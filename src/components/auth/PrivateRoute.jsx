// src/components/auth/PrivateRoute.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";

export default function PrivateRoute({ children, fallback = null }) {
  const { user, authLoading } = useContext(AuthContext); // assumes AuthContext exposes a loading flag

  const {
    data: backendUser,
    error,
    loading: backendLoading,
  } = useFetch(user?._id ? `/user/${user._id}` : null); // don't fetch until we have an id

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Still resolving auth state — don't decide anything yet
    if (authLoading || backendLoading) return;

    const next = encodeURIComponent(pathname || "/");

    // No user in context at all → not logged in
    if (!user?._id) {
      router.replace(`/?next=${next}`);
      return;
    }

    // Token expired / rejected by backend
    if (error?.includes("401")) {
      router.replace(`/?next=${next}`);
      return;
    }
  }, [authLoading, backendLoading, user, backendUser, error, router, pathname]);

  // While resolving, or if we've determined there's no valid backend user, show fallback
  if (authLoading || backendLoading || !backendUser) return fallback;

  return children;
}