    "use client";

    import { AuthContext } from "@/context/AuthContext";
    import useFetch from "@/hooks/useFetch";
    import useSaveData from "@/hooks/useSaveData";
    import Table from "@/shared/Table";
    import React, { useContext, useEffect, useState } from "react";
    import { FiPlus, FiX } from "react-icons/fi";
    import { toast } from "react-toastify";
    import { MultiSelect } from "primereact/multiselect";

    import "primereact/resources/primereact.min.css";
    import "primereact/resources/themes/lara-light-cyan/theme.css";

    const courseTypeOption = [
        { value: "Online", label: "Online" },
        { value: "Offline", label: "Offline" },
        { value: "Video Course", label: "Video Course" },
        { value: "Download Course", label: "Download Course" },
        { value: "Free course", label: "Free Course" },
        { value: "Both", label: "Both" },
        { value: "Not Specified", label: "Not Specified" },
    ];

    export default function ManageCoursePage() {
        const { user } = useContext(AuthContext);

        // Array of course objects: [{ courseName: "Course A", courseType: "Online" }, ...]
        const [selectedCourses, setSelectedCourses] = useState([]);
        const [questions, setQuestions] = useState([]); // [{title, value}]
        const [showModal, setShowModal] = useState(false);
        const [formSubmitError, setFormSubmitError] = useState("");

        const { data: courses } = useFetch("/course");
        const { data: leads, loading, error, refetch } = useFetch(`/leads?createdBy=${user?.email}`);
        const { setEditCourse, editCourse, handleSave, loading: isSubmitting, error: submitError } = useSaveData(refetch);

        // Prefill data when editing a lead
        useEffect(() => {
            if (editCourse) {
                if (Array.isArray(editCourse.courses) && editCourse.courses.length > 0) {
                    setSelectedCourses(
                        editCourse.courses.map((c) => ({
                            courseName: c.courseName || "",
                            courseType: c.courseType || "Online",
                        })),
                    );
                } else if (editCourse.interstedCourse) {
                    // Fallback for legacy records
                    setSelectedCourses([
                        {
                            courseName: editCourse.interstedCourse,
                            courseType: editCourse.interstedCourseType || "Online",
                        },
                    ]);
                } else {
                    setSelectedCourses([]);
                }

                // Normalize questions state
                if (editCourse?.questions) {
                    if (Array.isArray(editCourse.questions)) {
                        setQuestions(editCourse.questions);
                    } else if (typeof editCourse.questions === "object") {
                        setQuestions(
                            Object.entries(editCourse.questions).map(([title, value]) => ({
                                title,
                                value: value ?? "",
                            })),
                        );
                    } else {
                        setQuestions([]);
                    }
                } else {
                    setQuestions([]);
                }
            } else {
                setSelectedCourses([]);
                setQuestions([]);
            }
        }, [editCourse]);

        // Handle MultiSelect changes (adds/removes courses from state)
        const handleMultiSelectChange = (selectedNames) => {
            const updated = selectedNames.map((name) => {
                const existing = selectedCourses.find((c) => c.courseName === name);
                // Default new additions to "Online"
                return existing || { courseName: name, courseType: "Online" };
            });
            setSelectedCourses(updated);
        };

        // Update type for ONE SPECIFIC course
        const updateIndividualCourseType = (courseName, newType) => {
            setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, courseType: newType } : c)));
        };

        // Remove individual course directly
        const removeCourse = (courseName) => {
            setSelectedCourses((prev) => prev.filter((c) => c.courseName !== courseName));
        };

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
            if (!user?.email) return toast.error("User Not found");
            const form = e.target;

            // if (!form.lead_phone.value.trim()) {
            //     return setFormSubmitError("Phone Number is Required");
            // }
            if (!selectedCourses || selectedCourses.length === 0) {
                return setFormSubmitError("Please select at least one course");
            }

            // Convert [{title, value}] into {title: value}
            const formattedQuestions = questions.reduce((acc, q) => {
                if (q.title.trim()) acc[q.title.trim()] = q.value.trim();
                return acc;
            }, {});

            // Payload sending each course with its own unique courseType
            const payload = {
                name: form.lead_name.value.trim(),
                email: form.lead_email.value.trim(),
                phone: form.lead_phone.value.trim(),    
                fblink: form.lead_fblink.value.trim(),
                address: form.lead_Address.value.trim(),
                questions: formattedQuestions,
                courses: selectedCourses.map((c) => ({
                    courseName: c.courseName,
                    courseType: c.courseType || "Online",
                })),
                leadSource: "incoming",
                creatorRole: "agent",
                createdBy: user.email,
                assignTo: user.email,
                assignDate: Date.now(),
                assignStatus: true,
            };

            const endpoint = editCourse ? `/leads/single-lead` : "/leads/single-lead";

            await handleSave(payload, form, endpoint);

            // Reset state
            setSelectedCourses([]);
            setFormSubmitError("");
            setQuestions([]);
            if (editCourse) setEditCourse(null);
        };

        const actionsCell = (row) => (
            <div className="flex gap-2">
                <button
                    className="btn btn-sm bg-blue-600 btn-primary"
                    onClick={() => {
                        setEditCourse(row);
                        setShowModal(true);
                    }}
                >
                    Edit
                </button>
            </div>
        );

        // Render course list with individual types in the main table
        const getCourseDisplay = (row) => {
            if (Array.isArray(row.courses) && row.courses.length > 0) {
                return (
                    <div className="flex flex-col gap-1">
                        {row.courses.map((c, idx) => (
                            <div key={idx} className="text-xs">
                                <span className="font-semibold text-gray-200">{c.courseName}</span>{" "}
                                <span className="text-blue-400">({c.courseType || "Not Specified"})</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return row.interstedCourse ? `${row.interstedCourse} (${row.interstedCourseType || "N/A"})` : "N/A";
        };


        const getFblink = (row) => {
            return row.fblink ? (
                <a href={row.fblink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">  Messenger Link
                </a>
                
            ) : (
                "N/A"
            );
        };

        const courseConfig = {
            header: ["Name", "Email", "Phone", "Messenger Link", "Interested Courses", "Action"],
            body: ["name", "email", "phone", getFblink, getCourseDisplay, actionsCell],
        };

        return (
            <div className="flex h-screen">
                {loading ? (
                    <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
                ) : error ? (
                    <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p>
                ) : (
                    <>
                        <Table dataType={"Leads"} data={leads} config={courseConfig} />

                        {/* Drawer / Form */}
                        <div
                            className={`h-full ${
                                showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-50 block" : "hidden lg:block"
                            } w-[400px] bg-gray-800 shadow-lg p-6 overflow-y-auto`}
                        >
                            <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold">{editCourse ? "Edit Lead" : "Add New Lead"}</h2>
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-outline"
                                        onClick={() => {
                                            setEditCourse(null);
                                            setShowModal(false);
                                        }}
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <input
                                        name="lead_name"
                                        placeholder="Lead Name"
                                        defaultValue={editCourse?.name || ""}
                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        name="lead_email"
                                        type="email"
                                        placeholder="Email"
                                        defaultValue={editCourse?.email || ""}
                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                        disabled={isSubmitting}
                                    />

                                    <input
                                        name="lead_phone"
                                        placeholder="Phone"
                                        defaultValue={editCourse?.phone || ""}
                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                        disabled={isSubmitting}
                                    />
                                    <input
                                        name="lead_fblink"
                                        placeholder="Messenger Link"
                                        defaultValue={editCourse?.fblink || ""}
                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                        disabled={isSubmitting}
                                    />

                                    <input
                                        name="lead_Address"
                                        placeholder="Address"
                                        defaultValue={editCourse?.address || ""}
                                        className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                        disabled={isSubmitting}
                                    />

                                    {/* MultiSelect Courses Selector */}
                                    <div className="w-full">
                                        <label className="block text-xs mb-1 text-gray-300 font-medium">Select Courses</label>
                                        <MultiSelect
                                            value={selectedCourses.map((c) => c.courseName)}
                                            onChange={(e) => handleMultiSelectChange(e.value)}
                                            options={
                                                [  { name: "Counselling" } ,...courses]?.map((c) => ({
                                                    label: c.name,
                                                    value: c.name,
                                                })) || []
                                            }
                                            optionLabel="label"
                                            optionValue="value"
                                            filter
                                            placeholder="Choose Courses"
                                            className="w-full bg-gray-900 border border-gray-700 text-white rounded"
                                            panelClassName="text-xs bg-gray-900 text-white border border-gray-700"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* INDIVIDUAL COURSE TYPE SELECTORS */}
                                    {selectedCourses.length > 0 && (
                                        <div className="flex flex-col gap-2 p-3 bg-gray-900/90 border border-gray-700 rounded-lg">
                                            <label className="text-xs font-semibold text-gray-300">Configure Course Types:</label>

                                            {selectedCourses.map((c, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between gap-2 bg-gray-800 p-2 rounded border border-gray-700"
                                                >
                                                    <span className="text-xs font-medium text-white truncate max-w-[130px]">{c.courseName}</span>

                                                    <div className="flex px-2 items-center gap-1">
                                                        <div className="flex-2 select-xs bg-gray-900 text-white rounded px-2">
                                                            <select
                                                                value={c.courseType || "Online"}
                                                            onChange={(e) => updateIndividualCourseType(c.courseName, e.target.value)}
                                                                // disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
                                                                className="select w-20  bg-transparent border-0 focus:outline-none"
                                                            >
                                                                <option className="bg-gray-900 px-4 pr-8" value="Online">
                                                                    Online
                                                                </option>
                                                                <option className="bg-gray-900 px-4 pr-8" value="Offline">
                                                                    Offline
                                                                </option>
                                                                <option className="bg-gray-900 px-4 pr-8" value="Video Course">
                                                                    Video
                                                                </option>
                                                                <option className="bg-gray-900 px-4 pr-8" value="Download Course">
                                                                    Download
                                                                </option>
                                                                <option className="bg-gray-900 px-4 pr-8" value="Free course">
                                                                    Free
                                                                </option>
                                                            </select>
                                                        </div>
                                                        {/* <select
                                                            
                                                            className="select select-xs select-bordered  text-xs focus:outline-0 focus:border-blue-500"
                                                        >
                                                            {courseTypeOption.map((opt) => (
                                                                <option key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </option>
                                                            ))}
                                                        </select> */}

                                                        <button
                                                            type="button"
                                                            onClick={() => removeCourse(c.courseName)}
                                                            className="btn btn-ghost btn-xs text-red-400 p-1 min-h-0 h-auto"
                                                            title="Remove Course"
                                                        >
                                                            <FiX size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Q&A / Questions Section */}
                                    <div className="mt-2">
                                        <div className="flex flex-col gap-3">
                                            {questions?.map((q, index) => (
                                                <div key={index} className="flex items-stretch gap-2">
                                                    <div className="space-y-3 w-full">
                                                        <input
                                                            type="text"
                                                            placeholder="Question Title"
                                                            value={q.title}
                                                            onChange={(e) => updateQuestion(index, "title", e.target.value)}
                                                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Answer"
                                                            value={q.value}
                                                            onChange={(e) => updateQuestion(index, "value", e.target.value)}
                                                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeQuestion(index)}
                                                        className="btn min-h-[85px] btn-xs bg-red-500 text-white"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="flex justify-end items-center mb-2">
                                                <button
                                                    type="button"
                                                    onClick={addQuestion}
                                                    className="btn btn-xs btn-outline border-gray-400 text-white/80 flex items-center gap-1"
                                                >
                                                    <FiPlus /> Create Q&A
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Error messages */}
                                <div className="mt-auto text-red-500 text-sm">{submitError || formSubmitError}</div>

                                <div className="pt-4 flex gap-2">
                                    <button type="submit" className="btn bg-blue-600 btn-primary w-full text-white" disabled={isSubmitting}>
                                        {isSubmitting ? (editCourse ? "Updating..." : "Creating...") : editCourse ? "Update Lead" : "Create Lead"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                <button onClick={() => setShowModal(true)} type="button" className="btn z-50 lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full">
                    Create New Lead
                </button>
            </div>
        );
    }
