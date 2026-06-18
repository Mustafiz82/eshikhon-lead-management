"use client";
import { useContext, useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { formateDate } from "./date";
import { AuthContext } from "@/context/AuthContext";
import useDiscountCalculation from "@/hooks/useDiscountCalculation";
import useDueCalculation from "@/hooks/useDueCalculation";
import { FaEdit } from "react-icons/fa";
import HistoryRow from "@/components/agentLeads/HistoryRow";
import axiosPublic from "@/api/axios";
import { findBestCourse } from "./matchCourseName";

export default function CourseInput({
  selectedLead,
  searchInput,
  setSearchInput,
  setError,
  course,
  setSelectedCourseType,
  orderNumber, setOrderNumber,
  coursePrice, setCoursePrice,
  discount, setDiscount,
  lastPaid, setLastPaid,
  dueAmount, setDueAmount,
  estimatedPaymentDate, setEstimatedPaymentDate,
  localHistory, setLocalHistory, setOrderStatus , setCustomerPhone , setOrderCompletionDate
}) {


  const { user: loggedUser } = useContext(AuthContext)



  const findOrderDetails = async (e) => {
    if (e.key === "Enter") {
      console.log(orderNumber)
      try {

        if (orderNumber?.toString()?.length === 7) {
          const res = await axiosPublic.get(
            `/leads/order/${orderNumber}?searchInput=${searchInput}&email=${loggedUser?.email}`,
          );

          console.log(res.data);
          
          if (res?.data) {
            setOrderStatus(res?.data?.status)
            setCoursePrice(parseInt(res?.data?.originalPrice))
            setDiscount(parseInt(res?.data?.discount))
            res?.data?.type == "Online" && setLastPaid(parseInt(res?.data?.total))
            res?.data?.type == "Online" && setDueAmount(res?.data?.originalPrice - res?.data?.discount - res?.data?.total)
            res?.data?.type == "Offline" && setDueAmount(res?.data?.originalPrice - res?.data?.discount)
            setSearchInput(findBestCourse(res?.data?.courseName, course)?.name)
            setSelectedCourseType(res?.data?.type)
            setCustomerPhone(res?.data?.customerPhone)
setOrderCompletionDate(res.data.orderCompletionDate);

            setError()
          }
        }
      } catch (error) {
        console.log(error.response)
        setError(error.response?.data?.title || error.response?.data.message);
      }


    }
  }

  const handleHistoryUpdate = (index, newDate) => {
    const updatedList = [...localHistory];
    updatedList[index].date = newDate;
    setLocalHistory(updatedList);
  };

  const calcDueAmount = (e) => {
    if (e.key === "Enter") {
      setDueAmount(coursePrice - discount - (selectedLead?.totalPaid || 0) - lastPaid)
    }
  }





  return (
    <div className="w-full max-w-xl mx-auto space-y-4">


      <div className="col-span-2">

        <input
          type="number"
          value={orderNumber}
          onChange={(e) => setOrderNumber((e.target.value))}
          onKeyDown={findOrderDetails}
          placeholder="Enter Order Number"
          className="input input-bordered w-full disabled:bg-transparent focus:outline-0 focus:border-blue-600 disabled:border disabled:border-gray-600"
        />

      </div>




      <div className="grid grid-cols-4 gap-4">
        {/* Original Price */}
        <div className="col-span-2">
          <label className="block mb-1 text-white/80 text-sm">
            Original Price
          </label>
          <input
            type="number"
            value={coursePrice}
            disabled
            placeholder="Auto-filled"
            className="input input-bordered w-full disabled:bg-transparent focus:outline-0 focus:border-blue-600 disabled:border disabled:border-gray-600"
          />

        </div>

        {/* Discount */}
        <div className="col-span-2">
          <label
            className="block mb-1 text-white/80 text-sm">
            Discount </label>
          <div className="join w-full">
            <input
              value={discount}
              disabled
              type="number"
              placeholder="Enter discount"
              className="input col-span-2 input-bordered join-item w-full focus:outline-0 focus:border-blue-600 disabled:bg-transparent disabled:border disabled:border-gray-600"
            />
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
            value={lastPaid}
            onChange={(e) => setLastPaid(e.target.value)}
            onBlur={() => {
              setDueAmount(coursePrice - discount - (selectedLead?.totalPaid || 0) -  Number(lastPaid || 0))
            }}
            onKeyDown={calcDueAmount}
            disabled={setSelectedCourseType === ""}
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
          type="date"
          // onClick={(e) => e.target.showPicker && e.target.showPicker()}
          className="input input-bordered bg- border border-gray-600 text-white rounded-md w-full focus:outline-none  focus:border-blue-600"
          value={estimatedPaymentDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setEstimatedPaymentDate(e.target.value)}
        />

      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold ">History</h2>
        <div className="max-h-28 overflow-y-auto pr-2">
          {localHistory.length > 0 ? (
            localHistory.map((item, index) => (
              <HistoryRow
                key={index}
                item={item}
                originalItem={selectedLead.history[index]}
                onUpdate={(newDate) => handleHistoryUpdate(index, newDate)}
              />
            ))
          ) : (
            <p className="mt-2 text-white/50 text-sm">No History Available</p>
          )}
        </div>
      </div>
    </div>
  );
}
