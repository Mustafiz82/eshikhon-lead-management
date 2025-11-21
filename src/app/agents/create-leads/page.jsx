"use client";

import { AuthContext } from "@/context/AuthContext";
import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import CustomSelect from "@/utils/CustomSelect";
import React, { useContext, useEffect, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi"
import { toast } from "react-toastify";



const courseTypeOption = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
    { value: "Video", label: "Video" }
]


export default function ManageCoursePage() {

    
    const [selectedCourse, setSelectedCourse] = useState("");
    const [questions, setQuestions] = useState([]); // [{title, value}]

    // when editing a lead, prefill select and questions

    const { user } = useContext(AuthContext)
    const [courseType, setCourseType] = useState("Online")
    const { data: courses } = useFetch("/course")
    const { data: leads, loading, error, refetch } = useFetch(`/leads?createdBy=${user?.email}`)
    const { setEditCourse, editCourse, handleSave, loading: isSubmitting, error: submitError } = useSaveData(refetch)
    const { handleDelete } = useDelete(refetch, "course")
    const [showModal, setShowModal] = useState(false)



    useEffect(() => {
        setSelectedCourse(editCourse?.interstedCourse || "");

        // questions can be object or array — normalize to [{title,value}]
        if (editCourse?.questions) {
            if (Array.isArray(editCourse.questions)) {
                setQuestions(editCourse.questions);
            } else if (typeof editCourse.questions === "object") {
                setQuestions(
                    Object.entries(editCourse.questions).map(([title, value]) => ({
                        title,
                        value: value ?? "",
                    }))
                );
            } else {
                setQuestions([]);
            }
        } else {
            setQuestions([]);
        }
    }, [editCourse]);


    const addQuestion = () => {
        setQuestions([...questions, { title: "", value: "" }]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const updateQuestion = (index, field, val) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = val;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.email) return toast.error("User Not found")
        const form = e.target;

        // Convert [{title, value}] into {title: value}
        const formattedQuestions = questions.reduce((acc, q) => {
            if (q.title.trim()) acc[q.title.trim()] = q.value.trim();
            return acc;
        }, {});

        const payload = {
            name: form.lead_name.value.trim(),
            email: form.lead_email.value.trim(),
            phone: form.lead_phone.value.trim(),
            address: form.lead_Address.value.trim(),
            questions: formattedQuestions,
            interstedCourse: selectedCourse,
            interstedCourseType: courseType,
            leadSource: "incoming",
            createdBy: user.email,
            assignTo: user.email,
            assignDate: Date.now(),
            assignStatus : true 
        };
        console.log(payload)
        await handleSave(payload, form, "/leads/single-lead")
        setSelectedCourse("Select Course")
        setQuestions([])

    };

    const actionsCell = (row) => (
        <div className="flex gap-2">
            <button
                className="btn btn-sm bg-blue-600 btn-primary"
                onClick={() => setEditCourse(row)}           // <- selected row here
            >
                Edit
            </button>
            <button
                className="btn btn-sm bg-red-500"
                onClick={() => handleDelete(`/course/${row._id ?? row.id}`)} // <- selected row id
            >
                Delete
            </button>
        </div>
    )

    const courseConfig = {
        header: ["Name", "Email", "Phone", "Address", "Intersted Course", "Created At"],
        body: ["name", "email", "phone", "address", "interstedCourse", actionsCell]
    }



    return (
        <div className="flex  h-screen">
            {loading ? (
                <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
            ) : error ? <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p> : (
                <>


                    <Table dataType={"Leads"} data={leads} config={courseConfig} />


                    {/* Drawer / Form */}
                    <div className={`h-full ${showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-[9999] block " : "hidden lg:block"}  w-[400px] bg-gray-800 shadow-lg p-6`}>
                        <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    {editCourse ? "Edit Lead" : "Add New Lead"}
                                </h2>
                                <button type="button" className="btn btn-xs btn-outline" onClick={() => {
                                    setEditCourse(null)
                                    setShowModal(false)
                                }

                                }>
                                    Close
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <input
                                    name="lead_name"
                                    required
                                    placeholder="Lead Name"
                                    defaultValue={editCourse?.name || ""}
                                    className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />
                                <input
                                    name="lead_email"
                                    type="email"
                                    required
                                    placeholder="Email"
                                    defaultValue={editCourse?.email || ""}
                                    className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />

                                <input
                                    name="lead_phone"
                                    required
                                    placeholder="Phone"
                                    defaultValue={editCourse?.phone || ""}
                                    className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />

                                <input
                                    name="lead_Address"
                                    required
                                    placeholder="Address"
                                    defaultValue={editCourse?.address || ""}
                                    className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                    disabled={isSubmitting}
                                />

                                <select
                                    name="interstedCourse"
                                    className="select focus:border-blue-600 bg-gray-900 focus:outline-0 select-bordered w-full"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="" disabled>Select Course</option>
                                    {courses.map((item) => (
                                        <option key={item._id ?? item.id ?? item.name} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>


                                {/* <div>
                                    <CustomSelect
                                        selected={selectedCourse}
                                        setSelected={setSelectedCourse}
                                        options={courseTypeOption}
                                        bgColor

                                    />
                                </div> */}



                                <div>
                                    <CustomSelect
                                        selected={courseType}
                                        setSelected={setCourseType}
                                        options={courseTypeOption}
                                        bgColor

                                    />
                                </div>



                                <div className="mt-4">


                                    <div className="flex  flex-col gap-3">
                                        {questions?.map((q, index) => (
                                            <div className="flex items-stretch gap-2 ">
                                                <div key={index} className="space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Question Title"
                                                        value={q.title}
                                                        onChange={(e) => updateQuestion(index, "title", e.target.value)}
                                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Answer"
                                                        value={q.value}
                                                        onChange={(e) => updateQuestion(index, "value", e.target.value)}
                                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeQuestion(index)}
                                                    className="btn min-h-[85px]  btn-xs  bg-red-500 text-white"
                                                >
                                                    <FiX />
                                                </button>
                                            </div>

                                        ))}

                                        <div className="flex justify-end  items-center mb-2">
                                            <button
                                                type="button"
                                                onClick={addQuestion}
                                                className="btn btn-xs btn-outline border-gray-400 text-white/80 flex items-center gap-1"
                                            >
                                                <FiPlus /> Create Question
                                            </button>
                                        </div>


                                    </div>
                                </div>
                            </div>

                            {/* Inline Error */}
                            {submitError && <div className="mt-3 text-red-500 text-sm">{submitError}</div>}

                            <div className="mt-auto pt-4 flex gap-2">
                                <button type="submit" className="btn bg-blue-600 btn-primary w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (editCourse ? "Updating..." : "Creating...") : editCourse ? "Update Lead" : "Create Lead"}
                                </button>

                            </div>
                        </form>
                    </div>
                </>
            )
            }

            <button onClick={() => setShowModal(true)} type="submit" className="btn z-50  lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full" >
               Create New Lead
            </button>
        </div >
    );
}
