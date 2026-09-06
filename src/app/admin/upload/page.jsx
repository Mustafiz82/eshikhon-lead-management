"use client";
import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { RiUpload2Fill } from "react-icons/ri";
import { Bounce, toast } from "react-toastify";
import Papa from "papaparse";
import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import { formateDate, parseCustomDate } from "@/utils/date";
import { AuthContext } from "@/context/AuthContext";
import { formatFilename } from "@/utils/formateFileName";
import { showToast } from "@/utils/showToast";
import { LuDownload, LuUpload } from "react-icons/lu";
import Link from "next/link";
import { FaExternalLinkAlt } from "react-icons/fa";
import { formatForWhatsApp } from "@/components/agentLeads/LeadModals";
import { findBestCourse } from "@/utils/matchCourseName";
import { FiPlus, FiX } from "react-icons/fi";
import { MultiSelect } from "primereact/multiselect";
import useSaveData from "@/hooks/useSaveData";

const STATUS = {
    PENDING: "pending",
    PARSING: "parsing",
    SAVING: "saving",
    COMPLETED: "completed",
    DUPLICATE: "duplicate",
    REGISTERING: "registering",
    ERROR: "error",
};

const statusBadge = (statusObj) => {
    const base = "px-2 py-0.5 text-xs rounded font-medium inline-block";
    const state = typeof statusObj === "object" ? statusObj.state : statusObj;
    const message = typeof statusObj === "object" ? statusObj.message : "";

    // Show live progress message if active
    if (message) {
        return <span className={`${base} bg-indigo-500/20 text-indigo-300`}>{message}</span>;
    }

    switch (state) {
        case STATUS.PENDING:
            return <span className={`${base} bg-yellow-500/20 text-yellow-300`}>Pending</span>;
        case STATUS.PARSING:
            return <span className={`${base} bg-blue-500/20 text-blue-300`}>Parsing</span>;
        case STATUS.SAVING:
            return <span className={`${base} bg-indigo-500/20 text-indigo-300`}>Saving</span>;
        case STATUS.COMPLETED:
            return <span className={`${base} bg-green-500/20 text-green-300`}>Completed</span>;
        case STATUS.ERROR:
            return <span className={`${base} bg-red-500/20 text-red-300`}>Error</span>;
        default:
            return <span className={`${base} bg-gray-500/20 text-gray-300`}>—</span>;
    }
};

const isRowNotEmpty = (row) => {
    if (!row || typeof row !== "object") return false;
    return Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== "");
};

function normalizeSeminarType(val) {
    if (!val) return "None";
    const clean = String(val).trim().toLowerCase();

    if (clean === "online") return "Online";
    if (clean === "offline") return "Offline";
    if (clean === "joined") return "Joined";
    if (["no need", "not interested", "none", "no"].includes(clean)) return "None";

    return "None"; // Default fallback for unknown values
}

function parseCallCount(val) {
    if (!val) return 0;
    // Strip out "x" and all non-digit characters
    const digits = String(val).replace(/\D/g, "");
    const parsed = parseInt(digits, 10);
    return isNaN(parsed) ? 0 : parsed;
}

function parseNote(noteText) {
    if (!noteText || typeof noteText !== "string" || !noteText.trim()) {
        return []; // 🔹 Returns empty array if note cell is blank
    }

    return [
        {
            text: noteText.trim(),
            by: "", // 🔹 Explicitly blank
            createdAt: null, // 🔹 Explicitly null
        },
    ];
}

function parseOrderNumber(val) {
    if (!val) return null;
    const digits = String(val).replace(/\D/g, ""); // Extracts digits only
    const parsed = parseInt(digits, 10);
    return isNaN(parsed) ? null : parsed;
}

const isValidLeadRow = (row) => {
    if (!row || typeof row !== "object") return false;

    // A valid lead MUST have at least a phone number, name, email, or course
    const hasPhone = row.phone && String(row.phone).trim() !== "";
    const hasName = row.name && String(row.name).trim() !== "";
    const hasEmail = row.email && String(row.email).trim() !== "";
    const hasCourse = row.interstedCourse && String(row.interstedCourse).trim() !== "";
    const hasFbUrl = row.fblink && String(row.fblink).trim() !== "";

     return Boolean(hasPhone || hasFbUrl);
};

const Page = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({});
    const { data: fileList = [], loading, refetch } = useFetch("/file"); // server history
    const fileInputRef = useRef(null);
    const { user } = useContext(AuthContext);
    const [uploadMode, setUploadMode] = useState("lead");
    const { data: rawCourses } = useFetch("/course");

    const data = fileList?.filter((item) => item.type == uploadMode);

    // Any active upload? (for the big box indicator only)
    // Get active upload object (to show live progress text in big drop box)
    const activeUpload = useMemo(() => {
        return Object.values(uploadStatus).find((s) => s.state === STATUS.PENDING || s.state === STATUS.PARSING || s.state === STATUS.SAVING);
    }, [uploadStatus]);

    const hasActiveUploads = Boolean(activeUpload);
    // Helper to set status for a file
    const setStatus = (fileName, state, message = "") => {
        setUploadStatus((prev) => ({
            ...prev,
            [fileName]: { state, message, updatedAt: Date.now() },
        }));
    };

    const handleFile = async (file) => {
        if (!file) return;
        if (!user.email) return showToast("User not found", "error");
        if (file.type !== "text/csv") return showToast("Only CSV files are allowed", "warning");

        const fileName = formatFilename(file.name);
        setStatus(fileName, STATUS.PENDING);

        // 1) Register file name (server “history”)

        // 2) Parse CSV
        setStatus(fileName, STATUS.PARSING);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: uploadMode == "lead" ? transfromHeaderLead : transfromHeaderAttendence,
            complete: (results) =>
                uploadMode == "lead" ? handleCompleteLeadCSVUpload(results, fileName) : handleCompleteAttendenceCSVUpload(results, fileName),

            error: function (err) {
                setStatus(fileName, STATUS.ERROR);
                showToast("Error parsing CSV", "error");
                console.error(err);
            },
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handlePaste = (e) => {
        const file = e.clipboardData.files[0];
        if (file && file.type === "text/csv") handleFile(file);
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    // Merge server history with local status overlay.
    // If a filename is currently uploading, show its live status; otherwise show Completed.
    const rows = (data || []).map((upload) => {
        const s = uploadStatus[upload.fileName]?.state;
        return {
            ...upload,
            _status: s || STATUS.COMPLETED, // default to completed when server has it and no live status
        };
    });

    const handleCompleteLeadCSVUpload = async (results, fileName) => {
        results.data = (results.data || []).filter(isValidLeadRow);

        const rows = results.data;
        const headers = Object.keys(rows[0] || {});
        const required = [];
        const missing = required.filter((f) => !headers.includes(f));

        console.log(rows);

        // return

        if (missing.length > 0) {
            setStatus(fileName, STATUS.ERROR);
            showToast(`Missing required fields: ${missing.join(", ")}`, "error");
            return;
        }

        const questionWiseData = rows.map((item) => {
            const {
                date,
                name,
                email,
                address,
                phone,
                fblink,
                interstedCourse,
                interstedCourseType,
                interstedSeminar,
                leadSource,
                entryBy,
                leadStatus,
                firstContacted,
                lastContacted,
                orderNumber,
                followUpDate,
                callCount,
                assignTo,
                assignDate,
                note,
                ...questions
            } = item;

            const parsedAssignTo = assignTo?.trim() || "N/A";
            const parsedAssignDate = parseCustomDate(assignDate);

            return {
                createdAt: parseCustomDate(date),
                name: name || "",
                email: email || "",
                address: address || "",
                phone: phone || "",
                fblink: fblink || "",
                // 🔹 NEW: Construct initial courses array from CSV row
                courses: interstedCourse
                    ? [
                          {
                              courseName: interstedCourse,
                              courseType: interstedCourseType || "Not Specified",
                              originalPrice: 0,
                              leadDiscount: 0,
                              discountUnit: "flat",
                              totalPaid: 0,
                              totalDue: 0,
                              history: [],
                          },
                      ]
                    : [],
                callCount: parseCallCount(callCount),
                questions,
                sourceFileName: fileName,
                createdBy: user?.email || "",
                entryBy: entryBy || "",
                note: parseNote(note),
                leadStatus: leadStatus || "Pending",
                orderNumber: parseOrderNumber(orderNumber),
                interstedSeminar: normalizeSeminarType(interstedSeminar),
                firstContacted: parseCustomDate(firstContacted),
                lastContacted: parseCustomDate(lastContacted),
                followUpDate: parseCustomDate(followUpDate),
                assignTo: parsedAssignTo,
                assignStatus: parsedAssignTo !== "N/A" ? true : false, // Sets true if assignTo is provided
                assignDate: parsedAssignDate,
            };
        });

        // console.log(questionWiseData)

        console.log(questionWiseData);

        const leadsWithOrders = questionWiseData.filter((lead) => lead.orderNumber);
        console.log(leadsWithOrders);
        // return console.log(questionWiseData)

        if (leadsWithOrders.length > 0) {
            let currentCount = 0;

            for (const lead of questionWiseData) {
                if (!lead.orderNumber) continue;

                currentCount++;

                // 🔹 Update status in UI showing current order being fetched
                setStatus(fileName, STATUS.SAVING, `Fetching Order #${lead.orderNumber} (${currentCount}/${leadsWithOrders.length})`);

                try {
                    // 🔹 FIX 3: Read course name from lead.courses[0]
                    const initialCourseName = lead.courses?.[0]?.courseName || "";
                    const searchInput = encodeURIComponent(initialCourseName);
                    const userEmail = encodeURIComponent(user?.email || "");

                    // Call API one at a time
                    const res = await axiosPublic.get(
                        `/leads/order/${lead.orderNumber}?searchInput=${searchInput}&phone=${user?.phone}&leadId=${lead._id}}`,
                    );
                    const orderData = res?.data;

                    if (orderData) {
                        // 🔹 FIX 2: Phone Matching & leadStatus Rule

                        const orderStatusClean = String(orderData.status || "").toLowerCase();

                        if (orderStatusClean !== "completed") {
                            lead.leadStatus = "On hold";
                        } else {
                            const matchedPhone =
                                formatForWhatsApp(orderData.customerPhone) === formatForWhatsApp(lead.phone) ||
                                formatForWhatsApp(orderData.customerPhone) === formatForWhatsApp(lead.email);
                            lead.leadStatus = matchedPhone ? "Enrolled" : "Enrolled with Other Number";
                        }

                        const completionDate = orderData.orderCompletionDate
                            ? new Date(orderData.orderCompletionDate)
                            : new Date(orderData.ordercreationDate);

                        // Map all courses from orderData.courses array
                        if (Array.isArray(orderData.courses) && orderData.courses.length > 0) {
                            lead.courses = orderData.courses.map((courseItem) => {
                                const matchedCourse = findBestCourse(courseItem.courseName, rawCourses);
                                const finalCourseName = matchedCourse?.name || courseItem.courseName || courseItem.cleanedName;
                                const isOnline = courseItem.type === "Online";
                                const origPrice = Number(courseItem.originalPrice || 0);
                                const disc = Number(courseItem.discount || 0);
                                const totPaid = Number(courseItem.total || 0);

                                return {
                                    courseName: finalCourseName,
                                    courseType: courseItem.type || "Online",
                                    originalPrice: origPrice,
                                    leadDiscount: disc,
                                    discountUnit: "flat",
                                    totalPaid: isOnline ? totPaid : 0,
                                    totalDue: isOnline ? Math.max(0, origPrice - disc - totPaid) : Math.max(0, origPrice - disc),
                                    enrolledAt: completionDate,
                                    history: isOnline ? [{ date: completionDate, paidAmount: totPaid }] : [],
                                };
                            });

                            // 🔹 NEW: Calculate top-level sum of totalPaid and totalDue for the lead
                            lead.totalPaid = lead.courses.reduce((sum, c) => sum + (Number(c.totalPaid) || 0), 0);
                            lead.totalDue = lead.courses.reduce((sum, c) => sum + (Number(c.totalDue) || 0), 0);
                            lead.enrolledAt = orderData.orderCompletionDate ? new Date(orderData.orderCompletionDate) : null;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to fetch order #${lead.orderNumber}:`, error);
                }
            }
        }

        // ---- Save leads first ----
        setStatus(fileName, STATUS.SAVING, "Saving leads to database...");

        try {
            const res = await axiosPublic.post("/leads", questionWiseData);
            console.log(res.data);

            // 1. Extract only the phone numbers for inserted leads
            const insertedLeads = res.data.insertedLeads?.map((lead) => lead._id) || [];

            // 2. Format duplicate leads: extract phone, course names, and reason
            const duplicateLeads =
                res.data.notInsertedLeads?.map((item) => ({
                    phone: item.phone,
                    course: item.data?.courses?.map((c) => c.courseName) || [], // extracts ["Ethical Hacking", ...]
                    reason: item.reason,
                })) || [];

            // ✅ Only if leads save succeeds → save file in history with the new fields
            setStatus(fileName, STATUS.REGISTERING, "Registering file...");

            await axiosPublic.post("/file", {
                fileName,
                type: uploadMode,
                insertedLeads,
                duplicateLeads,
            });

            setStatus(fileName, STATUS.COMPLETED, "");
            refetch(); // refresh server-side history list

            if (res.data.ok == false) {
                showToast(res.data.message, "error");
            } else {
                showToast(res.data.message, "success");
            }
        } catch (error) {
            console.log(error);
            setStatus(fileName, STATUS.ERROR);

            if (error.response?.status === 413) {
                showToast("Too many leads in one file. Please split into smaller files and try again.", "error");
            } else {
                showToast(error.message || "Failed to save leads", "error");
            }
        }
    };

    const transfromHeaderLead = (header) => {
        if (!header) return "";
        const normalized = header.trim().toLowerCase();
        console.log(normalized);
        if (["date"].includes(normalized)) return "date";
        if (["full name", "name"].includes(normalized)) return "name";
        if (["email", "e-mail", "email address"].includes(normalized)) return "email";
        if (["phone", "phone number", "mobile"].includes(normalized)) return "phone";
        if (["address", "location"].includes(normalized)) return "address";
        if (["Intersted Course", "intersted course", "courses", "course"].includes(normalized)) return "interstedCourse";
        if (["course type", "type", "course type"].includes(normalized)) return "interstedCourseType";
        if (["Lead Source", "lead source", "source"].includes(normalized)) return "leadSource";
        if (["entry by", "entryby", "created by"].includes(normalized)) return "entryBy";
        if (["lead status", "status"].includes(normalized)) return "leadStatus";
        if (["intersted seminar", "interested seminar", "seminar", "seminar type"].includes(normalized)) return "interstedSeminar";
        if (["fb url", "fburl", "facebook url", "facebook", "fb profile"].includes(normalized)) return "fblink";
        if (["first call date", "1st call date", "first contact date", "first contact", "1st contact"].includes(normalized)) return "firstContacted";
        if (["last call date", "last contact date", "last contact"].includes(normalized)) return "lastContacted";
        if (["followup date", "follow up date", "followup", "next followup"].includes(normalized)) return "followUpDate";

        if (["call count", "callcount", "calls", "call_count"].includes(normalized)) return "callCount";
        if (["notes", "note", "comment", "comments", "comment/note"].includes(normalized)) return "note";
        if (["order number", "order", "order #", "order_number", "order no", "ordernumber"].includes(normalized)) return "orderNumber";

        if (["assign to", "assignto", "assigned to"].includes(normalized)) return "assignTo";
        if (["assign date", "assigndate", "assigned date"].includes(normalized)) return "assignDate";

        return header;
    };

    const transfromHeaderAttendence = (header) => {
        if (!header) return "";
        const normalized = header.trim().toLowerCase();
        if (["email", "e-mail", "email address"].includes(normalized)) return "email";
        if (["phone", "phone number", "mobile"].includes(normalized)) return "phone";
        return header;
    };

    const handleCompleteAttendenceCSVUpload = async (results, fileName) => {
        console.log(results);

        const filteredData = results.data.map((row) => ({
            phone: row.phone || row.Phone || row.PHONE,
            email: row.email || row.Email || row.EMAIL,
        }));

        console.log(filteredData);

        setStatus(fileName, STATUS.SAVING);

        try {
            // 1) Save attendance
            const res = await axiosPublic.post("/leads/mark-attendence", filteredData);

            // 2) Register file only if attendance update succeeds
            setStatus(fileName, STATUS.REGISTERING);
            await axiosPublic.post("/file", { fileName, type: uploadMode });

            // 3) Mark completed
            setStatus(fileName, STATUS.COMPLETED);

            let updated = res.data.updated ?? 0;
            const total = results?.data?.length ?? 0;
            const message = `${updated} out of ${total} lead${total === 1 ? "" : "s"} updated`;

            showToast(message, res.data.updated > 0 ? "success" : "warning");

            console.log("Touched leads:", res.data.touched); // debug
            refetch();
        } catch (error) {
            setStatus(fileName, STATUS.ERROR);
            showToast(error.message || "Failed to process attendance", "error");
        }
    };

    // create lead functionality

    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formSubmitError, setFormSubmitError] = useState("");
    const [selectedDuplicateLeads, setSelectedDuplicateLeads] = useState(null);

    const { data: courses } = useFetch("/course");
    const { handleSave, loading: isSubmitting, error: submitError, setError } = useSaveData(refetch);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitError("");

        if (!user?.email) return toast.error("User Not found");
        const form = e.target;

        if (!selectedCourses || selectedCourses.length === 0) {
            return setFormSubmitError("Please select at least one course");
        }

        if (!form.lead_phone.value.trim() && !form.lead_fblink.value.trim()) {
            return setFormSubmitError("Please Enter FB link or phone Number");
        }

        // Payload sending each course with its own unique courseType
        const payload = {
            name: form.lead_name.value.trim(),
            email: form.lead_email.value.trim(),
            phone: form.lead_phone.value.trim(),
            fblink: form.lead_fblink.value.trim(),
            address: form.lead_Address.value.trim(),
            courses: selectedCourses.map((c) => ({
                courseName: c.courseName,
                courseType: c.courseType || "Online",
            })),
            leadSource: form.lead_source.value.trim(),
            creatorRole: "admin",
            createdBy: user.email,
        };

        const endpoint = "/leads/single-lead";

        console.log(payload, endpoint);

        const res = await handleSave(payload, form, endpoint);
        if (res?.data?.success) {
            showToast("Lead Created Successfully . ", "success");
        }
        console.log("clicked");

        // Reset state
        setSelectedCourses([]);
        setFormSubmitError("");
    };

    return (
        <div className="flex justify-between">
            <div
                className="w-full"
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
            >
                <div className=" rounded-2xl shadow-lg p-6 flex-1 w-full  transition-colors">
                    <div className="flex mb-5 flex-col lg:flex-row justify-between">
                        <h2 className="text-xl lg:text-2xl font-semibold text-white mb-3 lg:mb-6">
                            {" "}
                            Upload {uploadMode == "lead" ? "Leads" : "Attendence"} CSV & History
                        </h2>
                        <div className="flex  gap-2">
                            <button
                                onClick={() => setUploadMode((prev) => (prev == "attendence" ? "lead" : "attendence"))}
                                className="btn btn-sm bg-blue-600 flex-1 lg:flex-auto border-0 btn-primary"
                            >
                                <LuUpload className="text-lg" /> Upload {uploadMode == "lead" ? "Attendence" : "Leads"} CSV
                            </button>
                            <a
                                target="blank"
                                href={"https://docs.google.com/spreadsheets/d/1I79Tsq5nQwSvDbrHhaPC1pP1iJ3rXA0dSOaszIoUU1M/edit?gid=0#gid=0"}
                            >
                                <button className="btn border-0 btn-sm bg-blue-600 flex-1 lg:flex-auto btn-primary">
                                    {" "}
                                    <FaExternalLinkAlt className="text-" /> View Template
                                </button>
                            </a>
                        </div>
                    </div>

                    <div className="grid-cols-1 lg:grid-cols-[4fr_5fr] gap-6">
                        {/* Upload Box */}
                        <div
                            className={`border-2 bg-slate-900 h-[350px] flex flex-col justify-center items-center border-dashed transition-all rounded-xl p-6 text-center cursor-pointer ${
                                dragActive ? "border-blue-500 bg-blue-950/30" : "border-gray-600 hover:border-blue-400"
                            }`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {hasActiveUploads ? (
                                <div className="animate-pulse flex flex-col items-center justify-center gap-2">
                                    <RiUpload2Fill className="text-blue-400 text-5xl animate-bounce" />
                                    <p className="text-blue-400 text-lg font-semibold">{activeUpload?.message || "Uploading..."}</p>
                                </div>
                            ) : (
                                <>
                                    <RiUpload2Fill className="text-blue-600 dark:hover:text-blue-500 transition mb-5 text-4xl" />
                                    <p className="text-gray-300">
                                        Drop or click to upload <span className="font-medium">CSV file</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
                                </>
                            )}
                            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={(e) => handleFile(e.target.files[0])} />
                        </div>

                        {/* Upload History */}
                        <div className="overflow-x-auto mt-5">
                            <h3 className="text-lg font-medium text-gray-200 my-4">Recent Uploads From CSV (last 20)</h3>

                            <div className="grid grid-cols-[1fr_200px_100px_150px_150px] text-sm font-semibold text-gray-400 border-b border-gray-600 pb-2">
                                <div>Filename</div>
                                <div>Date</div>
                                <div>Status</div>
                                <div>inserted / Duplicate</div>
                                <div>Action</div>
                            </div>

                            <div className="overflow-y-auto max-h-[320px] wrapper mt-2 pb-10 pr-1">
                                {Object.entries(uploadStatus)
                                    .filter(([fileName]) => !rows.some((r) => r.fileName === fileName))
                                    .map(([fileName, s]) => (
                                        <div key={`live-${fileName}`} className="grid grid-cols-3 items-center text-sm py-2 border-b border-gray-700">
                                            <div className="text-gray-200 truncate">{fileName}</div>
                                            <div className="text-gray-400">—</div>
                                            <div>{statusBadge(s)}</div>
                                        </div>
                                    ))}
                                {rows.length > 0 ? (
                                    rows.map((upload, index) => (
                                        <div
                                            key={`${upload.fileName}-${index}`}
                                            className="grid grid-cols-[1fr_200px_100px_150px_150px]     items-center text-sm py-2 border-b border-gray-700"
                                        >
                                            <div className="text-gray-200   ">{upload.fileName}</div>
                                            <div className="text-gray-400">{upload.date ? formateDate(upload.date) : "—"}</div>
                                            <div className="">{statusBadge(upload._status)}</div>
                                            <div className="pl-5">
                                                <span className="text-green-500">{upload?.insertedLeads?.length}</span> /{" "}
                                                <span className="text-red-400">{upload?.duplicateLeads?.length}</span>
                                            </div>
                                            <div className="text-sm">
                                                {upload?.duplicateLeads?.length > 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedDuplicateLeads({ fileName: upload.fileName, leads: upload.duplicateLeads })
                                                        }
                                                        className="text-blue-400 hover:text-blue-300 underline font-medium"
                                                    >
                                                        View Duplicates ({upload.duplicateLeads.length})
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex mt-20 text-white/70 justify-center">
                                        <p>No Uploads Yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Live-only rows for files not yet in server history (optional) */}
                        </div>
                    </div>
                </div>

                <div></div>
            </div>

            <div
                className={`min-h-full ${
                    showModal ? "fixed min-w-[400px] lg:static top-0 left-0 w-full lg:w-auto z-50 block" : "hidden lg:block"
                } min-w-[380px] max-w-[380px] bg-gray-800 shadow-lg p-6 overflow-y-auto`}
            >
                <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">{"Add New Lead"}</h2>
                        <input
                            type="reset"
                            value={"Clear"}
                            className="btn btn-xs btn-outline"
                            // onClick={(e) => {

                            // }}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <input
                            name="lead_name"
                            placeholder="Lead Name"
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                            disabled={isSubmitting}
                        />
                        <input
                            name="lead_email"
                            type="text"
                            placeholder="Email"
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                            disabled={isSubmitting}
                        />

                        <input
                            name="lead_phone"
                            placeholder="Phone"
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                            disabled={isSubmitting}
                        />
                        <input
                            name="lead_fblink"
                            placeholder="Messenger Link"
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                            disabled={isSubmitting}
                        />

                        <input
                            name="lead_Address"
                            placeholder="Address"
                            className="input focus:outline-0 focus:border-blue-600 bg-gray-900 input-bordered w-full text-white"
                            disabled={isSubmitting}
                        />

                        <input
                            name="lead_source"
                            placeholder="Lead Source"
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
                                    [{ name: "Counselling" }, ...courses]?.map((c) => ({
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
                        {selectedCourses?.length > 0 && (
                            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto p-3 pt-0 bg-gray-900/90 border border-gray-700 rounded-lg">
                                <label className="text-xs font-semibold text-gray-300 sticky bg-gray-900/90 pt-3 z-[999] top-0">
                                    Configure Course Types:
                                </label>

                                {selectedCourses?.map((c, index) => (
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
                    </div>

                    {/* Error messages */}
                    <div className="mt-auto text-red-500 text-sm">{submitError || formSubmitError}</div>

                    <div className="pt-4 flex  gap-2">
                        <button type="submit" className="btn bg-blue-600 btn-primary w-full text-white">
                            {isSubmitting ? "Creating Lead..." : "Create Lead"}
                        </button>
                    </div>
                </form>
            </div>



            {selectedDuplicateLeads && (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <div>
                    <h3 className="text-lg font-semibold text-white">Duplicate / Failed Leads</h3>
                    <p className="text-xs text-gray-400 truncate max-w-lg mt-0.5">
                        {selectedDuplicateLeads.fileName}
                    </p>
                </div>
                <button
                    onClick={() => setSelectedDuplicateLeads(null)}
                    className="btn btn-sm btn-ghost btn-circle text-gray-400 hover:text-white"
                >
                    ✕
                </button>
            </div>

            {/* Modal Table Body */}
            <div className="overflow-y-auto p-4 pt-0 flex-1">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-800 text-xs text-gray-400 sticky top-0 uppercase">
                        <tr>
                            <th className="py-2.5 px-3">#</th>
                            <th className="py-2.5 px-3">Phone</th>
                            <th className="py-2.5 px-3">Course(s)</th>
                            <th className="py-2.5 px-3">Failed Reason</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {selectedDuplicateLeads.leads.map((item, index) => (
                            <tr key={item._id || index} className="hover:bg-gray-800/40">
                                <td className="py-2.5 px-3 text-gray-500 text-xs">{index + 1}</td>
                                <td className="py-2.5 px-3 font-mono text-white font-medium">{item.phone || "N/A"}</td>
                                <td className="py-2.5 px-3 text-gray-200">
                                    {Array.isArray(item.course) ? item.course.join(", ") : item.course || "—"}
                                </td>
                                <td className="py-2.5 px-3 text-red-400 text-xs font-medium">
                                    {item.reason || "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-gray-800 flex justify-end">
                <button
                    onClick={() => setSelectedDuplicateLeads(null)}
                    className="btn btn-sm bg-gray-800 hover:bg-gray-700 text-white border-0"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Page;
