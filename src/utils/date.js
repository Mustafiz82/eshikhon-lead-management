export function formateDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
// utils/date.js

export function parseCustomDate(dateStr) {
  // If date string is missing, empty, or not a string, return blank
  if (!dateStr || typeof dateStr !== "string" || !dateStr.trim()) {
    return "";
  }

  try {
    const parts = dateStr.trim().split("-");
    if (parts.length !== 3) {
      return "";
    }

    const [day, monthStr, year] = parts;
    const monthKey = monthStr.trim().toLowerCase().slice(0, 3);

    const months = {
      jan: 0,
      feb: 1,
      mar: 2,
      apr: 3,
      may: 4,
      jun: 5,
      jul: 6,
      aug: 7,
      sep: 8,
      oct: 9,
      nov: 10,
      dec: 11,
    };

    const monthIndex = months[monthKey];
    if (monthIndex === undefined) {
      return ""; // Invalid month name, return blank
    }

    const parsedDate = new Date(
      Date.UTC(parseInt(year, 10), monthIndex, parseInt(day, 10))
    );

    // If result is an Invalid Date, return blank
    return isNaN(parsedDate.getTime()) ? "" : parsedDate;
  } catch (error) {
    return "";
  }
}// Output: 2026-04-03T00:00:00.000Z (Ready for MongoDB)
