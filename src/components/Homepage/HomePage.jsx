"use client";

import { useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import axiosPublic from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";


export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { setUser } = useContext(AuthContext)
  const searchParams = useSearchParams();
  const next = searchParams.get("next");


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axiosPublic.post("/user/login", { email, password })
      const { user } = res?.data
      setError("")
      setUser(res?.data?.user)
      const fallback = user.role === "admin" ? "/admin" : "/agents";
      router.replace(next || fallback);
    } catch (error) {
      console.log(error, "errro")
      // setError(error?.data?.response?.error)
      setError(error?.response?.data?.error)
    }
    finally {
      setLoading(false)
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
            className="input input-bordered bg-gray-900 focus:border-blue-600 focus:outline-0  w-full"
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
              className="input input-bordered bg-gray-900 focus:border-blue-600 focus:outline-0 w-full pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer top-3 text-gray-500 z-10"
              tabIndex={-1}
            >
              {showPassword ? <BsEyeFill className="text-blue-600" /> : <BsEyeSlashFill />}
            </button>
          </div>
        </div>

        <p className="text-red-500">{error}</p>

        {/* Submit */}
        <button disabled={loading} type="submit" className="btn mt-5 bg-blue-600 btn-primary w-full">
       { !loading ?   "Login" : "Logging in ..."}
        </button>
      </form>
    </div>
  );
}
