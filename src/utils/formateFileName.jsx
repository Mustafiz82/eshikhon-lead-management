export function formatFilename(originalName) {
  const now = new Date(); // already in your local timezone if system is BD
  const pad = (n) => String(n).padStart(2, "0");

  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  const dotIndex = originalName.lastIndexOf(".");
  const base = dotIndex === -1 ? originalName : originalName.slice(0, dotIndex);
  const ext = dotIndex === -1 ? "" : originalName.slice(dotIndex);

  return `${base}_${timestamp}${ext}`;
}

// Example
console.log(formatFilename("Lead-Management-test-sheet - Sheet15.csv"));
