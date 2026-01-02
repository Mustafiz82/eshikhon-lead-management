import React from 'react';

const useDueCalculation = (
    originalPrice,
    lastPaid,
    inputDiscountAmount,
    selectedLead,
    inputDiscountUnit,
) => {

    console.log({ originalPrice,
    lastPaid,
    inputDiscountAmount,
    selectedLead,
    inputDiscountUnit})

    let inputDiscountFlatAmount = inputDiscountAmount
    let alreadyPaid = selectedLead?.history?.reduce((a , c) => (a + c.paidAmount) , 0) || 0
    console.log(alreadyPaid)

    if (inputDiscountUnit == "%") {
        inputDiscountFlatAmount = (inputDiscountAmount * originalPrice)/100
    }
   
    return Math.round(originalPrice - inputDiscountFlatAmount - lastPaid - alreadyPaid)

};

export default useDueCalculation;



// whats the original course price the time when he purched
// what the original discount amount hte time when he purched 
// how much amout he have already paid before 
// how much amout he is paying now . 
// if any refund is dont value = 0 if not continue 
// refunded ? 0 :  originalPrice - dicountamount - already paid - last paid



