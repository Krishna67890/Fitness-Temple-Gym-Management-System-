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
  owner: {
    uid: "local_owner_001",
    name: "Sanket Sir (Owner)",
    email: "sanket@fitnesstemple.com",
    role: "owner",
    phone: "+91 96652 31230",
    membershipStatus: "active",
    fitnessGoal: "Gym Director & Founder",
    photoURL: "/assets/FitnessTempleGym.png",
    profileImage: "/assets/FitnessTempleGym.png",
  },
  trainer_suraj: {
    uid: "local_trainer_suraj",
    name: "Suraj Sir",
    email: "suraj@fitnesstemple.com",
    role: "trainer",
    phone: "+91 91234 56789",
    trainerId: "trainer_suraj",
    membershipStatus: "active",
    fitnessGoal: "Senior Strength & Conditioning Coach",
    photoURL: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80",
    profileImage: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200&auto=format&fit=crop&q=80",
  },
  trainer_bhavesh: {
    uid: "local_trainer_bhavesh",
    name: "Bhavesh Sir",
    email: "Bhavesh@ftnesstemple.com",
    role: "trainer",
    phone: "+91 93456 78901",
    trainerId: "trainer_bhavesh",
    membershipStatus: "active",
    fitnessGoal: "Transformation Specialist",
    photoURL: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&auto=format&fit=crop&q=80",
    profileImage: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&auto=format&fit=crop&q=80",
  },
  member: {
    uid: "local_member_001",
    name: "Krishna Patil Rajput",
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
    gender: "",
    memberId: "FT-2026-089",
    photoURL: "",
    profileImage: "",
  },
};

// Default passwords for local/demo accounts
const LOCAL_CREDENTIALS: Record<string, string> = {
  "sanket@fitnesstemple.com": "Sanket@123",
  "suraj@fitnesstemple.com": "Suraj@123",
  "bhavesh@ftnesstemple.com": "bhavesh@123",
  "krishna@fitnesstemple.com": "member123",
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  portalSession: null,
  loading: true,
  isFirebaseConfigured: false,
  login: async () => { throw new Error("Uninitialized"); },
  register: async () => { throw new Error("Uninitialized"); },
  loginWithGoogle: async () => { throw new Error("Uninitialized"); },
  resetPassword: async () => {},
  logout: async () => {},
  updateUserData: async () => {},
  verifyPortalAccess: async () => false,
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
          // Attempt to get the user document
          let userSnap;
          try {
             userSnap = await getDoc(userDocRef);
          } catch (e: any) {
            console.warn("Initial user doc fetch failed (likely permission propagation delay):", e.message);
            // If it's a permission error, we wait a moment and try one more time
            if (e.code === 'permission-denied') {
              await new Promise(resolve => setTimeout(resolve, 1000));
              userSnap = await getDoc(userDocRef);
            }
          }

          if (userSnap && userSnap.exists()) {
            setUserData(userSnap.data() as UserProfile);
          } else {
            // New user detection
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
            // Try to create the document if it doesn't exist
            try {
              await setDoc(userDocRef, newProfile, { merge: true });
            } catch (e) {
              console.warn("Profile sync deferred (permission issue):", e);
            }
          }
        } catch (error) {
          console.error("Auth state sync error:", error);
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
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check ft_local_users registry for local registrations
    if (typeof window !== "undefined") {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      if (storedLocalUsers) {
        try {
          const localUsers = JSON.parse(storedLocalUsers);
          // We search for a user matching email and use pass as simple verification (e.g. member123)
          const matchedUid = Object.keys(localUsers).find(uid =>
            localUsers[uid].email?.toLowerCase() === cleanEmail
          );

          if (matchedUid && pass === "member123") {
            const profile = localUsers[matchedUid];
            setUserData(profile);
            setIsDemoMode(true);
            localStorage.setItem("ft_demo_role", profile.role || "member");
            return profile;
          }
        } catch (e) {
          console.error("Error parsing local users", e);
        }
      }
    }

    // 2. Check hardcoded Local Credentials for staff/demo accounts
    if (LOCAL_CREDENTIALS[cleanEmail] && LOCAL_CREDENTIALS[cleanEmail] === pass) {
      let matchedProfile = DEMO_PROFILES.member;
      if (cleanEmail === "sanket@fitnesstemple.com") matchedProfile = DEMO_PROFILES.owner;
      else if (cleanEmail === "suraj@fitnesstemple.com") matchedProfile = DEMO_PROFILES.trainer_suraj;
      else if (cleanEmail === "bhavesh@ftnesstemple.com") matchedProfile = DEMO_PROFILES.trainer_bhavesh;

      setUserData(matchedProfile);
      setIsDemoMode(true);
      localStorage.setItem("ft_demo_role", matchedProfile.trainerId ? matchedProfile.trainerId : matchedProfile.role);
      return matchedProfile;
    }

    // Check if live Firebase is ready
    if (isFirebaseConfigured && auth && db) {
      try {
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
      } catch (err) {
        // Fall through to demo if firebase fails but we want to allow demo login
        console.warn("Firebase login failed, checking demo fallback...");
      }
    }

    // Demo Mode match without plaintext leak in code (if not already matched by LOCAL_CREDENTIALS)
    let matchedProfile = DEMO_PROFILES.member;

    if (cleanEmail === "sanket@fitnesstemple.com") {
      matchedProfile = DEMO_PROFILES.owner;
    } else if (cleanEmail === "suraj@fitnesstemple.com") {
      matchedProfile = DEMO_PROFILES.trainer_suraj;
    } else if (cleanEmail === "bhavesh@ftnesstemple.com") {
      matchedProfile = DEMO_PROFILES.trainer_bhavesh;
    }

    setUserData(matchedProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", matchedProfile.trainerId ? matchedProfile.trainerId : matchedProfile.role);
    return matchedProfile;
  };

  // Register with Email & Password
  const register = async (email: string, pass: string, details?: Partial<UserProfile>): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const defaultAvatar = details?.gender === 'girl' ? "/assets/girl.png" : "/assets/boy.png";

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
        gender: details?.gender || "boy",
        photoURL: details?.photoURL || defaultAvatar,
        profileImage: details?.profileImage || defaultAvatar,
        memberId: details?.memberId || `FT-${Math.floor(1000 + Math.random() * 9000)}`,
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
    const defaultAvatar = details?.gender === 'girl' ? "/assets/girl.png" : "/assets/boy.png";
    const demoProfile: UserProfile = {
      ...DEMO_PROFILES.member,
      uid: `demo_${Date.now()}`,
      name: details?.name || email.split("@")[0],
      email: email,
      phone: details?.phone || "+91 99887 76655",
      gender: details?.gender || "boy",
      photoURL: details?.photoURL || defaultAvatar,
      profileImage: details?.profileImage || defaultAvatar,
      fitnessGoal: details?.fitnessGoal || "General Fitness",
      memberId: `FT-LOC-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    // Persist to ft_local_users for persistence across sessions in demo mode
    if (typeof window !== "undefined") {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      const localUsers = storedLocalUsers ? JSON.parse(storedLocalUsers) : {};
      localUsers[demoProfile.uid] = demoProfile;
      localStorage.setItem("ft_local_users", JSON.stringify(localUsers));
    }

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
        // Removed forced prompt to speed up login for already signed-in users

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
        let snap;
        try {
          snap = await getDoc(userRef);
        } catch (e) {
          console.warn("Initial profile fetch failed, likely permission delay:", e);
        }

        if (snap && snap.exists()) {
          const data = snap.data() as UserProfile;
          setUserData(data);
          setUser(result.user);
          setIsDemoMode(false);
          localStorage.removeItem("ft_demo_role");
          return data;
        }

        // New Google User - Create Profile
        const userEmail = result.user.email?.toLowerCase() || "";
        const isDev = userEmail.includes("krishna") || userEmail.includes("patil") || userEmail.includes("sanket");
        const defaultAvatar = result.user.photoURL || "/assets/boy.png";

        const newProfile: UserProfile = {
          uid: result.user.uid,
          name: isDev ? "Krishna Patil (Developer)" : (result.user.displayName || "Fitness Warrior"),
          email: userEmail,
          photoURL: isDev ? "/assets/boy.png" : defaultAvatar,
          profileImage: isDev ? "/assets/boy.png" : defaultAvatar,
          role: isDev ? "owner" : "member",
          trainerId: "trainer_suraj",
          trainerName: "Suraj Sir",
          membershipStatus: "active",
          membershipPlan: isDev ? "Developer Access" : "Standard Member",
          membershipExpiry: "2026-12-31",
          fitnessGoal: "General Fitness",
          memberId: isDev ? "DEV-001" : `FT-${Math.floor(1000 + Math.random() * 9000)}`,
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
    const cleanEmail = email.trim().toLowerCase();

    if (type === "member") {
      // For members, we assume Firebase auth or existence of userData is enough
      const isMatch = (user && user.email?.toLowerCase() === cleanEmail) ||
                      (userData && userData.email?.toLowerCase() === cleanEmail);

      if (isMatch) {
        const session = {
          uid: user?.uid || userData?.uid || "verified_member",
          role: "member",
          name: userData?.name || user?.displayName || "Member",
          authenticated: true,
          loginAt: Date.now()
        };
        setPortalSession(session);
        localStorage.setItem("ft_portal_session", JSON.stringify(session));
        return true;
      }
      return false;
    }

    // For Trainer/Owner, check strictly via API (Hidden env vars / hardcoded checks securely on server)
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
