"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";

export default function AdminRoute({ children, fallback = null }) {
  const { user, authLoading } = useContext(AuthContext); // assumes AuthContext exposes a loading flag
  const router = useRouter();
  const pathname = usePathname();

  // Only fetch once we actually know who the user is
  const {
    data: backendUser,
    error,
    loading: backendLoading,
  } = useFetch(user?._id ? `/user/${user._id}` : null);

  useEffect(() => {
    // Still figuring out auth state — don't decide anything yet
    if (authLoading || backendLoading) return;

    const next = encodeURIComponent(pathname || "/");

    // No user in context at all → definitely not logged in
    if (!user?._id) {
      router.replace(`/?next=${next}`);
      return;
    }

    // Token expired / rejected by backend
    if (error?.includes("401")) {
      router.replace(`/?next=${next}`);
      return;
    }

    // Logged in but wrong role
    if (backendUser && backendUser.role === "user") {
      router.replace("/");
    }
  }, [authLoading, backendLoading, user, backendUser, error, router, pathname]);

  // While we don't yet know the answer, show fallback (spinner) — don't render admin content
  if (authLoading || backendLoading || !backendUser || backendUser?.role === "user") {
    return fallback;
  }

  return children;
}