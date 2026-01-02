"use client";
import { useContext, useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { formateDate } from "./date";
import { AuthContext } from "@/context/AuthContext";
import useDiscountCalculation from "@/hooks/useDiscountCalculation";
import useDueCalculation from "@/hooks/useDueCalculation";

export default function CourseInput({ setCourseInput, selectedLead, selectedCourseId }) {


  const { user: loggedUser } = useContext(AuthContext)     // get user role 
  const [lastPaid, setLastPaid] = useState(0)              // handle input payment amount
  const [estimatedPaymentDate, setEstimatedPaymentDate] = useState(null)  // next payment date



  // get discount related result , option , course price from hook . 
  const {
    originalPrice,
    applicableDiscountOptions,
    selectedDiscount,
    selectedDiscountID,
    setSelectedDiscountID,
    inputDiscountAmount,
    setInputDiscountAmount,
    isDiscountDisabled,
    setIsDiscountDisabled,
    inputDiscountUnit,
    setInputDiscountUnit,
    minValue,
    maxValue,
  } = useDiscountCalculation(selectedCourseId, selectedLead)


  // Calculate Due 
  const dueAmount = useDueCalculation(
    originalPrice,
    lastPaid,
    inputDiscountAmount,
    selectedLead,
    inputDiscountUnit,
  )


  //  send course input data and states to lead modal 
  useEffect(() => {
    setCourseInput({
      estemitePaymentDate: estimatedPaymentDate ?? null,
      discountSource: selectedDiscount?.name ?? "",
      leadDiscount: inputDiscountAmount,
      discountUnit: inputDiscountUnit,
      originalPrice: originalPrice,
      lastPaid: lastPaid ?? 0,
      totalDue: dueAmount,
      minValue, maxValue
    });
  }, [
    estimatedPaymentDate,
    selectedDiscount,
    inputDiscountUnit,
    inputDiscountAmount,
    originalPrice,
    lastPaid,
    dueAmount,
  ]);


  // initialize the state with previous value from backend
  useEffect(() => {

    if (selectedLead?.nextEstimatedPaymentDate) {
      let nextPaymentDate = new Date(selectedLead?.nextEstimatedPaymentDate).toISOString().slice(0, 16)
      setEstimatedPaymentDate(nextPaymentDate)
    }

    setInputDiscountAmount(selectedLead?.leadDiscount)
    setInputDiscountUnit(selectedLead?.discountUnit == "amount" ? "৳" : "%")
    setSelectedDiscountID(selectedLead?.discountSource)

    console.log(loggedUser)

    if (loggedUser?.role == "user" && selectedLead?.leadDiscount) {
      console.log("true")
      setIsDiscountDisabled(true)
    }
  }, [selectedLead])




  return (
    <div className="w-full max-w-xl mx-auto space-y-4">

      <select
        // disabled={loggedUser.role == "user" &&  selectedLead?.leadDiscount}
        onChange={(e) => setSelectedDiscountID(e.target.value)}
        value={selectedDiscountID}
        className="select focus:border-blue-600 px-2 focus:outline-0 select-bordered w-full"
      >
        <option>Select Discount</option>
        {
          applicableDiscountOptions.map(item => <option
            value={item.name}
            key={item._id}> {item?.name}
          </option>)
        }
      </select>


      {/* Prices + Discount */}
      <div className="grid grid-cols-5 gap-4">
        {/* Original Price */}
        <div className="col-span-2">
          <label className="block mb-1 text-white/80 text-sm">
            Original Price
          </label>
          <input
            type="number"
            value={originalPrice}
            placeholder="Auto-filled"
            className="input input-bordered w-full disabled:bg-transparent disabled:border disabled:border-gray-600"
            disabled
          />
        </div>

        {/* Discount */}
        <div className="col-span-3">
          <label
            className="block mb-1 text-white/80 text-sm">
            Discount {(minValue && maxValue) ? `( ${minValue + inputDiscountUnit} - ${maxValue + inputDiscountUnit})` : null}</label>

          <div className="join grid grid-cols-3 w-full">
            <input

              value={inputDiscountAmount}
              disabled={isDiscountDisabled}
              onChange={(e) => setInputDiscountAmount(e.target.value)}
              type="number"
              min={minValue}
              max={maxValue}
              placeholder="Enter discount"
              className="input col-span-2 input-bordered join-item w-full focus:outline-0 focus:border-blue-600"
            />
            <select
              value={inputDiscountUnit}
              disabled={isDiscountDisabled}
              onChange={e => setInputDiscountUnit(e.target.value)}
              className="select select-bordered join-item focus:outline-0 focus:border-blue-600"
            >
              <option>%</option>
              <option>৳</option>
            </select>

          </div>
        </div>
      </div>

      {/* Paid / Due */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-white/80 text-sm">
            Last Paid amount
          </label>
          <input
            type="number"
            value={lastPaid ?? 0}
            onChange={(e) => setLastPaid(e.target.value)}
            placeholder="0"
            className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-white/80 text-sm">
            Total Due amount
          </label>
          <input
            type="number"
            disabled
            value={dueAmount}
            className="input disabled:bg-transparent disabled:border disabled:border-gray-600 input-bordered w-full focus:outline-0 focus:border-blue-600"
          />

        </div>
      </div>

      <div className="flex flex-col mt-2 gap-3">
        <label className="text-sm ">Next Estimate payment Date</label>

        <input
          type="datetime-local"
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
          className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
          value={estimatedPaymentDate}
          onChange={(e) => setEstimatedPaymentDate(e.target.value)}
        />

      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold ">History</h2>
        <div className="max-h-28 overflow-y-auto">
          {
            selectedLead?.history?.map(item => <div className="flex w-full mt-3 justify-between">
              <h2>{formateDate(item?.date)}</h2>
              <p className="flex items-center">
                <FaBangladeshiTakaSign /> {item?.paidAmount}
              </p>
            </div>)
          }

          {
            selectedLead?.history?.length == 0 && <p>No History Available</p>
          }


        </div>
      </div>
    </div>
  );
}
