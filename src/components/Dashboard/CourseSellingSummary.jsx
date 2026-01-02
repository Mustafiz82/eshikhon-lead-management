import useFetch from '@/hooks/useFetch';
import React, { useContext, useState } from 'react';
import CountUp from 'react-countup';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import SortableHeader from './SortableHeader';
import { AuthContext } from '@/context/AuthContext';

const CourseSellingSummary = ({ state }) => {

    const { user } = useContext(AuthContext)
    const { data, loading } = useFetch("course")

    const query = user.role === "user" ? `email=${user.email}` : ""
    const { data: summary } = useFetch(`dashboard/courseSellingSummary?startDate=${state[0].startDate}&endDate=${state[0].endDate}&${query}`)
    const [searchText, setSearchText] = useState("")

    const [selectedOption, setSelectedOption] = useState("rate")
    const [sortOrder, setSortOrder] = useState("desc")
    const [sortKey, setSortKey] = useState("total");



    console.log(sortOrder, sortKey, selectedOption)


    const sortCourses = (data, selectedOption, sortKey, sortOrder) => {

        // If nothing selected, return data as-is
        if (!sortKey || !sortOrder) {
            return data;
        }

        return [...data].sort((a, b) => {

            let valueA = 0;
            let valueB = 0;

            // -------- MONEY COLUMNS --------
            if (sortKey === "totalSales") {
                valueA = a.totalSales || 0;
                valueB = b.totalSales || 0;
            }

            else if (sortKey === "totalDue") {
                valueA = a.totalDue || 0;
                valueB = b.totalDue || 0;
            }

            // -------- ENROLLMENT COLUMNS --------
            else {
                const bucketA = a[sortKey];
                const bucketB = b[sortKey];

                const assignedA = bucketA?.assigned || 0;
                const enrolledA = bucketA?.enrolled || 0;

                const assignedB = bucketB?.assigned || 0;
                const enrolledB = bucketB?.enrolled || 0;

                // COUNT MODE
                if (selectedOption === "count") {
                    valueA = enrolledA;
                    valueB = enrolledB;
                }

                // RATE MODE
                else if (selectedOption === "rate") {
                    if (assignedA === 0 && enrolledA > 0) {
                        valueA = 1; // 100%
                    } else if (assignedA > 0) {
                        valueA = enrolledA / assignedA;
                    } else {
                        valueA = 0;
                    }

                    valueB = assignedB === 0 ? 0 : enrolledB / assignedB;
                }
            }

            // -------- SORT DIRECTION --------
            if (sortOrder === "asc") {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        });
    }

    const searchedData = summary.filter(item => item.courseName.toLowerCase().includes(searchText.toLowerCase()))


    const sortedData = sortCourses(searchedData, selectedOption, sortKey, sortOrder)



    console.log(sortedData)


    const totals = summary.reduce(
        (acc, item) => {
            acc.totalSales += item.totalSales || 0;
            acc.totalDue += item.totalDue || 0;

            acc.online.assigned += item.online?.assigned || 0;
            acc.online.enrolled += item.online?.enrolled || 0;

            acc.offline.assigned += item.offline?.assigned || 0;
            acc.offline.enrolled += item.offline?.enrolled || 0;

            acc.total.assigned += item.total?.assigned || 0;
            acc.total.enrolled += item.total?.enrolled || 0;

            return acc;
        },
        {
            totalSales: 0,
            totalDue: 0,
            online: { assigned: 0, enrolled: 0 },
            offline: { assigned: 0, enrolled: 0 },
            total: { assigned: 0, enrolled: 0 },
        }
    );






    return (
        <div>
            <div className="bg-gray-800 mt-10 pb-3 duration-300  rounded-xl shadow-md w-full mx-auto">
                <div className="flex p-6 pb-0 justify-between items-center mb-4">
                    <h2 className="lg:text-xl font-semibold">Course Selling Summary</h2>
                    <div className='flex  gap-5 flex-1 justify-end'>


                        <input type="search"
                            onChange={e => setSearchText(e.target.value)}

                            placeholder="🔍︎ Search by course name"
                            className="input static  input-bordered rounded-none focus:outline-0  focus:border-blue-600  mb-4"
                        />
                        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="Pick a color" className="select static! focus-within:ring-0 focus-within:outline-0 focus-within:border-blue-600 pl-5  ">

                            <option value={"count"}>By Highest Enrollment</option>
                            <option value={"rate"}>By Highest Conversion Rate     </option>

                        </select>
                    </div>
                </div>

                {/* Header */}
                <div className="grid px-6 grid-cols-11 mt-10 text-sm text-gray-300 font-medium py-2 border-b border-gray-700">

                    <div className="col-span-3">
                        Course Name
                    </div>

                    <div className="text-center">
                        <SortableHeader
                            label="Total Sales"
                            sortKey="totalSales"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            setSortKey={setSortKey}
                            setSortOrder={setSortOrder}
                        />
                    </div>

                    <div className="text-center">
                        <SortableHeader
                            label="Total Due"
                            sortKey="totalDue"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            setSortKey={setSortKey}
                            setSortOrder={setSortOrder}
                        />
                    </div>

                    <div className="col-span-2 pl-16">
                        <SortableHeader
                            label="Online"
                            sortKey="online"
                            align="left"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            setSortKey={setSortKey}
                            setSortOrder={setSortOrder}
                        />
                    </div>

                    <div className="col-span-2 pl-16">
                        <SortableHeader
                            label="Offline"
                            sortKey="offline"
                            align="left"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            setSortKey={setSortKey}
                            setSortOrder={setSortOrder}
                        />
                    </div>

                    <div className="pl-16 col-span-2">
                        <SortableHeader
                            label="Total"
                            sortKey="total"
                            align="left"
                            currentSortKey={sortKey}
                            currentSortOrder={sortOrder}
                            setSortKey={setSortKey}
                            setSortOrder={setSortOrder}
                        />
                    </div>

                </div>


                {/* Body */}
                <div className='mt-5   overflow-y-auto h-[400px] wrapper'>
                    {summary?.length > 0 ? (
                        sortedData?.map((item, index) => (
                            <div
                                key={index}
                                className={`grid px-6 grid-cols-11 hover:bg-blue-600/60 items-center cursor-scroll py-3 `}
                            >


                                {/* Name */}
                                <div className="col-span-3">{item.courseName}</div>

                                <p className='text-center '>   <CountUp className='' end={item.totalSales} /> </p>
                                <p className='text-center '>   <CountUp className='' end={item.totalDue} /> </p>
                                <p className='col-span-2 w-[200px] mx-auto'>  <ProgressBar assigned={item?.online?.assigned} enrolled={item?.online?.enrolled} /></p>
                                <p className='col-span-2 w-[200px] mx-auto'>  <ProgressBar assigned={item?.offline?.assigned} enrolled={item?.offline?.enrolled} /></p>
                                <p className='col-span-2 w-[200px] mx-auto'>  <ProgressBar assigned={item?.total?.assigned} enrolled={item?.total?.enrolled} /></p>




                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-4">
                            {loading ? "Loading..." : " No data available."}
                        </div>
                    )}

                </div>


                <div className='grid px-6 border-t border-gray-700 py-3 grid-cols-11'>
                    <div className='col-span-3 pl-5 font-semibold'>Total</div>

                    <div className='text-center'>
                        <CountUp className='text-sm' end={totals.totalSales} />
                    </div>

                    <div className='text-center'>
                        <CountUp className='text-sm' end={totals.totalDue} />
                    </div>

                    <p className='col-span-2 w-[200px] mx-auto'>
                        <ProgressBar
                            assigned={totals.online.assigned}
                            enrolled={totals.online.enrolled}
                        />
                    </p>

                    <p className='col-span-2 w-[200px] mx-auto'>
                        <ProgressBar
                            assigned={totals.offline.assigned}
                            enrolled={totals.offline.enrolled}
                        />
                    </p>

                    <p className='col-span-2 w-[200px] mx-auto'>
                        <ProgressBar
                            assigned={totals.total.assigned}
                            enrolled={totals.total.enrolled}
                        />
                    </p>
                </div>

            </div>
        </div>
    );
};

export default CourseSellingSummary;









const ProgressBar = ({ assigned, enrolled }) => {
    // Handle division by zero to avoid NaN
    let percentage = 0;

    if (assigned === 0 && enrolled > 0) {
        percentage = 100; // auto-enrolled case
    } else if (assigned > 0) {
        percentage = Math.min(100, Math.round((enrolled / assigned) * 100));
    }


    return (
        <div className="flex flex-col mt-2 h-full">
            {/* The background bar now contains the text */}
            <div className="relative flex w-full h-4 bg-black/20 rounded-full overflow-hidden" role="progressbar">

                {/* The Progress Fill */}
                <div
                    className="absolute top-0 left-0 h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                ></div>

                {/* The Label (placed on top using absolute positioning) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-gray-400 mix-blend-difference">
                        <CountUp end={enrolled} /> / <CountUp end={assigned} />
                    </span>
                </div>
            </div>
        </div>
    );
};