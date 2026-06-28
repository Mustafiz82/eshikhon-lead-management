// src/components/auth/AdminRoute.jsx
"use client";
import { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";

export default function AdminRoute({ children, fallback = null }) {
  const { user } = useContext(AuthContext);

  console.log(user)
  const {data : backendUser} = useFetch(`/user/${user?._id}`)
  const router = useRouter();
  const pathname = usePathname();


  console.log(backendUser.role)

  useEffect(() => { 
    if (backendUser === null) {
      // Not logged in → login
      const next = encodeURIComponent(pathname || "/");
      router.replace(`/?next=${next}`);
      return;
    }
    // Logged in but not admin → bounce to backendUser route (e.g., /dashboard)
    if (backendUser && backendUser?.role == "user" ) {
      router.replace("/");
    }
  }, [backendUser, router, pathname]);

  if (!backendUser || backendUser?.role == "user") return fallback; // or a spinner

  return children;
}
