import { TbCurrencyTaka } from "react-icons/tb";


export const formateDiscount = (row) => {
  if (!row || !row.mode) return "—";

  const isCommitted = row.authority === "committed";

  // Format percent
  const fmtPct = (v) => {
    if (v == null || isNaN(v)) return "—";
    const n = Number(v);
    return Number.isInteger(n) ? `${n}%` : `${n.toFixed(2)}%`;
  };

  // Format BDT with styled currency sign
  const fmtBDT = (v) => {
    if (v == null || isNaN(v)) return "—";
    const n = Number(v);
    return (
      <p className="flex items-center  ">
        <span ><TbCurrencyTaka className="text-xl -mr-1" /></span>
        {Number.isInteger(n) ? n : n.toFixed(2)}
      </p>
    );
  };

  const capSuffix =
    row.mode === "percent" && row.capAmount != null && !isNaN(row.capAmount) ? (
      <>
        {" "}
        (cap {fmtBDT(row.capAmount)})
      </>
    ) : (
      ""
    );

  if (row.mode === "percent") {
    if (isCommitted) {
      // committed + percent -> "60%" (+cap)
      return row.value != null ? (
        <>
          {fmtPct(row.value)}
          {capSuffix}
        </>
      ) : (
        "—"
      );
    }
    // flexible + percent -> "5%-10%" (+cap)
    const min = fmtPct(row.minValue);
    const max = fmtPct(row.maxValue);
    if (min === "—" && max === "—") return "—";
    return (
      <>
        {min}-{max}
        {capSuffix}
      </>
    );
  }

  if (row.mode === "amount") {
    if (isCommitted) {
      // committed + amount -> styled currency + value
      return row.value != null ? fmtBDT(row.value) : "—";
    }
    // flexible + amount -> styled currency for both min/max
    const minVal =
      row.minValue != null && !isNaN(row.minValue)
        ? fmtBDT(row.minValue)
        : "—";
    const maxVal =
      row.maxValue != null && !isNaN(row.maxValue)
        ? fmtBDT(row.maxValue)
        : "—";
    return (
      <>
        {minVal} - {maxVal}
      </>
    );
  }

  return "—";
};
