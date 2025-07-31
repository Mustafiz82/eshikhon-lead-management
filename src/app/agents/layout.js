import { RiDashboardFill } from "react-icons/ri";
import { FaFileCsv, FaUserTie } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";

export default function Layout({ children }) {
    return (
        <div className="drawer drawer-open bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                {children}
                {/* <label htmlFor="my-drawer" className="btn btn-primary drawer-button">
                    Open drawer
                </label> */}
            </div>
       
        </div>
    );
}
