import Papa from "papaparse";
import { showToast } from "./showToast";

export const handleLeadExport = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return showToast("No leads found to export", "warning");
  }


  console.log("leads")
  console.log(leads)

  const exportData = leads.map((l) => {
    const courses = Array.isArray(l.courses) ? l.courses : [];

    // Per-course price math: each course now carries its own
    // originalPrice/leadDiscount/discountUnit, so this is computed
    // per course, not looked up from an external catalog.
    const coursesWithMath = courses.map((c) => {
      const originalPrice = typeof c.originalPrice === "number" ? c.originalPrice : 0;
      let discountedPrice = originalPrice;

      if (c.leadDiscount && c.leadDiscount > 0) {
        if (c.discountUnit === "percent") {
          discountedPrice = Math.round(originalPrice * (1 - c.leadDiscount / 100));
        } else if (c.discountUnit === "flat") {
          discountedPrice = Math.max(0, originalPrice - c.leadDiscount);
        }
      }

      const coursePaid = typeof c.totalPaid === "number" ? c.totalPaid : 0;
      const courseDue =
        typeof c.totalDue === "number" ? c.totalDue : Math.max(0, discountedPrice - coursePaid);

      return { ...c, originalPrice, discountedPrice, coursePaid, courseDue };
    });

    const totalOriginalPrice = coursesWithMath.reduce((sum, c) => sum + c.originalPrice, 0);
    const totalDiscountedPrice = coursesWithMath.reduce((sum, c) => sum + c.discountedPrice, 0);

    // Human-readable one-line-per-course summary, e.g.
    // "MERN Stack Web Development (Online): price 8490, paid 8490, due 0 | Django (Online): price 3990, paid 3990, due 0"
    const coursesText = coursesWithMath
      .map(
        (c) =>
          `${c.courseName || "Unknown"} (${c.courseType || "N/A"}): price ${c.originalPrice}, discounted ${c.discountedPrice}, paid ${c.coursePaid}, due ${c.courseDue}`,
      )
      .join(" | ");

    const courseNamesText = coursesWithMath.map((c) => c.courseName).filter(Boolean).join(", ");
    const courseTypesText = coursesWithMath.map((c) => c.courseType).filter(Boolean).join(", ");

    // Payment history now lives inside courses[].history, not top-level
    // history (which is always empty on the new schema). Prefix each
    // entry with the course name so multi-course leads stay readable.
    const historyText = coursesWithMath
      .flatMap((c) =>
        (c.history || []).map(
          (h) => `${c.courseName || "Unknown"}: ${new Date(h.date).toLocaleString()} → ${h.paidAmount}`,
        ),
      )
      .join(" | ");

    // Derive last payment across all courses (most recent history entry
    // by date), since l.lastPayment isn't populated on the raw lead doc.
    const allHistoryEntries = coursesWithMath.flatMap((c) =>
      (c.history || []).map((h) => ({ ...h, courseName: c.courseName })),
    );
    const lastPaymentEntry = allHistoryEntries.length
      ? allHistoryEntries.reduce((latest, h) =>
          new Date(h.date) > new Date(latest.date) ? h : latest,
        )
      : null;

    const noteText = (l.note || []).map((n) => `${n.by || "unknown"}: ${n.text}`).join(" | ");

    return {
      "Full Name": l.name || "",
      "Email Address": l.email || "",
      "Phone Number": l.phone || "",
      Address: l.address || "",

      "Course Names": courseNamesText,
      "Course Types": courseTypesText,
      "Course Count": coursesWithMath.length,

      "Lead Source": l.leadSource || "",
      "Lead Status": l.leadStatus || "",
      "Assign To": l.assignTo || "",

      "Total Original Price": totalOriginalPrice,
      "Total Discounted Price": totalDiscountedPrice,

      "Total Paid": l.totalPaid ?? coursesWithMath.reduce((s, c) => s + c.coursePaid, 0),
      "Total Due":
        l.leadStatus === "Enrolled"
          ? coursesWithMath.reduce((s, c) => s + c.courseDue, 0)
          : 0,

      "Refund Amount": l.refundAmount ?? 0,

      "Last Payment Amount": lastPaymentEntry?.paidAmount ?? 0,
      "Last Payment Date": lastPaymentEntry?.date
        ? new Date(lastPaymentEntry.date).toISOString().slice(0, 19).replace("T", " ")
        : "",

      "Course Breakdown": coursesText,
      "Payment History": historyText,
      Notes: noteText,

      "Call Count": l.callCount ?? 0,
      "Locked": l.isLocked ? "YES" : "NO",
      "Entry By": l.entryBy || "",

      "First Contacted": l.firstContacted ? new Date(l.firstContacted).toLocaleString() : "",
      "Last Contacted": l.lastContacted ? new Date(l.lastContacted).toLocaleString() : "",
      "Follow Up Date": l.followUpDate ? new Date(l.followUpDate).toLocaleString() : "",
      "Enrolled At": l.enrolledAt ? new Date(l.enrolledAt).toLocaleString() : "",
      "Next Estimated Payment Date": l.nextEstimatedPaymentDate
        ? new Date(l.nextEstimatedPaymentDate).toLocaleString()
        : "",

      "Order Number": l.orderNumber ?? "",
      "Source File": l.sourceFileName || "",

      "Created At": l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
      "Assigned At": l.assignDate ? new Date(l.assignDate).toLocaleString() : "",
      "Updated At": l.updatedAt ? new Date(l.updatedAt).toLocaleString() : "",
    };
  });

  const csv = Papa.unparse(exportData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lead_export_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  showToast("Lead export completed", "success");
};