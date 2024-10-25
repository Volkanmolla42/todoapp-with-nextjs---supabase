"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      console.log("Giriş başarılı:", user);
    } else {
      console.error("Giriş başarısız.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 p-4 border border-blue-500 w-96 items-center"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border border-blue-400 p-3 "
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border border-blue-400 p-3 "
      />
      <button
        type="submit"
        className="border-none bg-blue-500 py-2 px-4 text-white rounded-md"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
