// Returns { minValue, maxValue } for the discount input
export function getDiscountBounds(selectedDiscountUnit, selectedDiscountObject, selectedCourse) {
    let minValue = 0;
    let maxValue = 0;

    const price = selectedCourse?.price;

    // If we do not have what we need, just return zeros safely
    if (!selectedDiscountObject || !price) {
        return { minValue, maxValue };
    }

    if (selectedDiscountUnit === "%") {
        // The input box is in percent
        if (selectedDiscountObject?.mode === "percent") {
            // Rule is also percent → use given min/max (but respect capAmount for max)
            minValue = parseInt(selectedDiscountObject?.minValue);

            const initialMaxValuePercent = parseInt(selectedDiscountObject?.maxValue);
            const initialMaxValueAmountAsPercent = Math.floor(
                (parseInt(selectedDiscountObject?.maxValue) / price) * 100
            );

            if (initialMaxValueAmountAsPercent < selectedDiscountObject.capAmount) {
                // capAmount is stricter when converted to percent
                maxValue = Math.floor((parseInt(selectedDiscountObject?.capAmount) / price) * 100);
            } else {
                maxValue = initialMaxValuePercent;
            }
        } else {
            // Rule is amount but input is percent → convert amount min/max to percent
            minValue = Math.floor((parseInt(selectedDiscountObject?.minValue) / price) * 100);
            maxValue = Math.floor((parseInt(selectedDiscountObject?.maxValue) / price) * 100);
        }
    } else {
        // The input box is in currency amount (৳)
        if (selectedDiscountObject?.mode === "amount") {
            // Rule is also amount → use given min/max
            minValue = parseInt(selectedDiscountObject?.minValue);
            maxValue = parseInt(selectedDiscountObject?.maxValue);
        } else {
            // Rule is percent but input is amount → convert percent min/max to amount
            minValue = Math.floor((parseInt(selectedDiscountObject?.minValue) / 100) * price);

            const initialMaxValueAsAmount = Math.floor(
                (parseInt(selectedDiscountObject?.maxValue) / 100) * price
            );

            if (selectedDiscountObject?.capAmount < initialMaxValueAsAmount) {
                maxValue = selectedDiscountObject?.capAmount;
            } else {
                maxValue = initialMaxValueAsAmount;
            }
        }
    }

    return { minValue, maxValue };
}
