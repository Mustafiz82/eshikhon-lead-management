// src/components/auth/AdminRoute.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function AdminRoute({ children, fallback = null }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user === null) {
      // Not logged in → login
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/?next=${next}`);
      return;
    }
    // Logged in but not admin → bounce to user route (e.g., /dashboard)
    if (user && user.role !== "admin") {
      router.replace("/");
    }
  }, [user, router, pathname]);

  if (!user || user.role !== "admin") return fallback; // or a spinner

  return children;
}
