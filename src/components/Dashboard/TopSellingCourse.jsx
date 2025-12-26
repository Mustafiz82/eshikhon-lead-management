import useFetch from '@/hooks/useFetch';
import React, { useState } from 'react';
import CountUp from 'react-countup';

const TopSellingCourse = () => {

    const { data, loading } = useFetch("course")
    const [selectedOption, setSelectedOption] = useState("count")
    console.log(selectedOption)



    return (
        <div>
            <div className="bg-gray-800 mt-10 pb-10 duration-300  rounded-xl shadow-md w-full mx-auto">
                <div className="flex p-6 pb-0 justify-between items-center mb-4">
                    <h2 className="lg:text-xl font-semibold">Top-Selling Course</h2>
                    <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} defaultValue="Pick a color" className="select focus-within:ring-0 focus-within:outline-0 focus-within:border-blue-600 pl-5  ">

                        <option value={"count"}>By Highest Enrollment</option>
                        <option value={"rate"}>By Highest Conversion Rate     </option>

                    </select>
                </div>

                {/* Header */}
                <div className="grid px-6 grid-cols-5 mt-10 text-sm text-gray-300 font-medium  py-2 border-b border-gray-700">
                    <div className='col-span-4'>Course Name</div>
                    <div className="text-center">Enrolled / Assigned</div>
                    <div className="text-right text-nowrap"></div>
                </div>

                {/* Body */}
                <div className='mt-5 px-6  overflow-y-auto max-h-[280px] wrapper'>
                    {data?.length > 0 ? (
                        data.map((item, index) => (
                            <div
                                key={index}
                                className={`grid grid-cols-5 hover:bg-blue-600/60 items-center px-4 py-3 `}
                            >


                                {/* Name */}
                                <div className="col-span-4">{item.name}</div>

                                <p className='text-center'>   <CountUp className='' end={10} /> /   <CountUp className=' text-sm' end={10} /></p>

                                {/* Metric */}
                                {/* <div className="text-right font-semibold text-blue-600">
                                    <CountUp end={item[valueKey] || 0} duration={1.2} />
                                </div> */}
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-400 py-4">
                            {loading ? "Loading..." : " No data available."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopSellingCourse;