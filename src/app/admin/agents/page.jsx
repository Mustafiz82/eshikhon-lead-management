"use client";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";
import React, { useState } from "react";






const page = () => {
    const router  = useRouter() 
    const {data:user} = useFetch("/user")
    const agents = user.filter(user => user.role == "user")

    return (
        <div className="p-4 h-screen overflow-hidden">
            {/* Main Content */}
                <div className="overflow-x-auto">
                    <table className="table  table-md table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th >Total Assigned</th>
                                <th>Pending</th>
                                <th>Target completion</th>
                                <th>Follow up</th>
                                <th>Admitted</th>
                                <th>Joined </th>
                               
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map(user => (
                                <tr className="cursor-pointer" onClick={() => {router.push(`/admin/agents/${user.email}`)}} key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="pl-10">{user.leadCount ?? 0}</td>
                                    <td className="pl-10">{user.pendingCount ?? 0}</td>
                                    <td className="pl-10">{58}%</td>
                                
                                    <td className="pl-10">{user.followUpCount ?? 0}</td>
                                    <td className="pl-10">{user.enrolledCount ?? 0}</td>
                                    <td className="pl-10">{user.joinedOnSeminarCount ?? 0}</td>

                                </tr>

                            ))}
                            {agents.length === 0 && (
                                <tr><td colSpan="5" className="text-center text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
         

        </div>
    );
};

export default page;
