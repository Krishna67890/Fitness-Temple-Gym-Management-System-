"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export type UserRole = "member" | "trainer" | "owner";

export interface UserProfile {
  uid: string;
  name: string;
  fullName?: string;
  email: string;
  photoURL?: string;
  profileImage?: string;
  role: UserRole;
  phone?: string;
  mobile?: string;
  trainerId?: string; // e.g. "trainer_suraj" or "trainer_sanket"
  trainerName?: string;
  membershipStatus?: "active" | "expiring" | "expired";
  membershipPlan?: string;
  membershipType?: string;
  membershipExpiry?: string;
  expiryDate?: string;
  fitnessGoal?: string;
  height?: string;
  weight?: string;
  age?: string;
  gender?: string;
  memberId?: string;
  attendance?: any;
  progressHistory?: any[];
  notifications?: any;
  createdAt?: any;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userData: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (email: string, pass: string, details?: Partial<UserProfile>) => Promise<UserProfile>;
  loginWithGoogle: () => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (newData: Partial<UserProfile>) => Promise<void>;
  verifyPortalAccess: (email: string, pass: string, type: "member" | "trainer" | "owner") => Promise<boolean>;
  setDemoRole: (role: UserRole, trainerChoice?: "suraj" | "sanket") => void;
  isDemoMode: boolean;
  portalSession: any | null;
}

// Built-in Demo profiles for local development when Firebase is not connected
const DEMO_PROFILES: Record<string, UserProfile> = {
  member: {
    uid: "demo_member_001",
    name: "Krishna Patil",
    email: "krishna@fitnesstemple.com",
    role: "member",
    phone: "+91 98765 43210",
    trainerId: "trainer_suraj",
    trainerName: "Suraj Sir",
    membershipStatus: "active",
    membershipPlan: "Gold Annual Elite",
    membershipExpiry: "2026-12-31",
    fitnessGoal: "Hypertrophy & Strength",
    height: "178",
    weight: "74",
    age: "24",
    gender: "male",
    memberId: "FT-2026-089",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  trainer_suraj: {
    uid: "demo_trainer_suraj",
    name: "Suraj Sir",
    email: "suraj@fitnesstemple.com",
    role: "trainer",
    phone: "+91 91234 56789",
    trainerId: "trainer_suraj",
    membershipStatus: "active",
    fitnessGoal: "Senior Strength & Conditioning Coach",
    photoURL: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80",
  },
  trainer_sanket: {
    uid: "demo_trainer_sanket",
    name: "Sanket Sir",
    email: "sanket@fitnesstemple.com",
    role: "trainer",
    phone: "+91 92345 67890",
    trainerId: "trainer_sanket",
    membershipStatus: "active",
    fitnessGoal: "Biomechanics & Hypertrophy Specialist",
    photoURL: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&auto=format&fit=crop&q=80",
  },
  owner: {
    uid: "demo_owner_omkar",
    name: "Omkar & Siddhant (Owners)",
    email: "management@fitnesstemple.com",
    role: "owner",
    phone: "+91 96652 31230",
    membershipStatus: "active",
    fitnessGoal: "Gym Director & Founder",
    photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isFirebaseConfigured: false,
  login: async () => { throw new Error("Uninitialized"); },
  register: async () => { throw new Error("Uninitialized"); },
  loginWithGoogle: async () => { throw new Error("Uninitialized"); },
  resetPassword: async () => {},
  logout: async () => {},
  updateUserData: async () => {},
  setDemoRole: () => {},
  isDemoMode: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [portalSession, setPortalSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const isFirebaseConfigured = !!auth && !!db;

  // Initialize Auth
  useEffect(() => {
    // Check for stored portal session
    const storedPortal = typeof window !== "undefined" ? localStorage.getItem("ft_portal_session") : null;
    if (storedPortal) {
      try {
        setPortalSession(JSON.parse(storedPortal));
      } catch (e) {
        console.error("Portal session parse error", e);
      }
    }

    // Check for redirect results (important for mobile)
    if (isFirebaseConfigured && auth) {
      getRedirectResult(auth).then((result) => {
        if (result?.user) {
          // Handle successful redirect sign-in if needed
        }
      }).catch(err => {
        console.error("Redirect Result Error:", err);
      });
    }

    // 1. Check for stored demo session
    const storedDemo = typeof window !== "undefined" ? localStorage.getItem("ft_demo_role") : null;

    if (!isFirebaseConfigured || storedDemo) {
      if (storedDemo && DEMO_PROFILES[storedDemo]) {
        setUserData(DEMO_PROFILES[storedDemo]);
        setIsDemoMode(true);
      } else if (!isFirebaseConfigured) {
        // Fallback default demo for offline exploration
        setUserData(DEMO_PROFILES.member);
        setIsDemoMode(true);
      }
      setLoading(false);
      return;
    }

    // 2. Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const userDocRef = doc(db!, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            setUserData(userSnap.data() as UserProfile);
          } else {
            // Check for specific role-based emails even for existing Firebase users
            const userEmail = firebaseUser.email?.toLowerCase() || "";
            let assignedRole: UserRole = "member";

            if (userEmail.includes("management") || userEmail.includes("owner")) assignedRole = "owner";
            else if (userEmail.includes("suraj")) assignedRole = "trainer";
            else if (userEmail.includes("sanket")) assignedRole = "trainer";

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || "Fitness Warrior",
              email: firebaseUser.email || "",
              photoURL: firebaseUser.photoURL || "",
              role: assignedRole,
              membershipStatus: "active",
              createdAt: serverTimestamp(),
            };

            setUserData(newProfile);
            // Non-blocking write to avoid permission-denied crashes on UI
            setDoc(userDocRef, newProfile).catch(e => console.warn("Profile sync deferred:", e));
          }
        } catch (error) {
          console.error("Auth state sync error:", error);
          // Fallback to avoid "Application Error" crash
          setUserData({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "Warrior",
            role: "member"
          } as UserProfile);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isFirebaseConfigured]);

  // Login with Email & Password
  const login = async (email: string, pass: string): Promise<UserProfile> => {
    // Check if live Firebase is ready
    if (isFirebaseConfigured && auth && db) {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const userDoc = await getDoc(doc(db, "users", cred.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        setUserData(data);
        setUser(cred.user);
        setIsDemoMode(false);
        localStorage.removeItem("ft_demo_role");
        return data;
      }
      // If doc does not exist, default to member
      const fallback: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || "Fitness Member",
        email: cred.user.email || email,
        role: "member",
        trainerId: "trainer_suraj",
        trainerName: "Suraj Sir",
        membershipStatus: "active",
      };
      await setDoc(doc(db, "users", cred.user.uid), fallback);
      setUserData(fallback);
      return fallback;
    }

    // Demo Mode match without plaintext leak in code
    const cleanEmail = email.trim().toLowerCase();
    let matchedRole: UserRole = "member";
    let matchedProfile = DEMO_PROFILES.member;

    if (cleanEmail.includes("owner") || cleanEmail.includes("omkar") || cleanEmail.includes("siddhant")) {
      matchedRole = "owner";
      matchedProfile = DEMO_PROFILES.owner;
    } else if (cleanEmail.includes("suraj")) {
      matchedRole = "trainer";
      matchedProfile = DEMO_PROFILES.trainer_suraj;
    } else if (cleanEmail.includes("sanket")) {
      matchedRole = "trainer";
      matchedProfile = DEMO_PROFILES.trainer_sanket;
    } else if (cleanEmail.includes("trainer")) {
      matchedRole = "trainer";
      matchedProfile = DEMO_PROFILES.trainer_suraj;
    }

    setUserData(matchedProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", matchedProfile.trainerId === "trainer_sanket" ? "trainer_sanket" : matchedRole === "trainer" ? "trainer_suraj" : matchedRole);
    return matchedProfile;
  };

  // Register with Email & Password
  const register = async (email: string, pass: string, details?: Partial<UserProfile>): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        name: details?.name || email.split("@")[0],
        email: cred.user.email || email,
        role: details?.role || "member",
        trainerId: details?.trainerId || "trainer_suraj",
        trainerName: details?.trainerName || "Suraj Sir",
        phone: details?.phone || "",
        membershipStatus: "active",
        membershipPlan: details?.membershipPlan || "Standard Annual",
        membershipExpiry: "2027-01-01",
        fitnessGoal: details?.fitnessGoal || "Strength & Endurance",
        height: details?.height || "175",
        weight: details?.weight || "70",
        age: details?.age || "25",
        gender: details?.gender || "not-specified",
        memberId: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, "users", cred.user.uid), newProfile);
      await setDoc(doc(db, "members", cred.user.uid), newProfile);
      setUserData(newProfile);
      setUser(cred.user);
      setIsDemoMode(false);
      localStorage.removeItem("ft_demo_role");
      return newProfile;
    }

    // Demo Mode registration
    const demoProfile: UserProfile = {
      ...DEMO_PROFILES.member,
      uid: `demo_${Date.now()}`,
      name: details?.name || email.split("@")[0],
      email: email,
      phone: details?.phone || "+91 99887 76655",
      fitnessGoal: details?.fitnessGoal || "General Fitness",
      memberId: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setUserData(demoProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", "member");
    return demoProfile;
  };

  // Google Sign-In
  const loginWithGoogle = async (): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });

        // Detection for mobile to use Redirect instead of Popup
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          await signInWithRedirect(auth, provider);
          // The code below won't execute as the page redirects
          return {} as UserProfile;
        }

        const result = await signInWithPopup(auth, provider);
        const userRef = doc(db, "users", result.user.uid);

        // Wait slightly for Firestore to be ready for the new user
        let snap = await getDoc(userRef);

        if (snap.exists()) {
          const data = snap.data() as UserProfile;
          setUserData(data);
          setUser(result.user);
          setIsDemoMode(false);
          localStorage.removeItem("ft_demo_role");
          return data;
        }

        // New Google User - Create Profile
        const newProfile: UserProfile = {
          uid: result.user.uid,
          name: result.user.displayName || "Fitness Warrior",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          role: "member",
          trainerId: "trainer_suraj",
          trainerName: "Suraj Sir",
          membershipStatus: "active",
          membershipPlan: "Standard Member",
          membershipExpiry: "2026-12-31",
          fitnessGoal: "General Fitness",
          memberId: `FT-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: serverTimestamp(),
        };

        await setDoc(userRef, newProfile);
        try {
          await setDoc(doc(db, "members", result.user.uid), newProfile);
        } catch (e) {
          console.warn("Could not create member doc immediately:", e);
        }

        setUserData(newProfile);
        setUser(result.user);
        setIsDemoMode(false);
        localStorage.removeItem("ft_demo_role");
        return newProfile;
      } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        if (error.code === 'auth/unauthorized-domain') {
          alert(`Domain Unauthorized: Please add "${window.location.hostname}" to Firebase Console > Authentication > Settings > Authorized Domains.`);
        }
        throw error;
      }
    }

    // Fallback demo Google login
    const profile = DEMO_PROFILES.member;
    setUserData(profile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", "member");
    return profile;
  };

  // Password Reset
  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  // Update user data in state & Firestore
  const updateUserData = async (newData: Partial<UserProfile>) => {
    setUserData((prev) => (prev ? { ...prev, ...newData } : (newData as UserProfile)));
    if (isFirebaseConfigured && db && user) {
      try {
        await setDoc(doc(db, "users", user.uid), newData, { merge: true });
        await setDoc(doc(db, "members", user.uid), newData, { merge: true });
      } catch (err) {
        console.error("Error updating user document:", err);
      }
    }
  };

  // Verify Portal Access (Layer 2)
  const verifyPortalAccess = async (email: string, pass: string, type: "member" | "trainer" | "owner"): Promise<boolean> => {
    if (type === "member") {
      // For members, we assume Firebase auth is enough, but we can verify against the logged in user
      if (user && user.email?.toLowerCase() === email.toLowerCase()) {
        const session = {
          uid: user.uid,
          role: "member",
          name: userData?.name || user.displayName || "Member",
          authenticated: true,
          loginAt: Date.now()
        };
        setPortalSession(session);
        localStorage.setItem("ft_portal_session", JSON.stringify(session));
        return true;
      }
      return false;
    }

    // For Trainer/Owner, check via API (Hidden env vars)
    try {
      const response = await fetch('/api/auth/portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass, portalType: type }),
      });

      const data = await response.json();
      if (data.success) {
        const session = {
          ...data,
          authenticated: true,
          loginAt: Date.now()
        };
        setPortalSession(session);
        localStorage.setItem("ft_portal_session", JSON.stringify(session));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Portal verification error:", error);
      return false;
    }
  };

  // Quick Role Switching for Local Dev / Testing
  const setDemoRole = (role: UserRole, trainerChoice?: "suraj" | "sanket") => {
    let key = role as string;
    if (role === "trainer") {
      key = trainerChoice === "sanket" ? "trainer_sanket" : "trainer_suraj";
    }
    const profile = DEMO_PROFILES[key] || DEMO_PROFILES.member;
    setUserData(profile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", key);

    // Also set portal session for demo
    const session = {
      uid: profile.uid,
      role: profile.role,
      name: profile.name,
      trainerId: profile.trainerId,
      authenticated: true,
      isDemo: true
    };
    setPortalSession(session);
    localStorage.setItem("ft_portal_session", JSON.stringify(session));
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        console.error("Logout error", e);
      }
    }
    localStorage.removeItem("ft_demo_role");
    localStorage.removeItem("ft_portal_session");
    localStorage.removeItem("ft_member_session");
    localStorage.removeItem("ft_user_role");
    setUser(null);
    setUserData(null);
    setPortalSession(null);
    setIsDemoMode(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        portalSession,
        loading,
        isFirebaseConfigured,
        login,
        register,
        loginWithGoogle,
        resetPassword,
        logout,
        updateUserData,
        verifyPortalAccess,
        setDemoRole,
        isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
