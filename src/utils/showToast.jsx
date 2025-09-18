// utils/showToast.js
import { toast, Slide } from "react-toastify";

// Reusable wrapper
export const showToast = (message, type = "success") => {
  const options = {
    position: "top-right",        // top-right corner
    autoClose: 4000,              // auto dismiss in 4s
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",                // dark theme
    transition: Slide,
    className: "custom-toast",    // custom styling
  };

  switch (type) {
    case "success":
      return toast.success(message, options);
    case "error":
      return toast.error(message, options);
    case "warning":
      return toast.warning(message, options);
    default:
      return toast(message, options);
  }
};
