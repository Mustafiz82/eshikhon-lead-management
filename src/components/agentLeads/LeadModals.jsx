"use client";

import axiosPublic from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import { formateDate } from "@/utils/date";
import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import QR from "./QR";
import { FaEdit, FaInfo, FaPlus } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { MultiSelect } from "primereact/multiselect";
import { findBestCourse } from "@/utils/matchCourseName";

import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import HistoryRow from "./HistoryRow";

export function formatForWhatsApp(number) {
    if (!number) return "";

    const original = number;
    let digits = number.replace(/\D/g, "");

    if (digits.startsWith("8801") || digits.startsWith("01") || (digits.length === 10 && digits.startsWith("1"))) {
        if (digits.startsWith("8801")) {
        } else if (digits.startsWith("01")) {
            digits = "880" + digits.slice(1);
        } else if (digits.startsWith("1")) {
            digits = "880" + digits;
        }

        if (digits.length === 13) return digits;
    }

    if (original.trim().startsWith("+")) {
        return digits;
    }

    return digits || original;
}

const getCourseTypeString = (typeVal) => {
    if (Array.isArray(typeVal)) {
        return typeVal[0] || "Online";
    }
    if (typeof typeVal === "string" && typeVal.trim()) {
        return typeVal;
    }
    return "Online";
};

const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {
    const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending");
    const [InterstedSeminarStatus, setInterstedSeminarStatus] = useState(selectedLead?.interstedSeminar || "None");

    const [followUpDate, setFollowUpDate] = useState("");
    const [refundAmount, setRefundAmount] = useState(0);

    // 🔹 Hidden Date Input Refs
    const firstContactedRef = useRef(null);
    const lastContactedRef = useRef(null);

    const [firstContactedDate, setFirstContactedDate] = useState("");
    const [lastContactedDate, setLastContactedDate] = useState("");

    const [messengerLink, setMessengerLink] = useState(selectedLead?.fblink || "");
    const [isMessengerEditing, setIsMessengerEditing] = useState(false);

    const [email, setEmail] = useState(selectedLead?.email || "");
    const [isEmailEditing, setIsEmailEditing] = useState(false);

    const [selectedCourses, setSelectedCourses] = useState([]);

    const [notes, setNotes] = useState(selectedLead?.note || []);

    const [leadSource, setLeadSource] = useState(selectedLead?.leadSource || "");
    const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);

    const [copied, setCopied] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [orderCompletionDate, setOrderCompletionDate] = useState(null);

    const { user } = useContext(AuthContext);

    const [orderNumber, setOrderNumber] = useState("");
    const [orderStatus, setOrderStatus] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [estimatedPaymentDate, setEstimatedPaymentDate] = useState(null);

    const [callCount, setCallCount] = useState(0);

    const sourceOptions = [
        "Counseling Form",
        "FB Page(1st)",
        "FB Page(2nd)",
        "Tiktok",
        "Instagram",
        "Youtube",
        "Others Social Media",
        "FB Paid Campaign",
        "Google Paid Campaign",
        "Onhold Order",
        "Office Visit",
        "Seminar",
        "Outdoor Event",
        "Free Course",
        "Associate Refer",
        "WhatsApp",
        "IMO",
        "Robi58",
        "Banglalink58",
        "GP39",
        "3CX Incoming",
    ];

    // Fetch Order Details from WooCommerce
    const findOrderDetails = async (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!orderNumber) return;
            try {
                const res = await axiosPublic.get(`/leads/order/${orderNumber}?phone=${user?.phone}&leadId=${selectedLead?._id}`);

                if (res?.data) {
                    setOrderStatus(res?.data?.status);
                    setCustomerPhone(res?.data?.customerPhone || "");
                    setOrderCompletionDate(res?.data?.orderCompletionDate || null);

                    if (Array.isArray(res.data.courses) && res.data.courses.length > 0) {
                        const newCoursesFromOrder = res.data.courses.map((wcCourse) => {
                            const matched = findBestCourse ? findBestCourse(wcCourse.cleanedName || wcCourse.courseName, course) : null;
                            const courseName = matched?.name || wcCourse.cleanedName || wcCourse.courseName;
                            const type = wcCourse.type || matched?.type || "Online";

                            const origPrice = Number(wcCourse.originalPrice || 0);
                            const disc = Number(wcCourse.discount || 0);

                            if (type === "Online") {
                                const paid = Number(wcCourse.total || 0);
                                const due = Math.max(0, origPrice - disc - paid);
                                const initHistory =
                                    paid > 0
                                        ? [
                                              {
                                                  date: res.data.orderCompletionDate || res.data.ordercreationDate,
                                                  paidAmount: paid,
                                              },
                                          ]
                                        : [];
                                return {
                                    courseName,
                                    courseType: getCourseTypeString(type),
                                    originalPrice: origPrice,
                                    leadDiscount: disc,
                                    discountUnit: "flat",
                                    totalPaid: paid,
                                    totalDue: due,
                                    history: initHistory,
                                    newPayment: 0,
                                };
                            } else {
                                const due = Math.max(0, origPrice - disc);
                                return {
                                    courseName,
                                    courseType: getCourseTypeString(type),
                                    originalPrice: origPrice,
                                    leadDiscount: disc,
                                    discountUnit: "flat",
                                    totalPaid: 0,
                                    totalDue: due,
                                    history: [],
                                    newPayment: 0,
                                };
                            }
                        });

                        setSelectedCourses(newCoursesFromOrder);
                    }

                    setError("");
                }
            } catch (err) {
                console.error("Order fetch error:", err);
                setError(err.response?.data?.message || err.response?.data?.title || "Failed to fetch order details");
            }
        }
    };

    const handleCourseFinancialChange = (courseName, field, val) => {
        setSelectedCourses((prev) =>
            prev.map((c) => {
                if (c.courseName !== courseName) return c;
                const numVal = Number(val) || 0;
                if (field === "newPayment") {
                    const orig = Number(c.originalPrice || 0);
                    const disc = Number(c.leadDiscount || 0);
                    const prevPaid = Number(c.totalPaid || 0);
                    const newTotalPaid = prevPaid + numVal;
                    const calcDue = Math.max(0, orig - disc - newTotalPaid);
                    return {
                        ...c,
                        newPayment: numVal,
                        totalDue: calcDue,
                    };
                }
                return { ...c, [field]: val };
            }),
        );
    };

    const handleMultiSelectChange = (selectedNames) => {
        const updated = selectedNames.map((name) => {
            const existing = selectedCourses.find((c) => c.courseName === name);
            if (existing) return existing;

            const matchedCourse = course?.find((c) => c.name === name);
            const resolvedType = getCourseTypeString(matchedCourse?.type || matchedCourse?.allowedTypes);
            const origPrice = Number(matchedCourse?.price || matchedCourse?.regularPrice || 0);

            return {
                courseName: name,
                courseType: resolvedType,
                originalPrice: origPrice,
                leadDiscount: 0,
                discountUnit: "flat",
                totalPaid: 0,
                totalDue: origPrice,
                history: [],
                newPayment: 0,
            };
        });

        setSelectedCourses(updated);
    };

    const handleCourseTypeChange = (courseName, newType) => {
        setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, courseType: getCourseTypeString(newType) } : c)));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        setError("");
        console.log(modelStatus);

        if (!selectedCourses || selectedCourses.length === 0) {
            setSaving(false);
            return setError("Please select at least one course");
        }

        // 🔹 CHECK 1: Prevent changing "Enrolled with Other Number" -> "Enrolled"
        const normalizedModelStatus = modelStatus?.trim().toLowerCase();
        const isEnrolled = normalizedModelStatus === "enrolled";
        const isEnrolledWithOther = normalizedModelStatus === "enrolled with other number";

        // 🔹 CHECK 1: Prevent changing "Enrolled with Other Number" -> "Enrolled"
        // if (selectedLead?.leadStatus === "Enrolled with Other Number" && isEnrolled && user?.role === "user") {
        //     setSaving(false);
        //     return setError("You cannot change the status of this lead from 'Enrolled with Other Number' to 'Enrolled'.");
        // }

        // 🔹 USER-SPECIFIC VALIDATIONS
        if (user?.role === "user") {
            if (error) {
                setSaving(false);
                return;
            }

            // Order checks only apply when trying to ENROLL the lead
            if (isEnrolled || isEnrolledWithOther) {
                // 1. Order number must be entered
                if (!orderNumber) {
                    setSaving(false);
                    return setError("An Order Number is required to enroll this lead.");
                }

                // 2. Order details must be verified (pressing Enter is required)
                if (!orderStatus || !customerPhone) {
                    setSaving(false);
                    return setError("Please press Enter inside the Order Number box to verify and load order details before enrolling.");
                }

                const normalizedOrderPhone = formatForWhatsApp(customerPhone);
                const normalizedLeadPhone = formatForWhatsApp(selectedLead?.phone);
                const normalizedLeadEmail = formatForWhatsApp(selectedLead?.email);
                const normalizedOrderStatus = orderStatus?.trim().toLowerCase();

                // 3. If the order status is anything but completed (e.g. failed, on-hold, pending)

                console.log(modelStatus);
                console.log(modelStatus === "On hold");
                if (normalizedOrderStatus !== "completed" && modelStatus !== "On hold") {
                    console.log(modelStatus);
                    setSaving(false);
                    return setError("This order is not completed. You can only set the lead status to 'On hold'.");
                }

                // 4. If the order is completed, verify phone matching
                if (normalizedOrderStatus === "completed") {
                    // Case A: Phone number mismatch
                    if (normalizedOrderPhone !== normalizedLeadPhone && normalizedOrderPhone !== normalizedLeadEmail) {
                        if (!isEnrolledWithOther) {
                            setSaving(false);
                            return setError("Phone number mismatch. You can only set the lead status to 'Enrolled with Other Number'.");
                        }
                    }
                    // Case B: Phone numbers match
                    else {
                        if (!isEnrolled) {
                            setSaving(false);
                            return setError("Phone numbers match. You must set the lead status to 'Enrolled'.");
                        }
                    }
                }
            }
        }
        // Construct updated courses payload
        const updatedCoursesPayload = selectedCourses.map((item) => {
            // const existingCourse = selectedLead?.courses?.find((c) => c.courseName === item.courseName);
            // let courseHistory = existingCourse?.history ? [...existingCourse.history] : [...(item.history || [])];

            const existingCourse = selectedLead?.courses?.find((c) => c.courseName === item.courseName);

            // If item has history (from WooCommerce / order search), use it.
            // Otherwise, keep existing course history if it had payments.
            let courseHistory = [];
            if (item.history && item.history.length > 0) {
                courseHistory = [...item.history];
            } else if (existingCourse?.history && existingCourse.history.length > 0) {
                courseHistory = [...existingCourse.history];
            }

            let finalPaid = Number(item.totalPaid || 0);
            if (Number(item.newPayment) > 0) {
                finalPaid += Number(item.newPayment);
                courseHistory.push({
                    date: item.newPaymentDate ? new Date(item.newPaymentDate) : new Date(),
                    paidAmount: Number(item.newPayment),
                });
            }

            const origPrice = Number(item.originalPrice || 0);
            const leadDisc = Number(item.leadDiscount || 0);
            const finalDue = Math.max(0, origPrice - leadDisc - finalPaid);

            return {
                ...(existingCourse?._id ? { _id: existingCourse._id } : {}),
                courseName: item.courseName,
                courseType: getCourseTypeString(item.courseType),
                originalPrice: origPrice,
                leadDiscount: leadDisc,
                discountUnit: "flat",
                totalPaid: finalPaid,
                totalDue: finalDue,
                history: courseHistory,
                ...(modelStatus === "Enrolled" && !existingCourse?.enrolledAt ? { enrolledAt: Date.now() } : {}),
                enrolledAt: item.newPaymentDate
                    ? new Date(item.newPaymentDate)
                    : existingCourse?.enrolledAt || (modelStatus === "Enrolled" ? Date.now() : null),
            };
        });

        const overallOriginalPrice = updatedCoursesPayload.reduce((sum, c) => sum + (c.originalPrice || 0), 0);
        const overallTotalPaid = updatedCoursesPayload.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
        const overallTotalDue = updatedCoursesPayload.reduce((sum, c) => sum + (c.totalDue || 0), 0);

        setError("");

        const obj = {
            courses: updatedCoursesPayload,
            interstedSeminar: InterstedSeminarStatus,
            leadSource: leadSource,
            fblink: messengerLink,
            email: email,
            originalPrice: overallOriginalPrice,
            paidAmount: overallTotalPaid,
            totalPaid: overallTotalPaid,
            totalDue: overallTotalDue,
            callCount: Number(callCount) || 0,
            refundAmount: Number(refundAmount) || 0,
            followUpDate: followUpDate,
            firstContacted: firstContactedDate ? new Date(firstContactedDate) : null,
            lastContacted: lastContactedDate ? new Date(lastContactedDate) : null,
            leadStatus: modelStatus,
            nextEstimatedPaymentDate: estimatedPaymentDate,
            note: notes.filter((item) => item?.status === "unsaved").map(({ text, by }) => ({ text, by })),
            lastModifiedBy: user?.name,
            orderNumber: parseInt(orderNumber) || null,
            orderCompletionDate,
        };

        if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
            obj.enrolledAt = Date.now();
        }

        const cleanedObj = Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => {
                if (Array.isArray(v)) return v.length > 0;
                return v !== undefined && v !== null && v !== "";
            }),
        );

        if (followUpDate === "") cleanedObj.followUpDate = null;

        try {
            const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj);
            console.log(res.data);
            setSaving(false);
            refetch();
            setSelectedLead(null);
        } catch (err) {
            console.error("Save changes error:", err);
            setError(err.response?.data?.message || "Failed to save changes");
            setSaving(false);
        }
    };

    useEffect(() => {
        if (selectedLead) {
            setModelStatus(selectedLead.leadStatus || "Pending");
            setInterstedSeminarStatus(selectedLead.interstedSeminar || "None");
            setNotes(selectedLead?.note || []);

            const initialCourses =
                selectedLead?.courses?.map((c) => ({
                    courseName: c.courseName,
                    courseType: getCourseTypeString(c.courseType),
                    originalPrice: Number(c.originalPrice || 0),
                    leadDiscount: Number(c.leadDiscount || 0),
                    discountUnit: c.discountUnit || "flat",
                    totalPaid: Number(c.totalPaid || 0),
                    totalDue: Number(c.totalDue || 0),
                    history: c.history || [],
                    newPayment: 0,
                    newPaymentDate: "",
                })) || [];

            setSelectedCourses(initialCourses);

            setLeadSource(selectedLead.leadSource || "");
            setError("");

            setFollowUpDate(selectedLead?.followUpDate ? selectedLead.followUpDate.split("T")[0] : "");
            setFirstContactedDate(selectedLead?.firstContacted ? selectedLead.firstContacted.split("T")[0] : "");
            setLastContactedDate(selectedLead?.lastContacted ? selectedLead.lastContacted.split("T")[0] : "");

            setRefundAmount(selectedLead.refundAmount || 0);
            setOrderNumber(selectedLead?.orderNumber || "");
            setCallCount(selectedLead?.callCount || 0);

            setEstimatedPaymentDate(selectedLead?.nextEstimatedPaymentDate ? selectedLead.nextEstimatedPaymentDate.split("T")[0] : "");

            setMessengerLink(selectedLead.fblink || "");
            setIsMessengerEditing(false);

            setEmail(selectedLead.email || "");
            setIsEmailEditing(false);
        }
    }, [selectedLead]);

    const handleAddNote = (e) => {
        e.preventDefault();
        setNotes([
            ...notes,
            {
                text: e.target.note?.value,
                status: "unsaved",
                by: user?.name,
                date: formateDate(Date.now()),
            },
        ]);
        e.target.reset();
    };

    const handleDeleteUnsavedNote = (index) => {
        setNotes((prev) => prev.filter((_, i) => i !== index));
    };

    const allCourseHistory = selectedCourses.flatMap((c) =>
        (c.history || []).map((h) => ({
            ...h,
            courseName: c.courseName,
        })),
    );

    function formatBDNumber(number) {
        const original = number;
        let digits = number.replace(/\D/g, "");

        if (digits.startsWith("880")) {
            digits = "0" + digits.slice(3);
        } else if (digits.startsWith("88")) {
            digits = "0" + digits.slice(2);
        } else if (!digits.startsWith("0") && digits.length === 10) {
            digits = "0" + digits;
        }

        if (digits.length === 11 && digits.startsWith("01")) {
            return digits;
        }

        return original;
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedLead(null);
                return;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handlePaymentInputChange = (courseName, val) => {
        setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, newPayment: val } : c)));
    };

    // ADD THIS HANDLER FUNCTION:
    const handlePaymentDateChange = (courseName, dateVal) => {
        setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, newPaymentDate: dateVal } : c)));
    };

    const applyCoursePayment = (courseName) => {
        setSelectedCourses((prev) =>
            prev.map((c) => {
                if (c.courseName !== courseName) return c;
                const numVal = Number(c.newPayment) || 0;
                const orig = Number(c.originalPrice || 0);
                const disc = Number(c.leadDiscount || 0);
                const prevPaid = Number(c.totalPaid || 0);
                const calcDue = Math.max(0, orig - disc - (prevPaid + numVal));
                return {
                    ...c,
                    totalDue: calcDue,
                };
            }),
        );
    };

    const isDisabled = user?.role === "user" && selectedLead?.leadStatus === "Enrolled";

    const handleRemoveCourse = (courseName) => {
        console.log("clicked");
        setSelectedCourses((prev) => prev.filter((c) => c.courseName !== courseName));
    };

    const initialFirstContact = selectedLead?.firstContacted ? selectedLead.firstContacted.split("T")[0] : "";
    const initialLastContact = selectedLead?.lastContacted ? selectedLead.lastContacted.split("T")[0] : "";

    // 🔹 Trigger native browser calendar directly
    const openDatePicker = (inputRef) => {
        if (!inputRef.current) return;
        try {
            if (inputRef.current.showPicker) {
                inputRef.current.showPicker();
            } else {
                inputRef.current.click();
            }
        } catch (e) {
            console.error("Calendar trigger error:", e);
        }
    };

    return (
        selectedLead && (
            <div className="fixed inset-0 !z-99 bg-black/40 flex items-center justify-center">
                <div
                    className={`bg-base-100 w-full scale-90 rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${
                        modelStatus == "Enrolled" ||
                        modelStatus == "Refunded" ||
                        modelStatus == "Enrolled with Other Number" ||
                        modelStatus == "On hold"
                            ? "md:grid-cols-2 lg:grid-cols-4 max-w-[1350px]"
                            : "md:grid-cols-3 lg:grid-cols-[400px_1fr_1fr] max-w-[1150px]"
                    } gap-4 max-h-[90vh] overflow-y-visible`}
                >
                    {/* Top bar */}
                    <div className="sticky md:absolute ml-auto top-3 right-3">
                        <button onClick={() => setSelectedLead(null)} className="btn btn-sm">
                            ✕ Close
                        </button>
                    </div>

                    {/* Column 1: Lead Details */}
                    <div className="space-y-6 max-h-[550px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-scroll">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Lead Info</h3>
                            <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
                                <div className="text-white/50">Name</div>
                                <div className="font-medium">{selectedLead.name || "N/A"}</div>
                                <div className="text-white/50 flex items-center">Email</div>
                                <div className="flex w-full items-center justify-between font-medium">
                                    {isEmailEditing ? (
                                        <div className="flex items-center gap-1 w-full">
                                            <input
                                                type="text"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input input-xs bg-gray-900 border border-gray-600 text-white rounded w-full focus:outline-none focus:border-blue-500 text-xs py-1 px-1.5"
                                                placeholder="Enter email..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsEmailEditing(false)}
                                                className="btn btn-xs btn-ghost text-green-400 font-bold"
                                                title="Confirm text changes"
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex w-full items-center justify-between font-medium">
                                            <div className="flex items-center gap-1">
                                                <span title={email} className="truncate max-w-[120px]">
                                                    {email || "N/A"}
                                                    {/* mustafiz8260@gmail.com */}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                {email != (selectedLead?.email || "") && (
                                                    <span
                                                        title="Unsaved"
                                                        className="text-yellow-500 border-2  border-yellow-500 rounded-full p-0.5  font-semibold text-[10px]"
                                                    >
                                                        <FaInfo />
                                                    </span>
                                                )}

                                                {email && (
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(email);
                                                            setCopied(true);
                                                            setTimeout(() => setCopied(false), 1500);
                                                        }}
                                                        className="text-blue-400 self-end  cursor-pointer hover:text-white text-xs flex items-center"
                                                        title="Copy Email"
                                                    >
                                                        {copied ? (
                                                            <IoCheckmarkDoneSharp className="text-green-400 text-lg" />
                                                        ) : (
                                                            <MdContentCopy className="text-blue-400 text-lg" />
                                                        )}
                                                    </button>
                                                )}

                                                <div
                                                    className="cursor-pointer text-blue-400 hover:text-white "
                                                    onClick={() => setIsEmailEditing(true)}
                                                >
                                                    <FaEdit />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-white/50">Phone</div>
                                <div className="font-medium">{selectedLead.phone || "N/A"}</div>
                                <div className="text-white/50 flex items-center">Messenger</div>
                                <div className="flex w-full items-center justify-between font-medium">
                                    {isMessengerEditing ? (
                                        <div className="flex items-center gap-1 w-full">
                                            <input
                                                type="text"
                                                value={messengerLink}
                                                onChange={(e) => setMessengerLink(e.target.value)}
                                                className="input input-xs bg-gray-900 border border-gray-600 text-white rounded w-full focus:outline-none focus:border-blue-500 text-xs py-1 px-1.5"
                                                placeholder="Paste Messenger link..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsMessengerEditing(false)}
                                                className="btn btn-xs btn-ghost text-green-400 font-bold"
                                                title="Confirm text changes"
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex w-full items-center justify-between font-medium">
                                            <span className="truncate max-w-[140px]" title={messengerLink}>
                                                {messengerLink || "N/A"}
                                            </span>

                                            {messengerLink !== (selectedLead?.fblink || "") && (
                                                <span className="ml-2 text-yellow-500 font-semibold text-xs whitespace-nowrap">(Unsaved)</span>
                                            )}

                                            <div
                                                className="cursor-pointer text-blue-400 hover:text-white ml-2"
                                                onClick={() => setIsMessengerEditing(true)}
                                            >
                                                <FaEdit />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="text-white/50">Address</div>
                                <div className="font-medium">{selectedLead.address || "N/A"}</div>
                                <div className="text-white/50">Entry By</div>
                                <div className="font-medium">{selectedLead.entryBy || "N/A"}</div>
                                <div className="text-white/50">Created By</div>
                                <div className="font-medium truncate max-w-[160px]" title={selectedLead.createdBy}>
                                    {selectedLead.createdBy || "N/A"}
                                </div>

                                <div className="text-white/50 flex items-center">Call Count</div>
                                <div className="font-medium flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                        <span>x{callCount}</span>
                                        {Number(callCount) !== Number(selectedLead?.callCount || 0) && (
                                            <span className="text-yellow-500 font-semibold text-xs">(Unsaved)</span>
                                        )}
                                    </div>

                                    {/* 🔹 Decrement (-) & Increment (+) Buttons */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setCallCount((prev) => Math.max(0, Number(prev || 0) - 1))}
                                            className="w-5 h-5 flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white rounded border border-gray-600 text-xs font-bold transition-colors"
                                            title="Decrease Call Count"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCallCount((prev) => Number(prev || 0) + 1)}
                                            className="w-5 h-5 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors"
                                            title="Increase Call Count"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-white/50 flex items-center">Lead Source</div>
                                <div className="flex w-full items-center justify-between font-medium">
                                    {leadSource || "N/A"}
                                    {leadSource !== (selectedLead?.leadSource || "") && (
                                        <span className="ml-2 text-yellow-500 font-semibold text-xs">(Unsaved)</span>
                                    )}
                                    <div
                                        className="cursor-pointer text-blue-400 hover:text-white ml-2"
                                        onClick={() => setIsSourceMenuOpen(!isSourceMenuOpen)}
                                    >
                                        <FaEdit />
                                    </div>
                                    {isSourceMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-9998 cursor-default" onClick={() => setIsSourceMenuOpen(false)}></div>
                                            <ul className="menu fixed left-90 top-50 p-2 shadow-xl bg-base-300 rounded-box max-h-[300px] overflow-y-auto border border-gray-600 z-9999">
                                                {sourceOptions.map((source, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() => {
                                                                setLeadSource(source);
                                                                setIsSourceMenuOpen(false);
                                                            }}
                                                            className={leadSource === source ? "bg-primary text-white" : ""}
                                                        >
                                                            {source}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-white/80 mb-2">
                                {selectedLead?.leadStatus === "Enrolled" ? "Enrolled" : "Interested"} Course:
                            </h4>
                            {selectedLead?.courses && selectedLead.courses.length > 0 ? (
                                selectedLead.courses.map((c, i) => (
                                    <div key={i} className="py-1 rounded-lg text-xs">
                                        <div className="font-semibold text-white">
                                            {c.courseName} ({c.courseType || "Online"})
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-white/50 italic">No courses listed</div>
                            )}
                        </div>

                        {/* SECTION: TIMELINE */}
                        <div>
                            <h4 className="text-xs font-bold text-white/80 mb-1">Timeline</h4>
                            <div className="grid grid-cols-[140px_1fr] gap-y-1 text-sm">
                                <div className="text-white/50">Lead Created</div>
                                <div className="font-medium">{formateDate(selectedLead.createdAt)}</div>
                                <div className="text-white/50">Assigned Date</div>
                                <div className="font-medium">{formateDate(selectedLead.assignDate)}</div>

                                {/* 🔹 EDITABLE FIRST CONTACTED WITH DIRECT CALENDAR POPUP */}
                                <div className="text-white/50 flex items-center">First Contacted</div>
                                <div className="flex items-center justify-between font-medium">
                                    <div className="flex items-center justify-between gap-1  w-full">
                                        <span>{firstContactedDate ? formateDate(firstContactedDate) : "N/A"}</span>
                                        {firstContactedDate !== initialFirstContact && (
                                            <span
                                                title="Unsaved"
                                                className="text-yellow-500 border-2 border-yellow-500 rounded-full p-0.5  font-semibold text-xs"
                                            >
                                                <FaInfo />
                                            </span>
                                        )}
                                    </div>

                                    {/* Edit Icon triggers hidden date input calendar directly */}
                                    {!initialFirstContact && (
                                        <div
                                            className="cursor-pointer text-blue-400 hover:text-white ml-2"
                                            onClick={() => openDatePicker(firstContactedRef)}
                                        >
                                            <FaEdit />
                                        </div>
                                    )}

                                    {/* Hidden Date Input */}
                                    <input
                                        ref={firstContactedRef}
                                        type="date"
                                        className="sr-only"
                                        value={firstContactedDate}
                                        onChange={(e) => setFirstContactedDate(e.target.value)}
                                    />
                                </div>

                                {/* 🔹 EDITABLE LAST CONTACTED WITH DIRECT CALENDAR POPUP */}
                                <div className="text-white/50 flex items-center">Last Contacted</div>
                                <div className="flex items-center justify-between font-medium">
                                    <div className="flex items-center justify-between gap-1  w-full">
                                        <span>{lastContactedDate ? formateDate(lastContactedDate) : "N/A"}</span>
                                        {lastContactedDate !== initialLastContact && (
                                            <span
                                                title="Unsaved"
                                                className="text-yellow-500 border-2 border-yellow-500 rounded-full p-0.5  font-semibold text-xs"
                                            >
                                                <FaInfo />
                                            </span>
                                        )}
                                    </div>

                                    {/* Edit Icon triggers hidden date input calendar directly */}
                                    <div
                                        className="cursor-pointer text-blue-400 hover:text-white ml-2"
                                        onClick={() => openDatePicker(lastContactedRef)}
                                    >
                                        <FaEdit />
                                    </div>

                                    {/* Hidden Date Input */}
                                    <input
                                        ref={lastContactedRef}
                                        type="date"
                                        className="sr-only"
                                        value={lastContactedDate}
                                        onChange={(e) => setLastContactedDate(e.target.value)}
                                    />
                                </div>

                                <div className="text-white/50">Follow-Up Date</div>
                                <div className="font-medium">{selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</div>
                                <div className="text-white/50">Enrollment Date</div>
                                <div className="font-medium">{selectedLead.enrolledAt ? formateDate(selectedLead.enrolledAt) : "N/A"}</div>
                                <div className="text-white/50">Next Payment Date</div>
                                <div className="font-medium">
                                    {selectedLead.nextEstimatedPaymentDate ? formateDate(selectedLead.nextEstimatedPaymentDate) : "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* SECTION: QUESTIONS */}
                        {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold text-white/80 mb-1">Questions</h4>
                                <div className="space-y-3 text-sm mt-1">
                                    {Object.entries(selectedLead.questions).map(([q, a], i) => (
                                        <div key={i} className="border-b border-white/10 pb-2">
                                            <div className="text-white/50">{q}</div>
                                            <div className="font-medium text-white mt-1">{a}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Notes */}
                    <div className="space-y-2 flex flex-col text-sm">
                        <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
                        <div className="space-y-2 h-[320px] overflow-y-auto">
                            {notes?.map((note, i) => (
                                <div key={i} className="border border-gray-500 mt-2 p-2 bg-base-200 rounded relative">
                                    {note.status === "unsaved" && (
                                        <button
                                            onClick={() => handleDeleteUnsavedNote(i)}
                                            className="absolute cursor-pointer p-1 top-1 z-30 right-1 text-red-500 text-xs hover:text-red-300"
                                            title="Delete this unsaved note"
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <p className={`text-xs opacity-70 ${(note.date || note.createdAt || note.by) && "mb-2"}`}>
                                        <span>{(note.date || note.createdAt) && formateDate(note.date || note.createdAt) + ` • ${note.by}`} </span>
                                        {note?.status == "unsaved" && <span className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
                                    </p>
                                    <div className="whitespace-pre-wrap break-all font-sans text-sm">{note.text}</div>
                                </div>
                            ))}
                            {notes?.length === 0 && <p className="text-xs text-center mt-20 text-base-content/60">No notes yet.</p>}
                        </div>

                        <form className="mt-auto" onSubmit={handleAddNote}>
                            <textarea
                                name="note"
                                required
                                className="textarea resize-none focus:outline-none focus:border-blue-600 mt-auto textarea-bordered w-full"
                                rows={3}
                                placeholder="Write a note..."
                            ></textarea>
                            <button className="btn w-full mt-2 bg-blue-600 btn-primary">Add Note</button>
                        </form>
                    </div>

                    {/* Column 3: Payment Details */}
                    {(modelStatus == "Enrolled" ||
                        modelStatus == "Refunded" ||
                        modelStatus == "Enrolled with Other Number" ||
                        modelStatus == "On hold") && (
                        <div className="space-y-3 flex flex-col text-sm max-h-[550px] overflow-y-auto pr-1">
                            <h3 className="text-lg font-semibold">Payment Details</h3>

                            {/* Order Number Input */}
                            <div>
                                <label className="text-xs text-white/60 mb-1 block">Order Number</label>
                                <input
                                    type="number"
                                    value={orderNumber || ""}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    onKeyDown={findOrderDetails}
                                    placeholder="Enter Order Number & Press Enter"
                                    className="input input-bordered w-full disabled:bg-transparent focus:outline-0 focus:border-blue-600 disabled:border disabled:border-gray-600"
                                />
                            </div>

                            {/* Course Breakdown Cards */}
                            <div className="space-y-1.5 mt-2">
                                <label className="text-xs font-bold text-white/80 block">Enrolled Courses Breakdown</label>
                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                    {selectedCourses && selectedCourses.length > 0 ? (
                                        selectedCourses.map((c, i) => (
                                            <div key={i} className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="font-medium text-white truncate max-w-[170px]" title={c.courseName}>
                                                        {c.courseName}
                                                    </span>
                                                    <span
                                                        className={`px-1.5 py-0.5 text-[10px] rounded font-medium border ${
                                                            c.courseType === "Offline"
                                                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                                                : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                                        }`}
                                                    >
                                                        {c.courseType || "Online"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-700/60">
                                                    <span>
                                                        Price: <strong className="text-white">৳{c.originalPrice || 0}</strong>
                                                    </span>
                                                    <span>
                                                        Paid:{" "}
                                                        <strong className="text-green-400">
                                                            ৳{Number(c.totalPaid || 0) + Number(c.newPayment || 0)}
                                                        </strong>
                                                    </span>
                                                    <span>
                                                        Due:{" "}
                                                        <strong className={c.totalDue > 0 ? "text-red-400" : "text-gray-400"}>
                                                            ৳{c.totalDue || 0}
                                                        </strong>
                                                    </span>
                                                </div>

                                                {c.courseType === "Offline" && (
                                                    <div className="pt-2 border-t border-gray-700/60 space-y-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <label className="text-[11px] text-yellow-400 font-medium whitespace-nowrap">
                                                                Enrolled / Payment Date:
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={c.newPaymentDate || ""}
                                                                onChange={(e) => handlePaymentDateChange(c.courseName, e.target.value)}
                                                                className="input input-xs bg-gray-900 border-gray-600 text-white rounded focus:outline-none focus:border-yellow-500 text-xs"
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between gap-2">
                                                            <label className="text-[11px] text-yellow-400 font-medium whitespace-nowrap">
                                                                + Add Payment (৳):
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={c.newPayment || ""}
                                                                onChange={(e) => handlePaymentInputChange(c.courseName, e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        e.preventDefault();
                                                                        applyCoursePayment(c.courseName);
                                                                    }
                                                                }}
                                                                onBlur={() => applyCoursePayment(c.courseName)}
                                                                placeholder="0"
                                                                className="input input-xs bg-gray-900 border-yellow-500/50 text-yellow-300 font-bold w-24 text-right focus:outline-none focus:border-yellow-500 rounded"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-white/50 italic p-2 bg-gray-800 rounded border border-gray-700 text-center">
                                            No courses selected
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-lg space-y-1 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Overall Total Paid:</span>
                                    <span className="font-bold text-green-400">
                                        ৳{selectedCourses.reduce((sum, c) => sum + (Number(c.totalPaid) || 0) + (Number(c.newPayment) || 0), 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Overall Total Due:</span>
                                    <span className="font-bold text-red-400">৳{selectedCourses.reduce((sum, c) => sum + (c.totalDue || 0), 0)}</span>
                                </div>
                            </div>

                            {/* Next Estimated Payment Date */}
                            <div>
                                <label className="text-xs text-white/60 mb-1 block">Next Estimate Payment Date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    className="input input-bordered bg-transparent border border-gray-600 text-white rounded-md w-full focus:outline-none focus:border-blue-600"
                                    value={estimatedPaymentDate || ""}
                                    onChange={(e) => setEstimatedPaymentDate(e.target.value)}
                                />
                            </div>

                            {/* Payment History */}
                            <div>
                                <h2 className="text-lg font-semibold">Payment History</h2>
                                <div className="max-h-36 overflow-y-auto pr-2 space-y-1 mt-1">
                                    {allCourseHistory.length > 0 ? (
                                        allCourseHistory.map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded text-xs"
                                            >
                                                <div>
                                                    <span className="text-white font-medium block">{item.courseName}</span>
                                                    <span className="text-gray-400 text-[11px]">{formateDate(item.date)}</span>
                                                </div>
                                                <span className="text-green-400 font-bold">৳{item.paidAmount}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="mt-2 text-white/50 text-sm">No Payment History Available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Column 4: Actions */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold">Actions</h3>

                        <div className="flex mt-2 gap-2 justify-center">
                            <div className="flex-1 min-w-[81px] border border-white">
                                <QR value={`tel:${formatBDNumber(selectedLead?.phone)}`} />
                            </div>
                            <div className="space-y-2 flex-2">
                                <a
                                    href={`sip:${formatBDNumber(selectedLead?.phone)}@192.168.10.150:13005`}
                                    className="flex gap-2 py-3! w-full bg-[#EB6609] border border-[#373737] btn"
                                >
                                    <Image alt="Linphone" src={"/logo/linphone.jpg"} className="w-auto h-5" width={1000} height={1000} /> Call on
                                    Linphone
                                </a>

                                <div className="flex w-full  gap-2">
                                    <a
                                        href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex gap-2 py-3! flex-1 bg-[#34DA51] border border-[#34DA51] btn"
                                    >
                                        <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5" width={1000} height={1000} /> Whatsapp
                                    </a>

                                    {selectedLead?.fblink && (
                                        <a
                                            href={selectedLead?.fblink || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex gap-2 py-3! flex-1 bg-[#0084FF] border border-[#0084FF] btn"
                                        >
                                            <Image alt="wsp" src={"/logo/messenger.png"} className="w-auto h-5" width={1000} height={1000} />{" "}
                                            Messenger
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="relative mt-2 w-full">
                            <div className="dropdown w-full">
                                <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
                                    Lead Status ({modelStatus})
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
                                    {statusOptions
                                        ?.filter((item) => item != "All" && item != "Contacted")
                                        .map((s) => (
                                            <li key={s}>
                                                <button
                                                    onClick={() => {
                                                        setModelStatus(s);
                                                        setError("");
                                                        document.activeElement.blur();
                                                    }}
                                                    className={`capitalize ${user?.role == "user" && s == "Refunded" && "hidden"}`}
                                                >
                                                    {s}
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>

                        <div className="relative mt-2 w-full">
                            <div className="dropdown w-full">
                                <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
                                    Seminar Status ({InterstedSeminarStatus})
                                </label>
                                <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
                                    {["Joined", "Online", "Offline", "None"].map((s) => (
                                        <li key={s}>
                                            <button
                                                onClick={() => {
                                                    setInterstedSeminarStatus(s);
                                                    document.activeElement.blur();
                                                }}
                                                className="capitalize"
                                            >
                                                {s}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Multi-Course Selection + Inline Type Selector */}
                        <div className="mt-2 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-xs text-white/60">Interested Courses</label>

                                <div className="relative">
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        disabled={isDisabled}
                                        className={`text-white flex gap-2 items-center text-xs ${
                                            isDisabled ? "opacity-50 cursor-not-allowed" : "pointer-events-none"
                                        }`}
                                    >
                                        Add Course <FaPlus />
                                    </button>

                                    {!isDisabled && (
                                        <MultiSelect
                                            value={selectedCourses.map((c) => c.courseName)}
                                            onChange={(e) => handleMultiSelectChange(e.value)}
                                            options={
                                                [{ name: "Others" }, { name: "Counselling" }, ...course]?.map((c) => ({
                                                    label: c.name,
                                                    value: c.name,
                                                })) || []
                                            }
                                            optionLabel="label"
                                            optionValue="value"
                                            filter
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            panelClassName="text-xs"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
                                {selectedCourses.map((c, idx) => (
                                    <div
                                        key={idx}
                                        className="flex relative items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded text-xs gap-2"
                                    >
                                        <span className="font-medium flex-3 text-white truncate max-w-[170px]" title={c.courseName}>
                                            {c.courseName}
                                        </span>
                                        <div className="flex-2 select-xs bg-gray-900 text-white rounded px-2">
                                            <select
                                                value={getCourseTypeString(c.courseType)}
                                                onChange={(e) => handleCourseTypeChange(c.courseName, e.target.value)}
                                                disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
                                                className="select bg-transparent border-0 focus:outline-none"
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

                                        {!isDisabled && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    console.log("Removing course:", c.courseName);
                                                    handleRemoveCourse(c.courseName);
                                                }}
                                                className="top-0 right-0 bg-red-500 rounded-full text-white hover:text-red-200 p-1 text-xs font-bold leading-none cursor-pointer !z-999"
                                                title="Remove Course"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {modelStatus == "Refunded" ? (
                            <div className="mt-auto gap-3">
                                <label className="block mb-1 text-white/80 text-sm">Refunded Amount</label>
                                <input
                                    type="number"
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    placeholder="Enter Refunded Amount"
                                    className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col mt-auto gap-3">
                                <label className="text-sm">Next Follow-Up Date</label>
                                <input
                                    type="date"
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    min={new Date().toISOString().split("T")[0]}
                                    className="input input-bordered bg-transparent border border-gray-600 text-white rounded-md w-full focus:outline-none focus:border-blue-600"
                                    value={followUpDate}
                                    onChange={(e) => setFollowUpDate(e.target.value)}
                                />
                            </div>
                        )}

                        <p className="text-red-500 text-sm font-semibold">{error}</p>

                        <button
                            onClick={handleSaveChanges}
                            title={selectedLead?.isLocked ? "Lead is Locked. Contact Admin to modify the leads" : ""}
                            disabled={saving || selectedLead?.isLocked}
                            className="btn w-full btn-primary bg-blue-600 text-white hover:bg-[#333] border border-gray-600"
                        >
                            {saving ? "Saving..." : " Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default LeadModals;
