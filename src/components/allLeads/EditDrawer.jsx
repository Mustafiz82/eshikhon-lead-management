import axiosPublic from '@/api/axios';
import { showAlert } from '@/utils/swal';
import React, { useEffect, useState } from 'react';

const EditDrawer = ({showDrawer, setShowDrawer, editLead, course, setEditLead, refetch }) => {


    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedType, setSelectedType] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const payload = {
            name: form.lead_name.value,
            email: form.lead_email.value,
            phone: form.lead_phone.value,
            address: form.lead_Address.value,
            seminarTopic: selectedCourse,
            seminarType: selectedType
        };
        try {
            await axiosPublic.patch(`/leads/${editLead._id}`, payload);
            showAlert("Updated", "Lead updated successfully!", "success");
            setShowDrawer(false);
            setEditLead(null);
            refetch();
        } catch (err) {
            showAlert("Error", err.message, "error");
        }
    }



    useEffect(() => {
        if (editLead?.seminarTopic) {
            setSelectedCourse(editLead.seminarTopic);
        }
        if (editLead?.seminarType) {
            setSelectedType(editLead.seminarType);
        }
    }, [editLead]);


    return (
        <div>
            {showDrawer && (
                <div
                    onClick={() => setShowDrawer(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                ></div>
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full lg:w-[400px] bg-gray-800 shadow-xl z-[9999] transform transition-transform duration-300 ${showDrawer ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <form
                    autoComplete="off"
                    onSubmit={handleSubmit}
                    className="flex flex-col h-full p-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-white">Edit Lead</h2>
                        <button
                            type="button"
                            className="btn btn-xs btn-outline"
                            onClick={() => {
                                setEditLead(null);
                                setShowDrawer(false);
                            }}
                        >
                            Close
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <input
                            name="lead_name"
                            placeholder="Lead Name"
                            defaultValue={editLead?.name || ""}
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                        />
                        <input
                            name="lead_email"
                            type="email"
                            placeholder="Email"
                            defaultValue={editLead?.email || ""}
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                        />
                        <input
                            name="lead_phone"
                            placeholder="Phone"
                            defaultValue={editLead?.phone || ""}
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                        />
                        <input
                            name="lead_Address"
                            placeholder="Address"
                            defaultValue={editLead?.address || ""}
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                        />

                        <select
                            name="seminarTopic"
                            className="select focus:border-blue-600 bg-gray-900 focus:outline-0 select-bordered w-full"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="" disabled>Select Course</option>
                            {course?.map((item) => (
                                <option key={item._id} value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>


                        <select
                            name="seminarTopic"

                            className="select focus:border-blue-600 text-white bg-gray-900 focus:outline-0 select-bordered w-full"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="" disabled>Select Type</option>
                            {["Online", "Offline", "Video"]?.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-auto pt-4">
                        <button type="submit" className="btn bg-blue-600 btn-primary w-full">
                            Update Lead
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};

export default EditDrawer;