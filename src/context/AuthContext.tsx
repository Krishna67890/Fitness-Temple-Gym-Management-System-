"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  isFirebaseConfigured: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    // Check for hardcoded role session
    const savedRole = localStorage.getItem("ft_user_role");
    if (savedRole && (savedRole === "owner" || savedRole === "trainer")) {
      setUserData({ role: savedRole, name: savedRole.charAt(0).toUpperCase() + savedRole.slice(1) });
    }

    // Local Storage Check for Members
    const savedMember = localStorage.getItem("ft_member_session");
    if (savedMember) {
      try {
        const data = JSON.parse(savedMember);
        if (data.role?.toLowerCase() === "member" || data.role?.toLowerCase() === "trainer" || data.role?.toLowerCase() === "owner") {
          setUserData(data);
        }
      } catch (e) {
        console.error("Error parsing saved session", e);
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user && db) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);

            // Persist User to Local Storage for session continuity
            localStorage.setItem("ft_member_session", JSON.stringify(data));
            localStorage.setItem("ft_user_role", data.role?.toLowerCase() || "member");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        if (!localStorage.getItem("ft_member_session")) {
          setUserData(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    localStorage.removeItem("ft_member_session");
    localStorage.removeItem("ft_user_role");
    localStorage.removeItem("ft_user_session");
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUserData(null);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
