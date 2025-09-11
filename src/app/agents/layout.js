"use client"
import { RiDashboardFill } from "react-icons/ri";
import { FaChalkboardTeacher, FaFileCsv, FaUserPlus, FaUserTie } from "react-icons/fa";

import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function Layout({ children }) {

    const { user } = useContext(AuthContext)
    return (
        <PrivateRoute>
            <div className="drawer drawer-open bg-gray-900 text-gray-100 transition-colors">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    {children}
                    {/* <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
                    Open drawer
                </label> */}
                </div>
                <div className=" p-0 ">

                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu flex-nowrap shrink-0 p-0 pt-8  bg-gray-800 gap-3   text-gray-100 min-h-full overflow-hidden w-12 hover:w-80 duration-300  transition-[width]">
                        {/* Sidebar content here */}

                        <Link href={"/agents"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none   hover:bg-blue-900 hover:text-white transition">
                                <RiDashboardFill className="text-xl shrink-0 p-0" /> Dashboard
                            </li>
                        </Link>
                        <Link href={"/agents/all-leads"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none   hover:bg-blue-900 hover:text-white transition">
                                <FaUserTie className="text-xl  shrink-0 p-0" /> My Leads
                            </li>
                        </Link>

                        <Link href={"/agents/create-leads"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none   hover:bg-blue-900 hover:text-white transition">
                                <FaUserPlus className="text-xl  shrink-0 p-0" /> Create Lead
                            </li>
                        </Link>


                        <li className="mt-auto px-5 flex flex-row py-3 border-t border-gray-700/30 dark:border-gray-200/20 items-center">
                         
                            <div className="p-0 mt-5">

                                <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                                <p className="text-xs opacity-70 truncate">( {user?.role || "Agent"} )</p>
                            </div>
                        </li>

                        <SidebarFooter />
                    </ul>
                </div>
            </div>
        </PrivateRoute>
    );
}
