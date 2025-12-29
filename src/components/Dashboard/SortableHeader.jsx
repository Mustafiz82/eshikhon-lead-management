import { FaSortUp, FaSortDown } from "react-icons/fa";

const SortableHeader = ({
  label,
  sortKey,
  currentSortKey,
  currentSortOrder,
  setSortKey,
  setSortOrder,
  align = "center",
}) => {
  const isActive = currentSortKey === sortKey;

  const handleSort = () => {
    if (!isActive) {
      setSortKey(sortKey);
      setSortOrder("asc");
    } else {
      setSortOrder(currentSortOrder === "asc" ? "desc" : "asc");
    }
  };

  const alignClass =
    align === "left"
      ? "justify-start"
      : align === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <div
      onClick={handleSort}
      className={`flex items-center gap-1 ${alignClass} cursor-pointer select-none`}
    >
      <span className={isActive ? "text-white font-medium" : ""}>
        {label}
      </span>

      <div className="flex flex-col leading-none">
        <FaSortUp
          className={`text-[12px] -mb-[5px] ${
            isActive && currentSortOrder === "asc"
              ? "text-white"
              : "text-gray-500"
          }`}
        />
        <FaSortDown
          className={`text-[12px] ${
            isActive && currentSortOrder === "desc"
              ? "text-white"
              : "text-gray-500"
          }`}
        />
      </div>
    </div>
  );
};

export default SortableHeader;
