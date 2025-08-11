"use client";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

const dummyCourses = [
  {
    id: 1,
    name: "Graphic Design Masterclass",
    type: "Online",
    price: 5000,
    maxDiscount: 20,
  },
  {
    id: 2,
    name: "Digital Marketing",
    type: "Offline",
    price: 7000,
    maxDiscount: 25,
  },
  {
    id: 3,
    name: "MERN Stack Development",
    type: "Video",
    price: 6000,
    maxDiscount: 15,
  },
];

const ManageCoursePage = () => {
  const [courses, setCourses] = useState(dummyCourses);
  const [editCourse, setEditCourse] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "Online",
    price: "",
    maxDiscount: "",
  });

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (confirmDelete) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const handleSubmit = () => {
    if (editCourse) {
      // Update existing course
      const updated = courses.map((c) =>
        c.id === editCourse.id ? { ...formData, id: editCourse.id } : c
      );
      setCourses(updated);
      setEditCourse(null);
    } else {
      // Create new course
      const newCourse = { ...formData, id: Date.now() };
      setCourses([...courses, newCourse]);
    }

    // Reset form after submission
    setFormData({
      name: "",
      type: "Online",
      price: "",
      maxDiscount: "",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Side: Table */}
      <div className="flex-1 p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Manage Courses</h2>
         
        </div>
        <div className="overflow-x-auto">
          <table className="table table-md table-zebra w-full">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Type</th>
                <th>Price (৳)</th>
                <th>Max Discount (%)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.name}</td>
                  <td>{course.type}</td>
                  <td>{course.price}</td>
                  <td>{course.maxDiscount}</td>
                  <td className="flex gap-2">
                    <button
                      className="btn btn-sm bg-blue-600 text-white"
                      onClick={() => {
                        setEditCourse(course);
                        setFormData(course);
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="btn btn-sm bg-red-500 text-white"
                      onClick={() => handleDelete(course.id)}
                    >
                      <MdDeleteForever className="text-lg" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-[400px] bg-base-200 dark:bg-gray-800 shadow-lg p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData.name.length < 2) {
              alert("Course name is too short.");
              return;
            }
            if (Number(formData.price) <= 0) {
              alert("Price must be greater than 0.");
              return;
            }
            if (
              Number(formData.maxDiscount) < 0 ||
              Number(formData.maxDiscount) > 100
            ) {
              alert("Discount must be between 0 and 100.");
              return;
            }
            handleSubmit();
          }}
          className="flex flex-col h-full gap-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {editCourse ? "Edit Course" : "Add New Course"}
            </h2>
            {editCourse && (
              <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={() => {
                  setEditCourse(null);
                  setFormData({
                    name: "",
                    type: "Online",
                    price: "",
                    maxDiscount: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="Course Name"
            className="input bg-transparent focus:border-blue-600 focus:outline-0 input-bordered w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <select
            className="select bg-transparent focus:border-blue-600 focus:outline-0 select-bordered w-full"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option className="text-black">Online</option>
            <option className="text-black">Offline</option>
            <option className="text-black">Video</option>
          </select>

          <input
            type="number"
            placeholder="Price (৳)"
            className="input bg-transparent focus:border-blue-600 focus:outline-0 input-bordered w-full"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Max Discount (%)"
            className="input bg-transparent focus:border-blue-600 focus:outline-0 input-bordered w-full"
            value={formData.maxDiscount}
            onChange={(e) =>
              setFormData({ ...formData, maxDiscount: e.target.value })
            }
            required
          />

          <div className="mt-auto pt-4">
            <button type="submit" className="btn bg-blue-600 text-white w-full">
              {editCourse ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCoursePage;
