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
  // Format BDT with styled currency sign
  const fmtBDT = (v) => {
    if (v == null || isNaN(v)) return "—";
    const n = Number(v);
    return (
      <span className="inline-flex items-center whitespace-nowrap">
        <TbCurrencyTaka className="text-xl -mr-1" />
        {Number.isInteger(n) ? n : n.toFixed(2)}
      </span>
    );
  };

  const capSuffix =
    row.mode === "percent" && row.capAmount != null && !isNaN(row.capAmount) ? (
      <span className="whitespace-nowrap flex items-center">
        (cap {fmtBDT(row.capAmount)})
      </span>
    ) : (
      ""
    );

  if (row.mode === "percent") {
    if (isCommitted) {
      // committed + percent -> "60%" (+cap)
      return row.value != null ? (
        <span className="flex items-center">
          {fmtPct(row.value)}
          {capSuffix}
        </span>
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
        <p> {min}-{max}</p>
        <p className="text-nowrap">{capSuffix}</p>

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
