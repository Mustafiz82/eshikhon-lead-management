import Papa from "papaparse";
import { showToast } from "./showToast";

// Helper to format date as "D-MMM-YYYY" (e.g., 2-Sep-2026)
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()}`;
};

// Helper to format note timestamp with hours and minutes
const formatNoteDate = (dateStr) => {
  if (!dateStr) return "No Date";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "No Date";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${d.getDate()}-${months[d.getMonth()]}-${d.getFullYear()} ${hours}:${mins}`;
};

export const handleLeadExport = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return showToast("No leads found to export", "warning");
  }

  const exportData = leads.map((l) => {
    const courses = Array.isArray(l.courses) ? l.courses : [];

    // 1. Course Names joined with " + "
    const courseNamesText = courses
      .map((c) => c.courseName?.trim())
      .filter(Boolean)
      .join(" + ");

    // 2. All Notes formatted with [Date] [Author]: Text, separated by \n\n
    const noteText = Array.isArray(l.note) && l.note.length > 0
      ? l.note
          .map((n) => {
            const author = n.by && n.by.trim() ? n.by.trim() : "System";
            const date = formatNoteDate(n.createdAt);
            return `[${date}] [${author}]:\n${n.text}`;
          })
          .join("\n\n")
      : "";

    // 3. Exact column order matching your Google Sheet
    return {
      "Date": formatDate(l.createdAt || l.firstContacted),
      "Full Name": l.name || "",
      "Phone": l.phone ? `'${l.phone}` : "", // prefixed with ' so Google Sheets keeps the leading 0
      "Email": l.email || "",
      "FB URL": l.fblink || "",
      "Address": l.address || "",
      "Intersted Course": courseNamesText,
      "Course Type": "Online",
      "Lead Source": l.leadSource || "Not Provided",
      "Entry By": l.entryBy || "",
      "Lead Status": l.leadStatus || "Pending",
      "Interested Seminar": l.interstedSeminar || "None",
      "First Call Date": formatDate(l.firstContacted),
      "Last Call Date": formatDate(l.lastContacted),
      "Followup Date": formatDate(l.followUpDate),
      "Call Count": l.callCount ?? 0,
      "Notes": noteText,
      "Order Number": l.orderNumber ?? "", // Left empty for leads without orders
      "Assign To": l.assignTo && l.assignTo !== "N/A" ? l.assignTo : "",
      "Assign Date": formatDate(l.assignDate),
    };
  });

  const csv = Papa.unparse(exportData);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `leads_sheet_export_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  showToast("Lead export completed", "success");
};


export const handleSystemBackupExport = (leads, filenamePrefix = "leads_backup") => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return showToast("No leads selected to backup", "warning");
  }

  try {
    // 1. Create a structured backup payload with audit metadata
    const backupPayload = {
      backupType: "SYSTEM_FULL_ARCHIVE",
      version: "1.0",
      exportedAt: new Date().toISOString(),
      totalLeads: leads.length,
      leads: leads, // Full, untouched database documents
    };

    // 2. Convert to JSON string (formatted with 2 spaces for readability)
    const jsonString = JSON.stringify(backupPayload, null, 2);

    // 3. Create a memory-safe Blob
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // 4. Trigger download
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${filenamePrefix}_${leads.length}_leads_${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();

    // 5. Cleanup memory
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Successfully backed up ${leads.length} leads`, "success");
  } catch (error) {
    console.error("Backup export failed:", error);
    showToast("Failed to generate backup file", "error");
  }
};