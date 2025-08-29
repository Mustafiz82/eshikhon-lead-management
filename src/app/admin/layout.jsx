"use client"
import { RiDashboardFill } from "react-icons/ri";
import { FaChalkboardTeacher, FaFileCsv, FaUserTie } from "react-icons/fa";
import { MdDiscount, MdSupportAgent } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";
import { usePathname, useRouter } from "next/navigation";
import AdminRoute from "@/components/auth/AdminRoute";

export default function Layout({ children }) {
    const pathname = usePathname()

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
        <AdminRoute>
            <div className="drawer drawer-open bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">{children}</div>
                <div className="drawer-side p-0">
                    <label htmlFor="my-drawer" className="drawer-overlay" />
                    <ul className="menu bg-base-200 p-0 pt-8 dark:bg-gray-800 gap-3 text-base-content dark:text-gray-100 min-h-full w-80 transition-colors">
                        {menuItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <li
                                    className={`flex cursor-pointer px-5 flex-row items-center gap-2 text-md py-3 rounded-none transition
                                    ${pathname === item.href
                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white"
                                            : "hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-white"
                                        }`}
                                >
                                    {item.icon} {item.label}
                                </li>
                            </Link>
                        ))}
                        <SidebarFooter />
                    </ul>
                </div>
            </div>
        </AdminRoute>
    );
}
