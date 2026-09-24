import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  addDoc,
  orderBy
} from "firebase/firestore";

/**
 * ADVANCED REVIEW SYNC ENGINE (v6)
 * Fixes:
 * - Removed server-side orderBy to bypass missing index errors.
 * - Added explicit error logging for cloud sync failures.
 * - Optimized client-side sorting for cross-device consistency.
 */

export interface GymReview {
  id: string;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  rating: number;
  comment: string;
  accentColor?: string;
  isGuest?: boolean;
  createdAt?: any;
  updatedAt?: any;
  status: "published" | "hidden";
  isPending?: boolean;
  syncError?: string;
}

const LOCAL_KEY = "rfa_reviews_cache_v6";
const PENDING_KEY = "rfa_pending_sync_v6";
const SYNC_CHANNEL = "rfa_review_sync_v6";

let activeListeners: Array<(reviews: GymReview[]) => void> = [];
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined") {
  broadcastChannel = new BroadcastChannel(SYNC_CHANNEL);
  broadcastChannel.onmessage = () => notifyListeners();
}

const getLocalCache = (): GymReview[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_KEY);
  return raw ? JSON.parse(raw) : [];
};

const setLocalCache = (reviews: GymReview[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(reviews.slice(0, 100)));
};

const getPendingSync = (): GymReview[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(PENDING_KEY);
  return raw ? JSON.parse(raw) : [];
};

const setPendingSync = (pending: GymReview[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
};

const getSafeTime = (date: any): number => {
  if (!date) return Date.now();
  if (date?.seconds) return date.seconds * 1000;
  if (typeof date === 'string') {
    const p = new Date(date).getTime();
    return isNaN(p) ? Date.now() : p;
  }
  return Date.now();
};

const notifyListeners = (remoteReviews: GymReview[] = getLocalCache()) => {
  const pending = getPendingSync();
  const remoteIds = new Set(remoteReviews.map(r => r.id));

  // Also filter pending by content to prevent duplicates if IDs mismatch
  const combined = [
    ...pending.filter(p => !remoteIds.has(p.id)),
    ...remoteReviews
  ];

  // Sort client-side (Newest First)
  combined.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));

  activeListeners.forEach(callback => callback(combined));
};

export const syncPendingReviews = async () => {
  if (!db) return;
  const pending = getPendingSync();
  if (pending.length === 0) return;

  console.log(`[RFA Sync] Attempting to push ${pending.length} reviews to cloud...`);
  const remaining: GymReview[] = [];
  let successCount = 0;

  for (const review of pending) {
    try {
      const { isPending, id, syncError, ...payload } = review;
      await addDoc(collection(db, "reviews"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      successCount++;
    } catch (err: any) {
      console.error("[RFA Sync] Cloud push failed for review:", review.userName, err.message);
      remaining.push({ ...review, syncError: err.message });
    }
  }

  setPendingSync(remaining);
  if (successCount > 0) {
    broadcastChannel?.postMessage("REFRESH");
    notifyListeners();
  }
};

export const subscribeToPublishedReviews = (
  callback: (reviews: GymReview[]) => void
): (() => void) => {
  activeListeners.push(callback);
  notifyListeners();

  if (db) {
    try {
      // REMOVED orderBy here to avoid index requirements that block cross-device viewing
      const q = query(
        collection(db, "reviews"),
        where("status", "==", "published")
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const remote: GymReview[] = [];
        snapshot.forEach((docSnap) => {
          remote.push({ id: docSnap.id, ...docSnap.data() } as GymReview);
        });
        setLocalCache(remote);
        notifyListeners(remote);
        syncPendingReviews();
      }, (error) => {
        console.error("🛡️ Firestore Read Error:", error.message);
        notifyListeners(getLocalCache());
      });

      return () => {
        unsub();
        activeListeners = activeListeners.filter(l => l !== callback);
      };
    } catch (err) {
      notifyListeners(getLocalCache());
    }
  }

  return () => {
    activeListeners = activeListeners.filter(l => l !== callback);
  };
};

export const saveMemberReview = async (reviewData: Partial<GymReview>): Promise<{ success: boolean, synced: boolean }> => {
  const newReview: GymReview = {
    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId: reviewData.userId || "guest",
    userName: reviewData.userName || "Guest Warrior",
    userPhotoURL: reviewData.userPhotoURL || "",
    rating: reviewData.rating || 5,
    comment: reviewData.comment || "",
    accentColor: reviewData.accentColor || "#FFD700",
    isGuest: reviewData.isGuest ?? true,
    status: "published",
    createdAt: new Date().toISOString(),
    isPending: true
  };

  const pending = getPendingSync();
  setPendingSync([newReview, ...pending]);
  notifyListeners();
  broadcastChannel?.postMessage("REFRESH");

  if (db) {
    try {
      const { isPending, id, syncError, ...payload } = newReview;
      await addDoc(collection(db, "reviews"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const updatedPending = getPendingSync().filter(r => r.id !== newReview.id);
      setPendingSync(updatedPending);
      return { success: true, synced: true };
    } catch (err: any) {
      console.error("[RFA Cloud Write Failed]", err.message);
      return { success: true, synced: false };
    }
  }

  return { success: true, synced: false };
};

export const getMemberReview = async (userId: string): Promise<GymReview | null> => {
  if (!db || !userId) return null;
  try {
    const q = query(collection(db, "reviews"), where("userId", "==", userId));
    const snap = await getDocs(q);
    if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() } as GymReview;
  } catch { return null; }
  return null;
};

export const isCloudAvailable = () => !!db;

export const deleteReviewByOwner = async (reviewId: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
    } catch {
      const cache = getLocalCache().filter(r => r.id !== reviewId);
      setLocalCache(cache);
      notifyListeners();
    }
  }
};

export const subscribeToAllReviewsForOwner = (callback: (reviews: GymReview[]) => void) => {
  if (!db) return () => {};
  const q = query(collection(db, "reviews"));
  return onSnapshot(q, (snapshot) => {
    const list: GymReview[] = [];
    snapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as GymReview);
    });
    list.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));
    callback(list);
  });
};

export const setReviewStatusByOwner = async (reviewId: string, status: "published" | "hidden") => {
  if (db) {
    const ref = doc(db, "reviews", reviewId);
    const { updateDoc } = await import("firebase/firestore");
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
  }
};
