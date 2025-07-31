"use client";
import React, { useState } from "react";
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";


const dummyUsers = [
    {
        id: 1,
        name: "Ibrahim Akbar",
        email: "ibrahim@example.com",
        role: "Admin",
        password: "admin123",
    },
    {
        id: 2,
        name: "Agent 1",
        email: "agent1@example.com",
        role: "User",
        password: "agent123",
    },
    {
        id: 3,
        name: "Agent 2",
        email: "agent2@example.com",
        role: "User",
        password: "agent123",
    },
    {
        id: 4,
        name: "Agent 3",
        email: "agent3@example.com",
        role: "User",
        password: "agent123",
    },
    {
        id: 5,
        name: "Agent 4",
        email: "agent4@example.com",
        role: "User",
        password: "agent123",
    },
];


const page = () => {
    const [users, setUsers] = useState(dummyUsers);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "User",
        status: "Active",
    });

    const openDrawer = (user = null) => {
        if (user) {
            setEditUser(user);
            setFormData(user);
        } else {
            setEditUser(null);
            setFormData({ name: "", email: "", role: "User", status: "Active" });
        }
        setIsDrawerOpen(true);
    };

    const handleSubmit = () => {
        if (editUser) {
            setUsers(users.map(u => (u.id === editUser.id ? formData : u)));
        } else {
            const newUser = { ...formData, id: Date.now() };
            setUsers([...users, newUser]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 p-6">

                <div className="overflow-x-auto">
                    <table className="table table-md table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th >Role</th>
                                <th ></th>

                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td></td>

                                    <td>
                                        <button className="btn btn-sm mr-2 bg-blue-600 btn-primary" onClick={() => openDrawer(user)}><FaEdit /> Edit</button>
                                        <button className="btn btn-sm bg-red-500/80" onClick={() => handleDelete(user.id)}><MdDeleteForever className="text-lg" />Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr><td colSpan="5" className="text-center text-gray-400">No users found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Right Drawer */}
            <div className={`h-full w-[400px] bg-base-200   dark:bg-gray-800 shadow-lg transition-transform duration-300 z-50`}>
                <form
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (formData.password.length < 6) {
                            alert("Password must be at least 6 characters long.");
                            return;
                        }
                        if (formData.password !== formData.confirmPassword) {
                            alert("Passwords do not match.");
                            return;
                        }
                        handleSubmit();
                    }}
                    className="p-6 flex flex-col h-full"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            {editUser ? "Edit User" : "Add New User"}
                        </h2>

                        <div className="flex gap-2">
                            {/* Cancel Drawer Button */}


                            {/* Switch to Add New User */}
                            {editUser && (
                                <button
                                    type="button"
                                    className="btn btn-xs btn-outline"
                                    onClick={() => {
                                        setEditUser(null);
                                        setFormData({
                                            name: "",
                                            email: "",
                                            password: "",
                                            confirmPassword: "",
                                            role: "User",
                                            status: "Active",
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Input Fields */}
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Name"
                            autoComplete="off"
                            className="input input-bordered dark:bg-gray-900   focus:outline-0 focus:border-blue-600 w-full"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            autoComplete="off"
                            className="input input-bordered dark:bg-gray-900 focus:outline-0 focus:border-blue-600 w-full"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />

                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                minLength={6}
                                placeholder="Password (min 6 chars)"
                                autoComplete="new-password"
                                className="input input-bordered dark:bg-gray-900 focus:outline-0 focus:border-blue-600 w-full pr-12"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1} // optional: so tab doesn’t focus this button
                            >
                                {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                            </button>
                        </div>
                        <div className="relative w-full">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                required
                                minLength={6}
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                className="input input-bordered dark:bg-gray-900 focus:outline-0 focus:border-blue-600 w-full pr-12"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                tabIndex={-1} // optional: so tab doesn’t focus this button
                            >
                                {showConfirmPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                            </button>
                        </div>




                        <select
                            className="select dark:bg-gray-900 focus:outline-0 focus:border-blue-600 select-bordered w-full"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option>User</option>
                            <option>Admin</option>
                        </select>
                    </div>

                    {/* Submit Button pinned to bottom */}
                    <div className="mt-auto pt-4">
                        <button type="submit" className="btn bg-blue-600 btn-primary w-full">
                            {editUser ? "Update User" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>


        </div>
    );
};

export default page;
