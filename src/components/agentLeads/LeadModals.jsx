import axiosPublic from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import CourseInput from "@/utils/CourseInput";
import { formateDate } from "@/utils/date";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import QR from "./QR";
import { FaCopy, FaEdit } from "react-icons/fa";
import { IoCheckmarkDoneSharp, IoCopyOutline } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";

const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {

    const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending")
    const [InterstedSeminarStatus, setInterstedSeminarStatus] = useState(selectedLead?.interstedSeminar || "None")

    const [followUpDate, setFollowUpDate] = useState("")
    const [refundAmount, setRefundAmount] = useState(0)
    const [courseInput, setCourseInput] = useState({})
    const [searchInput, setSearchInput] = useState("")
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [searchSuggesion, setSearchSuggesion] = useState("")
    const [selectedCourseType, setSelectedCourseType] = useState(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [notes, setNotes] = useState(selectedLead?.note)
    const { user } = useContext(AuthContext)
    const [leadSource, setLeadSource] = useState(selectedLead?.leadSource || "");
    const [copied, setCopied] = useState(false);


    const sourceOptions = [
        "Counseling Form", "FB Page(1st)", "FB Page(2nd)", "Tiktok", "Instagram",
        "Youtube", "Others Social Media", "FB Paid Campaign", "Google Paid Campaign",
        "Onhold Order", "Office Visit", "Seminar", "Outdoor Event", "Free Course",
        "Associate Refer", "WhatsApp", "IMO", "Robi58", "Banglalink58", "GP39",
        "3CX Incoming"
    ];


    const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);
    const [sourceMenuPosition, setSourceMenuPosition] = useState({ top: 0, left: 0 });



    const handleSaveChanges = async () => {

        console.log(followUpDate)
        setSaving(true)
        const {
            estemitePaymentDate,
            discountSource,
            leadDiscount,      //actual duiscount value when discount is set 
            discountUnit,      // selected discount unit 
            originalPrice,
            lastPaid,
            totalDue,
            minValue,
            maxValue } = courseInput


        if (!searchInput) {
            setSaving(false)
            return setError("Please input Course Name")
        }

        let filteredCourse = course.filter(item => (item.name == searchInput))
      

        if (filteredCourse?.length == 0) {
            setSaving(false)
            return setError("Pleas Input a Valid Course Name");
        }

        if (modelStatus === "Enrolled") {
            console.log("enrolled", leadDiscount)
            if (leadDiscount !== null) {
                console.log("leaddisocunt enry", minValue, maxValue)
                if ((leadDiscount < minValue) || (leadDiscount > maxValue)) {
                    console.log("condition  matched")
                    setSaving(false)
                    return setError(`Discount must be between ${minValue} and ${maxValue}`)
                }
            }
        }


        setError("")

        const obj = {
            interstedCourse: (searchInput ?? "").trim(),
            interstedCourseType: selectedCourseType,
            interstedSeminar: InterstedSeminarStatus,
            discountSource,
            leadSource: leadSource,
            leadDiscount,
            discountUnit: discountUnit == "%" ? "percent" : "flat",
            originalPrice,
            refundAmount,
            paidAmount: lastPaid,
            totalDue,
            followUpDate: followUpDate,
            leadStatus: modelStatus,
            nextEstimatedPaymentDate: estemitePaymentDate,
            note: notes.filter(item => item?.status == "unsaved").map(({ text, by }) => ({ text, by })),
            lastModifiedBy: user?.name
        }

        console.log(obj)

        if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
            obj.enrolledAt = Date.now();
        }

        const cleanedObj = Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => {
                if (Array.isArray(v)) return v.length > 0;
                return Boolean(v);
            })
        );

        if (followUpDate === "") cleanedObj.followUpDate = null;

        // console.log(obj, "ojbeanedObj")


        const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj)
        console.log(res.data)
        setSaving(false)
        refetch()
        setSelectedLead(null)

    }

    useEffect(() => {
        if (selectedLead) {
            setModelStatus(selectedLead.leadStatus || "Pending");
            setInterstedSeminarStatus(selectedLead.interstedSeminar || "None")
            setNotes(selectedLead?.note)
            setSearchInput(selectedLead?.interstedCourse ?? selectedLead?.interstedCourse ?? "");
            setSelectedCourseType(selectedLead.interstedCourseType ?? selectedLead?.interstedCourse ?? "")
            setLeadSource(selectedLead.leadSource || "")
            setError("")

            const selectedCourse = course.find(courseItem => ((courseItem.name === selectedLead?.interstedCourse) && (courseItem.type === selectedLead?.interstedCourseType)))
            setSelectedCourseId(selectedCourse?._id)
            console.log(selectedCourse?._id)

            setFollowUpDate(
                selectedLead?.followUpDate
                    ? new Date(selectedLead.followUpDate).toISOString().slice(0, 16)
                    : ""
            );
            setRefundAmount(selectedLead.refundAmount)
        }
    }, [selectedLead]);


    const handleAddNote = (e) => {
        e.preventDefault()
        setNotes([...notes, { text: e.target.note?.value, status: "unsaved", by: user?.name?.name, date: formateDate(Date.now()) }])
        e.target.reset()
    }


    const handleSearch = (e) => {
        const searchText = e.target.value
        setSearchInput(searchText)
        const Suggesion = course.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
        if (searchText.length > 0) {
            setSearchSuggesion(Suggesion)
        }

    }


    const handleDeleteUnsavedNote = (index) => {
        setNotes(prev => prev.filter((_, i) => i !== index));
    };


    const handleSearchSuggesionClick = (item) => {
        setSearchInput(item?.name); //  shows name in input
        setSelectedCourseId(item?._id); // but internally, we track by id
        setSearchSuggesion("");
        setSelectedCourseType(item.type)
    };


    function formatBDNumber(number) {
        // Keep original input in case it's not BD
        const original = number;

        // Remove all non-digit characters
        let digits = number.replace(/\D/g, '');

        // Normalize Bangladeshi numbers
        if (digits.startsWith('880')) {
            digits = '0' + digits.slice(3);
        } else if (digits.startsWith('88')) {
            digits = '0' + digits.slice(2);
        } else if (!digits.startsWith('0') && digits.length === 10) {
            digits = '0' + digits;
        }

        // Check if it's a valid BD local number (11 digits, starts with 01)
        if (digits.length === 11 && digits.startsWith('01')) {
            return digits;
        }

        // Otherwise return original
        return original;
    }


    function formatForWhatsApp(number) {
        if (!number) return "";

        const original = number;
        let digits = number.replace(/\D/g, ''); // remove non-digits

        // --- Handle Bangladeshi numbers ---
        if (
            digits.startsWith('8801') || // +880 format
            digits.startsWith('01') ||   // local format
            (digits.length === 10 && digits.startsWith('1')) // missing 0
        ) {
            // Normalize BD number
            if (digits.startsWith('8801')) {
                // already correct (e.g. 8801742...)
            } else if (digits.startsWith('01')) {
                digits = '880' + digits.slice(1);
            } else if (digits.startsWith('1')) {
                digits = '880' + digits;
            }

            // Return BD number only if length is correct (13 digits)
            if (digits.length === 13) return digits;
        }

        // --- Handle other countries ---
        // If starts with country code (e.g., 61, 91, 44), remove leading '+' if exists
        if (original.trim().startsWith('+')) {
            return digits; // keep international code, remove '+'
        }

        // If user gave plain digits but not BD, just return cleaned number
        return digits || original;
    }



    return (
        selectedLead && <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
            <div>
                <div className={`bg-base-100 w-full   rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${(modelStatus == "Enrolled" || modelStatus == "Refunded") ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl" : "md:grid-cols-3 lg:grid-cols-3 max-w-5xl"} gap-4 max-h-[90vh] overflow-y-auto`}>

                    {/* Top bar with lead info */}
                    <div className="sticky md:absolute ml-auto   top-3 right-3">
                        <button
                            onClick={() => setSelectedLead(null)}
                            className="btn btn-sm "
                        >
                            ✕ Close
                        </button>
                    </div>
                    {/*  Column 1: Lead Details */}
                    {/*  Column 1: Lead Details */}
                    <div className="space-y-6 max-h-[450px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  overflow-y-scroll">

                        {/* SECTION: BASIC INFO */}
                        <div className="">
                            <h3 className="text-lg font-semibold mb-2">Lead Info</h3>
                            <div className="grid  grid-cols-[130px_1fr] gap-y-1 text-sm">
                                <div className="text-white/50">Name</div>
                                <div className="font-medium">{selectedLead.name}</div>

                                <div className="text-white/50">Email</div>
                                <div className="font-medium flex justify-between items-center gap-2">
                                    <span title={selectedLead.email} className="truncate max-w-[140px]">
                                        {selectedLead.email}
                                    </span>

                                    {selectedLead.email && <button
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
                                    </button>}
                                </div>

                                <div className="text-white/50">Phone</div>
                                <div className="font-medium">{selectedLead.phone}</div>

                                <div className="text-white/50">Address</div>
                                <div className="font-medium">{selectedLead.address}</div>

                                {/* ✅ MISSING FIELD: CREATED BY */}
                                {/* <div className="text-white/50">Created By</div>
                                <div className="font-medium">{selectedLead.createdBy}</div> */}
                            </div>
                        </div>

                        {/* SECTION: COURSE INFO */}
                        <div>
                            <h4 className="text-xs font-semibold text-white/60 mb-1">Course Info</h4>
                            <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">

                                <div className="text-white/50">Interested Course</div>
                                <div title={selectedLead.interstedCourse} className="font-medium line-clamp-1 ">{selectedLead.interstedCourse}</div>

                                <div className="text-white/50">Course Type</div>
                                <div className="font-medium">{selectedLead.interstedCourseType}</div>

                                {/* LEAD SOURCE WITH EDIT BUTTON */}
                                <div className="text-white/50 flex items-center">Lead Source</div>
                                <div className="flex items-center justify-between font-medium">
                                    {leadSource || "N/A"}

                                    {leadSource !== (selectedLead?.leadSource || "") && (
                                        <span className="ml-2 text-yellow-500 font-semibold text-xs">(Unsaved)</span>
                                    )}

                                    <div
                                        className="cursor-pointer text-blue-400 hover:text-white ml-2"
                                        onClick={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setSourceMenuPosition({ top: rect.bottom + 5, left: rect.left - 200 });
                                            setIsSourceMenuOpen(!isSourceMenuOpen);
                                        }}
                                    >
                                        <FaEdit />
                                    </div>

                                    {isSourceMenuOpen && (
                                        <>
                                            {/* Invisible backdrop to close menu when clicking outside */}
                                            <div
                                                className="fixed inset-0 z-9998 cursor-default"
                                                onClick={() => setIsSourceMenuOpen(false)}
                                            ></div>

                                            {/* The Menu List */}
                                            <ul
                                                style={{
                                                    top: `${sourceMenuPosition.top}px`,
                                                    left: `${sourceMenuPosition.left}px`,
                                                    position: 'fixed' // This creates the escape magic
                                                }}
                                                className="menu p-2 shadow-xl bg-base-300 rounded-box  max-h-[300px] overflow-y-auto border border-gray-600 z-9999"
                                            >
                                                {sourceOptions.map((source, idx) => (
                                                    <li key={idx}>
                                                        <button
                                                            onClick={() => {
                                                                setLeadSource(source);
                                                                setIsSourceMenuOpen(false); // Close on select
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

                        {/* SECTION: TIMELINE */}
                        <div>
                            <h4 className="text-xs font-semibold text-white/60 mb-1">Timeline</h4>
                            <div className="grid grid-cols-[130px_1fr] gap-y-1 text-sm">
                                <div className="text-white/50">Assigned Date</div>
                                <div className="font-medium">{formateDate(selectedLead.assignDate)}</div>

                                <div className="text-white/50">Follow-Up Date</div>
                                <div className="font-medium">
                                    {selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}
                                </div>

                                <div className="text-white/50">Next Payment Date</div>
                                <div className="font-medium">
                                    {selectedLead.nextEstimatedPaymentDate ? formateDate(selectedLead.nextEstimatedPaymentDate) : "N/A"}
                                </div>

                                <div className="text-white/50">Last Contacted</div>
                                <div className="font-medium">
                                    {selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}
                                </div>
                            </div>
                        </div>

                        {/* ✅ MISSING SECTION: QUESTIONS */}
                        {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-white/60 mb-1">Questions</h4>

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


                    {/*  Column 2: Notes */}
                    <div className="space-y-2 flex flex-col text-sm">
                        <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
                        <div className="space-y-2 h-[250px]   overflow-y-auto">
                            {/* {notes?.map((note, i) => (
                                    <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200  rounded">
                                        <p className="text-xs opacity-70">
                                            {formateDate(note.date || note.createdAt)} • {note.by}
                                            {note?.status == "unsaved" && <span title="Click Save Change Button to save the note" className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
                                        </p>
                                        <p>{note.text}</p>
                                    </div>
                                ))} */}

                            {notes?.map((note, i) => (
                                <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200 rounded relative">

                                    {/* DELETE BUTTON ONLY FOR UNSAVED */}
                                    {note.status === "unsaved" && (
                                        <button
                                            onClick={() => handleDeleteUnsavedNote(i)}
                                            className="absolute cursor-pointer p-1 top-1 z-30 right-1  text-red-500 text-xs hover:text-red-300"
                                            title="Delete this unsaved note"
                                        >
                                            ✕
                                        </button>
                                    )}

                                    <p className="text-xs mb-2 opacity-70">
                                        {formateDate(note.date || note.createdAt)} • {note.by}
                                        {note?.status == "unsaved" &&
                                            <span className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
                                    </p>

                                    <pre className="text-wrap">{note.text}</pre>
                                </div>
                            ))}

                            {(notes?.length === 0) && (
                                <p className="text-xs text-center mt-20  text-base-content/60">No notes yet.</p>
                            )}
                        </div>

                        {/* Add new note input */}
                        <form className="mt-auto" onSubmit={handleAddNote}>
                            <textarea
                                name="note"
                                required
                                className="textarea resize-none focus:outline-none  focus:border-blue-600  mt-auto textarea-bordered w-full "
                                rows={3}
                                placeholder="Write a note..."
                            // Hook this to your handler
                            ></textarea>
                            <button className="btn w-full mt-2 bg-blue-600 btn-primary ">Add Note</button>
                        </form>
                    </div>

                    {(modelStatus == "Enrolled" || modelStatus == "Refunded") && <div className="space-y-2  flex flex-col text-sm">
                        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>

                        <CourseInput
                            courseInput={courseInput}
                            setCourseInput={setCourseInput}
                            selectedLead={selectedLead}
                            selectedCourseId={selectedCourseId}
                            setError={setError}

                        />


                    </div>}

                    {/*  Column 3: Actions */}
                    <div className="flex flex-col gap-2 ">
                        <h3 className="text-lg font-semibold">Actions</h3>

                        <div className="flex mt-2 gap-2 justify-center ">
                            <div className="flex-1">
                                <QR value={`tel:${formatBDNumber(selectedLead?.phone)}`} />
                            </div>
                            <div className="space-y-2 flex-2">

                                <a
                                    // href={`tel:017429500624`}
                                    href={`tel:${formatBDNumber(selectedLead?.phone)}`}
                                    // href="http://192.168.10.10/webclient/#/call/017429500624"
                                    className=" flex gap-2 py-3! w-full bg-[#373737] border border-[#373737] btn  "
                                >
                                    Call on <Image alt="3CX" src={"/logo/3cx.png"} className="w-auto h-5 " width={1000} height={1000} />
                                </a>

                                <a
                                    href={`https://wa.me/${formatForWhatsApp(selectedLead?.phone)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" flex gap-2 py-3! w-full bg-[#34DA51] border border-[#34DA51] btn "
                                >
                                    <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5 " width={1000} height={1000} />  Call on Whatsapp
                                </a>
                            </div>
                        </div>

                        <div className="relative mt-2 w-full">
                            <div className="dropdown   w-full">
                                <label
                                    tabIndex={0}
                                    className="btn min-w-full border-gray-500 btn-outline capitalize"
                                >
                                    Lead Status ({modelStatus})
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-9999 fixed!    menu p-2 shadow bg-base-200 rounded-box w-76"
                                >
                                    {statusOptions.filter(item => item != "All").map((s) => (
                                        <li key={s}>
                                            <button
                                                onClick={() => {
                                                    setModelStatus(s)
                                                    document.activeElement.blur()
                                                }}
                                                className={`capitalize ${user.role == "user" && s == "Refunded" && "hidden"}`}
                                            >
                                                {s}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="relative mt-2 w-full">
                            <div className="dropdown   w-full">
                                <label
                                    tabIndex={0}
                                    className="btn min-w-full border-gray-500 btn-outline capitalize"
                                >
                                    Seminar Status ({InterstedSeminarStatus})
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-9999 fixed!    menu p-2 shadow bg-base-200 rounded-box w-76"
                                >
                                    {["Joined", "Online", "Offline", "None"].map((s) => (
                                        <li key={s}>
                                            <button
                                                onClick={() => {
                                                    setInterstedSeminarStatus(s)
                                                    document.activeElement.blur()
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


                        <div className="mt-2 relative">
                            <input
                                type="text"
                                disabled={user.role == "user" && selectedLead.interstedCourse && selectedLead.leadStatus == "Enrolled"}
                                value={searchInput}
                                onChange={handleSearch}
                                placeholder="Course Name"
                                className="input input-bordered w-full  focus:outline-0 focus:border-blue-600"
                            />

                            <span className="absolute border-gray-600 bg-gray-800 text-xs right-5 border p-1 px-2 rounded-full -top-2">{selectedCourseType}</span>

                            {searchSuggesion?.length > 0 && <ul className="bg-base-100 fixed z-50 shadow-md mt-1 rounded-box border border-base-300">
                                {
                                    searchSuggesion.map(item => <li
                                        onClick={() => handleSearchSuggesionClick(item)}
                                        className="px-4 py-2 flex justify-between w-[290px] bg-gray-700 cursor-pointer hover:bg-base-200">
                                        <span>{item.name} ({item.type})</span>
                                        <span>৳ {item.price}</span>
                                    </li>)
                                }
                            </ul>
                            }
                        </div>

                        {
                            modelStatus == "Refunded" ?
                                <div className=" mt-auto gap-3">
                                    <label className="block mb-1 text-white/80 text-sm">
                                        Refunded Amount
                                    </label>
                                    <input
                                        type="number"
                                        value={refundAmount}
                                        onChange={e => setRefundAmount(e.target.value)}
                                        placeholder="Enter Refunded Amount"
                                        className="input input-bordered w-full focus:outline-0 focus:border-blue-600"

                                    />
                                </div> :


                                <div className="flex flex-col mt-auto gap-3">
                                    <label className="text-sm ">Next Follow-Up Date</label>

                                    <input
                                        type="datetime-local"
                                        onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                        className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                    />

                                </div>

                        }

                        {/* {modelStatus == "Enrolled" && <div className="flex flex-col mt-2 gap-3">
                                <label className="text-sm ">Next Estimate payment Date</label>

                                <input
                                    type="datetime-local"
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                    className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
                                    value={estemitePaymentDate}
                                    onChange={(e) => setEstimatePaymentDate(e.target.value)}
                                />

                            </div>
                            } */}

                        <p className="text-red-500 font-semibold">{error}</p>

                        <button

                            onClick={handleSaveChanges}
                            title={selectedLead?.isLocked ? "Lead is Locked . Contact Admin to modify the leads " : ""}
                            disabled={saving || selectedLead?.isLocked}
                            className="btn w-full   btn-primary bg-blue-600  text-white hover:bg-[#333] border border-gray-600 "
                        >
                            {saving ? "Saving..." : " Save Changes"}
                        </button>
                    </div>



                    {/* column 4 */}

                </div>

            </div>

        </div >
    )
};

export default LeadModals;