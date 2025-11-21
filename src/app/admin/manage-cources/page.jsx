"use client";

import Dropdown from "@/components/agentLeads/Dropdown";
import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import CustomSelect from "@/utils/CustomSelect";
import React, { useEffect, useState } from "react";




const courseOption = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  { value: "Video", label: "Video" },
]


export default function ManageCoursePage() {

  const [courseType, setCourseType] = useState("Online")

  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSortMethod, setSelectedSortMethod] = useState("Default")

  const [searchQuery, setSearchQuery] = useState("")
  const [searchText, setSearchText] = useState("")

  const [filterCourseType, setFilterCourseType] = useState("All")

  const { data: courses, loading, error, refetch } = useFetch(`/course?sort=${selectedSortMethod}&q=${searchQuery}&type=${(filterCourseType !== "All") ? filterCourseType : ""}`)
  const { setEditCourse, editCourse, handleSave, loading: isSubmitting, error: submitError } = useSaveData(refetch)
  const { handleDelete } = useDelete(refetch, "course")


  console.log(searchQuery)





  useEffect(() => {
    const handleKeyDown = (e) => {
      // Focus search input when Ctrl + K is pressed
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("course-search-input");
        if (searchInput) return searchInput.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);




  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const payload = {
      name: form.course_name.value.trim(),
      type: courseType,
      price: form.price.value ? Number(form.price.value) : null,
      code : form?.code?.value
    };
    console.log(payload)
    await handleSave(payload, form, "/course")

  };

  const actionsCell = (row) => (
    <div className="flex justify-end gap-2">
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
    header: ["Name", "Type", "Price", "Code" , "Action"],
    body: ["name", "type", "price", "code" , actionsCell]
  }


  useEffect(() => {

    if (editCourse)
      setCourseType(editCourse?.type)
  }, [editCourse])

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(searchText)
    }, 500)
    return () => clearTimeout(delay)
  }, [searchText])


  useEffect(() => {

  }, [])

  const list = Array.isArray(courses?.items) ? courses.items : courses;

  const online = list?.filter(i => i?.type?.toLowerCase() === "online")?.length || 0;
  const offline = list?.filter(i => i?.type?.toLowerCase() === "offline")?.length || 0;


  console.log(online, offline)





  return (
    <div className="flex  min-h-[calc(100vh-100px)] lg:h-screen overflow-hidden">
      {loading ? (
        <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
      ) : error ? <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p> : (
        <>






          <div className=" flex-1 justify-between items-center overflow-auto lg:overflow-x-hidden  ">
            <div className="flex lg:items-start flex-col-reverse md:flex-row  p-6 pb-0 justify-between">
              <div className="md:w-fit w-full  flex gap-2">
                <Dropdown
                  dropdownPosition="dropdown-start"
                  selectedState={selectedSortMethod}
                  setSelectedState={setSelectedSortMethod}
                  label="Sort By"
                  options={["Default", "Name (Ascending)", "Name (Descending)", "Price (Ascending)", "Price (Descending)"]}
                  setCurrentPage={setCurrentPage}
                  defaultOptions={"Default"}
                />
                <Dropdown
                  dropdownPosition="dropdown-end"
                  selectedState={filterCourseType}
                  setSelectedState={setFilterCourseType}
                  label="Course Type"
                  options={["All", "Online", "Offline",]}
                  setCurrentPage={setCurrentPage}
                  defaultOptions={"All"}
                />






              </div>
              <p className="hidden lg:block">Total course :  {courses?.length} (online : {online} , offline : {offline})</p>
              <form onSubmit={(e) => {
                e.preventDefault()
                setSearchQuery(searchText)

              }}>
                <input
                  type="text"
                  id="course-search-input"
                  placeholder="🔍︎ Search by name, type or price"
                  className="input lg:min-w-[300px] input-bordered focus:outline-0 focus:border-blue-600 w-full mb-4"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}

                />
              </form>
            </div>
            <div className="lg:-mr-4 overflow-auto  ">
              <Table data={courses} config={courseConfig} />
            </div>
          </div>

          {/* Drawer / Form */}
          <div className={`h-full ${showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-[9999] block " : "hidden lg:block"}  w-[400px] bg-gray-800 shadow-lg p-6`}>
            <form autoComplete="off" onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button type="button" className={`btn btn-xs btn-outline ${(!editCourse && !showModal) && "hidden"}`} onClick={() => {
                  setEditCourse(null)
                  setShowModal(false)
                }}>
                  Clear
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


                <input
                  type="text"
                  name="code"
                  placeholder="short code"
                  defaultValue={editCourse?.code ?? ""}
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

              </div>
            </form>
          </div>
        </>
      )}

      <button onClick={() => setShowModal(true)} type="submit" className="btn z-50  lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full" >
        Create New course
      </button>
    </div>
  );
}
