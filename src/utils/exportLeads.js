import Papa from "papaparse";
import { showToast } from "./showToast";

export const handleLeadExport = (course , leads) => {

    if (!Array.isArray(leads) || leads.length === 0) {
    return showToast("No leads found to export", "warning");
  }

  console.log(course.items);

  // If course data is required for correct export, don’t export before it exists.
  // (If you have a loading flag from useFetch, check that instead.)
  if (!course?.length) {
    return showToast("Course list not loaded yet", "warning");
  }

  const norm = (v) =>
    String(v ?? "")
      .trim()
      .toLowerCase();

  const coursePriceMap = new Map(
    (course ?? []).map((c) => [
      `${norm(c.name)}|${norm(c.type)}`,
      c.price ?? 0,
    ]),
  );

  console.log(coursePriceMap);

  const exportData = leads.map((l) => {
    const courseKey = `${norm(l.interstedCourse)}|${norm(l.interstedCourseType)}`;
    const coursePrice = coursePriceMap.get(courseKey);

    // ✅ Original Price comes from course price (fallbacks included)
    const originalPrice =
      (typeof coursePrice === "number" ? coursePrice : undefined) ??
      (typeof l.originalPrice === "number" ? l.originalPrice : 0);

    // ✅ Discount uses *this* originalPrice
    let discountedPrice = originalPrice;
    if (l.leadDiscount && l.leadDiscount > 0) {
      if (l.discountUnit === "percent") {
        discountedPrice = Math.round(
          originalPrice * (1 - l.leadDiscount / 100),
        );
      } else if (l.discountUnit === "flat") {
        discountedPrice = Math.max(0, originalPrice - l.leadDiscount);
      }
    }

    const historyText = (l.history || [])
      .map((h) => `${new Date(h.date).toLocaleString()} → ${h.paidAmount}`)
      .join(" | ");

    const noteText = (l.note || [])
      .map((n) => `${n.by || "unknown"}: ${n.text}`)
      .join(" | ");

    return {
      "Full Name": l.name || "",
      "Email Address": l.email || "",
      "Phone Number": l.phone || "",
      Address: l.address || "",
      "Seminar Topic": l.interstedCourse || "",
      "Seminar Type": l.interstedCourseType || "",
      "Lead Source": l.leadSource || "",
      "Lead Status": l.leadStatus || "",
      "Assign To" : l.assignTo || "" ,

      "Original Price": originalPrice,
      "Discounted Price": discountedPrice,

      "Total Paid": l.totalPaid ?? 0,
      "Total Due":
        l.leadStatus == "Enrolled" ? discountedPrice - l.totalPaid : 0,
      "Last Payment Amount": l.lastPayment?.paidAmount ?? 0,
      // "Last Payment Date": l.lastPayment?.date
      //   ? new Date(l.lastPayment.date).toLocaleString()
      //   : "",
      "Last Payment Date": l.lastPayment?.date ? new Date(l.lastPayment?.date).toISOString().slice(0,19).replace("T"," ") : "" ,
      "Payment History": historyText,
      Notes: noteText,
      "Created At": l.createdAt ? new Date(l.createdAt).toLocaleString() : "",
      "Assigned At": l.assignDate ? new Date(l.assignDate).toLocaleString() : "",

      // optional but useful for debugging mismatches:
      "Course Price Found": typeof coursePrice === "number" ? "YES" : "NO",
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
