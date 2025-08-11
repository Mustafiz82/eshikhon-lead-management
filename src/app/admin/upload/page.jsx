"use client";
import React, { useRef, useState, useEffect } from "react";
import { RiUpload2Fill } from "react-icons/ri";
import { Bounce, toast } from "react-toastify";
import Papa from "papaparse";


const Page = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (!file || file.type !== "text/csv") {
            return toast.error('Only CSV files allowed', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
        }
        setIsUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: (header) => {
                if (!header) return "";

                const normalized = header.trim().toLowerCase();

                // Map known variations to internal field names
                if (["full name", "name"].includes(normalized)) return "fullName";
                if (["email", "e-mail", "email address"].includes(normalized)) return "email";
                if (["phone", "phone number", "mobile"].includes(normalized)) return "phone";
                if (["address", "location"].includes(normalized)) return "address";
                if (["seminar topic", "topic", "course"].includes(normalized)) return "seminar topic";

            },
     
            complete: function (results) {
                const data = results.data;
                const headers = Object.keys(data[0] || {});
                const requiredFields = ["name", "email", "phone", "address", "seminar topic"];
                const missingFields = requiredFields.filter(field => !headers.includes(field));

                if (missingFields.length > 0) {
                    toast.error(` Missing required fields: ${missingFields.join(", ")}`);
                    return;
                }

                const validSeminarTopics = [
                    "graphic design",
                    "spoken english for freelancing",
                    "digital marketing",
                    "video editing",
                    "ethical hacking",
                    "ai for image, video & music creation",
                    "data entry",
                    "mern stack web development",
                    "not provided"
                ];

                const cleanedData = data.map((row) => {
                    return {
                        ...row,
                        "seminar topic": row["seminar topic"]?.toString().trim() || "Not provided"
                    };
                });

                const invalidTopics = cleanedData.filter(row =>
                    !validSeminarTopics.includes(row["seminar topic"].toLowerCase())
                );

                if (invalidTopics.length > 0) {
                    toast.error(` Some rows have invalid seminar topics. Allowed: ${validSeminarTopics.join(", ")}`);
                    console.warn(" Invalid rows:", invalidTopics);
                    return;
                }

                console.log(" Cleaned and validated data:", cleanedData);
            }
            ,

            error: function (err) {
                toast.error(" Error parsing CSV");
                console.error(err);
            }
        });






        // Fake upload animation
        setTimeout(() => {
            console.log("📦 Uploaded file:", file);
            setIsUploading(false);
        }, 2000);
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
        if (file && file.type === "text/csv") {
            handleFile(file);
        }
    };

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, []);

    const dummyUploads = [];

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
                <h2 className="text-2xl font-semibold text-white mb-6">
                    📤 Upload CSV & History
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Upload Box */}
                    <div
                        className={`border-2 h-[350px] flex flex-col justify-center items-center border-dashed transition-all rounded-xl p-6 text-center cursor-pointer ${dragActive ? "border-blue-500 bg-blue-950/30" : "border-gray-600 hover:border-blue-400"
                            }`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {isUploading ? (
                            <div className="animate-pulse text-blue-400 text-xl">Uploading...</div>
                        ) : (
                            <>
                                <RiUpload2Fill className="text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 transition mb-5 text-4xl" />
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
                            {dummyUploads.length > 0 ? (
                                dummyUploads.map((upload, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-3 items-center text-sm py-2 border-b border-gray-700"
                                    >
                                        <div className="text-gray-200">{upload.filename}</div>
                                        <div className="text-gray-400">{upload.date}</div>
                                        <div
                                            className={`font-medium ${upload.status === "Success"
                                                ? "text-green-400"
                                                : "text-red-400"
                                                }`}
                                        >
                                            {upload.status}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex mt-20 text-white/70 justify-center">
                                    <p>No Uploads Yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
