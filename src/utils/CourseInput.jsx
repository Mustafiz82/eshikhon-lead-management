"use client";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { formateDate } from "./date";

export default function CourseInput({ courseInput, setCourseInput , selectedLead  }) {

  const [searchInput, setSearchInput] = useState("")
  const [searchSuggesion, setSearchSuggesion] = useState("")
  const [selectedDiscount, setSelectedDiscount] = useState("")
  const [selectedDiscountinput, setSelectedDiscountInput] = useState("")
  const [selectedDiscountUnit, setSelectedDiscountUnit] = useState("%")
  const [lastPaid, setlastPaid] = useState()

  console.log(selectedLead)


  const { data: course } = useFetch("/course")
  const { data: discount } = useFetch("/discount")


  const selectedDiscountObject = discount.find(item => (item.name == selectedDiscount) || (item.name == selectedLead?.discountSource))
  const isCommited =  selectedDiscountObject?.authority === "committed" 

  const selectedCourse = course.find(item => (item.name.toLowerCase() ==  searchInput.toLocaleLowerCase()) || (item.name.toLowerCase() ==  selectedLead?.enrolledTo?.toLocaleLowerCase() ))

  console.log(discount)
  console.log(selectedCourse)


  useEffect(() => {
    setCourseInput({
      enrolledTo: searchInput.trim(),
      discountSource: selectedDiscount,
      leadDiscount: selectedDiscountObject?.value || selectedDiscountinput,
      discountUnit: isCommited ? (selectedDiscountObject?.mode == "amount" ? "flat" : "percent") : selectedDiscountUnit,
      originalPrice: selectedCourse?.price,
      lastPaid:  lastPaid,
      totalDue: selectedCourse?.price - (lastPaid + selectedDiscountinput),

    })
  }, [searchInput, selectedDiscount, selectedDiscountinput, selectedDiscountUnit, selectedCourse, lastPaid])



  const handleSearch = (e) => {
    const searchText = e.target.value
    setSearchInput(searchText)
    const Suggesion = course.filter(item => item.name.toLowerCase().startsWith(searchText.toLowerCase()))
    if (searchText.length > 0) {
      setSearchSuggesion(Suggesion)
    }

  }


  const handleSearchSuggesionClick = (input) => {
    setSearchInput(input)
    setSearchSuggesion("")
  }

  let minValue = 0;
  let maxValue = 0;

  if (selectedDiscountUnit == "%") {
    if (selectedDiscountObject?.mode == "percent") {
      minValue = parseInt(selectedDiscountObject?.minValue);
      let initialMaxValuePercent = parseInt(selectedDiscountObject?.maxValue);
      let initialMaxValueAmount = Math.floor((parseInt(selectedDiscountObject?.maxValue) / selectedCourse?.price) * 100);

      if (initialMaxValueAmount < selectedDiscountObject.capAmount) {
        maxValue = Math.floor((parseInt(selectedDiscountObject?.capAmount) / selectedCourse?.price) * 100)
      }
      else {
        maxValue = initialMaxValuePercent
      }


    } else {
      minValue = Math.floor((parseInt(selectedDiscountObject?.minValue) / selectedCourse?.price) * 100);
      maxValue = Math.floor((parseInt(selectedDiscountObject?.maxValue) / selectedCourse?.price) * 100);
    }
  } else {
    if (selectedDiscountObject?.mode == "amount") {
      minValue = parseInt(selectedDiscountObject?.minValue);
      maxValue = parseInt(selectedDiscountObject?.maxValue);
    } else {
      minValue = Math.floor((parseInt(selectedDiscountObject?.minValue) / 100) * selectedCourse?.price);
      let initialMaxValue = Math.floor((parseInt(selectedDiscountObject?.maxValue) / 100) * selectedCourse?.price);
      if (selectedDiscountObject?.capAmount < initialMaxValue) {
        maxValue = selectedDiscountObject?.capAmount
      }
      else {
        maxValue = initialMaxValue
      }
    }
  }







  const totalDueAmount = () => {
    if (!courseInput) return

    if (selectedDiscountObject) {
      console.log(selectedDiscountObject?.mode)
      if (selectedDiscountObject?.mode == "amount") {
        if (isCommited) {
          return selectedCourse?.price - lastPaid - selectedLead?.totalPaid - selectedDiscountObject?.value
        }

        else {
          if(selectedDiscountUnit == "%"){
            let valueAmount = selectedCourse?.price * (selectedDiscountinput / 100)
            return selectedCourse?.price - lastPaid - selectedLead?.totalPaid - valueAmount
          }
          else {
            return selectedCourse?.price - lastPaid - selectedLead?.totalPaid - selectedDiscountinput
          }
        }

      }
      else {
        let valueAmount = selectedCourse?.price * (selectedDiscountObject.value / 100)
        return selectedCourse?.price - lastPaid - selectedLead?.totalPaid - valueAmount
      }
    }

    return (selectedCourse?.price - lastPaid - selectedLead?.totalPaid)



  }


  console.log(selectedCourse)
  console.log(selectedDiscountObject)

  console.log(minValue, "min")
  console.log(maxValue, "max")



  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Course Name */}
      <div className="mt-3">
        <input
          type="text"
          value={selectedLead?.enrolledTo || searchInput}
          onChange={handleSearch}
          placeholder="Course Name"
          className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
        />
        {searchSuggesion?.length > 0 && <ul className="bg-base-100 fixed z-50 shadow-md mt-1 rounded-box border border-base-300">
          {
            searchSuggesion.map(item => <li
              onClick={() => handleSearchSuggesionClick(item.name)}
              className="px-4 py-2 flex justify-between w-[290px] bg-gray-700 cursor-pointer hover:bg-base-200">
              <span>{item.name} ({item.type})</span>
              <span>৳ {item.price}</span>
            </li>)
          }
        </ul>
        }
      </div>

      {/* Discount Type */}
      <select
        onChange={(e) => setSelectedDiscount(e.target.value)}
        value={selectedLead?.discountSource}
        className="select focus:border-blue-600 focus:outline-0 select-bordered w-full"
      >
        <option>Select Discount</option>
        {
          discount
            ?.filter(item => {
              const now = new Date();
              const start = new Date(item.startAt);
              const end = new Date(item.expireAt);
              return (
                item?.appliesTo?.includes(String(selectedCourse?._id)) &&
                now >= start &&
                now <= end
              );
            })
            ?.map(item => (
              <option key={item._id}>{item.name}</option>
            ))
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
            value={selectedCourse?.price || ""}
            placeholder="Auto-filled"
            className="input input-bordered w-full disabled:bg-transparent disabled:border disabled:border-gray-600"
            disabled
          />
        </div>

        {/* Discount */}
        <div className="col-span-3">
          <label className="block mb-1 text-white/80 text-sm">Discount {(minValue && maxValue) ? `( ${minValue + selectedDiscountUnit} - ${maxValue + selectedDiscountUnit})` : null}</label>
          <div className="join grid grid-cols-3 w-full">
            <input
              disabled={isCommited}
              value={selectedLead?.leadDiscount || selectedDiscountObject?.value || selectedDiscountinput}
              onChange={(e) => setSelectedDiscountInput(e.target.value)}
              type="number"
              min={minValue}
              max={maxValue}
              placeholder="Enter discount"
              className="input col-span-2 input-bordered join-item w-full focus:outline-0 focus:border-blue-600"
            />
            <select
              onChange={(e) => setSelectedDiscountUnit(e.target.value)}
              value={isCommited ? (selectedDiscountObject?.mode == "amount" ? "৳" : "%") : selectedDiscountUnit}
              disabled={isCommited}
              className="select select-bordered join-item focus:outline-0 focus:border-blue-600">
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
            value={selectedLead?.lastPayment?.paidAmount || lastPaid}
            onChange={(e) => setlastPaid(e.target.value)}
            placeholder="0"
            className="input input-bordered w-full  focus:outline-0 focus:border-blue-600 "

          />
        </div>

        <div>
          <label className="block mb-1 text-white/80 text-sm">
            Total Due amount
          </label>
          <input
            type="number"
            disabled
            value={selectedLead?.totalDue || totalDueAmount()}
            className="input disabled:bg-transparent disabled:border disabled:border-gray-600 input-bordered w-full focus:outline-0 focus:border-blue-600"
          />
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="text-lg font-semibold mt-9">History</h2>
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
            selectedLead?.history?.length == 0  && <p>No History Available</p>
          }
          
       
        </div>
      </div>
    </div>
  );
}
