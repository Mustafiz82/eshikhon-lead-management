"use client";

import { showAlert, showToast } from "@/utils/swal";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getUser());
    const isLoggingOut = useRef(false);
    const router = useRouter();

    function getUser() {
        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("user");
            return savedUser ? JSON.parse(savedUser) : {};
        }
        return null;
    }

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
            router.push("/");

            if (isLoggingOut.current) {
                showAlert("Logged out successfully", "", "success");
                isLoggingOut.current = false; // reset flag
            }
        }
    }, [user]);

    // logout function
    const logout = async () => {
        // 1. Immediately delete from localStorage so user never persists on refresh
        localStorage.removeItem("user");

        // 2. Show the alert (optional - will show for 1.2s before redirecting)
        if (typeof showAlert === "function") {
            showAlert("Logged out successfully", "", "success");
        }

        // 3. Hard redirect to login/home
        // This cleans up all memory and avoids rendering null to any dashboard component!
        setTimeout(() => {
            window.location.href = "/";
        }, 800);
    };

    return <AuthContext.Provider value={{ user, setUser, logout }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
