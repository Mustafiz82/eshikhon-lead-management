// src/components/auth/PrivateRoute.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";

export default function PrivateRoute({ children, fallback = null }) {
  const { user } = useContext(AuthContext);

   const {data : backendUser , error} = useFetch(`/user/${user?._id}`)
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Not logged in → send to login with redirect back
    if (backendUser === null || error?.includes("401")) {
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/?next=${next}`);
    }
  }, [user, router, pathname]);

  if (!user) return fallback; // or a spinner

  return children;
}
