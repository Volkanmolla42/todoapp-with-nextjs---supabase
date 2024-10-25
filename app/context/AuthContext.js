// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/app/services/todoService";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      console.log(data.user);
      if (data.user) {
        setUser(data.user);
        router.push("/todo");
      }
    };
    getUser();
  }, [router]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };

    fetchUser();
  }, []);
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Giriş hatası:", error.message);
      return null;
    }
    setUser(data.user);
    router.push("/todo");
    return data.user;
  };

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Kayıt hatası:", error.message);
      return null;
    }
    setUser(data.user);
    router.push("/todo");

    return data.user;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
