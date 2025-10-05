"use client"
import { RiDashboardFill } from "react-icons/ri";
import { FaChalkboardTeacher, FaFileCsv, FaUserPlus, FaUserTie } from "react-icons/fa";

import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { LuMenu } from "react-icons/lu";
import { useIsSmall } from "@/hooks/useIsSmall";

export default function Layout({ children }) {

    const { user } = useContext(AuthContext)
    const { userData } = useContext(AuthContext)
    const isSmall = useIsSmall();

    return (
        <PrivateRoute>
            <div className="drawer  bg-gray-900 text-gray-100 transition-colors">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content h-full">
                    <div className="flex bg-gray-900 fixed z-[999] w-full  xl:hidden p-5 top-0 h-fit justify-between items-center">
                        <a href="https://eshikhon.com/" target="blank"><img className="h-10" src={"/logo/eshikhon.svg"}/></a>
                        <label htmlFor="my-drawer" className="btn btn-primary bg-blue-600 text-xl drawer-button"><LuMenu /></label>
                    </div>
                    <div className="mt-16 xl:ml-10 2xl:ml-0 xl:mt-0">
                        {children}
                    </div>
                </div>
                <div className={`${isSmall && "drawer-side"}  z-[8999] p-0`}>

                    <label htmlFor="my-drawer" className="drawer-overlay" />
                    <ul className="menu flex-nowrap shrink-0 p-0 pt-8  bg-gray-800 gap-3 w-80   text-gray-100 min-h-full overflow-hidden xl:w-12 fixed 2xl:static hover:w-80 duration-300  ">
                  

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

                           <div className="flex mt-2  px-5 justify-start">
                            <a href="https://eshikhon.com/" target="blank">
                            <img className="h-12  " src={"/logo/eshikhon.svg"} /></a>
                        </div>
                    </ul>
                </div>
            </div>
        </PrivateRoute>
    );
}
