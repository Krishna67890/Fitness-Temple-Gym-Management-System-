"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  QrCode,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  Camera,
  X,
  UserPlus
} from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, Timestamp, orderBy, addDoc, getDocs } from "firebase/firestore";

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [manualMemberId, setManualMemberId] = useState("");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [stats, setStats] = useState([
    { label: "Total Members", value: "0", icon: "👥" },
    { label: "Present Today", value: "0", icon: "✅" },
    { label: "Absent Today", value: "0", icon: "❌" },
    { label: "Avg. Daily Time", value: "0h", icon: "⏱️" },
  ]);

  useEffect(() => {
    const firestore = db;
    if (!firestore) return;

    let attendanceUnsubscribe: (() => void) | undefined;

    const membersUnsubscribe = onSnapshot(collection(firestore, "members"), (snapshot) => {
      const total = snapshot.size;

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const attendanceQuery = query(
        collection(firestore, "attendance"),
        where("timestamp", ">=", Timestamp.fromDate(startOfDay)),
        where("timestamp", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("timestamp", "desc")
      );

      if (attendanceUnsubscribe) attendanceUnsubscribe();

      attendanceUnsubscribe = onSnapshot(attendanceQuery, (attendanceSnapshot) => {
        const records = attendanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAttendanceData(records);

        const presentCount = records.length;
        setStats([
          { label: "Total Members", value: total.toString(), icon: "👥" },
          { label: "Present Today", value: presentCount.toString(), icon: "✅" },
          { label: "Absent Today", value: (total - presentCount).toString(), icon: "❌" },
          { label: "Avg. Daily Time", value: "1.2h", icon: "⏱️" },
        ]);
      });
    });

    return () => {
      membersUnsubscribe();
      if (attendanceUnsubscribe) attendanceUnsubscribe();
    };
  }, [selectedDate]);

  const markAttendance = async (memberId: string) => {
    const firestore = db;
    if (!firestore) return;
    setIsScanning(true);

    try {
      // Find member in Firestore
      const membersRef = collection(firestore, "members");
      const q = query(membersRef, where("memberId", "==", memberId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Member not found!");
        setIsScanning(false);
        return;
      }

      const memberDoc = querySnapshot.docs[0];
      const memberData = memberDoc.data();

      // Check for expiry
      if (memberData.expiryDate && new Date(memberData.expiryDate) < new Date()) {
        alert(`Access Denied: Membership for ${memberData.fullName} has expired!`);
        setIsScanning(false);
        return;
      }

      const attendanceRef = collection(firestore, "attendance");
      await addDoc(attendanceRef, {
        memberId: memberId,
        memberName: memberData.fullName,
        timestamp: Timestamp.now(),
        checkInTime: Timestamp.now(),
        status: "Present",
        duration: "---"
      });

      alert(`Attendance marked for ${memberData.fullName}`);
      setIsScannerOpen(false);
      setIsManualModalOpen(false);
      setManualMemberId("");
    } catch (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulatedScan = () => {
    // For demo: scan a random member from the list if available, or a known test ID
    const testId = "FT-DEMO";
    markAttendance(testId);
  };

  const exportDailyReport = () => {
    if (attendanceData.length === 0) return alert("No data to export");

    const headers = ["Member Name", "Member ID", "Check In", "Check Out", "Duration", "Status"];
    const rows = attendanceData.map(record => [
      record.memberName,
      record.memberId,
      record.checkInTime ? new Date(record.checkInTime.seconds * 1000).toLocaleTimeString() : "---",
      record.checkOutTime ? new Date(record.checkOutTime.seconds * 1000).toLocaleTimeString() : "---",
      record.duration || "Ongoing",
      "Present"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAttendance = attendanceData.filter(record =>
    record.memberName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.memberId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">Attendance <span className="text-primary">System</span></h1>
          <p className="text-gray-400">Track daily check-ins and monthly attendance reports.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="btn-outline py-3 px-6 flex items-center space-x-2"
          >
            <QrCode size={20} />
            <span className="text-sm">Scan QR</span>
          </button>
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="btn-primary py-3 px-6 flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span className="text-sm">Manual Entry</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isManualModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-md glass p-10 rounded-[3rem] border-white/10"
            >
              <button onClick={() => setIsManualModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full"><X size={24} /></button>
              <h3 className="text-2xl font-black uppercase italic mb-6">Manual <span className="text-primary">Entry</span></h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500">Member ID</label>
                  <input
                    type="text"
                    placeholder="e.g. FT1234"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-primary text-xl font-black"
                    value={manualMemberId}
                    onChange={(e) => setManualMemberId(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => markAttendance(manualMemberId)}
                  className="btn-primary w-full py-4 uppercase font-black italic"
                >
                  {isScanning ? "Verifying..." : "Mark Present"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScannerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-lg glass p-8 rounded-[3rem] border-white/10 overflow-hidden"
            >
              <button
                onClick={() => setIsScannerOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full transition-all"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-black uppercase italic mb-2">QR <span className="text-primary">Scanner</span></h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Position the member's QR code within the frame</p>
              </div>

              <div className="relative aspect-square bg-black/40 rounded-[2rem] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 border-[40px] border-black/60 pointer-events-none"></div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-3xl pointer-events-none shadow-[0_0_50px_rgba(255,215,0,0.2)]">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary -translate-x-1 -translate-y-1 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary translate-x-1 -translate-y-1 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary -translate-x-1 translate-y-1 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary translate-x-1 translate-y-1 rounded-br-xl"></div>

                    <motion.div
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-0.5 bg-primary/50 shadow-[0_0_15px_#FFD700]"
                    />
                 </div>

                 <Camera size={48} className="text-white/10" />
                 <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <div className="p-4 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-primary">
                    {isScanning ? "Verifying Member..." : "Ready to Scan"}
                  </p>
                </div>
                <button
                  onClick={handleSimulatedScan}
                  disabled={isScanning}
                  className="w-full py-4 bg-primary text-black rounded-2xl text-xs font-black uppercase hover:bg-white transition-all disabled:opacity-50"
                >
                  {isScanning ? "Processing..." : "Simulate QR Scan"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border-white/5"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 glass p-8 rounded-[2.5rem]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <button onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft size={20} /></button>
              <div className="flex items-center space-x-2">
                <Calendar className="text-primary" size={20} />
                <span className="font-bold">{new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <button onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }} className="p-2 hover:bg-white/5 rounded-full"><ChevronRight size={20} /></button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search member..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-primary w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Member</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Check In</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Check Out</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Duration</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAttendance.map((record, i) => (
                  <tr key={i} className="group">
                    <td className="py-4">
                      <p className="text-sm font-bold">{record.memberName}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">{record.memberId}</p>
                    </td>
                    <td className="py-4 text-sm text-gray-300">
                      {record.checkInTime ? new Date(record.checkInTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}
                    </td>
                    <td className="py-4 text-sm text-gray-300">
                      {record.checkOutTime ? new Date(record.checkOutTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}
                    </td>
                    <td className="py-4 text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} className="text-primary" />
                        <span>{record.duration || "Ongoing"}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded-md bg-green-500/10 text-green-500">
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredAttendance.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No attendance records found for this date.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button
            onClick={exportDailyReport}
            className="w-full mt-8 py-3 bg-white/5 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Download size={16} />
            Export Daily Report
          </button>
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="glass p-8 rounded-[2.5rem]">
            <h3 className="text-lg font-black uppercase italic mb-6">Attendance <span className="text-primary">Insights</span></h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Peak Hours (6 AM - 8 AM)</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[85%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold uppercase mb-2">
                  <span>Evening Rush (6 PM - 9 PM)</span>
                  <span className="text-primary">70%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[70%]" />
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-primary/5 border border-primary/20 rounded-3xl">
              <h4 className="text-sm font-black uppercase mb-2">Most Consistent Member</h4>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-black">RS</div>
                <div>
                  <p className="text-sm font-bold">Rahul Sharma</p>
                  <p className="text-[10px] text-primary font-black">28 Days / Month</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent">
             <h3 className="text-lg font-black uppercase italic mb-4">Quick <span className="text-primary">Report</span></h3>
             <p className="text-sm text-gray-400 mb-6">Generate full attendance report for the current month in CSV format.</p>
             <button onClick={exportDailyReport} className="btn-primary w-full py-3 text-xs">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
