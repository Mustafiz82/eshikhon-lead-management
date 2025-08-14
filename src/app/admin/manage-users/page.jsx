"use client";
import axiosPublic from "@/api/axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

const allowedDesignations = ["Junior Executive", "Executive", "Senior Executive"];

export default function Page() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [role, setRole] = useState("user")

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosPublic.get("/user");
            setUsers(res.data || []);
        } catch (err) {
            Swal.fire("Error", err?.response?.data?.error || err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const payload = {
            name: form.user_name.value.trim(),
            email: form.user_email.value.trim().toLowerCase(),
            password: form.user_password.value,
            role: form.role.value,
            designation: form.role.value === "admin" ? null : form.designation?.value || null,
            target: form.target.value ? Number(form.target.value) : null,
        };
        setIsSubmitting(true);
        setFormError(""); // clear old error

        try {
            if (editUser) {
                const id = editUser._id || editUser.id;
                await axiosPublic.put(`/user/${id}`, payload);
            } else {
                await axiosPublic.post("/user", payload);
            }

            await fetchUsers();
            form.reset();
            setEditUser(null);
        } catch (err) {
            console.log(err)
            if (err?.response?.data?.error.startsWith("E11000")) {
                setFormError("Email Already Exist")
            }
            else {
                setFormError(err?.response?.data?.error || err.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the user.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/user/${id}`);
                Swal.fire("Deleted!", "User has been deleted.", "success");
                fetchUsers();
            } catch (error) {
                Swal.fire("Error", error?.response?.data?.error || error.message, "error");
            }
        }
    };


    // console.log(editUser.role.toLowerCase().trim())

    return (
        <div className="flex h-screen overflow-hidden">
            {loading ? (
                <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
            ) : (
                <>
                    {/* Table */}
                    <div className="flex-1 p-6">
                        <div className="overflow-x-auto">
                            <table className="table table-md table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Name</th><th>Email</th><th>Role</th><th>Designation</th><th>Target (%)</th><th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user._id || user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>{user.designation ?? "-"}</td>
                                                <td>{user.target ?? "-"}</td>
                                                <td className="flex gap-2">
                                                    <button
                                                        className="btn btn-sm bg-blue-600 btn-primary"
                                                        onClick={() => setEditUser(user)}
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm bg-red-500"
                                                        onClick={() => handleDelete(user._id)}
                                                    >
                                                        <MdDelete /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-gray-400">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Drawer */}
                    <div className="h-full w-[400px] bg-base-200 dark:bg-gray-800 shadow-lg p-6">
                        <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">{editUser ? "Edit User" : "Add New User"}</h2>
                                <button type="button" className="btn btn-xs btn-outline" onClick={() => setEditUser(null)}>Close</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <input
                                    name="user_name"
                                    required
                                    placeholder="Name"
                                    defaultValue={editUser?.name || ""}
                                    className="input dark:bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />

                                <input
                                    type="email"
                                    name="user_email"
                                    required
                                    placeholder="Email"
                                    defaultValue={editUser?.email || ""}
                                    className="input dark:bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />

                                <input
                                    type="password"
                                    name="user_password"
                                    placeholder="Password"
                                    minLength={6}
                                    required={!editUser}
                                    className="input dark:bg-gray-900 input-bordered w-full"
                                    autoComplete="new-password"
                                    disabled={isSubmitting}
                                />

                                <select
                                    name="role"
                                    className="select dark:bg-gray-900 select-bordered w-full"
                                    disabled={isSubmitting}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option selected={editUser?.role?.toLowerCase()?.trim() == "user"} value="user">User</option>
                                    <option selected={editUser?.role?.toLowerCase()?.trim() == "admin"} value="admin">Admin</option>
                                </select>


                                {(role === "user") && (
                                    <select
                                        name="designation"
                                        defaultValue={editUser?.designation || "Junior Executive"}
                                        className="select dark:bg-gray-900 select-bordered w-full"
                                        disabled={isSubmitting}
                                    >
                                        {allowedDesignations.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                )}

                                {(role == "user" && <input
                                    type="number"
                                    name="target"
                                    placeholder="Target (%)"
                                    defaultValue={editUser?.target ?? ""}
                                    className="input dark:bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />)}
                            </div>

                            {/* Inline Error */}
                            {formError && (
                                <div className="mt-3 text-red-500 text-sm">{formError}</div>
                            )}

                            <div className="mt-auto pt-4 flex gap-2">
                                <button type="submit" className="btn bg-blue-600 btn-primary w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (editUser ? "Updating..." : "Creating...") : editUser ? "Update User" : "Create User"}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-ghost w-full"
                                    onClick={() => setEditUser(null)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}
