"use client";
import useFetch from "@/hooks/useFetch";
import CustomSelect from "@/utils/CustomSelect";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { TbCurrencyTaka } from "react-icons/tb";



const page = () => {
    const router = useRouter()
    const currentMonth = new Date().getMonth() + 1;
    console.log(currentMonth)
    const [selectedFilter, setSelectedFilter] = useState(String(currentMonth));
    const { data: user, loading } = useFetch(`/dashboard/agent?month=${selectedFilter}&year=2025`)
    const agents = user.filter(user => user.role == "user")


    const options = [
        { value: "all", label: "All Time" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];




    return (
        <div className="p-6 min-h-[calc(100vh-100px)] lg:h-screen overflow-hidden">


            <div className="flex  bg-slate-900 justify-between mb-4">
                <h2 className="text-white text-lg lg:text-xl font-semibold capitalize">Agent Overview</h2>
                <div className="flex gap-2 items-center">
                    <p className="whitespace-nowrap    text-gray-300 hidden lg:block">View Statistics for:</p>

                    <CustomSelect
                        selected={selectedFilter}
                        setSelected={setSelectedFilter}
                        options={options}

                    />
                </div>
            </div>

            {/* Main Content */}
            {loading ? (
                <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
            ) : (
                <div className="overflow-x-auto">

                    {agents.length > 0 ? (
                        <table className="table  table-md table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>This Month Assigned</th>
                                    <th>Connected Today</th>
                                    <th>Completed</th>
                                    <th>Pending</th>
                                    <th>Enrolled</th>
                                    <th>Sales </th>
                                    <th className="text-center">Refunds </th>
                                    <th>Target completion</th>
                                    <th>Commission</th>

                                </tr>
                            </thead>
                            <tbody className="">
                                {agents.map(user => (
                                    <tr className="cursor-pointer" onClick={() => { router.push(`/admin/agents/${user.email}`) }} key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td className="pl-10">{user.leadCount ?? 0}</td>
                                        <td className="pl-10">{user.connectedCallCountToday ?? 0}</td>
                                        <td className="pl-10">{(user.leadCount - user.pendingCount) || 0}</td>
                                        <td className="pl-10">{user.pendingCount ?? 0}</td>
                                        <td className="pl-10">{user.totalEnrolled ?? 0}</td>
                                        <td className="pl- text-center">{user.totalSales}</td>
                                        <td className="pl- text-center">{user.totalRefunds}</td>

                                        <td className="pl-10">{user.targetCompletionRate ?? 0}%</td>
                                        <td className="pl-10 flex items-center ">{user.commission ?? 0} <TbCurrencyTaka /></td>


                                    </tr>

                                ))}

                            </tbody>
                        </table>

                    ) : (
                        <div className="w-full h-[300px] flex justify-center items-center  text-center py-6 text-gray-400">
                            No users found. 
                        </div>
                    )}
                </div>

            )}
        </div>
    );
};

export default page;
