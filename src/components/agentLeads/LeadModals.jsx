import axiosPublic from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";
import useFetch from "@/hooks/useFetch";
import CourseInput from "@/utils/CourseInput";
import { formateDate } from "@/utils/date";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import QR from "./QR";

const LeadModals = ({ selectedLead, setSelectedLead, statusOptions, refetch, course }) => {

    const [modelStatus, setModelStatus] = useState(selectedLead?.leadStatus || "Pending")
    const [estemitePaymentDate, setEstimatePaymentDate] = useState(null)
    const [followUpDate, setFollowUpDate] = useState("")
    const [courseInput, setCourseInput] = useState({})
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState("")
    const [notes, setNotes] = useState(selectedLead?.note)
    const { user } = useContext(AuthContext)



    const handleSaveChanges = async () => {
        setSaving(true)
        const {
            enrolledTo,
            discountSource,
            leadDiscount,
            discountUnit,
            originalPrice,
            lastPaid,
            totalDue } = courseInput

        console.log(totalDue)

        if (modelStatus == "Enrolled") {
            if (!enrolledTo && !selectedLead?.enrolledTo) {
                setSaving(false)
                return setError("Please input Course Name")
            }
            let filteredCourse = course.filter(item => (item.name == enrolledTo) || (item.name == selectedLead?.enrolledTo))
            console.log(filteredCourse)

            if (filteredCourse?.length == 0) {
                setSaving(false)
                return setError("Pleas Input a Valid Course Name");
            }

        }

        setError("")

        const obj = {
            enrolledTo,
            discountSource,
            leadDiscount,
            discountUnit: discountUnit == "%" ? "percent" : "flat",
            originalPrice,
            paidAmount: lastPaid,
            totalDue,
            followUpDate: followUpDate,
            leadStatus: modelStatus,
            nextEstimatedPaymentDate: estemitePaymentDate,
            note: notes.filter(item => item?.status == "unsaved").map(({ text, by }) => ({ text, by })),
            lastContacted: Date.now()
        }

        if (modelStatus === "Enrolled" && !selectedLead?.enrolledAt) {
            obj.enrolledAt = Date.now();
        }

        const cleanedObj = Object.fromEntries(
            Object.entries(obj).filter(([_, v]) => {
                if (Array.isArray(v)) return v.length > 0;
                return Boolean(v);
            })
        );

        console.log(obj, "ojbeanedObj")


        const res = await axiosPublic.patch(`/leads/${selectedLead?._id}`, cleanedObj)
        console.log(res.data)
        setSaving(false)
        refetch()
        setSelectedLead(null)

    }

    useEffect(() => {
        if (selectedLead) {
            setModelStatus(selectedLead.leadStatus || "Pending");
            setNotes(selectedLead?.note)
        }
    }, [selectedLead]);


    const handleAddNote = (e) => {
        e.preventDefault()
        setNotes([...notes, { text: e.target.note?.value, status: "unsaved", by: user?.name, date: formateDate(Date.now()) }])
        e.target.reset()
    }

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


    return (
        selectedLead && <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
            <div>
                <div className={`bg-base-100 w-full   rounded-lg shadow-lg p-6 relative grid grid-cols-1 ${modelStatus == "Enrolled" ? "md:grid-cols-2 lg:grid-cols-4 max-w-7xl" : "md:grid-cols-3 lg:grid-cols-3 max-w-5xl"} gap-6 max-h-[90vh] overflow-y-auto`}>

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
                    <div className="bg-base-200 max-h-[470px] overflow-y-auto border border-base-300 rounded p-4 pt-0 w-full  shadow-md space-y-2 text-sm">
                        <h3 className="text-lg font-bold mb-3 border-b border-base-300 pb-2">Lead Info</h3>

                        <div className="space-y-2">
                            <p><span className="font-semibold text-white/80">Name:</span> {selectedLead.name}</p>
                            <p><span className="font-semibold text-white/80">Email:</span> {selectedLead.email}</p>
                            <p><span className="font-semibold text-white/80">Phone:</span> {selectedLead.phone}</p>
                            <p><span className="font-semibold text-white/80">Address:</span> {selectedLead.address}</p>
                            <p><span className="font-semibold text-white/80">Internsted Course:</span> {selectedLead.seminarTopic}</p>
                            <p><span className="font-semibold text-white/80">Course Type:</span> {selectedLead.seminarType}</p>
                            <p><span className="font-semibold text-white/80">Created By:</span> {selectedLead.createdBy}</p>
                            <p><span className="font-semibold text-white/80">Assigned Date:</span> {formateDate(selectedLead.assignDate)}</p>
                            <p><span className="font-semibold text-white/80">Follow-Up Date:</span> {selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</p>
                            <p><span className="font-semibold text-white/80">Last Contacted:</span> {selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}</p>
                        </div>

                        {selectedLead?.questions && Object.keys(selectedLead.questions).length > 0 && (
                            <div className="space-y-2">
                                <h4 className="font-semibold mb-1 mt-4 border-b pb-2">Questions</h4>
                                <ul className=" mt-2 text-xs space-y-3">
                                    {Object.entries(selectedLead.questions).map(([q, a], i) => (
                                        <li key={i}>
                                            <span className="font-semibold text-white/80">{q}</span><br className="mt-2" /><span className="text-white "> {a}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}



                    </div>

                    {/*  Column 2: Notes */}
                    <div className="space-y-2 flex flex-col text-sm">
                        <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
                        <div className="space-y-2 h-[250px]   overflow-y-auto">
                            {notes?.map((note, i) => (
                                <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200  rounded">
                                    <p className="text-xs opacity-70">
                                        {formateDate(note.date || note.createdAt)} • {note.by}
                                        {note?.status == "unsaved" && <span title="Click Save Change Button to save the note" className="ml-2 text-yellow-500 font-semibold">(Unsaved)</span>}
                                    </p>
                                    <p>{note.text}</p>
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

                    {modelStatus == "Enrolled" && <div className="space-y-2  flex flex-col text-sm">
                        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>

                        <CourseInput
                            courseInput={courseInput}
                            setCourseInput={setCourseInput}
                            selectedLead={selectedLead}

                        />


                    </div>}

                    {/*  Column 3: Actions */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold">Actions</h3>

                        <div className="flex gap-2 justify-center ">
                            <div className="flex-1">
                                <QR value={formatBDNumber(selectedLead?.phone)} />
                            </div>
                            <div className="space-y-2 flex-2">

                                <a
                                    // href={`tel:017429500624`}
                                    href={`tel:${formatBDNumber(selectedLead?.phone)}`}
                                    // href="http://192.168.10.10/webclient/#/call/017429500624"
                                    className=" flex gap-2 !py-3 w-full bg-[#373737] border border-[#373737] btn  "
                                >
                                    Call on <Image alt="3CX" src={"/logo/3cx.png"} className="w-auto h-5 " width={1000} height={1000} />
                                </a>

                                <a
                                    href={`https://web.whatsapp.com/send/?phone=%2B${selectedLead.phone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className=" flex gap-2 !py-3 w-full bg-[#34DA51] border border-[#34DA51] btn "
                                >
                                    <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5 " width={1000} height={1000} />  Call on Whatsapp
                                </a>
                            </div>
                        </div>

                        <div className="relative w-full">
                            <div className="dropdown  w-full">
                                <label
                                    tabIndex={0}
                                    className="btn min-w-full btn-outline capitalize"
                                >
                                    Status ({modelStatus})
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content z-[999] !fixed    menu p-2 shadow bg-base-200 rounded-box w-76"
                                >
                                    {statusOptions.filter(item => item != "All").map((s) => (
                                        <li key={s}>
                                            <button
                                                onClick={() => {
                                                    setModelStatus(s)
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

                        {modelStatus == "Enrolled" && <div className="flex flex-col mt-2 gap-3">
                            <label className="text-sm ">Next Estimate payment Date</label>

                            <input
                                type="datetime-local"
                                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
                                value={estemitePaymentDate}
                                onChange={(e) => setEstimatePaymentDate(e.target.value)}
                            />

                        </div>
                        }

                        <p className="text-red-500 font-semibold">{error}</p>

                        <button

                            onClick={handleSaveChanges}
                            title={selectedLead?.isLocked ? "Lead is Locked . Contact Admin to modify the leads " : ""}
                            disabled={saving || selectedLead?.isLocked}
                            className="btn w-full -mt-1  btn-primary bg-blue-600  text-white hover:bg-[#333] border border-gray-600 "
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