import Modal from "@/shared/Modal";
import React from "react";
import { formateDate } from "@/utils/date"; // <-- using your function

const DetailsModal = ({ isOpen, onClose, seletedLead }) => {
    if (!seletedLead) return null;

    // Money formatting with taka sign
    const money = (value) => {
        if (value === null || value === undefined || value === "") return "—";
        return `৳${value}`;
    };

    // Discount formatting
    const formatDiscount = (lead) => {
        if (!lead.leadDiscount) return "—";

        if (lead.discountUnit === "percent") {
            return `${lead.leadDiscount}%`;
        } else {
            return `${lead.leadDiscount}৳`;
        }
    };

    const fields = [
        { label: "Name", value: seletedLead.name },
        { label: "Interested Course", value: seletedLead.interstedCourse },
        { label: "Phone", value: seletedLead.phone },
        { label: "Interested Seminar", value: seletedLead.interstedSeminar },
        { label: "Email", value: seletedLead.email },
        { label: "Course Type", value: seletedLead.interstedCourseType },
        { label: "Address", value: seletedLead.address },
        { label: "Lead Source", value: seletedLead.leadSource },
        { label: "Lead Status", value: seletedLead.leadStatus },


        // Discount (unit removed—converted)
        { label: "Original Price", value: money(seletedLead.originalPrice) },
        {
            label: "Follow Up Date",
            value: seletedLead.followUpDate ? formateDate(seletedLead.followUpDate) : "—",
        },
        { label: "Discount", value: formatDiscount(seletedLead) },
        {
            label: "Last Contacted",
            value: seletedLead.lastContacted ? formateDate(seletedLead.lastContacted) : "—",
        },
        // Money fields (always show taka sign)
        { label: "Total Paid", value: money(seletedLead.totalPaid) },
        {
            label: "Enrolled At",
            value: seletedLead.enrolledAt ? formateDate(seletedLead.enrolledAt) : "—",
        },
        { label: "Total Due", value: money(seletedLead.totalDue) },
        {
            label: "Next Estimated Payment",
            value: seletedLead.nextEstimatedPaymentDate
                ? formateDate(seletedLead.nextEstimatedPaymentDate)
                : "—",
        },
        { label: "Assign To", value: seletedLead.assignTo },
        { label: "Assign Status", value: String(seletedLead.assignStatus) },
        { label: "Created By", value: seletedLead.createdBy },

        // All dates use your formatting function



    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="max-w-5xl">
            <div className="grid grid-cols-4 gap-y-4 gap-x-8 mt-6 text-sm">

                {fields.map((item, index) => (
                    <React.Fragment key={index}>

                        {/* Label */}
                        <div className="text-gray-300 font-medium">
                            {item.label}
                        </div>

                        {/* Value */}
                        <div className="text-gray-100 break-words">
                            : {item.value || "—"}
                        </div>

                    </React.Fragment>
                ))}

            </div>

            {/* Payment History */}
            {seletedLead?.history?.length > 0 && (
                <div className="mt-10">
                    <h3 className="font-semibold text-gray-200 mb-2">Payment History:</h3>

                    <div className="space-y-2">
                        {seletedLead.history.map((h, i) => (
                            <div key={i} className="p-3 border border-blue-600 rounded">
                                <div className="grid grid-cols-4">
                                    <span className="text-gray-300">Amount</span>
                                    <span className="text-gray-100">: {money(h.paidAmount)}</span>

                                    <span className="text-gray-300">Date</span>
                                    <span className="text-gray-100">
                                        : {h.date ? formateDate(h.date) : "—"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default DetailsModal;
