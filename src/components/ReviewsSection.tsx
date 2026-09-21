"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  CheckCircle,
  Plus,
  ArrowUpDown,
  Quote,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  AlertCircle,
  Lock,
  MessageSquare,
  ShieldCheck,
  Share2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  subscribeToPublishedReviews,
  getMemberReview,
  saveMemberReview,
  deleteMemberReview,
  GymReview,
} from "@/lib/reviewsService";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

export const ReviewsSection = () => {
  const router = useRouter();
  const { user, userData } = useAuth();

  const [reviews, setReviews] = useState<GymReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"Newest" | "Highest" | "Oldest">("Newest");

  // Current member's existing review
  const [myReview, setMyReview] = useState<GymReview | null>(null);
  const [loadingMyReview, setLoadingMyReview] = useState(false);

  // Review Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Role constraint notice for trainers/owners
  const [roleNotice, setRoleNotice] = useState<string | null>(null);

  // Active Carousel Index
  const [carouselIndex, setCarouselIndex] = useState(0);

  // 0. Portal URL setup to avoid hydration mismatch
  const [portalUrl, setPortalUrl] = useState("https://rajarajeshwari-fitness.vercel.app/reviews");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPortalUrl(`${window.location.origin}/reviews`);
    }
  }, []);

  // 1. Subscribe to real published reviews from Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToPublishedReviews((realReviews) => {
      setReviews(realReviews);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Fetch or update current member's personal review
  useEffect(() => {
    const currentUid = user?.uid || userData?.uid;
    if (currentUid && userData?.role === "member") {
      setLoadingMyReview(true);
      getMemberReview(currentUid)
        .then((existing) => {
          setMyReview(existing);
          setLoadingMyReview(false);
        })
        .catch(() => setLoadingMyReview(false));
    } else {
      setMyReview(null);
    }
  }, [user, userData, reviews]);

  // Handle "Write a Review" button click
  const handleOpenReviewAction = () => {
    setErrorMessage("");
    setSubmitSuccess(false);

    // If not authenticated, redirect to login
    if (!user && !userData) {
      router.push("/login?redirect=reviews");
      return;
    }

    // Role check: Only members can submit gym reviews
    if (userData?.role && userData.role !== "member") {
      setRoleNotice(
        `You are currently logged in as a gym ${userData.role.toUpperCase()}. Only registered gym members can write public member reviews. Coaches and owners manage reviews from their dashboard.`
      );
      return;
    }

    // If member already has an active review, switch to edit mode
    if (myReview) {
      setModalMode("edit");
      setRatingInput(myReview.rating);
      setCommentInput(myReview.comment);
    } else {
      setModalMode("create");
      setRatingInput(5);
      setCommentInput("");
    }
    setIsModalOpen(true);
  };

  // Handle Edit existing review
  const handleEditMyReview = () => {
    if (!myReview) return;
    setErrorMessage("");
    setSubmitSuccess(false);
    setModalMode("edit");
    setRatingInput(myReview.rating);
    setCommentInput(myReview.comment);
    setIsModalOpen(true);
  };

  // Handle Delete existing review
  const handleDeleteMyReview = async () => {
    const currentUid = user?.uid || userData?.uid;
    if (!currentUid) return;

    if (confirm("Are you sure you want to delete your review? Note: Only administrators have final deletion authority in some cases.")) {
      try {
        await deleteMemberReview(currentUid);
        setMyReview(null);
      } catch (err: any) {
        alert("Failed to delete review: " + (err.message || "Unknown error"));
      }
    }
  };

  // Submit or update member review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const currentUid = user?.uid || userData?.uid;
    if (!currentUid) {
      setErrorMessage("Please log in to submit a review.");
      return;
    }

    if (!commentInput.trim()) {
      setErrorMessage("Please write a comment sharing your gym experience.");
      return;
    }

    setIsSubmitting(true);
    try {
      const authorName =
        userData?.name ||
        user?.displayName ||
        userData?.fullName ||
        "Fitness Member";
      const authorPhoto = userData?.photoURL || user?.photoURL || "";

      await saveMemberReview({
        userId: currentUid,
        userName: authorName,
        userPhotoURL: authorPhoto,
        rating: ratingInput,
        comment: commentInput.trim(),
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || "Failed to submit review to Firestore. Please try again.");
    }
  };

  // Real Ratings Calculations (NO hardcoded numbers)
  const totalReviewsCount = reviews.length;
  const averageRating =
    totalReviewsCount > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
      : "0.0";
  const fiveStarReviewsCount = reviews.filter((r) => r.rating === 5).length;

  // Filtered & Sorted Reviews
  const filteredReviews = reviews
    .filter((r) => (filterRating === "All" ? true : r.rating === parseInt(filterRating)))
    .sort((a, b) => {
      const getSafeTime = (date: any): number => {
        if (!date) return Date.now(); // Ensure new/pending reviews stay at top
        if (typeof date.seconds === "number") return date.seconds * 1000;
        if (date instanceof Date) return date.getTime();
        const parsed = new Date(date).getTime();
        return isNaN(parsed) ? 0 : parsed;
      };

      if (sortBy === "Highest") return b.rating - a.rating;
      if (sortBy === "Oldest") return getSafeTime(a.createdAt) - getSafeTime(b.createdAt);
      return getSafeTime(b.createdAt) - getSafeTime(a.createdAt);
    });

  // Featured reviews with 5 stars
  const featuredFiveStars = reviews.filter((r) => r.rating === 5);

  return (
    <section className="py-32 relative overflow-hidden bg-[#050505]" id="reviews">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-4 max-w-7xl mx-auto">
        {/* 1. Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 mb-6"
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-primary font-black uppercase tracking-[0.25em] text-[10px]">
              Verified Member Feedback
            </span>
          </motion.div>

          <h2 className="section-title mb-4">
            REAL MEMBER <span className="ft-gradient-text">REVIEWS</span>
          </h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Authentic, verified reviews from real members training inside Fitness Temple.
          </p>

          {/* QR Code Portal & Role Notice */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white p-5 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,215,0,0.3)] border-2 border-primary/20 hover:scale-105 transition-transform duration-500 relative group">
                <div className="absolute -top-3 -right-3 bg-primary text-black text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg z-20">
                  Live Portal
                </div>
                <QRCodeSVG
                  value={portalUrl}
                  size={160}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "/assets/FitnessTempleGym.png",
                    x: undefined,
                    y: undefined,
                    height: 30,
                    width: 30,
                    excavate: true,
                  }}
                />
              </div>
              <div className="text-center mt-2">
                <p className="text-[11px] font-black uppercase text-primary tracking-[0.4em] mb-1">Permanent Review Portal</p>
                <div className="flex items-center justify-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-widest italic">
                   <ShieldCheck size={10} className="text-green-500" />
                   Verified Member Discovery
                </div>
              </div>
            </div>

            <button
              onClick={handleOpenReviewAction}
              className="btn-primary px-8 py-4 rounded-2xl flex items-center gap-2.5 text-xs font-black uppercase tracking-wider shadow-[0_0_30px_rgba(255,215,0,0.3)] transition-all mt-4"
            >
              <MessageSquare size={16} />
              <span>Write a Review</span>
            </button>

            {roleNotice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass max-w-md p-4 rounded-2xl border border-yellow-500/30 text-yellow-400 text-xs flex items-start gap-3 text-left"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{roleNotice}</p>
                  <button
                    onClick={() => setRoleNotice(null)}
                    className="text-[10px] uppercase underline text-gray-400 mt-1 hover:text-white"
                  >
                    Dismiss Notice
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* 2. Logged-in Member's Active Review Card (If Exists) */}
        {myReview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass max-w-2xl mx-auto mb-16 p-6 md:p-8 rounded-[2.5rem] border border-primary/30 shadow-[0_0_40px_rgba(255,215,0,0.15)] bg-gradient-to-r from-primary/10 via-black to-black"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary" />
                <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                  Your Published Member Review
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditMyReview}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-primary hover:text-black text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Edit size={13} /> Edit My Review
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < myReview.rating ? "fill-primary text-primary" : "text-gray-700"}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-bold text-gray-400">
                {myReview.rating}.0 / 5.0
              </span>
            </div>

            <p className="text-white text-base leading-relaxed italic">
              "{myReview.comment}"
            </p>
            <p className="text-[10px] font-mono text-gray-500 mt-3">
              Authored by: <strong className="text-gray-300">{myReview.userName}</strong> (Verified Account)
            </p>
          </motion.div>
        )}

        {/* 3. Real Live Stats Bar (Derived purely from Firestore reviews) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="glass p-6 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-3xl font-black text-white font-mono">{averageRating}</div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Average Rating
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl mb-1">💬</div>
            <div className="text-3xl font-black text-white font-mono">{totalReviewsCount}</div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Real Reviews
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-3xl font-black text-white font-mono">{fiveStarReviewsCount}</div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
              5-Star Ratings
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 text-center">
            <div className="text-2xl mb-1">🛡️</div>
            <div className="text-3xl font-black text-green-400 font-mono">100%</div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Verified Members
            </div>
          </div>
        </div>

        {/* 4. Featured 5-Star Reviews Carousel (Only when real 5-star reviews exist) */}
        {featuredFiveStars.length > 0 && (
          <div className="mb-20 glass p-8 md:p-12 rounded-[3rem] border border-primary/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <span className="text-primary font-black uppercase tracking-[0.25em] text-[10px]">
                Featured 5-Star Highlight
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCarouselIndex((prev) => (prev - 1 + featuredFiveStars.length) % featuredFiveStars.length)
                  }
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCarouselIndex((prev) => (prev + 1) % featuredFiveStars.length)}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-black transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <Quote size={48} className="text-primary/20" />
                <p className="text-xl md:text-3xl font-medium text-white italic leading-relaxed">
                  "{featuredFiveStars[carouselIndex % featuredFiveStars.length]?.comment}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-lg">
                    {featuredFiveStars[carouselIndex % featuredFiveStars.length]?.userName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white uppercase italic text-base">
                      {featuredFiveStars[carouselIndex % featuredFiveStars.length]?.userName}
                    </h4>
                    <p className="text-xs text-primary font-bold">Verified Gym Member</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* 5. Filter & Sort Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 glass px-6 py-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">Filter:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-black/60 text-xs font-bold text-white border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer"
            >
              <option value="All">All Star Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars Only</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars Only</option>
              <option value="3">⭐⭐⭐ 3 Stars Only</option>
              <option value="2">⭐⭐ 2 Stars Only</option>
              <option value="1">⭐ 1 Star Only</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 text-xs font-bold text-primary border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-primary cursor-pointer"
            >
              <option value="Newest">Newest First</option>
              <option value="Highest">Highest Rated</option>
              <option value="Oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* 6. Real Reviews Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 animate-pulse space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl" />
                <div className="w-3/4 h-4 bg-white/10 rounded-lg" />
                <div className="w-full h-16 bg-white/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {review.userPhotoURL ? (
                        <img
                          src={review.userPhotoURL}
                          alt={review.userName}
                          className="w-11 h-11 rounded-2xl object-cover border border-primary/30"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-base">
                          {review.userName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-black text-white text-base uppercase italic tracking-tight">
                          {review.userName}
                        </h4>
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle size={10} /> Verified Member
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < review.rating ? "fill-primary text-primary" : "text-gray-700"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-500">
                  <span>Rating: {review.rating}.0 / 5.0</span>
                  <span>Fitness Temple Member</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* ZERO REVIEWS EMPTY STATE - MANDATORY RULE: NEVER SHOW FAKE REVIEWS */
          <div className="text-center py-24 glass rounded-[3rem] border border-dashed border-white/10 max-w-xl mx-auto p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 mx-auto flex items-center justify-center text-primary text-2xl">
              ⭐
            </div>
            <h3 className="text-xl font-black uppercase italic text-white tracking-wider">
              Be the first member to share your Fitness Temple experience.
            </h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              We value genuine feedback from real fitness warriors. Log in with your member account and
              tell the community about your gains and training results.
            </p>
            <button
              onClick={handleOpenReviewAction}
              className="btn-primary text-xs uppercase tracking-widest px-8 py-3.5 mt-2 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
            >
              Write First Review
            </button>
          </div>
        )}
      </div>

      {/* ── REAL REVIEW MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass max-w-lg w-full p-8 md:p-10 rounded-[3rem] border border-primary/30 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
                    {modalMode === "edit" ? "Edit Your Feedback" : "Authentic Member Review"}
                  </span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mt-0.5">
                    {modalMode === "edit" ? "Update Review" : "Rate Your Gym Experience"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Locked Member Identity Badge (Rule: Name/Photo MUST come from authenticated account) */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary text-base">
                  {(userData?.name || user?.displayName || "M").charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black uppercase italic text-white truncate">
                      {userData?.name || user?.displayName || "Verified Member"}
                    </p>
                    <span title="Locked to your account">
                      <Lock size={11} className="text-primary shrink-0" />
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate">
                    {user?.email || "Authenticated Firebase Account"}
                  </p>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider text-green-400 bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                  Role: Member
                </span>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                {/* 1. Interactive Star Selection */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                    Select Your Rating:
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingInput(star)}
                        className={`p-3 rounded-2xl border transition-all flex items-center justify-center ${
                          ratingInput >= star
                            ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(255,215,0,0.3)] scale-105"
                            : "bg-white/5 text-gray-600 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <Star size={24} className={ratingInput >= star ? "fill-current" : ""} />
                      </button>
                    ))}
                    <span className="text-sm font-black font-mono text-primary ml-2">
                      {ratingInput} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* 2. Review Comment Input */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                    Your Genuine Experience / Feedback:
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Tell us about the trainers, equipment, hygiene, workout atmosphere, and your fitness progress..."
                    className="w-full bg-black/60 border border-white/10 focus:border-primary rounded-2xl p-4 text-sm text-white outline-none resize-none placeholder:text-gray-600 leading-relaxed transition-all"
                  />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Success Banner */}
                {submitSuccess && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle size={14} />
                    <span>Review submitted successfully to Firestore!</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="btn-primary px-7 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Saving to Firestore..."
                      : modalMode === "edit"
                      ? "Update Review"
                      : "Publish Review"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ReviewsSection;
