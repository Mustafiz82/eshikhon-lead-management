// src/components/auth/PrivateRoute.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";

export default function PrivateRoute({ children, fallback = null }) {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Not logged in → send to login with redirect back
    if (user === null) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/?next=${next}`);
    }
  }, [user, router, pathname]);

  if (!user) return fallback; // or a spinner

  return children;
}
