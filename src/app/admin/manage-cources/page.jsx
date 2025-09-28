"use client";

import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import CustomSelect from "@/utils/CustomSelect";
import React, { useEffect, useState } from "react";




const courseOption = [
  { value: "Online", label:"Online" },
  { value: "Offline", label: "Offline" },
  { value: "Video", label: "Video" }
]


export default function ManageCoursePage() {

  const { data: courses, loading, error, refetch } = useFetch("/course")
  const { setEditCourse, editCourse, handleSave, loading: isSubmitting, error: submitError } = useSaveData(refetch)
  const { handleDelete } = useDelete(refetch, "course")
  const [ courseType, setCourseType ] = useState("Online")


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.course_name.value.trim(),
      type: courseType,
      price: form.price.value ? Number(form.price.value) : null,
    };
    console.log(payload)
    await handleSave(payload, form, "/course")

  };

  const actionsCell = (row) => (
    <div className="flex gap-2">
      <button
        className="btn btn-sm bg-blue-600 btn-primary"
        onClick={() => setEditCourse(row)}           // <- selected row here
      >
        Edit
      </button>
      <button
        className="btn btn-sm bg-red-500"
        onClick={() => handleDelete(`/course/${row._id ?? row.id}`)} // <- selected row id
      >
        Delete
      </button>
    </div>
  )

  const courseConfig = {
    header: ["Name", "Type", "Price", "Action"],
    body: ["name", "type", "price", actionsCell]
  }


  useEffect(() => {

    if(editCourse)
    setCourseType(editCourse?.type)
  } , [editCourse])







  return (
    <div className="flex h-screen overflow-hidden">
      {loading ? (
        <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
      ) : error ? <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p> : (
        <>


          <Table data={courses} config={courseConfig} />

          {/* Drawer / Form */}
          <div className="h-full w-[400px] bg-gray-800 shadow-lg p-6">
            <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button type="button" className="btn btn-xs btn-outline" onClick={() => setEditCourse(null)}>
                  Close
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  name="course_name"
                  required
                  placeholder="Course Name"
                  defaultValue={editCourse?.name || ""}
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                />

                {/* <select
                  name="type"
                  defaultValue={editCourse?.type || "Online"}
                  className="select bg-gray-900 select-bordered w-full"
                  disabled={isSubmitting}
                >
                  <option value="Online" className="text-black">Online</option>
                  <option value="Offline" className="text-black">Offline</option>
                  <option value="Video" className="text-black">Video</option>
                </select> */}

                <div>
                  <CustomSelect
                    selected={courseType}
                    setSelected={setCourseType}
                    options={courseOption}
                    bgColor

                  />
                </div>

                <input
                  type="number"
                  name="price"
                  placeholder="Price (৳)"
                  defaultValue={editCourse?.price ?? ""}
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                  min={0}
                  step="1"
                  required
                />
              </div>

              {/* Inline Error */}
              {submitError && <div className="mt-3 text-red-500 text-sm">{submitError}</div>}

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
