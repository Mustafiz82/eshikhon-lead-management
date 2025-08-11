"use client";
import { useState } from "react";

const dummyCourses = [
  { name: "Graphic Design", price: 8000 },
  { name: "Digital Marketing", price: 10000 },
  { name: "Web Development", price: 12000 },
  { name: "Ethical Hacking", price: 15000 },
  { name: "UI/UX Design", price: 9000 },
  { name: "Career Guideline", price: 5000 },
  { name: "Video Editing", price: 7000 },
  { name: "App Development", price: 13000 }
];

export default function CourseInput({ search, setSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const handleChange = (e) => {
    const input = e.target.value;
    setSearch(input);

    if (!input.trim()) {
      setSuggestions([]);
      setPrice("");
      return;
    }

    const filtered = dummyCourses.filter((course) =>
      course.name.toLowerCase().includes(input.toLowerCase())
    );

    setSuggestions(filtered);
  };

  const handleSelect = (course) => {
    setSearch(course.name);
    setSuggestions([]);
    setPrice(course.price);
  };

  return (
    <div className="w-full -mb-2 max-w-xl mx-auto space-y-4">
      {/* Course Name Input */}
      <div>
        <label className="block mb-1  text-sm">Course Name</label>
        <input
          type="text"
          placeholder="Start typing..."
          value={search}
          onChange={handleChange}
          className="input input-bordered w-full focus:outline-0 focus:border-blue-600"
        />
        {suggestions.length > 0 && (
          <ul className="bg-base-100 fixed z-50 shadow-md mt-1 rounded-box border border-base-300">
            {suggestions.map((course, index) => (
              <li
                key={index}
                onClick={() => handleSelect(course)}
                className="px-4 py-2 cursor-pointer hover:bg-base-200"
              >
                {course.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Row: Original Price + Discount (%) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm ">Original Price</label>
          <input
            type="number"
            value={price}
            disabled
            placeholder="Auto-filled"
            className="input input-bordered w-full disabled:bg-transparent disabled:border disabled:border-gray-600  "
          />
        </div>

        <div>
          <label className="block mb-1 text-sm ">Discount (%)</label>
          <input
            type="number"
            placeholder="Enter discount %"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="input input-bordered w-full  focus:outline-0 focus:border-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
