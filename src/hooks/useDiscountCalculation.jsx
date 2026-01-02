import React, { useContext, useEffect, useMemo, useState } from 'react';
import useFetch from './useFetch';
import { getDiscountBounds } from '@/utils/getDiscountBounds';
import { AuthContext } from '@/context/AuthContext';

const useDiscountCalculation = (selectedCourseId, selectedLead) => {

    const { data: course } = useFetch("/course")
    const { data: discount } = useFetch("/discount")


    const [selectedDiscountID, setSelectedDiscountID] = useState("")    // ID of the Discount is selected 
    const [inputDiscountAmount, setInputDiscountAmount] = useState(0)   // The value entered on discount input
    const [inputDiscountUnit, setInputDiscountUnit] = useState()       // selected discount input 
    const [isDiscountDisabled, setIsDiscountDisabled] = useState(false)// set discount disable or not
    const { user: loggedUser } = useContext(AuthContext) // get user role 


    // Find which course is being selected
    const selectedCourse = course.find(item => item._id === selectedCourseId);

    // select which discounts are applicable for the selected Course (by expire status and applicable course id )
    const applicableDiscountOptions = discount
        ?.filter(item => {
            const now = new Date();
            const start = new Date(item.startAt);
            const end = new Date(item.expireAt);
            return (
                item?.appliesTo?.includes(String(selectedCourse?._id)) &&
                now >= start && now <= end
            );
        })

    // Find the actual selected Discount  (from id to object )
    const selectedDiscount = applicableDiscountOptions?.find(
        discount => discount.name === selectedDiscountID
    );



    // when any discount is selected or toggled it  sets amount , unit and handle disable state
    useEffect(() => {

        if (selectedDiscount?.authority === "committed") {
            setIsDiscountDisabled(true)
            setInputDiscountAmount(selectedDiscount.value)
            setInputDiscountUnit(selectedDiscount.mode === "amount" ? "৳" : "%")
        }
        else {
            setIsDiscountDisabled(false)
            if (selectedDiscount) {
                const discountInput = selectedDiscount?.mode === "amount" ? "৳" : "%"
                setInputDiscountUnit(discountInput)
            }
        }
    }, [selectedDiscount])




    // Calculate course price if previously set keep it or set the course price (prevent price movement)
    let finalOriginalPrice = 0;

    if (!selectedCourse) {
        finalOriginalPrice = 0;
    }
    else if (selectedLead?.interstedCourse === selectedCourse?.name && selectedLead?.originalPrice) {
        finalOriginalPrice = selectedLead.originalPrice;
    }
    else {
        finalOriginalPrice = selectedCourse.price;
    }


    // Find the minimum and maximam discount 
    const minMaxDiscount = useMemo(() => {
        return getDiscountBounds(inputDiscountUnit, selectedDiscount, finalOriginalPrice)
    }, [selectedDiscount, inputDiscountUnit, selectedCourse])



    return {
        originalPrice: finalOriginalPrice,
        isDiscountDisabled,
        setIsDiscountDisabled,
        applicableDiscountOptions,
        selectedDiscountID,
        setSelectedDiscountID,
        selectedDiscount,
        inputDiscountAmount,
        setInputDiscountAmount,
        inputDiscountUnit,
        setInputDiscountUnit,
        minValue: minMaxDiscount.minValue,
        maxValue: minMaxDiscount.maxValue,

    }
};

export default useDiscountCalculation;