"use client";
import axiosPublic from "@/api/axios";
import CustomSelect from "@/utils/CustomSelect";
import { showAlert, showConfirm } from "@/utils/swal";
import React, { useEffect, useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";

const allowedDesignations = [
    { value: "Junior Executive", label: "Junior Executive" },
    { value: "Executive", label: "Executive" },
    { value: "Senior Executive", label: "Senior Executive" },
];


const roleOption = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" }
]


export default function Page() {
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState("");
    const [role, setRole] = useState("user")
    const [designation, setDesignation] = useState(editUser?.designation || "Junior Executive")
    const [fetchError, setFetchError] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const [showModal, setShowModal] = useState(false)

    console.log(editUser?.designation)

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosPublic.get("/user");
            setUsers(res.data || []);
        } catch (err) {
            setFetchError(err?.response?.data?.error || err.message,)
        } finally {
            setLoading(false);
        }
    };
    console.log(designation)

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
            role: role,
            designation: designation,
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
        const result = await showConfirm(
            "Are you sure?",
            "This action will permanently delete the user.",
            "Yes, delete it!"
        );

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(`/user/${id}`);
                showAlert("Deleted!", "User has been deleted.", "success");
                // or use toast instead:
                // showToast("User deleted", "success");
                fetchUsers();
            } catch (error) {
                showAlert("Error", error?.response?.data?.error || error.message, "error");
            }
        }
    };


    useEffect(() => {
        if (editUser) {
            setDesignation(editUser?.designation)
            setRole(editUser?.role)
        }
    }, [editUser])

    console.log(showModal)


    return (
        <div className="flex min-h-[calc(100vh-100px)] lg:h-screen max-w-screen ">
            {loading ? (
                <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
            ) : (
                <>
                    {/* Table */}
                    <div className="flex-1 max-w-screen overflow-auto p-6">
                        <div className="w-full overflow-x-auto">
                            {users.length > 0 ? (
                                <table className="table  table-md table-zebra  w-full">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Designation</th>
                                            <th>Target (%)</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="w-full text-center py-6 text-gray-400">
                                    No users found. {fetchError}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Drawer */}
                    <div className={`h-full ${showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-[9999] block " : "hidden lg:block"}  w-[400px] bg-gray-800 shadow-lg p-6`}>
                        <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">{editUser ? "Edit User" : "Add New User"}</h2>
                                <button type="button" className="btn btn-xs btn-outline" onClick={() => {
                                    setEditUser(null)
                                    setShowModal(false)
                                }}>Close</button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <input
                                    name="user_name"
                                    required
                                    placeholder="Name"
                                    defaultValue={editUser?.name || ""}
                                    className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                    disabled={isSubmitting}
                                />

                                <input
                                    type="email"
                                    name="user_email"
                                    required
                                    placeholder="Email"
                                    defaultValue={editUser?.email || ""}
                                    className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                    disabled={isSubmitting}
                                />

                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="user_password"
                                        placeholder="Password"
                                        minLength={6}
                                        required={!editUser}
                                        className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        autoComplete="new-password"
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 cursor-pointer top-[12px] text-gray-500 z-10"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <BsEyeFill className="text-blue-600" /> : <BsEyeSlashFill />}
                                    </button>
                                </div>

                                {/* <select
                                    name="role"
                                    className="select dark:bg-gray-900 select-bordered w-full"
                                    disabled={isSubmitting}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option selected={editUser?.role?.toLowerCase()?.trim() == "user"} value="user">User</option>
                                    <option selected={editUser?.role?.toLowerCase()?.trim() == "admin"} value="admin">Admin</option>
                                </select> */}
                                <div>
                                    <p className="text-xs text-white/70 mb-2">
                                        Role :
                                    </p>
                                    <CustomSelect
                                        selected={role}
                                        setSelected={setRole}
                                        options={roleOption}
                                        bgColor

                                    />
                                </div>


                                {(role === "user") && (
                                    // <div>
                                    //     <label className="text-xs text-white/70 mb-1">
                                    //         Designation
                                    //     </label>
                                    //     <select
                                    //         name="designation"
                                    //         onChange={(e) => setDesignation(e.target.value)}
                                    //         defaultValue={editUser?.designation || "Junior Executive"}
                                    //         className="select dark:bg-gray-900 select-bordered w-full"
                                    //         disabled={isSubmitting}
                                    //     >
                                    //         {allowedDesignations.map((d) => (
                                    //             <option key={d} value={d}>{d}</option>
                                    //         ))}
                                    //     </select>
                                    // </div>
                                    <div>
                                        <p className="text-xs text-white/70 mb-2">
                                            Designation :
                                        </p>

                                        <CustomSelect
                                            selected={designation}
                                            setSelected={setDesignation}
                                            options={allowedDesignations}
                                            bgColor

                                        />
                                    </div>
                                )}



                                {(role == "user" && <div className="flex flex-col gap-1">
                                    <label className="text-xs text-white/70 mb-1">
                                        Target %
                                    </label>
                                    <input
                                        type="number"
                                        name="target"
                                        placeholder="Target (%)"
                                        value={editUser?.target ?? designation == "Senior Executive" ? 10 : designation == "Executive" ? 7 : 5}
                                        className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                                        disabled={isSubmitting}
                                    />
                                </div>)}




                            </div>

                            {/* Inline Error */}
                            {formError && (
                                <div className="mt-3 text-red-500 text-sm">{formError}</div>
                            )}

                            <div className="mt-auto pt-4 flex gap-2">
                                <button type="submit" className="btn bg-blue-600 btn-primary w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (editUser ? "Updating..." : "Creating...") : editUser ? "Update User" : "Create User"}
                                </button>
                               
                            </div>
                        </form>
                    </div>
                </>
            )}


            <button onClick={() => setShowModal(true)} type="submit" className="btn z-50  lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full" >
               <TiUserAdd/>  Create New User
            </button>
        </div>
    );
}
