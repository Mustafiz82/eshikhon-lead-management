// Returns { minValue, maxValue } for the discount input
export function getDiscountBounds(selectedDiscountUnit, selectedDiscountObject, price) {
    let minValue = 0;
    let maxValue = 0;

    console.log(selectedDiscountUnit, selectedDiscountObject, price)

   
    const ruleMin = parseFloat(selectedDiscountObject?.minValue);
    const ruleMax = parseFloat(selectedDiscountObject?.maxValue);
    const cap = parseFloat(selectedDiscountObject?.capAmount);

    // If missing essential data → safe fallback
    if (!selectedDiscountObject || !price) {
        return { minValue, maxValue };
    }

    // ---------------------------
    // USER INPUT MODE: PERCENT %
    // ---------------------------
    if (selectedDiscountUnit === "%") {

        if (selectedDiscountObject.mode === "percent") {
            // Rule is also percent

            minValue = ruleMin;

            // max discount in amount from rule percent
            const ruleMaxAmount = (ruleMax / 100) * price;

            // If capAmount is LOWER → cap wins
            if (cap < ruleMaxAmount) {
                maxValue = Math.floor((cap / price) * 100); // convert amount → percent
            } else {
                maxValue = ruleMax;
            }

        } else {
            // Rule is in amount → convert to percent
            minValue = Math.floor((ruleMin / price) * 100);
            maxValue = Math.floor((ruleMax / price) * 100);
        }

    } else {
        // ---------------------------
        // USER INPUT MODE: AMOUNT ৳
        // ---------------------------

        if (selectedDiscountObject.mode === "amount") {
            // Rule is also amount
            minValue = ruleMin;

            // max = smaller of (rule max amount, cap amount)
            maxValue = Math.min(ruleMax, cap);

        } else {
            // Rule is percent → convert rule to amount
            const ruleMinAmount = (ruleMin / 100) * price;
            const ruleMaxAmount = (ruleMax / 100) * price;

            minValue = Math.floor(ruleMinAmount);

            // If capAmount is LOWER → cap wins
            maxValue = cap ? Math.min(ruleMaxAmount, cap) : ruleMaxAmount 

      }
    }

    return { minValue, maxValue };
}
