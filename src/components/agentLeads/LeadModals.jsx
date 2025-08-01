import { formateDate } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";

const LeadModals = ({ selectedLead, setSelectedLead, statusOptions}) => {

    const [modelStatus, setModelStatus] = useState("Pending")
    const [followUpDate, setFollowUpDate] = useState("")


    return (
        selectedLead && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-base-100 w-full max-w-5xl rounded-lg shadow-lg p-6 relative grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[90vh] overflow-y-auto">

                {/* Top bar with lead info */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={() => setSelectedLead(null)}
                        className="btn btn-sm "
                    >
                        ✕ Close
                    </button>
                </div>
                {/* ✅ Column 1: Lead Details */}
                <div className="bg-base-200 border border-base-300 rounded p-4 pt-0 w-full max-w-sm shadow-md space-y-2 text-sm">
                    <h3 className="text-lg font-bold mb-3 border-b border-base-300 pb-2">Lead Info</h3>

                    <div className="space-y-2">
                        <p><span className="font-semibold text-white/80">Name:</span> {selectedLead.name}</p>
                        <p><span className="font-semibold text-white/80">Email:</span> {selectedLead.email}</p>
                        <p><span className="font-semibold text-white/80">Phone:</span> {selectedLead.number}</p>
                        <p><span className="font-semibold text-white/80">Address:</span> {selectedLead.address}</p>
                        <p><span className="font-semibold text-white/80">Seminar Topic:</span> {selectedLead.seminarTopic}</p>
                        <p><span className="font-semibold text-white/80">Assigned Date:</span> {formateDate(selectedLead.date)}</p>
                        <p><span className="font-semibold text-white/80">Follow-Up Date:</span> {selectedLead.followUpDate ? formateDate(selectedLead.followUpDate) : "N/A"}</p>
                        <p><span className="font-semibold text-white/80">Last Contacted:</span> {selectedLead.lastContacted ? formateDate(selectedLead.lastContacted) : "N/A"}</p>
                    </div>

                    {selectedLead.otherQuestions?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-1">Other Questions</h4>
                            <ul className="list-disc pl-5 text-xs text-base-content/70 space-y-1">
                                {selectedLead.otherQuestions.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ✅ Column 2: Notes */}
                <div className="space-y-2 flex flex-col text-sm">
                    <h3 className="text-lg font-semibold mb-2">Previous Notes</h3>
                    <div className="space-y-2  max-h-44 overflow-y-auto">
                        {selectedLead.notes?.map((note, i) => (
                            <div key={i} className="border border-base-300 mt-2 p-2 bg-base-200  rounded">
                                <p className="text-xs opacity-70">
                                    {formateDate(note.date)} • {note.by}
                                </p>
                                <p>{note.text}</p>
                            </div>
                        ))}
                        {(!selectedLead.notes || selectedLead.notes.length === 0) && (
                            <p className="text-xs text-center mt-20  text-base-content/60">No notes yet.</p>
                        )}
                    </div>

                    {/* Add new note input */}
                    <textarea
                        className="textarea resize-none focus:outline-none  focus:border-blue-600  mt-auto textarea-bordered w-full "
                        rows={3}
                        placeholder="Write a note..."
                    // Hook this to your handler
                    ></textarea>
                    <button className="btn bg-blue-600 btn-primary ">Add Note</button>
                </div>

                {/* ✅ Column 3: Actions */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Actions</h3>
                    <div className="flex flex-col gap-2">

                        <a
                            // href={`tel:017429500624`}
                            href={`tel:${selectedLead.number}`}
                            // href="http://192.168.10.10/webclient/#/call/017429500624"
                            className=" flex gap-2 !py-3 w-full bg-[#373737] btn h-full "
                        >
                            Call on <Image alt="3CX" src={"/logo/3cx.png"} className="w-auto h-5 " width={1000} height={1000} />
                        </a>

                        <a
                            href={`https://wa.me/${selectedLead.number}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className=" flex gap-2 !py-3 w-full bg-[#34DA51] btn h-full"
                        >
                            <Image alt="wsp" src={"/logo/whatsapp.png"} className="w-auto h-5 " width={1000} height={1000} />  Call on Whatsapp
                        </a>
                    </div>

                    <div className="relative w-full">
                        <div className="dropdown w-full">
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
                                {statusOptions.map((s) => (
                                    <li key={s}>
                                        <button
                                            onClick={() => setModelStatus(s)}
                                            className="capitalize"
                                        >
                                            {s}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col mt-8 gap-3">
                        <label className="text-sm ">Next Follow-Up Date</label>

                        <input
                            type="datetime-local"
                            className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
                            value={followUpDate}
                            onChange={(e) => setFollowUpDate(e.target.value)}
                        />

                    </div>

                    <button

                        className="btn w-full -mt-1  btn-primary bg-blue-600  text-white hover:bg-[#333] border border-gray-600 "
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
};

export default LeadModals;