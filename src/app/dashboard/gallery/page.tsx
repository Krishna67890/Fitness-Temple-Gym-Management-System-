"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Maximize2,
  X,
  Camera,
  Loader2
} from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

const MOCK_PHOTOS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
    caption: "Pushing limits at the bench today!",
    likes: 24,
    comments: 5,
    date: "2 hours ago"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581009146145-b5ef03a71018?q=80&w=2070&auto=format&fit=crop",
    caption: "Early morning grind. No excuses.",
    likes: 42,
    comments: 12,
    date: "5 hours ago"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop",
    caption: "New PB on Squats! 140kg x 5",
    likes: 89,
    comments: 21,
    date: "Yesterday"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    caption: "Consistency is key.",
    likes: 56,
    comments: 8,
    date: "2 days ago"
  }
];

const GalleryPage = () => {
  const { user } = useAuth();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>(MOCK_PHOTOS);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    if (!db) return;
    const q = query(collection(db!, "gallery"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPhotos(docs);
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db || !storage || !user) return;

    const caption = prompt("Enter a caption for your photo:");
    if (caption === null) return;

    try {
      setIsUploading(true);
      const storageRef = ref(storage!, `gallery/${Date.now()}_${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await addDoc(collection(db!, "gallery"), {
        url: downloadURL,
        caption: caption || "Fitness journey!",
        likes: 0,
        comments: 0,
        timestamp: Timestamp.now(),
        userName: user.displayName || "Member",
        userPhoto: user.photoURL || null,
        userId: user.uid
      });

      alert("Photo uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload photo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase italic mb-2">Member <span className="text-primary">Gallery</span></h1>
          <p className="text-gray-400">Share your journey and inspire the community.</p>
        </div>
        <div className="relative">
          <input
            type="file"
            id="gallery-upload"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="gallery-upload"
            className={`btn-primary py-3 px-6 flex items-center space-x-2 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
            <span className="text-sm">{isUploading ? "Uploading..." : "Upload Photo"}</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="glass rounded-3xl overflow-hidden group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <Maximize2 className="text-white" size={32} />
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-300 line-clamp-1 mb-3">{photo.caption}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Heart size={16} />
                    <span className="text-xs font-bold">{photo.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-400">
                    <MessageCircle size={16} />
                    <span className="text-xs font-bold">{photo.comments}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-500 font-black uppercase">
                  {photo.timestamp?.toDate ? photo.timestamp.toDate().toLocaleDateString() : "Recent"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-all">
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full flex flex-col lg:flex-row glass rounded-[3rem] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lg:w-2/3 bg-black">
                <img src={selectedPhoto.url} className="w-full h-full object-contain max-h-[70vh]" />
              </div>
              <div className="lg:w-1/3 p-8 flex flex-col">
                 <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-black text-black">
                      {selectedPhoto.userName?.substring(0, 2).toUpperCase() || "M"}
                    </div>
                    <div>
                       <p className="text-sm font-bold">{selectedPhoto.userName || "Member"}</p>
                       <p className="text-[10px] text-gray-500 uppercase font-black">
                         {selectedPhoto.timestamp?.toDate ? selectedPhoto.timestamp.toDate().toLocaleString() : "Recent"}
                       </p>
                    </div>
                 </div>
                 <p className="text-gray-300 mb-8">{selectedPhoto.caption}</p>
                 <div className="mt-auto space-y-4">
                    <div className="flex items-center space-x-6">
                       <button className="flex items-center space-x-2 text-primary">
                          <Heart size={24} />
                          <span className="font-bold">{selectedPhoto.likes}</span>
                       </button>
                       <button className="flex items-center space-x-2 text-gray-400">
                          <MessageCircle size={24} />
                          <span className="font-bold">{selectedPhoto.comments}</span>
                       </button>
                       <button className="text-gray-400 ml-auto">
                          <Share2 size={24} />
                       </button>
                    </div>
                    <div className="flex gap-2">
                       <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary"
                       />
                       <button className="bg-primary text-black px-4 rounded-xl font-black text-[10px] uppercase">Post</button>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
