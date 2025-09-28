import Swal from "sweetalert2";

const PRIMARY_COLOR = "#2563eb"; // Tailwind bg-blue-600

// Base dark theme config
const baseConfig = {
  background: "#1f2937", // Tailwind gray-800
  color: "#f9fafb",      // Tailwind gray-50
  confirmButtonColor: PRIMARY_COLOR,
  cancelButtonColor: "#374151", // Tailwind gray-700
};

// Generic alert
export const showAlert = (title, text, icon = "info") => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon,
  });
};

// Confirmation dialog
export const showConfirm = (title, text, confirmText = "Yes") => {
  return Swal.fire({
    ...baseConfig,
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
  });
};

// Toast notification (bottom-right)
export const showToast = (message, icon = "success") => {
  return Swal.fire({
    ...baseConfig,
    toast: true,
    position: "bottom-end",
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};
