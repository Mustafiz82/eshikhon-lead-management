"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

const users = [
  { email: "admin@example.com", password: "admin123", role: "admin" },
  { email: "agent1@example.com", password: "agent123", role: "agent" },
  { email: "agent2@example.com", password: "agent123", role: "agent" },
];

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") router.push("/admin");
      else if (user.role === "agent") router.push("/agent/leads");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-xl flex flex-col gap-5"
      >
        <h2 className="text-2xl font-bold text-center text-base-content mb-5">Login to Your Account</h2>

        {/* Email */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-base-content pb-3">Email</span>
          </label>
          <input
            type="email"
            placeholder="Enter email"
            className="input input-bordered dark:bg-gray-900 focus:border-blue-600 focus:outline-0  w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>

        {/* Password with toggle */}
        <div className="form-control relative">
          <label className="label">
            <span className="label-text text-base-content pb-3">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="input input-bordered dark:bg-gray-900 focus:border-blue-600 focus:outline-0 w-full pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer top-[12px] text-gray-500 z-10"
              tabIndex={-1}
            >
              {showPassword ? <BsEyeFill className="text-blue-600" /> : <BsEyeSlashFill />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn mt-5 bg-blue-600 btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
}
