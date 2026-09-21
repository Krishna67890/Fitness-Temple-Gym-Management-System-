"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, User, MessageSquare, CheckCircle, QrCode as QrIcon, LogOut, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { saveMemberReview, subscribeToPublishedReviews, GymReview } from "@/lib/reviewsService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ReviewsPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<GymReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [localName, setLocalName] = useState("");
  const [isNameSet, setIsNameSet] = useState(false);

  const [theme, setTheme] = useState<"Default" | "RGB" | "Glass">("Default");

  useEffect(() => {
    // Check if name is already in local storage
    const savedName = localStorage.getItem("review_display_name");
    if (savedName) {
      setLocalName(savedName);
      setIsNameSet(true);
    }

    const savedTheme = localStorage.getItem("review_theme_preference");
    if (savedTheme === "RGB" || savedTheme === "Glass" || savedTheme === "Default") {
      setTheme(savedTheme);
    }

    const unsub = subscribeToPublishedReviews((revs) => {
      setReviews(revs);
    });
    return () => unsub();
  }, []);

  const handleThemeChange = (newTheme: "Default" | "RGB" | "Glass") => {
    setTheme(newTheme);
    localStorage.setItem("review_theme_preference", newTheme);
  };

  const handleSetName = (e: React.FormEvent) => {
    e.preventDefault();
    if (localName.trim()) {
      localStorage.setItem("review_display_name", localName);
      setIsNameSet(true);
    }
  };

  const handleLogoutLocal = () => {
    localStorage.removeItem("review_display_name");
    setLocalName("");
    setIsNameSet(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Use either the logged in user or the local review name
    const reviewerName = userData?.fullName || user?.displayName || localName || "Valued Member";
    const reviewerId = user?.uid || `local_${Date.now()}`;

    if (!isNameSet && !user) {
      alert("Please set your name first!");
      return;
    }

    if (!comment.trim()) return;

    // Optimistic Update
    const optimisticReview: GymReview = {
      id: `optimistic_${Date.now()}`,
      userId: reviewerId,
      userName: reviewerName,
      userPhotoURL: userData?.profileImage || user?.photoURL || "",
      rating,
      comment: comment.trim(),
      status: "published",
      createdAt: { seconds: Math.floor(Date.now() / 1000) }
    };

    setReviews(prev => [optimisticReview, ...prev]);

    setIsSubmitting(true);
    try {
      await saveMemberReview({
        userId: reviewerId,
        userName: reviewerName,
        userPhotoURL: userData?.profileImage || user?.photoURL || "",
        rating,
        comment,
      });
      setComment("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const reviewPageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/reviews`
    : "https://rajarajeshwari-fitness.vercel.app/reviews";

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-4 border border-primary/20"
          >
            <Star className="text-primary" size={14} fill="currentColor" />
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Wall of Excellence</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6">
            MEMBER <span className="text-primary">REVIEWS</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm leading-relaxed">
            Your feedback fuels our fire. Share your transformation journey and rate your experience at Fitness Arena.
          </p>

          {/* Theme Selector */}
          <div className="mt-8 flex justify-center gap-4">
            {(["Default", "RGB", "Glass"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                  theme === t
                    ? "bg-primary text-black border-primary font-black shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                    : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                }`}
              >
                {t} Theme
              </button>
            ))}
          </div>

            <div className="mt-12 flex flex-col items-center">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_0_60px_rgba(255,215,0,0.15)] border-4 border-primary/20 group hover:scale-105 transition-all duration-500">
              {/* Permanent QR linking to the reviews page - ALWAYS VISIBLE */}
              <QRCodeSVG
                value={reviewPageUrl}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-6 text-center">
              <p className="text-[12px] font-black uppercase text-primary tracking-[0.4em]">PERMANENT REVIEW PORTAL</p>
              <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-widest italic">Scan to share your experience with the world</p>
            </div>
            {/* Review Portal Access Button */}
            <div className="mt-8">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
              >
                Access Review Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className={`p-8 rounded-[3rem] sticky top-32 ${
              theme === 'Glass' ? 'backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl' : 'glass border border-white/10'
            }`}>
              <h3 className="text-2xl font-black uppercase italic mb-6">Write a <span className="text-primary">Review</span></h3>

              {!user && !isNameSet ? (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6 leading-relaxed">
                    Identify yourself to post a review.<br/>No gym login required.
                  </p>
                  <form onSubmit={handleSetName} className="space-y-4">
                    <input
                      type="text"
                      placeholder="ENTER YOUR NAME..."
                      value={localName}
                      onChange={(e) => setLocalName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary text-xs font-black uppercase tracking-widest"
                      required
                    />
                    <button
                      type="submit"
                      className="btn-primary w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                    >
                      Start Reviewing
                    </button>
                  </form>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-[9px] text-gray-600 font-bold uppercase mb-4">Or use your gym account</p>
                    <button
                      onClick={() => window.location.href = '/login'}
                      className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition-all"
                    >
                      Member Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User size={14} className="text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        Reviewing as: <span className="text-white">{userData?.fullName || user?.displayName || localName}</span>
                      </span>
                    </div>
                    {isNameSet && !user && (
                      <button
                        type="button"
                        onClick={handleLogoutLocal}
                        className="p-2 hover:text-red-500 transition-colors"
                        title="Change Name"
                      >
                        <LogOut size={14} />
                      </button>
                    )}
                  </div>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star
                          size={32}
                          className={star <= rating ? "text-primary fill-primary" : "text-gray-700"}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Your Experience</label>
                    <textarea
                      required
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="TELL US ABOUT YOUR JOURNEY..."
                      className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-primary text-sm font-bold transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span className="text-[10px] font-black uppercase tracking-widest">Post Review</span>
                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 text-green-500"
                    >
                      <CheckCircle size={14} />
                      <span className="text-[10px] font-black uppercase">Review Published!</span>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 px-4">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <MessageSquare className="text-primary" />
                Real Member <span className="text-primary">Reviews</span>
              </h3>
              <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                {reviews.length} Total Reviews
              </span>
            </div>

            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {reviews.length === 0 ? (
                <div className="glass p-20 rounded-[3rem] border border-dashed border-white/10 text-center">
                  <Star className="text-gray-800 mx-auto mb-4" size={48} />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first to share!</p>
                </div>
              ) : (
                reviews.map((rev, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    key={rev.id || idx}
                    className={`p-8 rounded-[2.5rem] transition-all group relative overflow-hidden ${
                      theme === 'Glass'
                        ? 'backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl hover:border-primary/40'
                        : theme === 'RGB'
                        ? 'bg-black/60 border border-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]'
                        : 'glass border border-white/5 hover:border-primary/20'
                    }`}
                  >
                    {/* RGB Accent Line / Full border if RGB theme */}
                    {theme === 'RGB' ? (
                      <div className="absolute inset-0 p-[2px] rounded-[2.5rem] bg-gradient-to-r from-red-500 via-green-500 to-blue-500 -z-10 animate-pulse group-hover:scale-[1.01] transition-transform" style={{ maskComposite: 'exclude' } as React.CSSProperties} />
                    ) : (
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-green-500 to-blue-500 opacity-30" />
                    )}

                    {theme === 'RGB' && (
                      <div className="absolute inset-0 bg-black/90 rounded-[2.5rem] -z-10" />
                    )}

                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                          {rev.userPhotoURL ? (
                            <img src={rev.userPhotoURL} alt={rev.userName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black uppercase italic tracking-wider text-lg">{rev.userName}</h4>
                            {userData?.role === 'owner' && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (confirm("Permanently delete this review?")) {
                                    try {
                                      const { deleteReviewByOwner } = await import("@/lib/reviewsService");
                                      await deleteReviewByOwner(rev.id);
                                    } catch (err: any) {
                                      alert("Failed to delete: " + err.message);
                                    }
                                  }
                                }}
                                className="p-1.5 text-red-500/50 hover:text-red-500 transition-colors bg-red-500/5 rounded-lg border border-red-500/10"
                                title="Owner Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < rev.rating ? "text-primary fill-primary" : "text-gray-800"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black uppercase text-gray-600 bg-white/5 px-3 py-1 rounded-full">
                        {rev.createdAt?.seconds
                          ? new Date(rev.createdAt.seconds * 1000).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>

                    <p className="text-gray-400 font-bold leading-relaxed text-sm italic relative">
                      <span className="text-primary/20 text-4xl absolute -left-4 -top-4 opacity-50">"</span>
                      {rev.comment}
                      <span className="text-primary/20 text-4xl absolute -bottom-8 opacity-50">"</span>
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
