import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import AuthProvider from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Eshikhon Lead ",
  description: "A specialized Lead Management System (LMS",
};

export default function RootLayout({ children }) {
  return (
    <html data-theme="dark" lang="en">
      <AuthProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <ToastContainer />
        </body>
      </AuthProvider>
    </html>
  );
}
                                                                                                                                                   