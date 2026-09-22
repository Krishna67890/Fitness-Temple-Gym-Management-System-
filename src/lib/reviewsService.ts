import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

export interface GymReview {
  id: string; // Document ID (matches userId)
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number; // 1 to 5
  comment: string;
  accentColor?: string; // RGB customization
  isGuest?: boolean;
  createdAt?: any;
  updatedAt?: any;
  status: "published" | "hidden";
}

const LOCAL_STORAGE_REVIEWS_KEY = "fitness_temple_real_reviews";

// Helper to get offline/local fallback reviews if Firebase credentials are not yet set
const getLocalReviews = (): GymReview[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalReviews = (reviews: GymReview[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (err) {
    console.error("Failed to save local reviews", err);
  }
};

/**
 * Helper to get a stable timestamp from various date formats
 */
const getSafeTime = (date: any): number => {
  if (!date) return Date.now(); // Use current time for pending server timestamps to keep them at the top
  if (typeof date.seconds === "number") return date.seconds * 1000;
  if (date instanceof Date) return date.getTime();
  const parsed = new Date(date).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Real-time listener for public published reviews from Firestore
 * Strictly filters by status == 'published'
 */
export const subscribeToPublishedReviews = (
  callback: (reviews: GymReview[]) => void
): (() => void) => {
  if (db) {
    try {
      const q = query(
        collection(db, "reviews"),
        where("status", "==", "published")
      );

      // Using onSnapshot with includeMetadataChanges: true can help with cross-device sync visibility
      const unsubscribe = onSnapshot(
        q,
        { includeMetadataChanges: true },
        (snapshot) => {
          const reviews: GymReview[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            reviews.push({
              id: docSnap.id,
              userId: data.userId || docSnap.id,
              userName: data.userName || "Guest",
              userPhotoURL: data.userPhotoURL || "",
              rating: Number(data.rating) || 5,
              comment: data.comment || "",
              accentColor: data.accentColor || "#FFD700",
              isGuest: data.isGuest ?? true,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
              status: data.status || "published",
            });
          });

          // Sort newest first in memory
          reviews.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));

          // Save backup to local storage for premium instant sync fallback
          saveLocalReviews(reviews);

          callback(reviews);
        },
        (error) => {
          console.warn("Firestore reviews listener error, reading local store:", error);
          const local = getLocalReviews();
          local.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));
          callback(local);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("Could not initiate Firestore reviews query:", err);
    }
  }

  const local = getLocalReviews().filter((r) => r.status === "published");
  local.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));
  callback(local);
  return () => {};
};

/**
 * Fetch a member's own review by their authenticated UID
 */
export const getMemberReview = async (userId: string): Promise<GymReview | null> => {
  if (!userId) return null;

  if (db) {
    try {
      // For real users, id matches userId
      const docRef = doc(db, "reviews", userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          userId: data.userId || snap.id,
          userName: data.userName || "Member",
          userPhotoURL: data.userPhotoURL || "",
          rating: Number(data.rating) || 5,
          comment: data.comment || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          status: data.status || "published",
        };
      }

      // If not found by direct ID (might be a local user who logged in)
      const q = query(collection(db, "reviews"), where("userId", "==", userId));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const docSnap = qSnap.docs[0];
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId,
          userName: data.userName,
          userPhotoURL: data.userPhotoURL,
          rating: data.rating,
          comment: data.comment,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          status: data.status,
        };
      }
    } catch (err) {
      console.warn("Firestore getMemberReview error:", err);
    }
  }

  return null;
};

/**
 * Submit or update an authentic review
 */
export const saveMemberReview = async ({
  userId,
  userName,
  userPhotoURL,
  rating,
  comment,
  accentColor,
  isGuest,
}: {
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  accentColor?: string;
  isGuest?: boolean;
}): Promise<void> => {
  if (!userId) throw new Error("Identification required.");
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5 stars.");
  if (!comment.trim()) throw new Error("Review comment cannot be empty.");

  const isLocalOrGuest = userId.startsWith('local_') || userId.startsWith('demo_') || userId.startsWith('guest_') || isGuest;

  const payload: any = {
    userId,
    userName: userName || "Guest Warrior",
    userPhotoURL: userPhotoURL || "",
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment: comment.trim(),
    accentColor: accentColor || "#FFD700",
    isGuest: !!isLocalOrGuest,
    updatedAt: serverTimestamp(),
    status: "published" as const,
  };

  if (db) {
    try {
      const docId = userId;
      const docRef = doc(db, "reviews", docId);

      // Check if document exists to preserve createdAt
      const docSnap = await getDoc(docRef);
      const finalPayload = {
        ...payload,
        createdAt: docSnap.exists() ? docSnap.data().createdAt : serverTimestamp(),
      };

      // 1. Save the review
      await setDoc(docRef, finalPayload, { merge: true });

      // 2. AUTOMATICALLY add reviewer to "members" collection (optional fallback so it never blocks reviews)
      try {
        const memberRef = doc(db, "members", docId);
        await setDoc(memberRef, {
          fullName: userName,
          email: isLocalOrGuest ? `${docId}@guest.fitnesstemple.com` : (userId.includes('@') ? userId : `${userId}@fitnesstemple.com`),
          mobile: "Reviewer",
          membershipType: "Reviewer/Guest",
          status: "Active",
          role: "member",
          memberId: docId.substring(0, 8).toUpperCase(),
          updatedAt: serverTimestamp(),
          lastActive: serverTimestamp(),
          source: "Review System",
          ...(docSnap.exists() ? {} : { createdAt: serverTimestamp() })
        }, { merge: true });
      } catch (memberErr) {
        console.warn("Could not auto-add to members collection (permissions/guest), continuing:", memberErr);
      }

    } catch (err: any) {
      console.error("Detailed Firestore Error:", err);
      // Fallback to local if sync fails but let the user know
      throw new Error(`Sync Error: ${err.message || "Connection lost"}`);
    }
  }

  // Backup to local storage instantly
  const local = getLocalReviews();
  // Filter out any previous review from the same user to avoid duplicates
  const filteredLocal = local.filter((r) => r.id !== userId && r.userId !== userId);
  const reviewObj: GymReview = {
    id: userId,
    userId,
    userName,
    userPhotoURL,
    rating,
    comment,
    accentColor: accentColor || "#FFD700",
    isGuest: !!isLocalOrGuest,
    status: "published",
    createdAt: new Date().toISOString()
  };
  filteredLocal.unshift(reviewObj);
  saveLocalReviews(filteredLocal.slice(0, 50));
};

/**
 * Real-time listener for ALL reviews for the Gym Owner
 */
export const subscribeToAllReviewsForOwner = (
  callback: (reviews: GymReview[]) => void
): (() => void) => {
  if (db) {
    try {
      const q = query(collection(db, "reviews"), orderBy("updatedAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const reviews: GymReview[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          reviews.push({
            id: docSnap.id,
            userId: data.userId || docSnap.id,
            userName: data.userName || "Member",
            userPhotoURL: data.userPhotoURL || "",
            rating: Number(data.rating) || 5,
            comment: data.comment || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            status: data.status || "published",
          });
        });
        callback(reviews);
      });
      return unsubscribe;
    } catch (err) {
      console.warn("Owner reviews query error:", err);
    }
  }
  return () => {};
};

/**
 * Owner moderation action: Change status
 */
export const setReviewStatusByOwner = async (
  reviewId: string,
  status: "published" | "hidden"
): Promise<void> => {
  if (db) {
    const docRef = doc(db, "reviews", reviewId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  }
};

/**
 * Owner moderation action: Permanently delete
 */
export const deleteReviewByOwner = async (reviewId: string): Promise<void> => {
  if (db) {
    const docRef = doc(db, "reviews", reviewId);
    await deleteDoc(docRef);
  }
};

/**
 * Legacy support for components using deleteMemberReview
 * Now redirects to Owner-only logic (will fail for members due to Firestore rules)
 */
export const deleteMemberReview = async (userId: string): Promise<void> => {
  return deleteReviewByOwner(userId);
};
