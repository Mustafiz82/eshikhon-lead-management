"use client";
import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { formateDate } from "./date";
import { getDiscountBounds } from "./getDiscountBounds";

export default function CourseInput({ courseInput, setCourseInput, selectedLead, selectedCourseId }) {

  const [searchInput, setSearchInput] = useState("")
  const [searchSuggesion, setSearchSuggesion] = useState("")

  const [estemitePaymentDate, setEstimatePaymentDate] = useState(null)
  const [selectedDiscount, setSelectedDiscount] = useState("")
  const [selectedDiscountinput, setSelectedDiscountInput] = useState("")
  const [selectedDiscountUnit, setSelectedDiscountUnit] = useState("%")
  const [lastPaid, setlastPaid] = useState()


  const { data: course } = useFetch("/course")
  const { data: discount } = useFetch("/discount")


  const selectedDiscountObject = discount.find(item => (item.name == selectedDiscount) || (item.name == selectedLead?.discountSource))
  const isCommited = selectedDiscountObject?.authority === "committed"
  // const selectedCourse = course.find(item => (item.name.toLowerCase() == searchInput.toLocaleLowerCase()) || (item.name.toLowerCase() == selectedLead?.enrolledTo?.toLocaleLowerCase()))
  const selectedCourse = course.find(item => item._id === selectedCourseId);


  useEffect(() => {
    const finalUnit = isCommited
      ? (selectedDiscountObject?.mode === "amount" ? "flat" : "percent")
      : selectedDiscountUnit;

    const finalLeadDiscount = isCommited
      ? (selectedDiscountObject?.value ?? 0)
      : (selectedDiscountinput ?? 0);

    setCourseInput({
      // enrolledTo: (searchInput ?? "").trim(),
      estemitePaymentDate : estemitePaymentDate ?? null , 
      discountSource: selectedDiscount ?? "",
      leadDiscount: finalLeadDiscount,
      discountUnit: finalUnit,
      originalPrice: selectedCourse?.price ?? 0,
      lastPaid: lastPaid ?? 0,
      totalDue: calcTotalDue(),
      minValue, maxValue
    });
  }, [
    // searchInput,
    selectedDiscount,
    selectedDiscountinput,
    selectedDiscountUnit,
    selectedCourse,
    lastPaid,
    isCommited,
    selectedDiscountObject,
    selectedLead?.totalPaid,
    estemitePaymentDate
  ]);




  // const handleSearch = (e) => {
  //   const searchText = e.target.value
  //   setSearchInput(searchText)
  //   const Suggesion = course.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
  //   if (searchText.length > 0) {
  //     setSearchSuggesion(Suggesion)
  //   }

  // }


  // const handleSearchSuggesionClick = (item) => {
  //   setSearchInput(item?.name); //  shows name in input
  //   setSelectedCourseId(item?._id); // but internally, we track by id
  //   setSearchSuggesion("");
  // };


  const { minValue, maxValue } = getDiscountBounds(
    selectedDiscountUnit,
    selectedDiscountObject,
    selectedCourse
  );

  // Use one single source of truth for due calculation
  function calcTotalDue() {
    const price = selectedCourse?.price ?? 0;
    const alreadyPaid = selectedLead?.totalPaid ?? 0;
    const last = lastPaid ?? 0;

    let discountAmount = 0;

    if (selectedDiscountObject) {
      if (isCommited) {
        // committed discount comes from backend rule
        if (selectedDiscountObject.mode === "amount") {
          discountAmount = selectedDiscountObject.value ?? 0;
        } else {
          const percent = (selectedDiscountObject.value ?? 0) / 100;
          discountAmount = price * percent;
        }
      } else {
        // user-entered discount
        if (selectedDiscountUnit === "৳") {
          const entered = selectedDiscountinput ? parseFloat(selectedDiscountinput) : 0;
          discountAmount = entered;
        } else {
          const percent = (selectedDiscountinput ? parseFloat(selectedDiscountinput) : 0) / 100;
          discountAmount = price * percent;
        }
      }
    }

    const due = Math.round(price - alreadyPaid - last - discountAmount);
    return due < 0 ? 0 : due; // never negative
  }



  useEffect(() => {
    // setSearchInput(selectedLead?.enrolledTo ?? selectedLead?.interstedCourse ?? "");
    setSelectedDiscount(selectedLead?.discountSource ?? "");
    setSelectedDiscountInput(selectedLead?.leadDiscount ?? "");
    setSelectedDiscountUnit(selectedLead?.discountUnit == "percent" ? "%" : "৳");

    setlastPaid(0);
  }, [selectedLead]);


  // helper to clamp based on current unit
  function clampDiscount(val, unit) {
    let num = parseFloat(val);
    if (isNaN(num)) return 0;

    const { minValue, maxValue } = getDiscountBounds(
      unit,
      selectedDiscountObject,
      selectedCourse
    );

    if (minValue !== undefined && num < minValue) num = minValue;
    if (maxValue !== undefined && num > maxValue) num = maxValue;

    return num;
  }






  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Course Name */}
      {/* <div className="mt-3">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          placeholder="Course Name"
          className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
        />

        {searchSuggesion?.length > 0 && <ul className="bg-base-100 fixed z-50 shadow-md mt-1 rounded-box border border-base-300">
          {
            searchSuggesion.map(item => <li
              onClick={() => handleSearchSuggesionClick(item)}
              className="px-4 py-2 flex justify-between w-[290px] bg-gray-700 cursor-pointer hover:bg-base-200">
              <span>{item.name} ({item.type})</span>
              <span>৳ {item.price}</span>
            </li>)
          }
        </ul>
        }
      </div> */}

      {/* Discount Type */}
      <select
        onChange={(e) => setSelectedDiscount(e.target.value)}
        value={selectedDiscount}
        className="select focus:border-blue-600 px-2 focus:outline-0 select-bordered w-full"
      >
        <option>Select Discount</option>
        {discount
          ?.filter(item => {
            const now = new Date();
            const start = new Date(item.startAt);
            const end = new Date(item.expireAt);
            return (
              item?.appliesTo?.includes(String(selectedCourse?._id)) &&
              now >= start && now <= end
            );
          })
          ?.map(item => <option key={item._id}>{item.name}</option>)
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
              value={isCommited ? (selectedDiscountObject?.value ?? "") : (selectedDiscountinput ?? "")}
              onChange={(e) => setSelectedDiscountInput(e.target.value)}
              onBlur={(e) => {
                setSelectedDiscountInput(clampDiscount(e.target.value, selectedDiscountUnit));
              }}

              type="number"
              min={minValue}
              max={maxValue}
              placeholder="Enter discount"
              className="input col-span-2 input-bordered join-item w-full focus:outline-0 focus:border-blue-600"
            />
            <select
              onChange={(e) => {
                const newUnit = e.target.value;
                setSelectedDiscountUnit(newUnit);

                // Re-validate the existing discount against new unit bounds
                setSelectedDiscountInput((prev) => clampDiscount(prev, newUnit));
              }}
              value={isCommited ? (selectedDiscountObject?.mode === "amount" ? "৳" : "%") : selectedDiscountUnit}
              disabled={isCommited}
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
            onChange={(e) => setlastPaid(e.target.value)}
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
            value={calcTotalDue()}
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
            value={estemitePaymentDate}
            onChange={(e) => setEstimatePaymentDate(e.target.value)}
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
