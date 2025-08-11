"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaChalkboardTeacher } from "react-icons/fa";


const dummyUsers = [
    {
        id: 1,
        name: "Ibrahim Akbar",
        email: "ibrahim@example.com",
        role: "Admin",
        password: "admin123",
        totalAssigned: 20,
        pending: 5,
        followUp: 3,
        admitted: 10,
        joined: 2,
    },
    {
        id: 2,
        name: "Agent 1",
        email: "agent1@example.com",
        role: "user",
        password: "agent123",
        totalAssigned: 15,
        pending: 4,
        followUp: 2,
        admitted: 7,
        joined: 2,
    },
    {
        id: 3,
        name: "Agent 2",
        email: "agent2@example.com",
        role: "user",
        password: "agent123",
        totalAssigned: 18,
        pending: 6,
        followUp: 1,
        admitted: 9,
        joined: 2,
    },
    {
        id: 4,
        name: "Agent 3",
        email: "agent3@example.com",
        role: "user",
        password: "agent123",
        totalAssigned: 10,
        pending: 2,
        followUp: 1,
        admitted: 5,
        joined: 2,
    },
    {
        id: 5,
        name: "Agent 4",
        email: "agent4@example.com",
        role: "user",
        password: "agent123",
        totalAssigned: 12,
        pending: 3,
        followUp: 2,
        admitted: 6,
        joined: 1,
    },
];






const page = () => {
    const [users, setUsers] = useState(dummyUsers);
    const agents = dummyUsers.filter(user => user.role == "user")
    const router  = useRouter() 

    return (
        <div className="p-4 h-screen overflow-hidden">
            {/* Main Content */}
                <div className="overflow-x-auto">
                    <table className="table table-md table-zebra w-full">
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
                                <tr className="cursor-pointer" onClick={() => {router.push(`/admin/agents/${user.id}`)}} key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td className="pl-10">{user.totalAssigned ?? 0}</td>
                                    <td className="pl-10">{user.pending ?? 0}</td>
                                    <td className="pl-10">{58}%</td>
                                
                                    <td className="pl-10">{user.followUp ?? 0}</td>
                                    <td className="pl-10">{user.admitted ?? 0}</td>
                                    <td className="pl-10">{user.joined ?? 0}</td>

                                </tr>

                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan="5" className="text-center text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
         

        </div>
    );
};

export default page;
