"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, User, MessageSquare, CheckCircle, QrCode as QrIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { saveMemberReview, subscribeToPublishedReviews, GymReview } from "@/lib/reviewsService";
import { useAuth } from "@/context/AuthContext";

export default function ReviewsPage() {
  const { user, userData } = useAuth();
  const [reviews, setReviews] = useState<GymReview[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsub = subscribeToPublishedReviews((revs) => {
      setReviews(revs);
    });
    return () => unsub();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review!");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await saveMemberReview({
        userId: user.uid,
        userName: userData?.fullName || user.displayName || "Valued Member",
        userPhotoURL: userData?.profileImage || user.photoURL || "",
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

  const reviewPageUrl = typeof window !== "undefined" ? window.location.href : "";

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
            Your feedback fuels our fire. Share your transformation journey and rate your experience at Fitness Temple.
          </p>

          <button
            onClick={() => setShowQR(!showQR)}
            className="mt-8 flex items-center gap-2 mx-auto bg-white/5 border border-white/10 px-6 py-3 rounded-2xl hover:bg-primary hover:text-black transition-all group"
          >
            <QrIcon size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">Generate Review QR</span>
          </button>
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-16 flex flex-col items-center"
            >
              <div className="bg-white p-6 rounded-[2rem] shadow-[0_0_50px_rgba(255,215,0,0.2)] mb-4">
                <QRCodeSVG value={reviewPageUrl} size={200} />
              </div>
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">Scan to share your review</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-[3rem] border border-white/10 sticky top-32">
              <h3 className="text-2xl font-black uppercase italic mb-6">Write a <span className="text-primary">Review</span></h3>

              {!user ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm font-bold uppercase mb-6">You must be logged in to share your experience.</p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="btn-primary w-full py-4 rounded-2xl text-[10px]"
                  >
                    Login to Review
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-6">
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

            <div className="space-y-6">
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
                    className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all group"
                  >
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
                          <h4 className="font-black uppercase italic tracking-wider text-lg">{rev.userName}</h4>
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
