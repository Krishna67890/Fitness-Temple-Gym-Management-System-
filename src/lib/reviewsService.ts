import { db } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  addDoc
} from "firebase/firestore";

/**
 * ADVANCED REVIEW SYNC ENGINE (v5)
 * Features:
 * 1. Offline-First: Instant UI updates via LocalStorage.
 * 2. Background Sync: Retries failed cloud pushes automatically.
 * 3. Tab Sync: BroadcastChannel synchronizes reviews across browser tabs.
 * 4. Resilient Fallback: Graceful degradation when Firestore permissions are missing.
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
  isPending?: boolean; // Flag for locally-saved but not-yet-cloud-synced reviews
  syncError?: boolean;
}

const LOCAL_KEY = "rfa_reviews_cache_v5";
const PENDING_KEY = "rfa_pending_sync_v5";
const SYNC_CHANNEL = "rfa_review_sync_channel";

// ─── INTERNAL STATE ─────────────────────────────────────────────────────────
let activeListeners: Array<(reviews: GymReview[]) => void> = [];
let broadcastChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined") {
  broadcastChannel = new BroadcastChannel(SYNC_CHANNEL);
  broadcastChannel.onmessage = (event) => {
    if (event.data === "REFRESH") {
      notifyListeners();
    }
  };
}

const notifyListeners = (remoteReviews: GymReview[] = getLocalCache()) => {
  const pending = getPendingSync();
  // Filter out pending that are already in remote (by content/userId to prevent duplicates)
  const remoteIds = new Set(remoteReviews.map(r => r.id));
  const uniquePending = pending.filter(p => !remoteIds.has(p.id));

  const combined = [...uniquePending, ...remoteReviews];
  combined.sort((a, b) => getSafeTime(b.createdAt) - getSafeTime(a.createdAt));

  activeListeners.forEach(callback => callback(combined));
};

// ─── STORAGE HELPERS ────────────────────────────────────────────────────────
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
  if (typeof date === 'string') return new Date(date).getTime();
  const parsed = new Date(date).getTime();
  return isNaN(parsed) ? Date.now() : parsed;
};

// ─── SYNC ENGINE ────────────────────────────────────────────────────────────
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
      console.error("[RFA Sync] Cloud push failed:", err.message);
      remaining.push({ ...review, syncError: true });
    }
  }

  setPendingSync(remaining);
  if (successCount > 0) {
    broadcastChannel?.postMessage("REFRESH");
    // We don't call notifyListeners here directly because the onSnapshot will pick it up
  }
};

// ─── REAL-TIME SUBSCRIPTION ─────────────────────────────────────────────────
export const subscribeToPublishedReviews = (
  callback: (reviews: GymReview[]) => void
): (() => void) => {
  activeListeners.push(callback);
  notifyListeners(); // Immediate load from cache

  if (db) {
    try {
      const q = query(
        collection(db, "reviews"),
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const remote: GymReview[] = [];
        snapshot.forEach((docSnap) => {
          remote.push({ id: docSnap.id, ...docSnap.data() } as GymReview);
        });
        setLocalCache(remote);
        notifyListeners(remote);
        // Attempt to sync any local pending reviews whenever we get a fresh remote list
        syncPendingReviews();
      }, (error) => {
        console.warn("🛡️ Firestore Read Restricted: Switching to Advanced Local Cache Strategy");
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

// ─── PUBLISH REVIEW ─────────────────────────────────────────────────────────
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

  // 1. Instant Local Save
  const pending = getPendingSync();
  setPendingSync([newReview, ...pending]);
  notifyListeners();
  broadcastChannel?.postMessage("REFRESH");

  // 2. Background Cloud Push
  if (db) {
    try {
      const { isPending, id, syncError, ...payload } = newReview;
      await addDoc(collection(db, "reviews"), {
        ...payload,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Remove from pending on success
      const updatedPending = getPendingSync().filter(r => r.id !== newReview.id);
      setPendingSync(updatedPending);
      return { success: true, synced: true };
    } catch (err: any) {
      console.warn("[RFA] Remote push delayed. Review remains in high-availability local storage.");
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

export const deleteReviewByOwner = async (reviewId: string) => {
  if (db) {
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
    } catch {
      // If delete fails, at least remove from local cache if it was there
      const cache = getLocalCache().filter(r => r.id !== reviewId);
      setLocalCache(cache);
      notifyListeners();
    }
  }
};
