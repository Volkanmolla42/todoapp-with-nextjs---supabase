"use client";

import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "" || confirmPassword === "") {
      return;
    } else if (password !== confirmPassword) {
      return;
    }

    const user = await register(email, password);

    if (user) {
      console.log("Giriş başarılı:", user);
    } else console.log("Giriş başarısız:", user);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-4 border border-blue-500 w-96 items-center"
    >
      <input
        type="email"
        value={email}
        placeholder="Enter your email"
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="off"
        className="border border-blue-400 p-3 "
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        required
        autoComplete="off"
        className="border border-blue-400 p-3 "
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm your password"
        required
        autoComplete="off"
        className="border border-blue-400 p-3 "
      />

      <button
        type="submit"
        className="border-none bg-blue-500 py-2 px-4 text-white rounded-md"
      >
        Register
      </button>
    </form>
  );
};

export default RegisterForm;
