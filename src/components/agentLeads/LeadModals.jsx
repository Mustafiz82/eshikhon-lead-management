// import axiosPublic from "@/api/axios";
// import { AuthContext } from "@/context/AuthContext";
// import useFetch from "@/hooks/useFetch";
// import CourseInput from "@/utils/CourseInput";
// import { formateDate } from "@/utils/date";
// import Image from "next/image";
// import { useContext, useEffect, useState } from "react";
// import QR from "./QR";
// import { FaCopy, FaEdit } from "react-icons/fa";
// import { IoCheckmarkDoneSharp, IoCopyOutline } from "react-icons/io5";
// import { MdContentCopy } from "react-icons/md";
// import { MultiSelect } from "primereact/multiselect";

// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";

// export function formatForWhatsApp(number) {
//     if (!number) return "";

//     const original = number;
//     let digits = number.replace(/\D/g, ""); // remove non-digits

//     // --- Handle Bangladeshi numbers ---
//     if (
//         digits.startsWith("8801") || // +880 format
//         digits.startsWith("01") || // local format
//         (digits.length === 10 && digits.startsWith("1")) // missing 0
//     ) {
//         if (digits.startsWith("8801")) {
//         } else if (digits.startsWith("01")) {
//             digits = "880" + digits.slice(1);
//         } else if (digits.startsWith("1")) {
//             digits = "880" + digits;
//         }

//         if (digits.length === 13) return digits;
//     }

//     // --- Handle other countries ---

//     if (original.trim().startsWith("+")) {
//         return digits; // keep international code, remove '+'
//     }

//     // If user gave plain digits but not BD, just return cleaned number
//     return digits || original;
// }

// const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {
//     const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending");
//     const [InterstedSeminarStatus, setInterstedSeminarStatus] = useState(selectedLead?.interstedSeminar || "None");

//     const [followUpDate, setFollowUpDate] = useState("");
//     const [refundAmount, setRefundAmount] = useState(0); // may noi need keep it for now (replace by oder number later)

//     const [courseInput, setCourseInput] = useState({});

//     const [searchInput, setSearchInput] = useState(""); // we will remove thta
//     const [selectedCourseNames, setSelectedCourseNames] = useState([]);

//     const [selectedCourseId, setSelectedCourseId] = useState(null);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//     const selectedCourse = course.find((item) => item._id === selectedCourseId);
//     const [selectedCourseType, setSelectedCourseType] = useState(selectedCourse?.type || "");
//     const searchSuggestions =
//         searchInput?.trim() && isDropdownOpen ? course.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase())) : [];

//     const [notes, setNotes] = useState(selectedLead?.note || []);

//     const [leadSource, setLeadSource] = useState(selectedLead?.leadSource || "");
//     const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);

//     const [copied, setCopied] = useState(false);

//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [orderCompletionDate, setOrderCompletionDate] = useState(null);

//     const { user } = useContext(AuthContext);

//     // course input internal state
//     const [orderNumber, setOrderNumber] = useState("");
//     const [orderStatus, setOrderStatus] = useState("");
//     const [customerPhone, setCustomerPhone] = useState("");
//     const [coursePrice, setCoursePrice] = useState();
//     const [discount, setDiscount] = useState();
//     const [lastPaid, setLastPaid] = useState();
//     const [dueAmount, setDueAmount] = useState();
//     const [estimatedPaymentDate, setEstimatedPaymentDate] = useState(null);
//     const [localHistory, setLocalHistory] = useState([]);

//     const sourceOptions = [
//         "Counseling Form",
//         "FB Page(1st)",
//         "FB Page(2nd)",
//         "Tiktok",
//         "Instagram",
//         "Youtube",
//         "Others Social Media",
//         "FB Paid Campaign",
//         "Google Paid Campaign",
//         "Onhold Order",
//         "Office Visit",
//         "Seminar",
//         "Outdoor Event",
//         "Free Course",
//         "Associate Refer",
//         "WhatsApp",
//         "IMO",
//         "Robi58",
//         "Banglalink58",
//         "GP39",
//         "3CX Incoming",
//     ];

//     const handleSaveChanges = async () => {
//         // setSaving(true)
//         // const {
//         //     estemitePaymentDate,
//         //     discountSource,
//         //     leadDiscount,      //actual duiscount value when discount is set
//         //     discountUnit,      // selected discount unit
//         //     originalPrice : coursePrice,
//         //     lastPaid,
//         //     totalDue,
//         //     modifiedHistory,
//         //     minValue,
//         //     maxValue } = courseInput

//         console.log(user.role);

//         // if (!searchInput) {
//         //     setSaving(false);
//         //     return setError("Please input Course Name");
//         // }

//         if (orderNumber) {
//             console.log(selectedLead?.phone);

//             if (error) {
//                 return;
//             }

//             if (orderStatus === "on-hold") {
//                 return setError("On Hold Orders can't be marked as Enrolled ");
//             }

//             if (
//                 formatForWhatsApp(customerPhone) !== formatForWhatsApp(selectedLead?.phone) &&
//                 modelStatus !== "Enrolled with Other Number" &&
//                 user?.role == "user"
//             ) {
//                 return setError("The order number must match the phone number associated with this lead ");
//             } else {
//                 setError("");
//             }
//         }

//         const updatedCourses = selectedCourseNames.map((name) => {
//             const matchedCourse = course?.find((c) => c.name === name);
//             const existingCourse = selectedLead?.courses?.find((c) => c.courseName === name);

//             return (
//                 existingCourse || {
//                     courseName: name,
//                     courseType: matchedCourse?.type || "Online",
//                     originalPrice: matchedCourse?.price || 0,
//                     leadDiscount: 0,
//                     discountUnit: "flat",
//                     totalPaid: 0,
//                     totalDue: matchedCourse?.price || 0,
//                     history: [],
//                 }
//             );
//         });

//         // if (
//         //   selectedLead?.createdBy === user?.email &&
//         //   new Date(orderCompletionDate) < new Date(selectedLead?.createdAt)
//         // ) {
//         //   return setError(
//         //     "Lead was created after the order date. Enrollment cannot be processed.",
//         //   );
//         // }

//         console.log("jsdlfsjdlj");

//         // if (discountSource) {

//         //     // discount must be a number
//         //     if (leadDiscount === null || leadDiscount === undefined || leadDiscount === "") {
//         //         setSaving(false);
//         //         return setError("Please input discount value");
//         //     }

//         //     const discountValue = Number(leadDiscount);

//         //     // below minimum
//         //     if (discountValue < minValue) {
//         //         setSaving(false);
//         //         return setError(`Discount cannot be less than ${minValue}`);
//         //     }

//         //     // above maximum
//         //     if (discountValue > maxValue) {
//         //         setSaving(false);
//         //         return setError(`Discount cannot be greater than ${maxValue}`);
//         //     }
//         // }

//         // let filteredCourse = course.filter((item) => item.name == searchInput);

//         // if (filteredCourse?.length == 0) {
//         //     setSaving(false);
//         //     return setError("Pleas Input a Valid Course Name");
//         // }

//         // const totalPaid = coursePrice;

//         // console.log(coursePrice - discount);
//         // console.log(totalPaid);

//         // if (lastPaid > coursePrice - discount - selectedLead.totalPaid) {
//         //     setSaving(false);
//         //     return setError("Payment Exceeds Course Price");
//         // }

//         // if (modelStatus === "Enrolled") {
//         //     console.log("enrolled", leadDiscount)
//         //     if (leadDiscount !== null) {
//         //         console.log("leaddisocunt enry", minValue, maxValue)
//         //         if ((leadDiscount < minValue) || (leadDiscount > maxValue)) {
//         //             console.log("condition  matched")
//         //             setSaving(false)
//         //             return setError(`Discount must be between ${minValue} and ${maxValue}`)
//         //         }
//         //     }
//         // }

//         setError("");
//         console.log(notes.filter((item) => item?.status == "unsaved").map(({ text, by }) => ({ text, by })));

//         const obj = {
//             courses: updatedCourses,
//             interstedCourseType: selectedCourseType,
//             interstedSeminar: InterstedSeminarStatus,
//             leadSource: leadSource,
//             leadDiscount: discount,
//             discountUnit: "flat",
//             originalPrice: coursePrice,
//             refundAmount,
//             paidAmount: lastPaid,
//             history: localHistory,
//             totalDue: dueAmount,
//             followUpDate: followUpDate,
//             leadStatus: modelStatus,
//             nextEstimatedPaymentDate: estimatedPaymentDate,
//             note: notes.filter((item) => item?.status == "unsaved").map(({ text, by }) => ({ text, by })),
//             lastModifiedBy: user?.name,
//             orderNumber: parseInt(orderNumber),
//             orderCompletionDate,
//         };

//         console.log(obj);

//         if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
//             obj.enrolledAt = Date.now();
//         }
//         const cleanedObj = Object.fromEntries(
//             Object.entries(obj).filter(([_, v]) => {
//                 if (Array.isArray(v)) return v.length > 0;

//                 return v !== undefined && v !== null && v !== "";
//             }),
//         );
//         // 01813164814

//         if (followUpDate === "") cleanedObj.followUpDate = null;

//         // console.log(obj, "ojbeanedObj")

//         const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj);
//         console.log(res.data);
//         setSaving(false);
//         refetch();
//         setLastPaid();
//         setSelectedLead(null);
//     };

//     // 🔹 Replace single searchInput state with an array state

//     useEffect(() => {
//         if (selectedLead) {
//             setModelStatus(selectedLead.leadStatus || "Pending");
//             setInterstedSeminarStatus(selectedLead.interstedSeminar || "None");
//             setNotes(selectedLead?.note || []);

//             // 🔹 Load array of course names from selectedLead.courses
//             const courseNames = selectedLead?.courses?.map((c) => c.courseName).filter(Boolean) || [];
//             console.log(courseNames)
//             setSelectedCourseNames(courseNames);

//             setLeadSource(selectedLead.leadSource || "");
//             setError("");

//             setFollowUpDate(selectedLead?.followUpDate ? selectedLead.followUpDate.split("T")[0] : "");
//             setRefundAmount(selectedLead.refundAmount || 0);
//             setOrderNumber(selectedLead?.orderNumber || "");

//             // Read prices from primary course
//             const primaryCourse = selectedLead?.courses?.[0] || {};
//             setCoursePrice(primaryCourse.originalPrice || 0);
//             setDiscount(primaryCourse.leadDiscount || 0);
//             setDueAmount(selectedLead?.totalDue || primaryCourse.totalDue || 0);
//             setLastPaid(selectedLead?.totalPaid || primaryCourse.totalPaid || null);
//             setEstimatedPaymentDate(selectedLead?.nextEstimatedPaymentDate ? selectedLead.nextEstimatedPaymentDate.split("T")[0] : "");
//             setLocalHistory(primaryCourse.history || selectedLead.history || []);
//         }
//     }, [selectedLead]);

//     useEffect(() => {
//         setSelectedCourseType(selectedCourse?.type || "");
//     }, [selectedCourse]);

//     const handleAddNote = (e) => {
//         e.preventDefault();
//         setNotes([
//             ...notes,
//             {
//                 text: e.target.note?.value,
//                 status: "unsaved",
//                 by: user?.name,
//                 date: formateDate(Date.now()),
//             },
//         ]);
//         e.target.reset();
//     };

//     const handleDeleteUnsavedNote = (index) => {
//         setNotes((prev) => prev.filter((_, i) => i !== index));
//     };

//     const handleSearchSuggesionClick = (item) => {
//         setSearchInput(item.name);
//         setSelectedCourseId(item._id);
//         setIsDropdownOpen(false); // Close dropdown on select
//     };

//     function formatBDNumber(number) {
//         // Keep original input in case it's not BD
//         const original = number;

//         // Remove all non-digit characters
//         let digits = number.replace(/\D/g, "");

//         // Normalize Bangladeshi numbers
//         if (digits.startsWith("880")) {
//             digits = "0" + digits.slice(3);
//         } else if (digits.startsWith("88")) {
//             digits = "0" + digits.slice(2);
//         } else if (!digits.startsWith("0") && digits.length === 10) {
//             digits = "0" + digits;
//         }

//         // Check if it's a valid BD local number (11 digits, starts with 01)
//         if (digits.length === 11 && digits.startsWith("01")) {
//             return digits;
//         }

//         // Otherwise return original
//         return original;
//     }

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === "Escape") {
//                 setSelectedLead(null);
//                 return;
//             }
//         };

//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, []);

//     return (
//         selectedLead && (
//             <div className="fixed inset-0 !z-99 bg-black/40 flex items-center justify-center">
//                 <div
//                     className={`bg-base-100 w-full scale-90    rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number" ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl" : "md:grid-cols-3 lg:grid-cols-3 max-w-5xl"} gap-4 max-h-[90vh] overflow-y-visible`}
//                 >
//                     {/* Top bar with lead info */}
//                     <div className="sticky md:absolute ml-auto   top-3 right-3">
//                         <button onClick={() => setSelectedLead(null)} className="btn btn-sm ">
//                             ✕ Close
//                         </button>
//                     </div>

//                     {/*  Column 1: Lead Details */}
//                     <div className="space-y-6 max-h-[550px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  overflow-y-scroll">
//                         {/* SECTION: BASIC INFO */}
//                         <div className="">
//                             <h3 className="text-lg font-semibold mb-2">Lead Info</h3>
//                             <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Name</div>
//                                 <div className="font-medium">{selectedLead.name || "N/A"}</div>

//                                 <div className="text-white/50">Email</div>
//                                 <div className="font-medium flex justify-between items-center gap-2">
//                                     <span title={selectedLead.email} className="truncate max-w-[140px]">
//                                         {selectedLead.email || "N/A"}
//                                     </span>

//                                     {selectedLead.email && (
//                                         <button
//                                             onClick={() => {
//                                                 navigator.clipboard.writeText(selectedLead.email);
//                                                 setCopied(true);
//                                                 setTimeout(() => setCopied(false), 1500);
//                                             }}
//                                             className="text-blue-400 cursor-pointer hover:text-white text-xs flex items-center"
//                                             title="Copy Email"
//                                         >
//                                             {copied ? (
//                                                 <IoCheckmarkDoneSharp className="text-green-400 text-lg" />
//                                             ) : (
//                                                 <MdContentCopy className="text-blue-400 text-lg" />
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>

//                                 <div className="text-white/50">Phone</div>
//                                 <div className="font-medium">{selectedLead.phone || "N/A"}</div>

//                                 <div className="text-white/50">Address</div>
//                                 <div className="font-medium">{selectedLead.address || "N/A"}</div>

//                                 {/* 🔹 NEW FIELDS ADDED HERE */}
//                                 <div className="text-white/50">Entry By</div>
//                                 <div className="font-medium">{selectedLead.entryBy || "N/A"}</div>

//                                 <div className="text-white/50">Created By</div>
//                                 <div className="font-medium truncate max-w-[160px]" title={selectedLead.createdBy}>
//                                     {selectedLead.createdBy || "N/A"}
//                                 </div>

//                                 <div className="text-white/50">Call Count</div>
//                                 <div className="font-medium">{selectedLead.callCount ? `x${selectedLead.callCount}` : "0"}</div>
//                                 <div className="text-white/50 flex items-center">Lead Source</div>
//                                 <div className="flex w-full items-center justify-between font-medium">
//                                     {leadSource || "N/A"}

//                                     {leadSource !== (selectedLead?.leadSource || "") && (
//                                         <span className="ml-2 text-yellow-500 font-semibold text-xs">(Unsaved)</span>
//                                     )}

//                                     <div
//                                         className="cursor-pointer text-blue-400 hover:text-white ml-2"
//                                         onClick={(e) => setIsSourceMenuOpen(!isSourceMenuOpen)}
//                                     >
//                                         <FaEdit />
//                                     </div>

//                                     {isSourceMenuOpen && (
//                                         <>
//                                             {/* Invisible backdrop to close menu when clicking outside */}
//                                             <div className="fixed inset-0 z-9998 cursor-default" onClick={() => setIsSourceMenuOpen(false)}></div>

//                                             {/* The Menu List */}
//                                             <ul className="menu fixed left-90 top-50 p-2 shadow-xl bg-base-300 rounded-box  max-h-[300px] overflow-y-auto border border-gray-600 z-9999">
//                                                 {sourceOptions.map((source, idx) => (
//                                                     <li key={idx}>
//                                                         <button
//                                                             onClick={() => {
//                                                                 setLeadSource(source);
//                                                                 setIsSourceMenuOpen(false); // Close on select
//                                                             }}
//                                                             className={leadSource === source ? "bg-primary text-white" : ""}
//                                                         >
//                                                             {source}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* SECTION: COURSE INFO */}
//                         <div>
//                             <h4 className="text-sm font-bold text-white/80 mb-2">
//                                 {selectedLead?.leadStatus === "Enrolled" ? "Enrolled" : "Interested"} Course :{" "}
//                             </h4>

//                             {selectedLead?.courses && selectedLead.courses.length > 0 ? (
//                                 selectedLead.courses.map((c, i) => (
//                                     <div key={i} className="py-1 rounded-lg   text-xs">
//                                         <div className="font-semibold text-white">
//                                             {c.courseName} ({c.courseType || "Online"})
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-sm text-white/50 italic">No courses listed</div>
//                             )}
//                         </div>

//                         {/* SECTION: TIMELINE */}
//                         <div>
//                             <h4 className="text-xs font-bold text-white/80 mb-1">Timeline</h4>
//                             <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Lead Created</div>
//                                 <div className="font-medium">{formateDate(selectedLead.createdAt)}</div>
//                                 <div className="text-white/50">Assigned Date</div>
//                                 <div className="font-medium">{formateDate(selectedLead.assignDate)}</div>

//                                 <div className="text-white/50">First Contacted</div>
//                                 <div className="font-medium">{selectedLead.firstContacted ? formateDate(selectedLead.firstContacted) : "N/A"}</div>
//                                 <div className="text-white/50">Last Contacted</div>
//                                 <div className="font-medium">{selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}</div>

//                                 <div className="text-white/50">Follow-Up Date</div>
//                                 <div className="font-medium">{selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</div>

//                                 <div className="text-white/50">Enrollment Date</div>
//                                 <div className="font-medium">{selectedLead.enrolledAt ? formateDate(selectedLead.enrolledAt) : "N/A"}</div>
//                                 <div className="text-white/50">Next Payment Date</div>
//                                 <div className="font-medium">
//                                     {selectedLead.nextEstimatedPaymentDate ? formateDate(selectedLead.nextEstimatedPaymentDate) : "N/A"}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* ✅ MISSING SECTION: QUESTIONS */}
//                         {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
//                             <div>
//                                 <h4 className="text-xs font-bold text-white/80 mb-1">Questions</h4>

//                                 <div className="space-y-3 text-sm mt-1">
//                                     {Object.entries(selectedLead.questions).map(([q, a], i) => (
//                                         <div key={i} className="border-b border-white/10 pb-2">
//                                             <div className="text-white/50">{q}</div>
//                                             <div className="font-medium text-white mt-1">{a}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/*  Column 2: Notes */}
//                     <div className="space-y-2 flex flex-col text-sm">
//                         <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
//                         <div className="space-y-2 h-[250px]   overflow-y-auto">
//                             {notes?.map((note, i) => (
//                                 <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200 rounded relative">
//                                     {/* DELETE BUTTON ONLY FOR UNSAVED */}
//                                     {note.status === "unsaved" && (
//                                         <button
//                                             onClick={() => handleDeleteUnsavedNote(i)}
//                                             className="absolute cursor-pointer p-1 top-1 z-30 right-1  text-red-500 text-xs hover:text-red-300"
//                                             title="Delete this unsaved note"
//                                         >
//                                             ✕
//                                         </button>
//                                     )}

//                                     <p className={`text-xs  opacity-70 ${(note.date || note.createdAt || note.by) && "mb-2"}`}>
//                                         <span>{(note.date || note.createdAt) && formateDate(note.date || note.createdAt) + ` • ${note.by}`} </span>
//                                         {note?.status == "unsaved" && <span className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
//                                     </p>

//                                     <pre className="text-wrap">{note.text}</pre>
//                                 </div>
//                             ))}

//                             {notes?.length === 0 && <p className="text-xs text-center mt-20  text-base-content/60">No notes yet.</p>}
//                         </div>

//                         {/* Add new note input */}
//                         <form className="mt-auto" onSubmit={handleAddNote}>
//                             <textarea
//                                 name="note"
//                                 required
//                                 className="textarea resize-none focus:outline-none  focus:border-blue-600  mt-auto textarea-bordered w-full "
//                                 rows={3}
//                                 placeholder="Write a note..."
//                                 // Hook this to your handler
//                             ></textarea>
//                             <button className="btn w-full mt-2 bg-blue-600 btn-primary ">Add Note</button>
//                         </form>
//                     </div>

//                     {/* column 3 */}
//                     {(modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number") && (
//                         <div className="space-y-2  flex flex-col text-sm">
//                             <h3 className="text-lg font-semibold mb-2">Payment Details</h3>

//                             <CourseInput
//                                 courseInput={courseInput}
//                                 setCourseInput={setCourseInput}
//                                 selectedLead={selectedLead}
//                                 selectedCourseId={selectedCourseId}
//                                 setError={setError}
//                                 searchInput={searchInput}
//                                 setSearchInput={setSearchInput}
//                                 course={course}
//                                 setSelectedCourseType={setSelectedCourseType}
//                                 // course input inernal states lifted up
//                                 orderNumber={orderNumber}
//                                 setOrderNumber={setOrderNumber}
//                                 coursePrice={coursePrice}
//                                 setCoursePrice={setCoursePrice}
//                                 discount={discount}
//                                 setDiscount={setDiscount}
//                                 lastPaid={lastPaid}
//                                 setLastPaid={setLastPaid}
//                                 dueAmount={dueAmount}
//                                 setDueAmount={setDueAmount}
//                                 estimatedPaymentDate={estimatedPaymentDate}
//                                 setEstimatedPaymentDate={setEstimatedPaymentDate}
//                                 localHistory={localHistory}
//                                 setLocalHistory={setLocalHistory}
//                                 setOrderStatus={setOrderStatus}
//                                 setCustomerPhone={setCustomerPhone}
//                                 setOrderCompletionDate={setOrderCompletionDate}
//                             />
//                         </div>
//                     )}

//                     {/*  Column 4: Actions */}
//                     <div className="flex flex-col gap-2 ">
//                         <h3 className="text-lg font-semibold">Actions</h3>

//                         <div className="flex mt-2 gap-2 justify-center ">
//                             <div className="flex-1 max-w-[81px] border border-white">
//                                 <QR value={`tel:${formatBDNumber(selectedLead?.phone)}`} />
//                             </div>
//                             <div className="space-y-2 flex-2">
//                                 <a
//                                     // href={`tel:017429500624`}
//                                     href={`sip:${formatBDNumber(selectedLead?.phone)}@192.168.10.150`}
//                                     className=" flex gap-2 py-3! w-full bg-[#EB6609] border border-[#373737] btn  "
//                                 >
//                                     <Image alt="Linphone" src={"/logo/linphone.jpg"} className="w-auto h-5 " width={1000} height={1000} /> Call on
//                                     Linphone
//                                 </a>

//                                 <a
//                                     href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className=" flex gap-2 py-3! w-full bg-[#34DA51] border border-[#34DA51] btn "
//                                 >
//                                     <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5 " width={1000} height={1000} /> Call on Whatsapp
//                                 </a>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown   w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Lead Status ({modelStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed!    menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {statusOptions
//                                         .filter((item) => item != "All" && item != "Contacted")
//                                         .map((s) => (
//                                             <li key={s}>
//                                                 <button
//                                                     onClick={() => {
//                                                         setModelStatus(s);
//                                                         document.activeElement.blur();
//                                                     }}
//                                                     className={`capitalize ${user?.role == "user" && s == "Refunded" && "hidden"}`}
//                                                 >
//                                                     {s}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown   w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Seminar Status ({InterstedSeminarStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed!    menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {["Joined", "Online", "Offline", "None"].map((s) => (
//                                         <li key={s}>
//                                             <button
//                                                 onClick={() => {
//                                                     setInterstedSeminarStatus(s);
//                                                     document.activeElement.blur();
//                                                 }}
//                                                 className="capitalize"
//                                             >
//                                                 {s}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* <div className="mt-2 relative">
//                           <input
//                               type="text"
//                               disabled={user?.role == "user" && selectedLead.interstedCourse && selectedLead.leadStatus == "Enrolled"}
//                               value={searchInput}
//                               onChange={handleSearch}
//                               placeholder="Course Name"
//                               className="input input-bordered w-full  focus:outline-0 focus:border-blue-600"
//                           />

//                           <span className="absolute border-gray-600 bg-gray-800 text-xs right-5 border p-1 px-2 rounded-full -top-2">{selectedCourseType}</span>

//                           {searchSuggesion?.length > 0 && <ul className="bg-base-100 fixed !z-9999 shadow-md mt-1 rounded-box border border-base-300">
//                               {
//                                   searchSuggesion.map(item => <li
//                                       onClick={() => handleSearchSuggesionClick(item)}
//                                       className="px-4 py-2 flex justify-between w-[290px] bg-gray-700 cursor-pointer hover:bg-base-200">
//                                       <span>{item.name} ({item.type})</span>
//                                       <span>৳ {item.price}</span>
//                                   </li>)
//                               }
//                           </ul>
//                           }
//                       </div> */}

//                         {/* <div className="mt-2 relative">
//                             <input
//                                 type="text"
//                                 disabled={user?.role === "user" && selectedLead.interstedCourse && selectedLead.leadStatus === "Enrolled"}
//                                 value={searchInput}
//                                 onFocus={() => setIsDropdownOpen(true)}
//                                 onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)} // Delay to allow click events on suggestions
//                                 onChange={(e) => {
//                                     setSearchInput(e.target.value);
//                                     setSelectedCourseId(null); // Clear selected ID if user changes the text
//                                     setIsDropdownOpen(true);
//                                 }}
//                                 placeholder="Course Name"
//                                 className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
//                             />

//                             {selectedCourseType && (
//                                 <span className="absolute border-gray-600 bg-gray-800 text-xs right-5 border p-1 px-2 rounded-full -top-2">
//                                     {selectedCourseType}
//                                 </span>
//                             )}

//                             {searchSuggestions.length > 0 && (
//                                 <ul className="bg-base-100 fixed !z-9999 shadow-md mt-1 rounded-box border border-base-300">
//                                     {searchSuggestions.map((item) => (
//                                         <li
//                                             key={item._id}
//                                             onClick={() => handleSearchSuggesionClick(item)}
//                                             className="px-4 py-2 flex justify-between w-[290px] bg-gray-700 cursor-pointer hover:bg-base-200"
//                                         >
//                                             <span>
//                                                 {item.name} ({item.type})
//                                             </span>
//                                             <span>৳ {item.price}</span>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             )}
//                         </div> */}

//                         <div className="mt-2 relative">
//                             <label className="text-xs text-white/60 mb-1 block">Interested Courses</label>
//                             <MultiSelect
//                                 value={selectedCourseNames}
//                                 onChange={(e) => setSelectedCourseNames(e.value)}
//                                 options={course?.map((c) => ({ label: `${c.name}`, value: c.name })) || []}
//                                 optionLabel="label"
//                                 optionValue="value"
//                                 placeholder="Select Courses"
//                                 filter
//                                 display="chip"
//                                 className="w-full text-xs"
//                                 disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
//                                 pt={{
//                                     root: { className: "bg-gray-800 text-white border-gray-600 w-full" },
//                                 }}
//                             />
//                         </div>

//                         {modelStatus == "Refunded" ? (
//                             <div className=" mt-auto gap-3">
//                                 <label className="block mb-1 text-white/80 text-sm">Refunded Amount</label>
//                                 <input
//                                     type="number"
//                                     value={refundAmount}
//                                     onChange={(e) => setRefundAmount(e.target.value)}
//                                     placeholder="Enter Refunded Amount"
//                                     className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
//                                 />
//                             </div>
//                         ) : (
//                             <div className="flex flex-col mt-auto gap-3">
//                                 <label className="text-sm ">Next Follow-Up Date</label>

//                                 <input
//                                     type="date"
//                                     onClick={(e) => e.target.showPicker && e.target.showPicker()}
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
//                                     value={followUpDate}
//                                     onChange={(e) => setFollowUpDate(e.target.value)}
//                                 />
//                             </div>
//                         )}

//                         <p className="text-red-500 text-sm font-semibold">{error}</p>

//                         <button
//                             onClick={handleSaveChanges}
//                             title={selectedLead?.isLocked ? "Lead is Locked . Contact Admin to modify the leads " : ""}
//                             disabled={saving || selectedLead?.isLocked}
//                             className="btn w-full   btn-primary bg-blue-600  text-white hover:bg-[#333] border border-gray-600 "
//                         >
//                             {saving ? "Saving..." : " Save Changes"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )
//     );
// };

// export default LeadModals;

// "use client";

// import axiosPublic from "@/api/axios";
// import { AuthContext } from "@/context/AuthContext";
// import useFetch from "@/hooks/useFetch";
// import CourseInput from "@/utils/CourseInput";
// import { formateDate } from "@/utils/date";
// import Image from "next/image";
// import { useContext, useEffect, useState } from "react";
// import QR from "./QR";
// import { FaCopy, FaEdit, FaPlus } from "react-icons/fa";
// import { IoCheckmarkDoneSharp, IoCopyOutline } from "react-icons/io5";
// import { MdContentCopy } from "react-icons/md";
// import { MultiSelect } from "primereact/multiselect";

// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import HistoryRow from "./HistoryRow";

// export function formatForWhatsApp(number) {
//     if (!number) return "";

//     const original = number;
//     let digits = number.replace(/\D/g, ""); // remove non-digits

//     // --- Handle Bangladeshi numbers ---
//     if (
//         digits.startsWith("8801") || // +880 format
//         digits.startsWith("01") || // local format
//         (digits.length === 10 && digits.startsWith("1")) // missing 0
//     ) {
//         if (digits.startsWith("8801")) {
//         } else if (digits.startsWith("01")) {
//             digits = "880" + digits.slice(1);
//         } else if (digits.startsWith("1")) {
//             digits = "880" + digits;
//         }

//         if (digits.length === 13) return digits;
//     }

//     // --- Handle other countries ---
//     if (original.trim().startsWith("+")) {
//         return digits; // keep international code, remove '+'
//     }

//     return digits || original;
// }

// // 🔹 Helper to guarantee courseType is ALWAYS a single String for Mongoose
// const getCourseTypeString = (typeVal) => {
//     if (Array.isArray(typeVal)) {
//         return typeVal[0] || "Online";
//     }
//     if (typeof typeVal === "string" && typeVal.trim()) {
//         return typeVal;
//     }
//     return "Online";
// };

// const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {
//     const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending");
//     const [InterstedSeminarStatus, setInterstedSeminarStatus] = useState(selectedLead?.interstedSeminar || "None");

//     const [followUpDate, setFollowUpDate] = useState("");
//     const [refundAmount, setRefundAmount] = useState(0);

//     const [courseInput, setCourseInput] = useState({});

//     /* ====================================================================
//      * UNUSED SINGLE-COURSE STATES (COMMENTED OUT)
//      * ==================================================================== */
//     /*
//     const [searchInput, setSearchInput] = useState("");
//     const [selectedCourseId, setSelectedCourseId] = useState(null);
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const selectedCourse = course.find((item) => item._id === selectedCourseId);
//     const [selectedCourseType, setSelectedCourseType] = useState(selectedCourse?.type || "");
//     const searchSuggestions = searchInput?.trim() && isDropdownOpen ? course.filter((item) => item.name.toLowerCase().includes(searchInput.toLowerCase())) : [];
//     */

//     // 🔹 LINKED COURSE STATE: [{ courseName, courseType }]
//     const [selectedCourses, setSelectedCourses] = useState([]);

//     const [notes, setNotes] = useState(selectedLead?.note || []);

//     const [leadSource, setLeadSource] = useState(selectedLead?.leadSource || "");
//     const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);

//     const [copied, setCopied] = useState(false);

//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [orderCompletionDate, setOrderCompletionDate] = useState(null);

//     const { user } = useContext(AuthContext);

//     // course input internal state
//     const [orderNumber, setOrderNumber] = useState("");
//     const [orderStatus, setOrderStatus] = useState("");
//     const [customerPhone, setCustomerPhone] = useState("");
//     const [coursePrice, setCoursePrice] = useState();
//     const [discount, setDiscount] = useState();
//     const [lastPaid, setLastPaid] = useState();
//     const [dueAmount, setDueAmount] = useState();
//     const [estimatedPaymentDate, setEstimatedPaymentDate] = useState(null);
//     const [localHistory, setLocalHistory] = useState([]);

//     const sourceOptions = [
//         "Counseling Form",
//         "FB Page(1st)",
//         "FB Page(2nd)",
//         "Tiktok",
//         "Instagram",
//         "Youtube",
//         "Others Social Media",
//         "FB Paid Campaign",
//         "Google Paid Campaign",
//         "Onhold Order",
//         "Office Visit",
//         "Seminar",
//         "Outdoor Event",
//         "Free Course",
//         "Associate Refer",
//         "WhatsApp",
//         "IMO",
//         "Robi58",
//         "Banglalink58",
//         "GP39",
//         "3CX Incoming",
//     ];

//     // 🔹 Handlers for Multi-Course Selection
//     const handleMultiSelectChange = (selectedNames) => {
//         const updated = selectedNames.map((name) => {
//             const existing = selectedCourses.find((c) => c.courseName === name);
//             const matchedCourse = course?.find((c) => c.name === name);
//             const resolvedType = getCourseTypeString(matchedCourse?.type || matchedCourse?.allowedTypes);

//             return existing || { courseName: name, courseType: resolvedType };
//         });

//         setSelectedCourses(updated);
//     };

//     const handleCourseTypeChange = (courseName, newType) => {
//         setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, courseType: getCourseTypeString(newType) } : c)));
//     };

//     const handleSaveChanges = async () => {
//         console.log(user.role);

//         if (!selectedCourses || selectedCourses.length === 0) {
//             setSaving(false);
//             return setError("Please select at least one course");
//         }

//         if (orderNumber) {
//             if (error) return;

//             if (orderStatus === "on-hold") {
//                 return setError("On Hold Orders can't be marked as Enrolled ");
//             }

//             if (
//                 formatForWhatsApp(customerPhone) !== formatForWhatsApp(selectedLead?.phone) &&
//                 modelStatus !== "Enrolled with Other Number" &&
//                 user?.role == "user"
//             ) {
//                 return setError("The order number must match the phone number associated with this lead ");
//             } else {
//                 setError("");
//             }
//         }

//         // 🔹 Construct updated courses payload with safe string courseTypes
//         const updatedCoursesPayload = selectedCourses.map((item) => {
//             const matchedCourse = course?.find((c) => c.name === item.courseName);
//             const existingCourse = selectedLead?.courses?.find((c) => c.courseName === item.courseName);

//             const courseTypeStr = getCourseTypeString(item.courseType || matchedCourse?.type);

//             return existingCourse
//                 ? { ...existingCourse, courseType: courseTypeStr }
//                 : {
//                       courseName: item.courseName,
//                       courseType: courseTypeStr,
//                       originalPrice: Number(matchedCourse?.price || matchedCourse?.regularPrice || 0),
//                       leadDiscount: 0,
//                       discountUnit: "flat",
//                       totalPaid: 0,
//                       totalDue: Number(matchedCourse?.price || matchedCourse?.regularPrice || 0),
//                       history: [],
//                   };
//         });

//         setError("");

//         const obj = {
//             courses: updatedCoursesPayload,
//             interstedSeminar: InterstedSeminarStatus,
//             leadSource: leadSource,
//             leadDiscount: discount,
//             discountUnit: "flat",
//             originalPrice: coursePrice,
//             refundAmount,
//             paidAmount: lastPaid,
//             history: localHistory,
//             totalDue: dueAmount,
//             followUpDate: followUpDate,
//             leadStatus: modelStatus,
//             nextEstimatedPaymentDate: estimatedPaymentDate,
//             note: notes.filter((item) => item?.status == "unsaved").map(({ text, by }) => ({ text, by })),
//             lastModifiedBy: user?.name,
//             orderNumber: parseInt(orderNumber),
//             orderCompletionDate,
//         };

//         if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
//             obj.enrolledAt = Date.now();
//         }

//         const cleanedObj = Object.fromEntries(
//             Object.entries(obj).filter(([_, v]) => {
//                 if (Array.isArray(v)) return v.length > 0;
//                 return v !== undefined && v !== null && v !== "";
//             }),
//         );

//         if (followUpDate === "") cleanedObj.followUpDate = null;

//         const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj);
//         console.log(res.data);
//         setSaving(false);
//         refetch();
//         setLastPaid();
//         setSelectedLead(null);
//     };

//     useEffect(() => {
//         if (selectedLead) {
//             setModelStatus(selectedLead.leadStatus || "Pending");
//             setInterstedSeminarStatus(selectedLead.interstedSeminar || "None");
//             setNotes(selectedLead?.note || []);

//             // 🔹 Populate selectedCourses array from selectedLead.courses
//             const initialCourses =
//                 selectedLead?.courses?.map((c) => ({
//                     courseName: c.courseName,
//                     courseType: getCourseTypeString(c.courseType),
//                 })) || [];

//             setSelectedCourses(initialCourses);

//             setLeadSource(selectedLead.leadSource || "");
//             setError("");

//             setFollowUpDate(selectedLead?.followUpDate ? selectedLead.followUpDate.split("T")[0] : "");
//             setRefundAmount(selectedLead.refundAmount || 0);
//             setOrderNumber(selectedLead?.orderNumber || "");

//             // Primary course financials
//             const primaryCourse = selectedLead?.courses?.[0] || {};
//             setCoursePrice(primaryCourse.originalPrice || selectedLead?.originalPrice || 0);
//             setDiscount(primaryCourse.leadDiscount || selectedLead?.leadDiscount || 0);
//             setDueAmount(selectedLead?.totalDue || primaryCourse.totalDue || 0);
//             setLastPaid(selectedLead?.totalPaid || primaryCourse.totalPaid || null);
//             setEstimatedPaymentDate(selectedLead?.nextEstimatedPaymentDate ? selectedLead.nextEstimatedPaymentDate.split("T")[0] : "");
//             setLocalHistory(primaryCourse.history || selectedLead.history || []);
//         }
//     }, [selectedLead]);

//     const handleAddNote = (e) => {
//         e.preventDefault();
//         setNotes([
//             ...notes,
//             {
//                 text: e.target.note?.value,
//                 status: "unsaved",
//                 by: user?.name,
//                 date: formateDate(Date.now()),
//             },
//         ]);
//         e.target.reset();
//     };

//     const handleDeleteUnsavedNote = (index) => {
//         setNotes((prev) => prev.filter((_, i) => i !== index));
//     };

//     /* ====================================================================
//      * UNUSED SINGLE-COURSE SEARCH HANDLER (COMMENTED OUT)
//      * ==================================================================== */
//     /*
//     const handleSearchSuggesionClick = (item) => {
//         setSearchInput(item.name);
//         setSelectedCourseId(item._id);
//         setIsDropdownOpen(false);
//     };
//     */

//     function formatBDNumber(number) {
//         const original = number;
//         let digits = number.replace(/\D/g, "");

//         if (digits.startsWith("880")) {
//             digits = "0" + digits.slice(3);
//         } else if (digits.startsWith("88")) {
//             digits = "0" + digits.slice(2);
//         } else if (!digits.startsWith("0") && digits.length === 10) {
//             digits = "0" + digits;
//         }

//         if (digits.length === 11 && digits.startsWith("01")) {
//             return digits;
//         }

//         return original;
//     }

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === "Escape") {
//                 setSelectedLead(null);
//                 return;
//             }
//         };

//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, []);

//     return (
//         selectedLead && (
//             <div className="fixed inset-0 !z-99 bg-black/40 flex items-center justify-center">
//                 <div
//                     className={`bg-base-100 w-full scale-90 rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${
//                         modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number"
//                             ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
//                             : "md:grid-cols-3 lg:grid-cols-3 max-w-5xl"
//                     } gap-4 max-h-[90vh] overflow-y-visible`}
//                 >
//                     {/* Top bar with lead info */}
//                     <div className="sticky md:absolute ml-auto top-3 right-3">
//                         <button onClick={() => setSelectedLead(null)} className="btn btn-sm">
//                             ✕ Close
//                         </button>
//                     </div>

//                     <div className="space-y-6 max-h-[550px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  overflow-y-scroll">
//                         {/* SECTION: BASIC INFO */}
//                         <div className="">
//                             <h3 className="text-lg font-semibold mb-2">Lead Info</h3>
//                             <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Name</div>
//                                 <div className="font-medium">{selectedLead.name || "N/A"}</div>
//                                 <div className="text-white/50">Email</div>
//                                 <div className="font-medium flex justify-between items-center gap-2">
//                                     <span title={selectedLead.email} className="truncate max-w-[140px]">
//                                         {selectedLead.email || "N/A"}
//                                     </span>
//                                     {selectedLead.email && (
//                                         <button
//                                             onClick={() => {
//                                                 navigator.clipboard.writeText(selectedLead.email);
//                                                 setCopied(true);
//                                                 setTimeout(() => setCopied(false), 1500);
//                                             }}
//                                             className="text-blue-400 cursor-pointer hover:text-white text-xs flex items-center"
//                                             title="Copy Email"
//                                         >
//                                             {copied ? (
//                                                 <IoCheckmarkDoneSharp className="text-green-400 text-lg" />
//                                             ) : (
//                                                 <MdContentCopy className="text-blue-400 text-lg" />
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                                 <div className="text-white/50">Phone</div>
//                                 <div className="font-medium">{selectedLead.phone || "N/A"}</div>
//                                 <div className="text-white/50">Address</div>
//                                 <div className="font-medium">{selectedLead.address || "N/A"}</div>
//                                 {/* 🔹 NEW FIELDS ADDED HERE */}
//                                 <div className="text-white/50">Entry By</div>
//                                 <div className="font-medium">{selectedLead.entryBy || "N/A"}</div>
//                                 <div className="text-white/50">Created By</div>
//                                 <div className="font-medium truncate max-w-[160px]" title={selectedLead.createdBy}>
//                                     {selectedLead.createdBy || "N/A"}
//                                 </div>
//                                 <div className="text-white/50">Call Count</div>
//                                 <div className="font-medium">{selectedLead.callCount ? `x${selectedLead.callCount}` : "0"}</div>
//                                 <div className="text-white/50 flex items-center">Lead Source</div>
//                                 <div className="flex w-full items-center justify-between font-medium">
//                                     {leadSource || "N/A"}
//                                     {leadSource !== (selectedLead?.leadSource || "") && (
//                                         <span className="ml-2 text-yellow-500 font-semibold text-xs">(Unsaved)</span>
//                                     )}
//                                     <div
//                                         className="cursor-pointer text-blue-400 hover:text-white ml-2"
//                                         onClick={(e) => setIsSourceMenuOpen(!isSourceMenuOpen)}
//                                     >
//                                         <FaEdit />
//                                     </div>
//                                     {isSourceMenuOpen && (
//                                         <>
//                                             {/* Invisible backdrop to close menu when clicking outside */}
//                                             <div className="fixed inset-0 z-9998 cursor-default" onClick={() => setIsSourceMenuOpen(false)}></div>
//                                             {/* The Menu List */}
//                                             <ul className="menu fixed left-90 top-50 p-2 shadow-xl bg-base-300 rounded-box  max-h-[300px] overflow-y-auto border border-gray-600 z-9999">
//                                                 {sourceOptions.map((source, idx) => (
//                                                     <li key={idx}>
//                                                         <button
//                                                             onClick={() => {
//                                                                 setLeadSource(source);
//                                                                 setIsSourceMenuOpen(false); // Close on select
//                                                             }}
//                                                             className={leadSource === source ? "bg-primary text-white" : ""}
//                                                         >
//                                                             {source}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                         {/* SECTION: COURSE INFO */}
//                         <div>
//                             <h4 className="text-sm font-bold text-white/80 mb-2">
//                                 {selectedLead?.leadStatus === "Enrolled" ? "Enrolled" : "Interested"} Course :{" "}
//                             </h4>
//                             {selectedLead?.courses && selectedLead.courses.length > 0 ? (
//                                 selectedLead.courses.map((c, i) => (
//                                     <div key={i} className="py-1 rounded-lg   text-xs">
//                                         <div className="font-semibold text-white">
//                                             {c.courseName} ({c.courseType || "Online"})
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-sm text-white/50 italic">No courses listed</div>
//                             )}
//                         </div>
//                         {/* SECTION: TIMELINE */}
//                         <div>
//                             <h4 className="text-xs font-bold text-white/80 mb-1">Timeline</h4>
//                             <div className="grid grid-cols-[140px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Lead Created</div>
//                                 <div className="font-medium">{formateDate(selectedLead.createdAt)}</div>
//                                 <div className="text-white/50">Assigned Date</div>
//                                 <div className="font-medium">{formateDate(selectedLead.assignDate)}</div>
//                                 <div className="text-white/50">First Contacted</div>
//                                 <div className="font-medium">{selectedLead.firstContacted ? formateDate(selectedLead.firstContacted) : "N/A"}</div>
//                                 <div className="text-white/50">Last Contacted</div>
//                                 <div className="font-medium">{selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}</div>
//                                 <div className="text-white/50">Follow-Up Date</div>
//                                 <div className="font-medium">{selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</div>
//                                 <div className="text-white/50">Enrollment Date</div>
//                                 <div className="font-medium">{selectedLead.enrolledAt ? formateDate(selectedLead.enrolledAt) : "N/A"}</div>
//                                 <div className="text-white/50">Next Payment Date</div>
//                                 <div className="font-medium">
//                                     {selectedLead.nextEstimatedPaymentDate ? formateDate(selectedLead.nextEstimatedPaymentDate) : "N/A"}
//                                 </div>
//                             </div>
//                         </div>
//                         {/* ✅ MISSING SECTION: QUESTIONS */}
//                         {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
//                             <div>
//                                 <h4 className="text-xs font-bold text-white/80 mb-1">Questions</h4>
//                                 <div className="space-y-3 text-sm mt-1">
//                                     {Object.entries(selectedLead.questions).map(([q, a], i) => (
//                                         <div key={i} className="border-b border-white/10 pb-2">
//                                             <div className="text-white/50">{q}</div>
//                                             <div className="font-medium text-white mt-1">{a}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     {/*  Column 2: Notes */}
//                     <div className="space-y-2 flex flex-col text-sm">
//                         <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
//                         <div className="space-y-2 h-[250px]   overflow-y-auto">
//                             {notes?.map((note, i) => (
//                                 <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200 rounded relative">
//                                     {/* DELETE BUTTON ONLY FOR UNSAVED */}
//                                     {note.status === "unsaved" && (
//                                         <button
//                                             onClick={() => handleDeleteUnsavedNote(i)}
//                                             className="absolute cursor-pointer p-1 top-1 z-30 right-1  text-red-500 text-xs hover:text-red-300"
//                                             title="Delete this unsaved note"
//                                         >
//                                             ✕
//                                         </button>
//                                     )}
//                                     <p className={`text-xs  opacity-70 ${(note.date || note.createdAt || note.by) && "mb-2"}`}>
//                                         <span>{(note.date || note.createdAt) && formateDate(note.date || note.createdAt) + ` • ${note.by}`} </span>
//                                         {note?.status == "unsaved" && <span className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
//                                     </p>
//                                     <pre className="text-wrap">{note.text}</pre>
//                                 </div>
//                             ))}
//                             {notes?.length === 0 && <p className="text-xs text-center mt-20  text-base-content/60">No notes yet.</p>}
//                         </div>
//                         {/* Add new note input */}
//                         <form className="mt-auto" onSubmit={handleAddNote}>
//                             <textarea
//                                 name="note"
//                                 required
//                                 className="textarea resize-none focus:outline-none  focus:border-blue-600  mt-auto textarea-bordered w-full "
//                                 rows={3}
//                                 placeholder="Write a note..."
//                                 // Hook this to your handler
//                             ></textarea>
//                             <button className="btn w-full mt-2 bg-blue-600 btn-primary ">Add Note</button>
//                         </form>
//                     </div>

//                     {/* Column 3: Payment Details */}
//                     {(modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number") && (
//                         // <div className="space-y-2 flex flex-col text-sm">
//                         //     <h3 className="text-lg font-semibold mb-2">Payment Details</h3>

//                         //     <CourseInput
//                         //         courseInput={courseInput}
//                         //         setCourseInput={setCourseInput}
//                         //         selectedLead={selectedLead}
//                         //         setError={setError}
//                         //         course={course}
//                         //         orderNumber={orderNumber}
//                         //         setOrderNumber={setOrderNumber}
//                         //         coursePrice={coursePrice}
//                         //         setCoursePrice={setCoursePrice}
//                         //         discount={discount}
//                         //         setDiscount={setDiscount}
//                         //         lastPaid={lastPaid}
//                         //         setLastPaid={setLastPaid}
//                         //         dueAmount={dueAmount}
//                         //         setDueAmount={setDueAmount}
//                         //         estimatedPaymentDate={estimatedPaymentDate}
//                         //         setEstimatedPaymentDate={setEstimatedPaymentDate}
//                         //         localHistory={localHistory}
//                         //         setLocalHistory={setLocalHistory}
//                         //         setOrderStatus={setOrderStatus}
//                         //         setCustomerPhone={setCustomerPhone}
//                         //         setOrderCompletionDate={setOrderCompletionDate}
//                         //     />
//                         // </div>

//                          <div>
//                           {/* Column 3: Payment Details */}
//     <div className="space-y-3 flex flex-col text-sm max-h-[550px] overflow-y-auto pr-1">
//         <h3 className="text-lg font-semibold">Payment Details</h3>

//         {/* Order Number Input */}
//         <div>
//             <label className="text-xs text-white/60 mb-1 block">Order Number</label>
//             <input
//                 type="number"
//                 value={orderNumber || ""}
//                 onChange={(e) => setOrderNumber(e.target.value)}
//                 placeholder="Enter Order Number"
//                 className="input input-bordered w-full disabled:bg-transparent focus:outline-0 focus:border-blue-600 disabled:border disabled:border-gray-600"
//             />
//         </div>

//         {/* 🔹 Sleek Course Cards (Matching Column 4 Style) */}
//         <div className="space-y-1.5 mt-2">
//             <label className="text-xs font-bold text-white/80 block">Enrolled Courses Breakdown</label>
//             <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
//                 {selectedCourses && selectedCourses.length > 0 ? (
//                     selectedCourses.map((c, i) => (
//                         <div key={i} className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs space-y-2">
//                             {/* Header Line: Course Name & Badge */}
//                             <div className="flex items-center justify-between gap-2">
//                                 <span className="font-medium text-white truncate max-w-[170px]" title={c.courseName}>
//                                     {c.courseName}
//                                 </span>
//                                 <span className={`px-1.5 py-0. text-[10px] rounded font-medium border ${
//                                     c.courseType === "Offline"
//                                         ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
//                                         : "bg-blue-500/20 text-blue-300 border-blue-500/30"
//                                 }`}>
//                                     {c.courseType || "Online"}
//                                 </span>
//                             </div>

//                             {/* Read-Only Stats Row (Price, Paid, Due) */}
//                             <div className="flex justify-between text-xs text-gray-400  pt-2.5 border-t border-gray-700/60">
//                                 <span>Price: <strong className="text-white">৳{c.originalPrice || 0}</strong></span>
//                                 <span>Paid: <strong className="text-green-400">৳{(c.totalPaid || 0) + (c.newPayment || 0)}</strong></span>
//                                 <span>Due: <strong className={c.totalDue > 0 ? "text-red-400" : "text-gray-400"}>৳{c.totalDue || 0}</strong></span>
//                             </div>

//                             {/* 🔹 ONLY FOR OFFLINE COURSES: Single Input for Last Paid Amount */}
//                             {c.courseType === "Offline" && (
//                                 <div className="pt-1.5 border-t border-gray-700/60 flex items-center justify-between gap-2">
//                                     <label className="text-[11px] text-yellow-400 font-medium whitespace-nowrap">+ Add Payment (৳):</label>
//                                     <input
//                                         type="number"
//                                         value={c.newPayment || ""}
//                                         onChange={(e) => handleCourseFinancialChange(c.courseName, "newPayment", e.target.value)}
//                                         placeholder="0"
//                                         className="input input-xs bg-gray-900 border-yellow-500/50 text-yellow-300 font-bold w-24 text-right focus:outline-none focus:border-yellow-500 rounded"
//                                     />
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-xs text-white/50 italic p-2 bg-gray-800 rounded border border-gray-700 text-center">
//                         No courses selected
//                     </div>
//                 )}
//             </div>
//         </div>

//         {/* Overall Order Summary */}
//         <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-lg space-y-1 text-sm">
//             <div className="flex justify-between text-gray-400">
//                 <span>Overall Total Paid:</span>
//                 <span className="font-bold text-green-400">
//                     ৳{selectedCourses.reduce((sum, c) => sum + (c.totalPaid || 0) + (c.newPayment || 0), 0)}
//                 </span>
//             </div>
//             <div className="flex justify-between text-gray-400">
//                 <span>Overall Total Due:</span>
//                 <span className="font-bold text-red-400">
//                     ৳{selectedCourses.reduce((sum, c) => sum + (c.totalDue || 0), 0)}
//                 </span>
//             </div>
//         </div>

//         {/* Next Payment Date Input */}
//         <div>
//             <label className="text-xs text-white/60 mb-1 block">Next Estimate Payment Date</label>
//             <input
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
//                 value={estimatedPaymentDate || ""}
//                 onChange={(e) => setEstimatedPaymentDate(e.target.value)}
//             />
//         </div>

//          <div>
//         <h2 className="text-lg font-semibold ">History</h2>
//         <div className="max-h-28 overflow-y-auto pr-2">
//           {localHistory.length > 0 ? (
//             localHistory.map((item, index) => (
//               <HistoryRow
//                 key={index}
//                 item={item}
//                 originalItem={selectedLead.history[index]}
//                 onUpdate={(newDate) => handleHistoryUpdate(index, newDate)}
//               />
//             ))
//           ) : (
//             <p className="mt-2 text-white/50 text-sm">No History Available</p>
//           )}
//         </div>
//       </div>
//     </div>

//                          </div>
//                     )}

//                     {/* Column 4: Actions */}
//                     <div className="flex flex-col gap-2">
//                         <h3 className="text-lg font-semibold">Actions</h3>

//                         <div className="flex mt-2 gap-2 justify-center">
//                             <div className="flex-1 max-w-[81px] border border-white">
//                                 <QR value={`tel:${formatBDNumber(selectedLead?.phone)}`} />
//                             </div>
//                             <div className="space-y-2 flex-2">
//                                 <a
//                                     href={`sip:${formatBDNumber(selectedLead?.phone)}@192.168.10.150`}
//                                     className="flex gap-2 py-3! w-full bg-[#EB6609] border border-[#373737] btn"
//                                 >
//                                     <Image alt="Linphone" src={"/logo/linphone.jpg"} className="w-auto h-5" width={1000} height={1000} /> Call on
//                                     Linphone
//                                 </a>

//                                 <a
//                                     href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex gap-2 py-3! w-full bg-[#34DA51] border border-[#34DA51] btn"
//                                 >
//                                     <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5" width={1000} height={1000} /> Call on Whatsapp
//                                 </a>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Lead Status ({modelStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {statusOptions
//                                         ?.filter((item) => item != "All" && item != "Contacted")
//                                         .map((s) => (
//                                             <li key={s}>
//                                                 <button
//                                                     onClick={() => {
//                                                         setModelStatus(s);
//                                                         document.activeElement.blur();
//                                                     }}
//                                                     className={`capitalize ${user?.role == "user" && s == "Refunded" && "hidden"}`}
//                                                 >
//                                                     {s}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Seminar Status ({InterstedSeminarStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {["Joined", "Online", "Offline", "None"].map((s) => (
//                                         <li key={s}>
//                                             <button
//                                                 onClick={() => {
//                                                     setInterstedSeminarStatus(s);
//                                                     document.activeElement.blur();
//                                                 }}
//                                                 className="capitalize"
//                                             >
//                                                 {s}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* 🔹 Multi-Course Selection + Inline Type Selector */}
//                         {/* 🔹 Multi-Course Selection + Inline Type Selector */}
//                         <div className="mt-2 space-y-2">
//                             <div className="flex items-center justify-between gap-2">
//                                 <label className="text-xs text-white/60">Interested Courses</label>

//                                 {/* Custom "+" trigger — real MultiSelect is stacked invisibly on top */}
//                                 <div className="relative ">
//                                     <button type="button" tabIndex={-1} className=" text-white flex gap-2 items-center  text-xs pointer-events-none">
//                                         Add Course <FaPlus />
//                                     </button>

//                                     <MultiSelect
//                                         value={selectedCourses.map((c) => c.courseName)}
//                                         onChange={(e) => handleMultiSelectChange(e.value)}
//                                         options={course?.map((c) => ({ label: c.name, value: c.name })) || []}
//                                         optionLabel="label"
//                                         optionValue="value"
//                                         filter
//                                         display="chip"
//                                         disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
//                                         className="absolute inset-0 opacity-0 cursor-pointer"
//                                         panelClassName="text-xs"
//                                     />
//                                 </div>
//                             </div>

//                             {/* 🔹 List of Selected Course Cards with Inline Type Selector (unchanged) */}
//                             <div className="space-y-1.5 max-h-[13 0px] overflow-y-auto pr-1">
//                                 {selectedCourses.map((c, idx) => (
//                                     <div
//                                         key={idx}
//                                         className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded text-xs gap-2"
//                                     >
//                                         <span className="font-medium flex-3 text-white truncate max-w-[170px]" title={c.courseName}>
//                                             {c.courseName}
//                                         </span>
//                                         <div className="flex-2 select-xs bg-gray-900  text-white rounded px-2">
//                                             <select
//                                                 value={getCourseTypeString(c.courseType)}
//                                                 onChange={(e) => handleCourseTypeChange(c.courseName, e.target.value)}
//                                                 disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
//                                                 className="select bg-transparent border-0 focus:outline-none"
//                                             >
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Online">
//                                                     Online
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Offline">
//                                                     Offline
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Video Course">
//                                                     Video
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Download Course">
//                                                     Download
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Free course">
//                                                     Free
//                                                 </option>
//                                             </select>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {modelStatus == "Refunded" ? (
//                             <div className="mt-auto gap-3">
//                                 <label className="block mb-1 text-white/80 text-sm">Refunded Amount</label>
//                                 <input
//                                     type="number"
//                                     value={refundAmount}
//                                     onChange={(e) => setRefundAmount(e.target.value)}
//                                     placeholder="Enter Refunded Amount"
//                                     className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
//                                 />
//                             </div>
//                         ) : (
//                             <div className="flex flex-col mt-3 gap-3">
//                                 <label className="text-sm">Next Follow-Up Date</label>
//                                 <input
//                                     type="date"
//                                     onClick={(e) => e.target.showPicker && e.target.showPicker()}
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="input input-bordered bg-border border-gray-600 text-white rounded-md w-full focus:outline-none focus:border-blue-600"
//                                     value={followUpDate}
//                                     onChange={(e) => setFollowUpDate(e.target.value)}
//                                 />
//                             </div>
//                         )}

//                         <p className="text-red-500 text-sm font-semibold">{error}</p>

//                         <button
//                             onClick={handleSaveChanges}
//                             title={selectedLead?.isLocked ? "Lead is Locked. Contact Admin to modify the leads" : ""}
//                             disabled={saving || selectedLead?.isLocked}
//                             className="btn w-full btn-primary bg-blue-600 text-white hover:bg-[#333] border border-gray-600"
//                         >
//                             {saving ? "Saving..." : " Save Changes"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )
//     );
// };

// // export default LeadModals;

// "use client";

// import axiosPublic from "@/api/axios";
// import { AuthContext } from "@/context/AuthContext";
// import { formateDate } from "@/utils/date";
// import Image from "next/image";
// import { useContext, useEffect, useState } from "react";
// import QR from "./QR";
// import { FaEdit, FaPlus } from "react-icons/fa";
// import { IoCheckmarkDoneSharp } from "react-icons/io5";
// import { MdContentCopy } from "react-icons/md";
// import { MultiSelect } from "primereact/multiselect";
// import { findBestCourse } from "@/utils/matchCourseName";

// import "primereact/resources/primereact.min.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
// import HistoryRow from "./HistoryRow";

// export function formatForWhatsApp(number) {
//     if (!number) return "";

//     const original = number;
//     let digits = number.replace(/\D/g, "");

//     if (digits.startsWith("8801") || digits.startsWith("01") || (digits.length === 10 && digits.startsWith("1"))) {
//         if (digits.startsWith("8801")) {
//         } else if (digits.startsWith("01")) {
//             digits = "880" + digits.slice(1);
//         } else if (digits.startsWith("1")) {
//             digits = "880" + digits;
//         }

//         if (digits.length === 13) return digits;
//     }

//     if (original.trim().startsWith("+")) {
//         return digits;
//     }

//     return digits || original;
// }

// const getCourseTypeString = (typeVal) => {
//     if (Array.isArray(typeVal)) {
//         return typeVal[0] || "Online";
//     }
//     if (typeof typeVal === "string" && typeVal.trim()) {
//         return typeVal;
//     }
//     return "Online";
// };

// const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {
//     const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending");
//     const [InterstedSeminarStatus, setInterstedSeminarStatus] = useState(selectedLead?.interstedSeminar || "None");

//     const [followUpDate, setFollowUpDate] = useState("");
//     const [refundAmount, setRefundAmount] = useState(0);

//     const [selectedCourses, setSelectedCourses] = useState([]);

//     const [notes, setNotes] = useState(selectedLead?.note || []);

//     const [leadSource, setLeadSource] = useState(selectedLead?.leadSource || "");
//     const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);

//     const [copied, setCopied] = useState(false);

//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");
//     const [orderCompletionDate, setOrderCompletionDate] = useState(null);

//     const { user } = useContext(AuthContext);

//     const [orderNumber, setOrderNumber] = useState("");
//     const [orderStatus, setOrderStatus] = useState("");
//     const [customerPhone, setCustomerPhone] = useState("");
//     const [estimatedPaymentDate, setEstimatedPaymentDate] = useState(null);

//     const sourceOptions = [
//         "Counseling Form",
//         "FB Page(1st)",
//         "FB Page(2nd)",
//         "Tiktok",
//         "Instagram",
//         "Youtube",
//         "Others Social Media",
//         "FB Paid Campaign",
//         "Google Paid Campaign",
//         "Onhold Order",
//         "Office Visit",
//         "Seminar",
//         "Outdoor Event",
//         "Free Course",
//         "Associate Refer",
//         "WhatsApp",
//         "IMO",
//         "Robi58",
//         "Banglalink58",
//         "GP39",
//         "3CX Incoming",
//     ];

//     // Fetch Order Details from WooCommerce
//     const findOrderDetails = async (e) => {
//         if (e.key === "Enter" || e.type === "click") {
//             if (!orderNumber) return;
//             try {
//                 const res = await axiosPublic.get(`/leads/order/${orderNumber}?email=${user?.email}`);

//                 if (res?.data) {
//                     setOrderStatus(res?.data?.status);
//                     setCustomerPhone(res?.data?.customerPhone || "");
//                     setOrderCompletionDate(res?.data?.orderCompletionDate || null);

//                     if (Array.isArray(res.data.courses) && res.data.courses.length > 0) {
//                         const newCoursesFromOrder = res.data.courses.map((wcCourse) => {
//                             const matched = findBestCourse ? findBestCourse(wcCourse.cleanedName || wcCourse.courseName, course) : null;
//                             const courseName = matched?.name || wcCourse.cleanedName || wcCourse.courseName;
//                             const type = wcCourse.type || matched?.type || "Online";

//                             const origPrice = Number(wcCourse.originalPrice || 0);
//                             const disc = Number(wcCourse.discount || 0);

//                             if (type === "Online") {
//                                 const paid = Number(wcCourse.total || 0);
//                                 const due = Math.max(0, origPrice - disc - paid);
//                                 const initHistory =
//                                     paid > 0
//                                         ? [
//                                               {
//                                                   date: res.data.orderCompletionDate || new Date(),
//                                                   paidAmount: paid,
//                                               },
//                                           ]
//                                         : [];
//                                 return {
//                                     courseName,
//                                     courseType: getCourseTypeString(type),
//                                     originalPrice: origPrice,
//                                     leadDiscount: disc,
//                                     discountUnit: "flat",
//                                     totalPaid: paid,
//                                     totalDue: due,
//                                     history: initHistory,
//                                     newPayment: 0,
//                                 };
//                             } else {
//                                 const due = Math.max(0, origPrice - disc);
//                                 return {
//                                     courseName,
//                                     courseType: getCourseTypeString(type),
//                                     originalPrice: origPrice,
//                                     leadDiscount: disc,
//                                     discountUnit: "flat",
//                                     totalPaid: 0,
//                                     totalDue: due,
//                                     history: [],
//                                     newPayment: 0,
//                                 };
//                             }
//                         });

//                         setSelectedCourses(newCoursesFromOrder);
//                     }

//                     setError("");
//                 }
//             } catch (err) {
//                 console.error("Order fetch error:", err);
//                 setError(err.response?.data?.message || err.response?.data?.title || "Failed to fetch order details");
//             }
//         }
//     };

//     const handleCourseFinancialChange = (courseName, field, val) => {
//         setSelectedCourses((prev) =>
//             prev.map((c) => {
//                 if (c.courseName !== courseName) return c;
//                 const numVal = Number(val) || 0;
//                 if (field === "newPayment") {
//                     const orig = Number(c.originalPrice || 0);
//                     const disc = Number(c.leadDiscount || 0);
//                     const prevPaid = Number(c.totalPaid || 0);
//                     const newTotalPaid = prevPaid + numVal;
//                     const calcDue = Math.max(0, orig - disc - newTotalPaid);
//                     return {
//                         ...c,
//                         newPayment: numVal,
//                         totalDue: calcDue,
//                     };
//                 }
//                 return { ...c, [field]: val };
//             }),
//         );
//     };

//     const handleMultiSelectChange = (selectedNames) => {
//         const updated = selectedNames.map((name) => {
//             const existing = selectedCourses.find((c) => c.courseName === name);
//             if (existing) return existing;

//             const matchedCourse = course?.find((c) => c.name === name);
//             const resolvedType = getCourseTypeString(matchedCourse?.type || matchedCourse?.allowedTypes);
//             const origPrice = Number(matchedCourse?.price || matchedCourse?.regularPrice || 0);

//             return {
//                 courseName: name,
//                 courseType: resolvedType,
//                 originalPrice: origPrice,
//                 leadDiscount: 0,
//                 discountUnit: "flat",
//                 totalPaid: 0,
//                 totalDue: origPrice,
//                 history: [],
//                 newPayment: 0,
//             };
//         });

//         setSelectedCourses(updated);
//     };

//     const handleCourseTypeChange = (courseName, newType) => {
//         setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, courseType: getCourseTypeString(newType) } : c)));
//     };

//     const handleSaveChanges = async () => {
//         setSaving(true);

//         if (!selectedCourses || selectedCourses.length === 0) {
//             setSaving(false);
//             return setError("Please select at least one course");
//         }

//         if (orderNumber) {
//             if (error) {
//                 setSaving(false);
//                 return;
//             }

//             if (orderStatus === "on-hold") {
//                 setSaving(false);
//                 return setError("On Hold Orders can't be marked as Enrolled ");
//             }

//             if (
//                 customerPhone &&
//                 formatForWhatsApp(customerPhone) !== formatForWhatsApp(selectedLead?.phone) &&
//                 modelStatus !== "Enrolled with Other Number" &&
//                 user?.role == "user"
//             ) {
//                 setSaving(false);
//                 return setError("The order number must match the phone number associated with this lead ");
//             } else {
//                 setError("");
//             }
//         }

//         // Construct updated courses payload
//         const updatedCoursesPayload = selectedCourses.map((item) => {
//             const existingCourse = selectedLead?.courses?.find((c) => c.courseName === item.courseName);
//             let courseHistory = existingCourse?.history ? [...existingCourse.history] : [...(item.history || [])];

//             let finalPaid = Number(item.totalPaid || 0);
//             if (Number(item.newPayment) > 0) {
//                 finalPaid += Number(item.newPayment);
//                 courseHistory.push({
//                     date: new Date(),
//                     paidAmount: Number(item.newPayment),
//                 });
//             }

//             const origPrice = Number(item.originalPrice || 0);
//             const leadDisc = Number(item.leadDiscount || 0);
//             const finalDue = Math.max(0, origPrice - leadDisc - finalPaid);

//             return {
//                 ...(existingCourse?._id ? { _id: existingCourse._id } : {}),
//                 courseName: item.courseName,
//                 courseType: getCourseTypeString(item.courseType),
//                 originalPrice: origPrice,
//                 leadDiscount: leadDisc,
//                 discountUnit: "flat",
//                 totalPaid: finalPaid,
//                 totalDue: finalDue,
//                 history: courseHistory,
//                 ...(modelStatus === "Enrolled" && !existingCourse?.enrolledAt ? { enrolledAt: Date.now() } : {}),
//             };
//         });

//         // Calculate overall totals across all courses
//         const overallOriginalPrice = updatedCoursesPayload.reduce((sum, c) => sum + (c.originalPrice || 0), 0);
//         const overallTotalPaid = updatedCoursesPayload.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
//         const overallTotalDue = updatedCoursesPayload.reduce((sum, c) => sum + (c.totalDue || 0), 0);

//         setError("");

//         const obj = {
//             courses: updatedCoursesPayload,
//             interstedSeminar: InterstedSeminarStatus,
//             leadSource: leadSource,
//             // 🔹 These two fields fix the auto-note issue (Price: X, Paid: Y)
//             originalPrice: overallOriginalPrice,
//             paidAmount: overallTotalPaid,
//             totalPaid: overallTotalPaid,
//             totalDue: overallTotalDue,
//             refundAmount: Number(refundAmount) || 0,
//             followUpDate: followUpDate,
//             leadStatus: modelStatus,
//             nextEstimatedPaymentDate: estimatedPaymentDate,
//             note: notes.filter((item) => item?.status === "unsaved").map(({ text, by }) => ({ text, by })),
//             lastModifiedBy: user?.name,
//             orderNumber: parseInt(orderNumber) || null,
//             orderCompletionDate,
//         };

//         if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
//             obj.enrolledAt = Date.now();
//         }

//         const cleanedObj = Object.fromEntries(
//             Object.entries(obj).filter(([_, v]) => {
//                 if (Array.isArray(v)) return v.length > 0;
//                 return v !== undefined && v !== null && v !== "";
//             }),
//         );

//         if (followUpDate === "") cleanedObj.followUpDate = null;

//         try {
//             const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj);
//             console.log(res.data);
//             setSaving(false);
//             refetch();
//             setSelectedLead(null);
//         } catch (err) {
//             console.error("Save changes error:", err);
//             setError(err.response?.data?.message || "Failed to save changes");
//             setSaving(false);
//         }
//     };

//     useEffect(() => {
//         if (selectedLead) {
//             setModelStatus(selectedLead.leadStatus || "Pending");
//             setInterstedSeminarStatus(selectedLead.interstedSeminar || "None");
//             setNotes(selectedLead?.note || []);

//             const initialCourses =
//                 selectedLead?.courses?.map((c) => ({
//                     courseName: c.courseName,
//                     courseType: getCourseTypeString(c.courseType),
//                     originalPrice: Number(c.originalPrice || 0),
//                     leadDiscount: Number(c.leadDiscount || 0),
//                     discountUnit: c.discountUnit || "flat",
//                     totalPaid: Number(c.totalPaid || 0),
//                     totalDue: Number(c.totalDue || 0),
//                     history: c.history || [],
//                     newPayment: 0,
//                 })) || [];

//             setSelectedCourses(initialCourses);

//             setLeadSource(selectedLead.leadSource || "");
//             setError("");

//             setFollowUpDate(selectedLead?.followUpDate ? selectedLead.followUpDate.split("T")[0] : "");
//             setRefundAmount(selectedLead.refundAmount || 0);
//             setOrderNumber(selectedLead?.orderNumber || "");

//             setEstimatedPaymentDate(selectedLead?.nextEstimatedPaymentDate ? selectedLead.nextEstimatedPaymentDate.split("T")[0] : "");
//         }
//     }, [selectedLead]);

//     const handleAddNote = (e) => {
//         e.preventDefault();
//         setNotes([
//             ...notes,
//             {
//                 text: e.target.note?.value,
//                 status: "unsaved",
//                 by: user?.name,
//                 date: formateDate(Date.now()),
//             },
//         ]);
//         e.target.reset();
//     };

//     const handleDeleteUnsavedNote = (index) => {
//         setNotes((prev) => prev.filter((_, i) => i !== index));
//     };

//     // Aggregate Payment History across all selected courses
//     const allCourseHistory = selectedCourses.flatMap((c) =>
//         (c.history || []).map((h) => ({
//             ...h,
//             courseName: c.courseName,
//         })),
//     );

//     function formatBDNumber(number) {
//         const original = number;
//         let digits = number.replace(/\D/g, "");

//         if (digits.startsWith("880")) {
//             digits = "0" + digits.slice(3);
//         } else if (digits.startsWith("88")) {
//             digits = "0" + digits.slice(2);
//         } else if (!digits.startsWith("0") && digits.length === 10) {
//             digits = "0" + digits;
//         }

//         if (digits.length === 11 && digits.startsWith("01")) {
//             return digits;
//         }

//         return original;
//     }

//     useEffect(() => {
//         const handleKeyDown = (e) => {
//             if (e.key === "Escape") {
//                 setSelectedLead(null);
//                 return;
//             }
//         };

//         window.addEventListener("keydown", handleKeyDown);
//         return () => window.removeEventListener("keydown", handleKeyDown);
//     }, []);

//     // 🔹 Only update the input text state as user types
//     const handlePaymentInputChange = (courseName, val) => {
//         setSelectedCourses((prev) => prev.map((c) => (c.courseName === courseName ? { ...c, newPayment: val } : c)));
//     };

//     // 🔹 Recalculate Due Amount ONLY when Enter is pressed or on blur
//     const applyCoursePayment = (courseName) => {
//         setSelectedCourses((prev) =>
//             prev.map((c) => {
//                 if (c.courseName !== courseName) return c;
//                 const numVal = Number(c.newPayment) || 0;
//                 const orig = Number(c.originalPrice || 0);
//                 const disc = Number(c.leadDiscount || 0);
//                 const prevPaid = Number(c.totalPaid || 0);
//                 const calcDue = Math.max(0, orig - disc - (prevPaid + numVal));
//                 return {
//                     ...c,
//                     totalDue: calcDue,
//                 };
//             }),
//         );
//     };

//     const isDisabled = user?.role === "user" && selectedLead?.leadStatus === "Enrolled";

//     const handleRemoveCourse = (courseName) => {
//         console.log("clicked");
//         setSelectedCourses((prev) => prev.filter((c) => c.courseName !== courseName));
//     };

//     return (
//         selectedLead && (
//             <div className="fixed inset-0 !z-99 bg-black/40 flex items-center justify-center">
//                 <div
//                     className={`bg-base-100 w-full scale-90 rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${
//                         modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number"
//                             ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl"
//                             : "md:grid-cols-3 lg:grid-cols-3 max-w-5xl"
//                     } gap-4 max-h-[90vh] overflow-y-visible`}
//                 >
//                     {/* Top bar */}
//                     <div className="sticky md:absolute ml-auto top-3 right-3">
//                         <button onClick={() => setSelectedLead(null)} className="btn btn-sm">
//                             ✕ Close
//                         </button>
//                     </div>

//                     {/* Column 1: Lead Details */}
//                     <div className="space-y-6 max-h-[550px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] overflow-y-scroll">
//                         <div>
//                             <h3 className="text-lg font-semibold mb-2">Lead Info</h3>
//                             <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Name</div>
//                                 <div className="font-medium">{selectedLead.name || "N/A"}</div>
//                                 <div className="text-white/50">Email</div>
//                                 <div className="font-medium flex justify-between items-center gap-2">
//                                     <span title={selectedLead.email} className="truncate max-w-[140px]">
//                                         {selectedLead.email || "N/A"}
//                                     </span>
//                                     {selectedLead.email && (
//                                         <button
//                                             onClick={() => {
//                                                 navigator.clipboard.writeText(selectedLead.email);
//                                                 setCopied(true);
//                                                 setTimeout(() => setCopied(false), 1500);
//                                             }}
//                                             className="text-blue-400 cursor-pointer hover:text-white text-xs flex items-center"
//                                             title="Copy Email"
//                                         >
//                                             {copied ? (
//                                                 <IoCheckmarkDoneSharp className="text-green-400 text-lg" />
//                                             ) : (
//                                                 <MdContentCopy className="text-blue-400 text-lg" />
//                                             )}
//                                         </button>
//                                     )}
//                                 </div>
//                                 <div className="text-white/50">Phone</div>
//                                 <div className="font-medium">{selectedLead.phone || "N/A"}</div>
//                                 <div className="text-white/50">Address</div>
//                                 <div className="font-medium">{selectedLead.address || "N/A"}</div>
//                                 <div className="text-white/50">Entry By</div>
//                                 <div className="font-medium">{selectedLead.entryBy || "N/A"}</div>
//                                 <div className="text-white/50">Created By</div>
//                                 <div className="font-medium truncate max-w-[160px]" title={selectedLead.createdBy}>
//                                     {selectedLead.createdBy || "N/A"}
//                                 </div>
//                                 <div className="text-white/50">Call Count</div>
//                                 <div className="font-medium">{selectedLead.callCount ? `x${selectedLead.callCount}` : "0"}</div>
//                                 <div className="text-white/50 flex items-center">Lead Source</div>
//                                 <div className="flex w-full items-center justify-between font-medium">
//                                     {leadSource || "N/A"}
//                                     {leadSource !== (selectedLead?.leadSource || "") && (
//                                         <span className="ml-2 text-yellow-500 font-semibold text-xs">(Unsaved)</span>
//                                     )}
//                                     <div
//                                         className="cursor-pointer text-blue-400 hover:text-white ml-2"
//                                         onClick={() => setIsSourceMenuOpen(!isSourceMenuOpen)}
//                                     >
//                                         <FaEdit />
//                                     </div>
//                                     {isSourceMenuOpen && (
//                                         <>
//                                             <div className="fixed inset-0 z-9998 cursor-default" onClick={() => setIsSourceMenuOpen(false)}></div>
//                                             <ul className="menu fixed left-90 top-50 p-2 shadow-xl bg-base-300 rounded-box max-h-[300px] overflow-y-auto border border-gray-600 z-9999">
//                                                 {sourceOptions.map((source, idx) => (
//                                                     <li key={idx}>
//                                                         <button
//                                                             onClick={() => {
//                                                                 setLeadSource(source);
//                                                                 setIsSourceMenuOpen(false);
//                                                             }}
//                                                             className={leadSource === source ? "bg-primary text-white" : ""}
//                                                         >
//                                                             {source}
//                                                         </button>
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         </>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         <div>
//                             <h4 className="text-sm font-bold text-white/80 mb-2">
//                                 {selectedLead?.leadStatus === "Enrolled" ? "Enrolled" : "Interested"} Course:
//                             </h4>
//                             {selectedLead?.courses && selectedLead.courses.length > 0 ? (
//                                 selectedLead.courses.map((c, i) => (
//                                     <div key={i} className="py-1 rounded-lg text-xs">
//                                         <div className="font-semibold text-white">
//                                             {c.courseName} ({c.courseType || "Online"})
//                                         </div>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <div className="text-sm text-white/50 italic">No courses listed</div>
//                             )}
//                         </div>

//                         <div>
//                             <h4 className="text-xs font-bold text-white/80 mb-1">Timeline</h4>
//                             <div className="grid grid-cols-[140px_1fr] gap-y-1 text-sm">
//                                 <div className="text-white/50">Lead Created</div>
//                                 <div className="font-medium">{formateDate(selectedLead.createdAt)}</div>
//                                 <div className="text-white/50">Assigned Date</div>
//                                 <div className="font-medium">{formateDate(selectedLead.assignDate)}</div>
//                                 <div className="text-white/50">First Contacted</div>
//                                 <div className="font-medium">{selectedLead.firstContacted ? formateDate(selectedLead.firstContacted) : "N/A"}</div>
//                                 <div className="text-white/50">Last Contacted</div>
//                                 <div className="font-medium">{selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}</div>
//                                 <div className="text-white/50">Follow-Up Date</div>
//                                 <div className="font-medium">{selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</div>
//                                 <div className="text-white/50">Enrollment Date</div>
//                                 <div className="font-medium">{selectedLead.enrolledAt ? formateDate(selectedLead.enrolledAt) : "N/A"}</div>
//                                 <div className="text-white/50">Next Payment Date</div>
//                                 <div className="font-medium">
//                                     {selectedLead.nextEstimatedPaymentDate ? formateDate(selectedLead.nextEstimatedPaymentDate) : "N/A"}
//                                 </div>
//                             </div>
//                         </div>

//                         {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
//                             <div>
//                                 <h4 className="text-xs font-bold text-white/80 mb-1">Questions</h4>
//                                 <div className="space-y-3 text-sm mt-1">
//                                     {Object.entries(selectedLead.questions).map(([q, a], i) => (
//                                         <div key={i} className="border-b border-white/10 pb-2">
//                                             <div className="text-white/50">{q}</div>
//                                             <div className="font-medium text-white mt-1">{a}</div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Column 2: Notes */}
//                     <div className="space-y-2 flex flex-col text-sm">
//                         <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
//                         <div className="space-y-2 h-[320px] overflow-y-auto">
//                             {notes?.map((note, i) => (
//                                 <div key={i} className="border border-gray-500 mt-2 p-2 bg-base-200 rounded relative">
//                                     {note.status === "unsaved" && (
//                                         <button
//                                             onClick={() => handleDeleteUnsavedNote(i)}
//                                             className="absolute cursor-pointer p-1 top-1 z-30 right-1 text-red-500 text-xs hover:text-red-300"
//                                             title="Delete this unsaved note"
//                                         >
//                                             ✕
//                                         </button>
//                                     )}
//                                     <p className={`text-xs opacity-70 ${(note.date || note.createdAt || note.by) && "mb-2"}`}>
//                                         <span>{(note.date || note.createdAt) && formateDate(note.date || note.createdAt) + ` • ${note.by}`} </span>
//                                         {note?.status == "unsaved" && <span className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
//                                     </p>
//                                     <pre className="text-wrap">{note.text}</pre>
//                                 </div>
//                             ))}
//                             {notes?.length === 0 && <p className="text-xs text-center mt-20 text-base-content/60">No notes yet.</p>}
//                         </div>

//                         <form className="mt-auto" onSubmit={handleAddNote}>
//                             <textarea
//                                 name="note"
//                                 required
//                                 className="textarea resize-none focus:outline-none focus:border-blue-600 mt-auto textarea-bordered w-full"
//                                 rows={3}
//                                 placeholder="Write a note..."
//                             ></textarea>
//                             <button className="btn w-full mt-2 bg-blue-600 btn-primary">Add Note</button>
//                         </form>
//                     </div>

//                     {/* Column 3: Payment Details */}
//                     {(modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number") && (
//                         <div className="space-y-3 flex flex-col text-sm max-h-[550px] overflow-y-auto pr-1">
//                             <h3 className="text-lg font-semibold">Payment Details</h3>

//                             {/* Order Number Input */}
//                             <div>
//                                 <label className="text-xs text-white/60 mb-1 block">Order Number</label>
//                                 <input
//                                     type="number"
//                                     value={orderNumber || ""}
//                                     onChange={(e) => setOrderNumber(e.target.value)}
//                                     onKeyDown={findOrderDetails}
//                                     placeholder="Enter Order Number & Press Enter"
//                                     className="input input-bordered w-full disabled:bg-transparent focus:outline-0 focus:border-blue-600 disabled:border disabled:border-gray-600"
//                                 />
//                             </div>

//                             {/* Course Breakdown Cards */}
//                             <div className="space-y-1.5 mt-2">
//                                 <label className="text-xs font-bold text-white/80 block">Enrolled Courses Breakdown</label>
//                                 <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
//                                     {selectedCourses && selectedCourses.length > 0 ? (
//                                         selectedCourses.map((c, i) => (
//                                             <div key={i} className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-xs space-y-2">
//                                                 <div className="flex items-center justify-between gap-2">
//                                                     <span className="font-medium text-white truncate max-w-[170px]" title={c.courseName}>
//                                                         {c.courseName}
//                                                     </span>
//                                                     <span
//                                                         className={`px-1.5 py-0.5 text-[10px] rounded font-medium border ${
//                                                             c.courseType === "Offline"
//                                                                 ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
//                                                                 : "bg-blue-500/20 text-blue-300 border-blue-500/30"
//                                                         }`}
//                                                     >
//                                                         {c.courseType || "Online"}
//                                                     </span>
//                                                 </div>

//                                                 <div className="flex justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-700/60">
//                                                     <span>
//                                                         Price: <strong className="text-white">৳{c.originalPrice || 0}</strong>
//                                                     </span>
//                                                     <span>
//                                                         Paid:{" "}
//                                                         <strong className="text-green-400">
//                                                             ৳{Number(c.totalPaid || 0) + Number(c.newPayment || 0)}
//                                                         </strong>
//                                                     </span>
//                                                     <span>
//                                                         Due:{" "}
//                                                         <strong className={c.totalDue > 0 ? "text-red-400" : "text-gray-400"}>
//                                                             ৳{c.totalDue || 0}
//                                                         </strong>
//                                                     </span>
//                                                 </div>

//                                                 {c.courseType === "Offline" && (
//                                                     <div className="pt-1.5 border-t border-gray-700/60 flex items-center justify-between gap-2">
//                                                         <label className="text-[11px] text-yellow-400 font-medium whitespace-nowrap">
//                                                             + Add Payment (৳):
//                                                         </label>
//                                                         <input
//                                                             type="number"
//                                                             value={c.newPayment || ""}
//                                                             onChange={(e) => handlePaymentInputChange(c.courseName, e.target.value)}
//                                                             onKeyDown={(e) => {
//                                                                 if (e.key === "Enter") {
//                                                                     e.preventDefault();
//                                                                     applyCoursePayment(c.courseName);
//                                                                 }
//                                                             }}
//                                                             onBlur={() => applyCoursePayment(c.courseName)}
//                                                             placeholder="0"
//                                                             className="input input-xs bg-gray-900 border-yellow-500/50 text-yellow-300 font-bold w-24 text-right focus:outline-none focus:border-yellow-500 rounded"
//                                                         />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <div className="text-xs text-white/50 italic p-2 bg-gray-800 rounded border border-gray-700 text-center">
//                                             No courses selected
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Summary */}
//                             <div className="p-2.5 bg-gray-900 border border-gray-700 rounded-lg space-y-1 text-sm">
//                                 <div className="flex justify-between text-gray-400">
//                                     <span>Overall Total Paid:</span>
//                                     <span className="font-bold text-green-400">
//                                         ৳{selectedCourses.reduce((sum, c) => sum + (Number(c.totalPaid) || 0) + (Number(c.newPayment) || 0), 0)}
//                                     </span>
//                                 </div>
//                                 <div className="flex justify-between text-gray-400">
//                                     <span>Overall Total Due:</span>
//                                     <span className="font-bold text-red-400">৳{selectedCourses.reduce((sum, c) => sum + (c.totalDue || 0), 0)}</span>
//                                 </div>
//                             </div>

//                             {/* Next Estimated Payment Date */}
//                             <div>
//                                 <label className="text-xs text-white/60 mb-1 block">Next Estimate Payment Date</label>
//                                 <input
//                                     type="date"
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="input input-bordered bg-transparent border border-gray-600 text-white rounded-md w-full focus:outline-none focus:border-blue-600"
//                                     value={estimatedPaymentDate || ""}
//                                     onChange={(e) => setEstimatedPaymentDate(e.target.value)}
//                                 />
//                             </div>

//                             {/* Payment History */}
//                             <div>
//                                 <h2 className="text-lg font-semibold">Payment History</h2>
//                                 <div className="max-h-36 overflow-y-auto pr-2 space-y-1 mt-1">
//                                     {allCourseHistory.length > 0 ? (
//                                         allCourseHistory.map((item, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded text-xs"
//                                             >
//                                                 <div>
//                                                     <span className="text-white font-medium block">{item.courseName}</span>
//                                                     <span className="text-gray-400 text-[11px]">{formateDate(item.date)}</span>
//                                                 </div>
//                                                 <span className="text-green-400 font-bold">৳{item.paidAmount}</span>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="mt-2 text-white/50 text-sm">No Payment History Available</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Column 4: Actions */}
//                     <div className="flex flex-col gap-2">
//                         <h3 className="text-lg font-semibold">Actions</h3>

//                         <div className="flex mt-2 gap-2 justify-center">
//                             <div className="flex-1 max-w-[81px] border border-white">
//                                 <QR value={`tel:${formatBDNumber(selectedLead?.phone)}`} />
//                             </div>
//                             <div className="space-y-2 flex-2">
//                                 <a
//                                     href={`sip:${formatBDNumber(selectedLead?.phone)}@192.168.10.150`}
//                                     className="flex gap-2 py-3! w-full bg-[#EB6609] border border-[#373737] btn"
//                                 >
//                                     <Image alt="Linphone" src={"/logo/linphone.jpg"} className="w-auto h-5" width={1000} height={1000} /> Call on
//                                     Linphone
//                                 </a>

//                                 <a
//                                     href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex gap-2 py-3! w-full bg-[#34DA51] border border-[#34DA51] btn"
//                                 >
//                                     <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5" width={1000} height={1000} /> Call on Whatsapp
//                                 </a>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Lead Status ({modelStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {statusOptions
//                                         ?.filter((item) => item != "All" && item != "Contacted")
//                                         .map((s) => (
//                                             <li key={s}>
//                                                 <button
//                                                     onClick={() => {
//                                                         setModelStatus(s);
//                                                         document.activeElement.blur();
//                                                     }}
//                                                     className={`capitalize ${user?.role == "user" && s == "Refunded" && "hidden"}`}
//                                                 >
//                                                     {s}
//                                                 </button>
//                                             </li>
//                                         ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         <div className="relative mt-2 w-full">
//                             <div className="dropdown w-full">
//                                 <label tabIndex={0} className="btn min-w-full border-gray-500 btn-outline capitalize">
//                                     Seminar Status ({InterstedSeminarStatus})
//                                 </label>
//                                 <ul tabIndex={0} className="dropdown-content z-9999 fixed! menu p-2 shadow bg-base-200 rounded-box w-76">
//                                     {["Joined", "Online", "Offline", "None"].map((s) => (
//                                         <li key={s}>
//                                             <button
//                                                 onClick={() => {
//                                                     setInterstedSeminarStatus(s);
//                                                     document.activeElement.blur();
//                                                 }}
//                                                 className="capitalize"
//                                             >
//                                                 {s}
//                                             </button>
//                                         </li>
//                                     ))}
//                                 </ul>
//                             </div>
//                         </div>

//                         {/* Multi-Course Selection + Inline Type Selector */}
//                         <div className="mt-2 space-y-2">
//                             <div className="flex items-center justify-between gap-2">
//                                 <label className="text-xs text-white/60">Interested Courses</label>

//                                 <div className="relative">
//                                     <button
//                                         type="button"
//                                         tabIndex={-1}
//                                         disabled={isDisabled}
//                                         className={`text-white flex gap-2 items-center text-xs ${
//                                             isDisabled ? "opacity-50 cursor-not-allowed" : "pointer-events-none"
//                                         }`}
//                                     >
//                                         Add Course <FaPlus />
//                                     </button>

//                                     {!isDisabled && (
//                                         <MultiSelect
//                                             value={selectedCourses.map((c) => c.courseName)}
//                                             onChange={(e) => handleMultiSelectChange(e.value)}
//                                             options={
//                                                 course?.map((c) => ({
//                                                     label: c.name,
//                                                     value: c.name,
//                                                 })) || []
//                                             }
//                                             optionLabel="label"
//                                             optionValue="value"
//                                             filter
//                                             className="absolute inset-0 opacity-0 cursor-pointer"
//                                             panelClassName="text-xs"
//                                         />
//                                     )}
//                                 </div>
//                             </div>

//                             <div className="space-y-1.5 max-h-[130px] overflow-y-auto pr-1">
//                                 {selectedCourses.map((c, idx) => (
//                                     <div
//                                         key={idx}
//                                         className="flex relative items-center justify-between p-2 bg-gray-800 border border-gray-700 rounded text-xs gap-2"
//                                     >
//                                         <span className="font-medium flex-3 text-white truncate max-w-[170px]" title={c.courseName}>
//                                             {c.courseName}
//                                         </span>
//                                         <div className="flex-2 select-xs bg-gray-900 text-white rounded px-2">
//                                             <select
//                                                 value={getCourseTypeString(c.courseType)}
//                                                 onChange={(e) => handleCourseTypeChange(c.courseName, e.target.value)}
//                                                 disabled={user?.role === "user" && selectedLead?.leadStatus === "Enrolled"}
//                                                 className="select bg-transparent border-0 focus:outline-none"
//                                             >
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Online">
//                                                     Online
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Offline">
//                                                     Offline
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Video Course">
//                                                     Video
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Download Course">
//                                                     Download
//                                                 </option>
//                                                 <option className="bg-gray-900 px-4 pr-8" value="Free course">
//                                                     Free
//                                                 </option>
//                                             </select>
//                                         </div>

//                                         {!isDisabled && (
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => {
//                                                     e.preventDefault();
//                                                     e.stopPropagation(); // 🔹 Prevents opening the MultiSelect dropdown
//                                                     console.log("Removing course:", c.courseName);
//                                                     handleRemoveCourse(c.courseName);
//                                                 }}
//                                                 className="  top-0 right-0 bg-red-500 rounded-full  text-white hover:text-red-200 p-1 text-xs font-bold leading-none cursor-pointer !z-999"
//                                                 title="Remove Course"
//                                             >
//                                                 ✕
//                                             </button>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {modelStatus == "Refunded" ? (
//                             <div className="mt-auto gap-3">
//                                 <label className="block mb-1 text-white/80 text-sm">Refunded Amount</label>
//                                 <input
//                                     type="number"
//                                     value={refundAmount}
//                                     onChange={(e) => setRefundAmount(e.target.value)}
//                                     placeholder="Enter Refunded Amount"
//                                     className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
//                                 />
//                             </div>
//                         ) : (
//                             <div className="flex flex-col mt-auto gap-3">
//                                 <label className="text-sm">Next Follow-Up Date</label>
//                                 <input
//                                     type="date"
//                                     onClick={(e) => e.target.showPicker && e.target.showPicker()}
//                                     min={new Date().toISOString().split("T")[0]}
//                                     className="input input-bordered bg-transparent border border-gray-600 text-white rounded-md w-full focus:outline-none focus:border-blue-600"
//                                     value={followUpDate}
//                                     onChange={(e) => setFollowUpDate(e.target.value)}
//                                 />
//                             </div>
//                         )}

//                         <p className="text-red-500 text-sm font-semibold">{error}</p>

//                         <button
//                             onClick={handleSaveChanges}
//                             title={selectedLead?.isLocked ? "Lead is Locked. Contact Admin to modify the leads" : ""}
//                             disabled={saving || selectedLead?.isLocked}
//                             className="btn w-full btn-primary bg-blue-600 text-white hover:bg-[#333] border border-gray-600"
//                         >
//                             {saving ? "Saving..." : " Save Changes"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         )
//     );
// };

// export default LeadModals;

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
                                                  date: res.data.orderCompletionDate || new Date(),
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
        console.log(modelStatus);

        if (!selectedCourses || selectedCourses.length === 0) {
            setSaving(false);
            return setError("Please select at least one course");
        }

        // 🔹 CHECK 1: Prevent changing "Enrolled with Other Number" -> "Enrolled"
        if (selectedLead?.leadStatus === "Enrolled with Other Number" && modelStatus === "Enrolled" && user?.role === "user") {
            setSaving(false);
            return setError("You cannot change the status of this lead from 'Enrolled with Other Number' to 'Enrolled'.");
        }

        if (orderNumber) {
            if (error) {
                setSaving(false);
                return;
            }

            if (orderStatus === "on-hold") {
                setSaving(false);
                return setError("On Hold Orders can't be marked as Enrolled");
            }

            // 🔹 CHECK 2: If order number is present but order details were not fetched (didn't press Enter)
            if (!customerPhone && modelStatus === "Enrolled" && user?.role === "user") {
                setSaving(false);
                return setError("Please press Enter inside the Order Number box to verify the order before marking as Enrolled.");
            }

            // 🔹 CHECK 3: Standard phone mismatch check (if order details were fetched)
            if (
                customerPhone &&
                formatForWhatsApp(customerPhone) !== formatForWhatsApp(selectedLead?.phone) &&
                modelStatus?.trim().toLowerCase() !== "enrolled with other number" &&
                user?.role === "user"
            ) {
                setSaving(false);
                return setError("The order number must match the phone number associated with this lead.");
            } else {
                setError("");
            }
        }

        // Construct updated courses payload
        const updatedCoursesPayload = selectedCourses.map((item) => {
            const existingCourse = selectedLead?.courses?.find((c) => c.courseName === item.courseName);
            let courseHistory = existingCourse?.history ? [...existingCourse.history] : [...(item.history || [])];

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
                        modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number"
                            ? "md:grid-cols-2 lg:grid-cols-4 max-w-[1350px]"
                            : "md:grid-cols-3 lg:grid-cols-[340px_1fr_1fr] max-w-[1050px]"
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
                                <div className="text-white/50">Email</div>
                                <div className="font-medium flex justify-between items-center gap-2">
                                    <span title={selectedLead.email} className="truncate max-w-[140px]">
                                        {selectedLead.email || "N/A"}
                                    </span>
                                    {selectedLead.email && (
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(selectedLead.email);
                                                setCopied(true);
                                                setTimeout(() => setCopied(false), 1500);
                                            }}
                                            className="text-blue-400 cursor-pointer hover:text-white text-xs flex items-center"
                                            title="Copy Email"
                                        >
                                            {copied ? (
                                                <IoCheckmarkDoneSharp className="text-green-400 text-lg" />
                                            ) : (
                                                <MdContentCopy className="text-blue-400 text-lg" />
                                            )}
                                        </button>
                                    )}
                                </div>
                                <div className="text-white/50">Phone</div>
                                <div className="font-medium">{selectedLead.phone || "N/A"}</div>
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
                                    <pre className="text-wrap">{note.text}</pre>
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
                    {(modelStatus == "Enrolled" || modelStatus == "Refunded" || modelStatus == "Enrolled with Other Number") && (
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
                            <div className="flex-1 max-w-[81px] border border-white">
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

                                <a
                                    href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex gap-2 py-3! w-full bg-[#34DA51] border border-[#34DA51] btn"
                                >
                                    <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5" width={1000} height={1000} /> Call on Whatsapp
                                </a>
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
                                                course?.map((c) => ({
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
