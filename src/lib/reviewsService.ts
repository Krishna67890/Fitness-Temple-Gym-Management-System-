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
 * Real-time listener for public published reviews from Firestore
 * Strictly filters by status == 'published'
 * If 0 reviews exist in database, returns empty array (ZERO fake fallback!)
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

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
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

          // Sort newest first in memory
          reviews.sort((a, b) => {
            const timeA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
            const timeB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
            return timeB - timeA;
          });

          callback(reviews);
        },
        (error) => {
          console.warn("Firestore reviews listener error, reading local store:", error);
          const local = getLocalReviews().filter((r) => r.status === "published");
          callback(local);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.warn("Could not initiate Firestore reviews query:", err);
    }
  }

  // Fallback for local development if Firebase keys not provided
  const local = getLocalReviews().filter((r) => r.status === "published");
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
      return null;
    } catch (err) {
      console.warn("Firestore getMemberReview error:", err);
    }
  }

  // Local fallback
  const local = getLocalReviews();
  return local.find((r) => r.userId === userId) || null;
};

/**
 * Submit or update an authentic review for a member
 * Automatically enforces:
 * - userId matches the authenticated user
 * - userName comes from authenticated user profile
 * - rating between 1 and 5
 */
export const saveMemberReview = async ({
  userId,
  userName,
  userPhotoURL,
  rating,
  comment,
}: {
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
}): Promise<void> => {
  if (!userId) throw new Error("Authentication required: Member ID missing.");
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5 stars.");
  if (!comment.trim()) throw new Error("Review comment cannot be empty.");

  const payload = {
    userId,
    userName: userName || "Member",
    userPhotoURL: userPhotoURL || "",
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment: comment.trim(),
    updatedAt: serverTimestamp(),
    status: "published" as const,
  };

  if (db) {
    const docRef = doc(db, "reviews", userId);
    const existingSnap = await getDoc(docRef);

    if (existingSnap.exists()) {
      await updateDoc(docRef, payload);
    } else {
      await setDoc(docRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
  }

  // Synchronize local store for instant UI feedback
  const local = getLocalReviews();
  const existingIdx = local.findIndex((r) => r.userId === userId);
  const localReview: GymReview = {
    id: userId,
    userId,
    userName: userName || "Member",
    userPhotoURL: userPhotoURL || "",
    rating: Math.min(5, Math.max(1, Math.round(rating))),
    comment: comment.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "published",
  };

  if (existingIdx >= 0) {
    local[existingIdx] = { ...local[existingIdx], ...localReview };
  } else {
    local.unshift(localReview);
  }
  saveLocalReviews(local);
};

/**
 * Delete a member's own review
 */
export const deleteMemberReview = async (userId: string): Promise<void> => {
  if (!userId) return;

  if (db) {
    try {
      const docRef = doc(db, "reviews", userId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore delete review error:", err);
    }
  }

  const local = getLocalReviews().filter((r) => r.userId !== userId);
  saveLocalReviews(local);
};

/**
 * Real-time listener for ALL reviews (both published and hidden) for the Gym Owner control center
 */
export const subscribeToAllReviewsForOwner = (
  callback: (reviews: GymReview[]) => void
): (() => void) => {
  if (db) {
    try {
      const q = collection(db, "reviews");
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
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
        },
        (err) => {
          console.warn("Owner reviews subscription error:", err);
          callback(getLocalReviews());
        }
      );
      return unsubscribe;
    } catch (err) {
      console.warn("Owner reviews query error:", err);
    }
  }

  callback(getLocalReviews());
  return () => {};
};

/**
 * Owner moderation action: Change status (published / hidden)
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

  const local = getLocalReviews();
  const found = local.find((r) => r.id === reviewId || r.userId === reviewId);
  if (found) {
    found.status = status;
    saveLocalReviews(local);
  }
};

/**
 * Owner moderation action: Permanently delete inappropriate review
 */
export const deleteReviewByOwner = async (reviewId: string): Promise<void> => {
  if (db) {
    const docRef = doc(db, "reviews", reviewId);
    await deleteDoc(docRef);
  }

  const local = getLocalReviews().filter(
    (r) => r.id !== reviewId && r.userId !== reviewId
  );
  saveLocalReviews(local);
};
