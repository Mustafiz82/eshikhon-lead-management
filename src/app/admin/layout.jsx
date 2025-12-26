"use client"
import { RiDashboardFill } from "react-icons/ri";
import { FaChalkboardTeacher, FaFileCsv, FaUserTie } from "react-icons/fa";
import { MdDiscount, MdSupportAgent } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";
import { usePathname, useRouter } from "next/navigation";
import AdminRoute from "@/components/auth/AdminRoute";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { LuMenu } from "react-icons/lu";
import { DateRangeContext, DateRangeProvider } from "@/context/DateRangeContext";

export default function Layout({ children }) {
    const pathname = usePathname()
    const { user } = useContext(AuthContext)


    const menuItems = [
        { href: "/admin", icon: <RiDashboardFill className="text-xl" />, label: "Dashboard" },
        { href: "/admin/all-leads", icon: <FaUserTie className="text-xl" />, label: "All Leads" },
        { href: "/admin/upload", icon: <FaFileCsv className="text-xl" />, label: "Upload CSV" },
        { href: "/admin/agents", icon: <MdSupportAgent className="text-xl" />, label: "Agent Overview" },
        { href: "/admin/manage-users", icon: <FaUserGroup className="text-xl" />, label: "Manage User" },
        { href: "/admin/manage-cources", icon: <FaChalkboardTeacher className="text-xl" />, label: "Manage Cources" },
        { href: "/admin/manage-discounts", icon: <MdDiscount className="text-xl" />, label: "Manage Discount" },
    ];



    return (
        <DateRangeProvider>
            <AdminRoute>
                <div className="drawer 2xl:drawer-open h-full bg-gray-900 text-gray-100 transition-colors">
                    <input id="my-drawer" type="checkbox" className="drawer-toggle" />


                    <div className="drawer-content h-full">
                        <div className="flex bg-gray-900 fixed z-9999 w-full  2xl:hidden p-5 top-0 h-fit justify-between items-center">
                            <a href="https://eshikhon.com/" target="blank"> <img className="h-10" src={"/logo/eshikhon.svg"} /></a>
                            <label htmlFor="my-drawer" className="btn btn-primary bg-blue-600 text-xl drawer-button"><LuMenu /></label>
                        </div>
                        <div className="mt-16 2xl:mt-0">
                            {children}
                        </div>
                    </div>
                    <div className="drawer-side z-9999! p-0">
                        <label htmlFor="my-drawer" className="drawer-overlay" />
                        <ul className="menu  p-0 pt-8 z-9999! relative bg-gray-800 gap-3  text-gray-100 min-h-full w-80 transition-colors">
                            {menuItems.map((item) => (
                                <Link key={item.href} href={item.href}>
                                    <li
                                        className={`flex cursor-pointer px-5 flex-row items-center gap-2 text-md py-3 rounded-none transition
                                    ${pathname === item.href
                                                ? " bg-blue-900 text-white"
                                                : " hover:bg-blue-900 hover:text-white"
                                            }`}
                                    >
                                        {item.icon} {item.label}
                                    </li>
                                </Link>
                            ))}





                            <li className="mt-auto px-5 flex flex-row py-3 border-t border-gray-700/30 dark:border-gray-200/20 items-center">

                                <div className="p-0 mt-5">

                                    <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
                                    <p className="text-xs opacity-70 truncate">( {user?.role || "Agent"} )</p>
                                </div>
                            </li>


                            <SidebarFooter />

                            <div className="flex  mt-2 px-5 justify-start">
                                <a href="https://eshikhon.com/" target="blank"> <img className="h-12  " src={"/logo/eshikhon.svg"} /></a>
                            </div>
                        </ul>
                    </div>
                </div>
            </AdminRoute>
        </DateRangeProvider>
    );
}
