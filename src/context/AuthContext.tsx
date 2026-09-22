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
  loginWithPhone: (phone: string, displayName?: string) => Promise<UserProfile>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserData: (newData: Partial<UserProfile>) => Promise<void>;
  verifyPortalAccess: (email: string, pass: string, type: "member" | "trainer" | "owner") => Promise<boolean>;
  setDemoRole: (role: UserRole, trainerChoice?: "suraj" | "sanket") => void;
  isDemoMode: boolean;
  portalSession: any | null;
}

// Helper to format clean display name from email (before @)
export const getCleanEmailName = (email?: string | null): string => {
  if (!email) return "Member";
  const prefix = email.split('@')[0];
  const clean = prefix.replace(/[._-]+/g, ' ').trim();
  return clean
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ') || "Member";
};

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
  loginWithPhone: async () => { throw new Error("Uninitialized"); },
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
    const storedPortalSession = typeof window !== "undefined" ? localStorage.getItem("ft_portal_session") : null;

    if (!isFirebaseConfigured || storedDemo) {
      if (storedDemo && DEMO_PROFILES[storedDemo]) {
        setUserData(DEMO_PROFILES[storedDemo]);
        setIsDemoMode(true);
        if (storedPortalSession) {
          try {
            setPortalSession(JSON.parse(storedPortalSession));
          } catch (e) {}
        }
      } else if (!isFirebaseConfigured) {
        // Fallback default demo for offline exploration
        setUserData(DEMO_PROFILES.member);
        setIsDemoMode(true);
        if (storedPortalSession) {
          try {
            setPortalSession(JSON.parse(storedPortalSession));
          } catch (e) {}
        }
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
          let userSnap;

          // Retry logic for permission propagation
          for (let i = 0; i < 3; i++) {
            try {
              userSnap = await getDoc(userDocRef);
              break;
            } catch (e: any) {
              if (e.code === 'permission-denied' && i < 2) {
                await new Promise(resolve => setTimeout(resolve, 800 * (i + 1)));
              } else {
                throw e;
              }
            }
          }

          let profileData: UserProfile;

          if (userSnap && userSnap.exists()) {
            profileData = userSnap.data() as UserProfile;
            const currentName = profileData.name || "";
            const isGenericName = !currentName || ["warrior", "fitness warrior", "fitness member", "member"].includes(currentName.trim().toLowerCase()) || currentName.includes('@');
            if (isGenericName && (profileData.email || firebaseUser.email)) {
              profileData.name = getCleanEmailName(profileData.email || firebaseUser.email);
            }
          } else {
            // New user detection
            const newUserEmail = firebaseUser.email?.toLowerCase() || "";
            let assignedRole: UserRole = "member";

            if (newUserEmail.includes("management") ||
                newUserEmail.includes("owner") ||
                newUserEmail.includes("krishna") ||
                newUserEmail.includes("patil") ||
                newUserEmail.includes("sanket")) {
              assignedRole = "owner";
            } else if (newUserEmail.includes("suraj") || newUserEmail.includes("bhavesh")) {
              assignedRole = "trainer";
            }

            const cleanEmailName = getCleanEmailName(newUserEmail);
            const finalName = (firebaseUser.displayName && !["warrior", "fitness warrior", "fitness member"].includes(firebaseUser.displayName.trim().toLowerCase()))
              ? firebaseUser.displayName
              : cleanEmailName;

            profileData = {
              uid: firebaseUser.uid,
              name: finalName,
              email: newUserEmail,
              photoURL: firebaseUser.photoURL || "",
              role: assignedRole,
              membershipStatus: "active",
              createdAt: serverTimestamp(),
            };

            // Attempt to create the document if it doesn't exist
            try {
              await setDoc(userDocRef, profileData, { merge: true });
            } catch (e) {
              console.warn("Profile sync deferred (permission issue):", e);
            }
          }

          setUserData(profileData);
          setIsDemoMode(false);
          localStorage.removeItem("ft_demo_role");

          // Update portal session
          const session = {
            uid: firebaseUser.uid,
            role: profileData.role || 'member',
            name: profileData.name || "Member",
            authenticated: true,
            loginAt: Date.now()
          };
          setPortalSession(session);
          localStorage.setItem("ft_portal_session", JSON.stringify(session));

        } catch (error) {
          console.error("Auth state sync error:", error);
        }
      } else {
        // If we are NOT in demo mode, clear everything
        const isCurrentlyDemo = localStorage.getItem("ft_demo_role") !== null;
        if (!isCurrentlyDemo) {
          setUserData(null);
          setPortalSession(null);
          localStorage.removeItem("ft_portal_session");
        } else {
          // If we ARE in demo mode, ensure portalSession is populated from storage if available
          const storedPortal = localStorage.getItem("ft_portal_session");
          if (storedPortal && !portalSession) {
            try {
              setPortalSession(JSON.parse(storedPortal));
            } catch (e) {
              console.error("Portal session recovery error", e);
            }
          }
        }
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
          const matchedUid = Object.keys(localUsers).find(uid =>
            localUsers[uid].email?.toLowerCase() === cleanEmail
          );

          if (matchedUid && pass === "member123") {
            const profile = localUsers[matchedUid];
            setUserData(profile);
            setIsDemoMode(true);
            localStorage.setItem("ft_demo_role", profile.role || "member");

            const session = {
              uid: profile.uid,
              role: profile.role || 'member',
              name: profile.name,
              authenticated: true,
              loginAt: Date.now()
            };
            setPortalSession(session);
            localStorage.setItem("ft_portal_session", JSON.stringify(session));

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

      const session = {
        uid: matchedProfile.uid,
        role: matchedProfile.role || 'member',
        name: matchedProfile.name,
        authenticated: true,
        loginAt: Date.now()
      };
      setPortalSession(session);
      localStorage.setItem("ft_portal_session", JSON.stringify(session));

      return matchedProfile;
    }

    // Check if live Firebase is ready
    if (isFirebaseConfigured && auth && db) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));

        let data: UserProfile;
        if (userDoc.exists()) {
          data = userDoc.data() as UserProfile;
        } else {
          const emailPrefix = email.split('@')[0];
          data = {
            uid: cred.user.uid,
            name: cred.user.displayName || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)),
            email: cred.user.email || email,
            role: "member",
            trainerId: "trainer_suraj",
            trainerName: "Suraj Sir",
            membershipStatus: "active",
          };
          await setDoc(doc(db, "users", cred.user.uid), data);
        }

        setUserData(data);
        setUser(cred.user);
        setIsDemoMode(false);
        localStorage.removeItem("ft_demo_role");

        const session = {
          uid: cred.user.uid,
          role: data.role || 'member',
          name: data.name || "Member",
          authenticated: true,
          loginAt: Date.now()
        };
        setPortalSession(session);
        localStorage.setItem("ft_portal_session", JSON.stringify(session));

        return data;
      } catch (err) {
        console.warn("Firebase login failed, checking demo fallback...");
      }
    }

    let matchedProfile = { ...DEMO_PROFILES.member };
    if (cleanEmail === "sanket@fitnesstemple.com") matchedProfile = { ...DEMO_PROFILES.owner };
    else if (cleanEmail === "suraj@fitnesstemple.com") matchedProfile = { ...DEMO_PROFILES.trainer_suraj };
    else if (cleanEmail === "bhavesh@ftnesstemple.com") matchedProfile = { ...DEMO_PROFILES.trainer_bhavesh };
    else {
      matchedProfile.name = getCleanEmailName(cleanEmail);
      matchedProfile.email = cleanEmail;
    }

    setUserData(matchedProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", matchedProfile.trainerId ? matchedProfile.trainerId : matchedProfile.role);

    const demoSession = {
      uid: matchedProfile.uid,
      role: matchedProfile.role || 'member',
      name: matchedProfile.name,
      authenticated: true,
      loginAt: Date.now()
    };
    setPortalSession(demoSession);
    localStorage.setItem("ft_portal_session", JSON.stringify(demoSession));

    return matchedProfile;
  };

  // Register with Email & Password
  const register = async (email: string, pass: string, details?: Partial<UserProfile>): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const emailPrefix = email.split('@')[0];
      const defaultAvatar = details?.gender === 'girl' ? "/assets/girl.png" : "/assets/boy.png";

      const newProfile: UserProfile = {
        uid: cred.user.uid,
        name: details?.name || (emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1)),
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

      const session = {
        uid: cred.user.uid,
        role: newProfile.role,
        name: newProfile.name,
        authenticated: true,
        loginAt: Date.now()
      };
      setPortalSession(session);
      localStorage.setItem("ft_portal_session", JSON.stringify(session));

      return newProfile;
    }

    const cleanEmailName = getCleanEmailName(email);
    const defaultAvatar = details?.gender === 'girl' ? "/assets/girl.png" : "/assets/boy.png";
    const demoProfile: UserProfile = {
      ...DEMO_PROFILES.member,
      uid: `demo_${Date.now()}`,
      name: details?.name || cleanEmailName,
      email: email,
      phone: details?.phone || "+91 99887 76655",
      gender: details?.gender || "boy",
      photoURL: details?.photoURL || defaultAvatar,
      profileImage: details?.profileImage || defaultAvatar,
      fitnessGoal: details?.fitnessGoal || "General Fitness",
      memberId: `FT-LOC-${Math.floor(1000 + Math.random() * 9000)}`,
    };

    if (typeof window !== "undefined") {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      const localUsers = storedLocalUsers ? JSON.parse(storedLocalUsers) : {};
      localUsers[demoProfile.uid] = demoProfile;
      localStorage.setItem("ft_local_users", JSON.stringify(localUsers));
    }

    setUserData(demoProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", "member");

    const demoSession = {
      uid: demoProfile.uid,
      role: 'member',
      name: demoProfile.name,
      authenticated: true,
      loginAt: Date.now()
    };
    setPortalSession(demoSession);
    localStorage.setItem("ft_portal_session", JSON.stringify(demoSession));

    return demoProfile;
  };

  // Google Sign-In
  const loginWithGoogle = async (): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      try {
        const provider = new GoogleAuthProvider();
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          await signInWithRedirect(auth, provider);
          return {} as UserProfile;
        }

        const result = await signInWithPopup(auth, provider);
        const userRef = doc(db, "users", result.user.uid);

        let snap;
        try {
          snap = await getDoc(userRef);
        } catch (e) {}

        if (snap && snap.exists()) {
          const data = snap.data() as UserProfile;
          setUserData(data);
          setUser(result.user);
          setIsDemoMode(false);
          localStorage.removeItem("ft_demo_role");

          const session = {
            uid: result.user.uid,
            role: data.role || 'member',
            name: data.name || result.user.displayName || "Member",
            authenticated: true,
            loginAt: Date.now()
          };
          setPortalSession(session);
          localStorage.setItem("ft_portal_session", JSON.stringify(session));

          return data;
        }

        const userEmail = result.user.email?.toLowerCase() || "";
        const isDev = userEmail.includes("krishna") || userEmail.includes("patil") || userEmail.includes("sanket");
        const defaultAvatar = result.user.photoURL || "/assets/boy.png";
        const emailName = getCleanEmailName(userEmail);

        const googleDisplayName = result.user.displayName;
        const finalDisplayName = (googleDisplayName && !["warrior", "fitness warrior", "fitness member"].includes(googleDisplayName.trim().toLowerCase()))
          ? googleDisplayName
          : emailName;

        const newProfile: UserProfile = {
          uid: result.user.uid,
          name: isDev ? "Krishna Patil" : finalDisplayName,
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
        } catch (e) {}

        setUserData(newProfile);
        setUser(result.user);
        setIsDemoMode(false);
        localStorage.removeItem("ft_demo_role");

        const session = {
          uid: result.user.uid,
          role: newProfile.role,
          name: newProfile.name,
          authenticated: true,
          loginAt: Date.now()
        };
        setPortalSession(session);
        localStorage.setItem("ft_portal_session", JSON.stringify(session));

        return newProfile;
      } catch (error: any) {
        console.error("Google Sign-In Error:", error);
        throw error;
      }
    }

    const profile = DEMO_PROFILES.member;
    setUserData(profile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", "member");
    return profile;
  };

  const loginWithPhone = async (phone: string, displayName?: string): Promise<UserProfile> => {
    const cleanPhone = phone.trim();
    const phoneDigits = cleanPhone.replace(/\D/g, "");
    const last4 = phoneDigits.slice(-4) || "0000";
    const memberId = `FT-PH-${last4}-${Math.floor(100 + Math.random() * 900)}`;
    const syntheticEmail = `${phoneDigits ? `user_${phoneDigits}` : `phone_${Date.now()}`}@fitnesstemple.com`;
    const resolvedName = displayName?.trim() || `Member ${last4}`;

    if (typeof window !== "undefined") {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      if (storedLocalUsers) {
        try {
          const localUsers = JSON.parse(storedLocalUsers);
          const matchedUid = Object.keys(localUsers).find(uid =>
            localUsers[uid].phone?.replace(/\D/g, "") === phoneDigits
          );
          if (matchedUid) {
            const profile = localUsers[matchedUid];
            setUserData(profile);
            setIsDemoMode(true);
            localStorage.setItem("ft_demo_role", profile.role || "member");

            const session = {
              uid: profile.uid,
              role: profile.role || 'member',
              name: profile.name,
              authenticated: true,
              loginAt: Date.now()
            };
            setPortalSession(session);
            localStorage.setItem("ft_portal_session", JSON.stringify(session));
            return profile;
          }
        } catch (e) {
          console.error("Error parsing local phone users", e);
        }
      }
    }

    const newProfile: UserProfile = {
      uid: `phone_${phoneDigits || Date.now()}`,
      name: resolvedName,
      fullName: resolvedName,
      phone: cleanPhone,
      mobile: cleanPhone,
      email: syntheticEmail,
      role: "member",
      trainerId: "trainer_suraj",
      trainerName: "Suraj Sir",
      membershipStatus: "active",
      membershipPlan: "Standard Annual",
      membershipExpiry: "2027-01-01",
      fitnessGoal: "General Fitness",
      memberId: memberId,
      photoURL: "/assets/boy.png",
      profileImage: "/assets/boy.png",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const storedLocalUsers = localStorage.getItem("ft_local_users");
      const localUsers = storedLocalUsers ? JSON.parse(storedLocalUsers) : {};
      localUsers[newProfile.uid] = newProfile;
      localStorage.setItem("ft_local_users", JSON.stringify(localUsers));
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "users", newProfile.uid), newProfile, { merge: true });
        await setDoc(doc(db, "members", newProfile.uid), newProfile, { merge: true });
      } catch (e) {
        console.warn("Phone user remote sync deferred:", e);
      }
    }

    setUserData(newProfile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", "member");

    const session = {
      uid: newProfile.uid,
      role: 'member',
      name: newProfile.name,
      authenticated: true,
      loginAt: Date.now()
    };
    setPortalSession(session);
    localStorage.setItem("ft_portal_session", JSON.stringify(session));

    return newProfile;
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    }
  };

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

  const verifyPortalAccess = async (email: string, pass: string, type: "member" | "trainer" | "owner"): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    if (type === "member") {
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

  const setDemoRole = (role: UserRole, trainerChoice?: "suraj" | "sanket") => {
    let key = role as string;
    if (role === "trainer") {
      key = trainerChoice === "sanket" ? "trainer_sanket" : "trainer_suraj";
    }
    const profile = DEMO_PROFILES[key] || DEMO_PROFILES.member;
    setUserData(profile);
    setIsDemoMode(true);
    localStorage.setItem("ft_demo_role", key);

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
    localStorage.removeItem("ft_local_users");
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
        loginWithPhone,
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
