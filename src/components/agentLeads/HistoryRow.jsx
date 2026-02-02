import { formateDate } from "@/utils/date";
import { useState } from "react";
import { FaCheck, FaEdit, FaTimes } from "react-icons/fa";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const HistoryRow = ({ item, originalItem, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Format date for HTML input (YYYY-MM-DD)
  const getInputValue = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  };

  const [tempDate, setTempDate] = useState(getInputValue(item.date));

  const handleSave = () => {
    onUpdate(tempDate); // Send new date to parent
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempDate(getInputValue(item.date)); // Revert to current value
    setIsEditing(false);
  };

  // Check if date is different from the saved database version
  const isUnsaved = getInputValue(item.date) !== getInputValue(originalItem?.date);

  return (
    <div className="flex w-full mt-3 justify-between items-center text-sm">
      <div className="flex gap-2 items-center">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="date"
              className="input input-xs input-bordered focus:outline-0 focus:border-blue-600"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
            />
            <button onClick={handleSave} className="text-green-500 hover:text-green-400" title="Confirm">
              <FaCheck />
            </button>
            <button onClick={handleCancel} className="text-red-500 hover:text-red-400" title="Cancel">
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 group">
            <h2 className="font-medium">
              {formateDate(item.date)}
            </h2>
            
            {/* Show Unsaved Indicator */}
            {isUnsaved && <span className="text-yellow-500 text-xs font-bold">(Unsaved)</span>}

            {/* Edit Button */}
            <button 
              onClick={() => setIsEditing(true)} 
              className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <FaEdit />
            </button>
          </div>
        )}
      </div>

      <p className="flex items-center font-semibold">
        <FaBangladeshiTakaSign /> {item?.paidAmount}
      </p>
    </div>
  );
};



export default HistoryRow