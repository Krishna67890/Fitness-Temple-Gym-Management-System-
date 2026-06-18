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
  updateUserData: (newData: any) => void;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  logout: async () => {},
  updateUserData: () => {},
  isFirebaseConfigured: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const updateUserData = (newData: any) => {
    setUserData((prev: any) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("ft_member_session", JSON.stringify(updated));
      return updated;
    });
  };

  const isFirebaseConfigured = !!auth;

  useEffect(() => {
    const checkSession = () => {
      const savedMember = localStorage.getItem("ft_member_session");
      if (savedMember) {
        try {
          const data = JSON.parse(savedMember);
          setUserData(data);
          setLoading(false);
          return true;
        } catch (e) {
          console.error("Error parsing saved session", e);
        }
      }
      return false;
    };

    const hasSession = checkSession();

    if (!auth) {
      if (!hasSession) {
        setUserData(null);
      }
      setLoading(false);
      return;
    }

    // Keep Firebase listener as fallback but prioritize local storage
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (!localStorage.getItem("ft_member_session")) {
        if (user && db) {
          try {
            const docRef = doc(db!, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
              localStorage.setItem("ft_member_session", JSON.stringify(data));
              localStorage.setItem("ft_user_role", data.role?.toLowerCase() || "member");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
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
    <AuthContext.Provider value={{ user, userData, loading, logout, updateUserData, isFirebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
