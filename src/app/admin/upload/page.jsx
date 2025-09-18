"use client";
import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { RiUpload2Fill } from "react-icons/ri";
import { Bounce, toast } from "react-toastify";
import Papa from "papaparse";
import axiosPublic from "@/api/axios";
import useFetch from "@/hooks/useFetch";
import { formateDate } from "@/utils/date";
import { AuthContext } from "@/context/AuthContext";
import { formatFilename } from "@/utils/formateFileName";
import { showToast } from "@/utils/showToast";
import { LuDownload, LuUpload } from "react-icons/lu";
import Link from "next/link";


const STATUS = {
    PENDING: "pending",
    PARSING: "parsing",
    SAVING: "saving",
    COMPLETED: "completed",
    DUPLICATE: "duplicate",
    ERROR: "error",
};

const statusBadge = (state) => {
    const base = "px-2 py-0.5 text-xs rounded font-medium inline-block";
    switch (state) {
        case STATUS.PENDING:
            return <span className={`${base} bg-yellow-500/20 text-yellow-300`}>Pending</span>;
        case STATUS.PARSING:
            return <span className={`${base} bg-blue-500/20 text-blue-300`}>Parsing</span>;
        case STATUS.SAVING:
            return <span className={`${base} bg-indigo-500/20 text-indigo-300`}>Saving</span>;
        case STATUS.COMPLETED:
            return <span className={`${base} bg-green-500/20 text-green-300`}>Completed</span>;
        case STATUS.DUPLICATE:
            return <span className={`${base} bg-amber-500/20 text-amber-300`}>Duplicate</span>;
        case STATUS.ERROR:
            return <span className={`${base} bg-red-500/20 text-red-300`}>Error</span>;
        default:
            return <span className={`${base} bg-gray-500/20 text-gray-300`}>—</span>;
    }
};


const Page = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadStatus, setUploadStatus] = useState({});
    const { data: fileList = [], loading, refetch } = useFetch("/file"); // server history
    const fileInputRef = useRef(null);
    const { user } = useContext(AuthContext)
    const [uploadMode, setUploadMode] = useState("lead")

    const data = fileList?.filter(item => item.type == uploadMode)

    // Any active upload? (for the big box indicator only)
    const hasActiveUploads = useMemo(
        () =>
            Object.values(uploadStatus).some(
                (s) =>
                    s.state === STATUS.PENDING ||
                    s.state === STATUS.PARSING ||
                    s.state === STATUS.SAVING
            ),
        [uploadStatus]
    );

    // Helper to set status for a file
    const setStatus = (fileName, state) => {
        setUploadStatus((prev) => ({
            ...prev,
            [fileName]: { state, updatedAt: Date.now() },
        }));
    };

    const handleFile = async (file) => {
        if (!file) return;
        if (!user.email) return showToast("User not found", "error");
        if (file.type !== "text/csv") return showToast("Only CSV files are allowed", "warning");


        const fileName = formatFilename(file.name);
        setStatus(fileName, STATUS.PENDING);

        // 1) Register file name (server “history”)
        try {
            await axiosPublic.post("/file", { fileName, type: uploadMode });
            // keep pending until parsing starts
        } catch (err) {
            console.log(err)

            setStatus(fileName, STATUS.ERROR);
            showToast("Something went wrong while registering the file", "error");
            return;
        }

        // 2) Parse CSV
        setStatus(fileName, STATUS.PARSING);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: uploadMode == "lead" ? transfromHeaderLead : transfromHeaderAttendence,
            complete: (results) => uploadMode == "lead" ? handleCompleteLeadCSVUpload(results, fileName) : handleCompleteAttendenceCSVUpload(results, fileName),

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
        const rows = results.data;
        const headers = Object.keys(rows[0] || {});
        const required = ["name", "email", "phone", "address", "seminarTopic"];
        const missing = required.filter((f) => !headers.includes(f));
        if (missing.length > 0) {
            setStatus(fileName, STATUS.ERROR);
            showToast(`Missing required fields: ${missing.join(", ")}`, "error");
            return;
        }

        const filtered = rows.filter(
            (item) => item.name && item.email && item.phone && item.address && item.seminarTopic
        );

        const questionWiseData = filtered.map((item) => {
            const { name, email, address, phone, seminarTopic, leadSource, ...questions } = item;
            return {
                name,
                email,
                address,
                phone,
                seminarTopic,
                questions,
                sourceFileName: fileName,
                createdBy: user?.email
            };
        });

        if (rows?.length > filtered?.length) {
            showToast(
                `${rows.length - filtered.length} of ${rows.length} rows skipped due to missing required fields`, "warning"
            );

        }

        // 3) Save leads
        setStatus(fileName, STATUS.SAVING);
        try {
            await axiosPublic.post("/leads", questionWiseData);
            setStatus(fileName, STATUS.COMPLETED);
            refetch(); // refresh server-side history list
        } catch (error) {
            setStatus(fileName, STATUS.ERROR);
            showToast(`Saved ${questionWiseData.length} leads`, "success");
            showToast(error.message || "Failed to save leads", "error");
        }
    }



    const transfromHeaderLead = (header) => {
        if (!header) return "";
        const normalized = header.trim().toLowerCase();
        if (["full name", "name"].includes(normalized)) return "name";
        if (["email", "e-mail", "email address"].includes(normalized)) return "email";
        if (["phone", "phone number", "mobile"].includes(normalized)) return "phone";
        if (["address", "location"].includes(normalized)) return "address";
        if (["seminar topic", "topic", "course"].includes(normalized)) return "seminarTopic";
        if (["Lead Source", "lead source", "source"].includes(normalized)) return "leadSource";
        return header;
    }


    const transfromHeaderAttendence = (header) => {
        if (!header) return "";
        const normalized = header.trim().toLowerCase();
        if (["email", "e-mail", "email address"].includes(normalized)) return "email";
        if (["phone", "phone number", "mobile"].includes(normalized)) return "phone";
        return header;
    }


    const handleCompleteAttendenceCSVUpload = async (results, fileName) => {

        console.log(results)
        const filteredData = results.data.map(row => ({
            phone: row.phone || row.Phone || row.PHONE,
            email: row.email || row.Email || row.EMAIL,
        }));

        console.log(filteredData)

        setStatus(fileName, STATUS.SAVING);

        try {
            const res = await axiosPublic.post("/leads/mark-attendence", filteredData);
            setStatus(fileName, STATUS.COMPLETED);
            let updated = res.data.updated ?? 0;
            const total = results?.data?.length ?? 0;
            const message = `${updated} out of ${total} lead${total === 1 ? "" : "s"} updated`;

            showToast(
                message,
                res.data.updated > 0 ? "success" : "warning"
            );

            console.log("Touched leads:", res.data.touched); // debug
            refetch();
        } catch (error) {
            setStatus(fileName, STATUS.ERROR);
            showToast(error.message || "Failed to process attendance", "error");
        }

    }






    return (
        <div
            className="min-h-screen bg-gray-900 p-6 flex items-center justify-center"
            onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
        >
            <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full max-w-6xl transition-colors">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold text-white mb-6"> Upload {uploadMode == "lead" ? "Leads" : "Attendence"} CSV & History</h2>
                    <div className="flex gap-2">
                        <button onClick={() => setUploadMode(prev => prev == "attendence" ? "lead" : "attendence")} className="btn btn-sm bg-blue-600 border-0 btn-primary"><LuUpload className="text-lg" /> Upload {uploadMode == "lead" ? "Attendence" : "Leads"}  CSV</button>
                        <Link href={"https://docs.google.com/spreadsheets/d/1I79Tsq5nQwSvDbrHhaPC1pP1iJ3rXA0dSOaszIoUU1M/edit?gid=0#gid=0"} ><button className="btn border-0 btn-sm bg-blue-600 btn-primary"> <LuDownload className="text-lg" /> Download Template</button></Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Box */}
                    <div
                        className={`border-2 h-[350px] flex flex-col justify-center items-center border-dashed transition-all rounded-xl p-6 text-center cursor-pointer ${dragActive ? "border-blue-500 bg-blue-950/30" : "border-gray-600 hover:border-blue-400"
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {hasActiveUploads ? (
                            <div className="animate-pulse text-blue-400 text-xl">Uploading...</div>
                        ) : (
                            <>
                                <RiUpload2Fill className="text-blue-600  dark:hover:text-blue-500 transition mb-5 text-4xl" />
                                <p className="text-gray-300">
                                    Drop or click to upload <span className="font-medium">CSV file</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">Max file size: 5MB</p>
                            </>
                        )}
                        <input
                            type="file"
                            accept=".csv"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={(e) => handleFile(e.target.files[0])}
                        />
                    </div>

                    {/* Upload History */}
                    <div className="overflow-x-auto">
                        <h3 className="text-lg font-medium text-gray-200 mb-4">Recent Uploads</h3>

                        <div className="grid grid-cols-3 text-sm font-semibold text-gray-400 border-b border-gray-600 pb-2">
                            <div>Filename</div>
                            <div>Date</div>
                            <div>Status</div>
                        </div>

                        <div className="overflow-y-auto max-h-[280px] wrapper mt-2 pb-10 pr-1">
                            {Object.entries(uploadStatus)
                                .filter(([fileName]) => !rows.some((r) => r.fileName === fileName))
                                .map(([fileName, s]) => (
                                    <div
                                        key={`live-${fileName}`}
                                        className="grid grid-cols-3 items-center text-sm py-2 border-b border-gray-700"
                                    >
                                        <div className="text-gray-200 truncate">{fileName}</div>
                                        <div className="text-gray-400">—</div>
                                        <div>{statusBadge(s.state)}</div>
                                    </div>
                                ))}
                            {rows.length > 0 ? (
                                rows.map((upload, index) => (
                                    <div
                                        key={`${upload.fileName}-${index}`}
                                        className="grid grid-cols-3 items-center text-sm py-2 border-b border-gray-700"
                                    >
                                        <div className="text-gray-200   ">{upload.fileName}</div>
                                        <div className="text-gray-400">
                                            {upload.date ? formateDate(upload.date) : "—"}
                                        </div>
                                        <div>{statusBadge(upload._status)}</div>
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
        </div>
    );
};

export default Page;
