import { RiDashboardFill } from "react-icons/ri";
import { FaChalkboardTeacher, FaFileCsv, FaUserPlus, FaUserTie } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import Link from "next/link";
import SidebarFooter from "@/shared/SidebarFooter";
import PrivateRoute from "@/components/auth/PrivateRoute";

export default function Layout({ children }) {
    return (
        <PrivateRoute>
            <div className="drawer drawer-open bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
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
                    <ul className="menu flex-nowrap shrink-0 bg-base-200 p-0 pt-8  dark:bg-gray-800 gap-3  text-base-content dark:text-gray-100 min-h-full overflow-hidden w-12 hover:w-80 duration-300  transition-[width]">
                        {/* Sidebar content here */}
                        <Link href={"/agents"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-white transition">
                                <RiDashboardFill className="text-xl shrink-0 p-0" /> Dashboard
                            </li>
                        </Link>
                        <Link href={"/agents/all-leads"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-white transition">
                                <FaUserTie className="text-xl  shrink-0 p-0" /> My Leads
                            </li>
                        </Link>

                        <Link href={"/agents/create-leads"}>
                            <li className="flex flex-nowrap text-nowrap shrink-0 cursor-pointer px-5 flex-row items-center gap-2 text-md   py-3 rounded-none hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-white transition">
                                <FaUserPlus className="text-xl  shrink-0 p-0" /> Create Lead
                            </li>
                        </Link>




                        <SidebarFooter />
                    </ul>
                </div>
            </div>
        </PrivateRoute>
    );
}
