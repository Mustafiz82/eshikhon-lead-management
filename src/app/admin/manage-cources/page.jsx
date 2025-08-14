"use client";

import axiosPublic from "@/api/axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";

export default function ManageCoursePage() {
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Supports both shapes: [{...}] or { items: [...] }
      const res = await axiosPublic.get("/course");
      console.log(res.data)
      const items = Array.isArray(res.data.items) ? res.data.items : res.data;
      setCourses(items || []);
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.error || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.course_name.value.trim(),
      type: form.type.value,
      price: form.price.value ? Number(form.price.value) : null,
    };

    setIsSubmitting(true);
    setFormError(""); // clear old error

    try {
      if (editCourse) {
        const id = editCourse._id || editCourse.id;
        await axiosPublic.put(`/course/${id}`, payload);
      } else {
        await axiosPublic.post("/course", payload);
      }

      await fetchCourses();
      form.reset();
      setEditCourse(null);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      // Optional: simplify duplicate key message if you have unique name/email, etc.
      if (typeof msg === "string" && msg.startsWith("E11000")) {
        setFormError("Duplicate value not allowed.");
      } else {
        setFormError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete the course.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosPublic.delete(`/course/${id}`);
        Swal.fire("Deleted!", "Course has been deleted.", "success");
        fetchCourses();
      } catch (error) {
        Swal.fire("Error", error?.response?.data?.error || error.message, "error");
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {loading ? (
        <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
      ) : (
        <>
          {/* Table */}
          <div className="flex-1 p-6">
            <div className="overflow-x-auto">
              <table className="table table-md table-zebra w-full">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price (৳)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <tr key={course._id || course.id}>
                        <td>{course.name}</td>
                        <td>{course.type}</td>
                        <td>{course.price}</td>
                        <td className="flex gap-2">
                          <button
                            className="btn btn-sm bg-blue-600 btn-primary"
                            onClick={() => setEditCourse(course)}
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn btn-sm bg-red-500"
                            onClick={() => handleDelete(course._id || course.id)}
                          >
                            <MdDelete /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-400">
                        No courses found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Drawer / Form */}
          <div className="h-full w-[400px] bg-base-200 dark:bg-gray-800 shadow-lg p-6">
            <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editCourse ? "Edit Course" : "Add New Course"}
                </h2>
               {
                editCourse &&  <button type="button" className="btn btn-xs btn-outline" onClick={() => setEditCourse(null)}>
                  Add New + 
                </button>
               }
              </div>

              <div className="flex flex-col gap-4">
                <input
                  name="course_name"
                  required
                  placeholder="Course Name"
                  defaultValue={editCourse?.name || ""}
                  className="input dark:bg-gray-900 focus:outline-0 focus:border-blue-600 input-bordered w-full"
                  disabled={isSubmitting}
                />

                <select
                  name="type"
                  defaultValue={editCourse?.type || "Online"}
                  className="select dark:bg-gray-900 focus:outline-0 focus:border-blue-600  text-white select-bordered w-full"
                  disabled={isSubmitting}
                >
                  <option value="Online" className="text-white">Online</option>
                  <option value="Offline" className="text-white">Offline</option>
                  <option value="Video" className="text-white">Video</option>
                </select>

                <input
                  type="number"
                  name="price"
                  placeholder="Price (৳)"
                  defaultValue={editCourse?.price ?? ""}
                  className="input dark:bg-gray-900 focus:outline-0 focus:border-blue-600 input-bordered w-full"
                  disabled={isSubmitting}
                  min={0}
                  step="1"
                  required
                />
              </div>

              {/* Inline Error */}
              {formError && <div className="mt-3 text-red-500 text-sm">{formError}</div>}

              <div className="mt-auto pt-4 flex gap-2">
                <button type="submit" className="btn bg-blue-600 btn-primary w-full" disabled={isSubmitting}>
                  {isSubmitting ? (editCourse ? "Updating..." : "Creating...") : editCourse ? "Update Course" : "Create Course"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => setEditCourse(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
