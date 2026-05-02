"use client";

import axiosPublic from "@/api/axios";
import Dropdown from "@/components/agentLeads/Dropdown";
import { AuthContext } from "@/context/AuthContext";
import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import CustomSelect from "@/utils/CustomSelect";
import React, { useContext, useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";




const courseOption = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  // { value: "Video", label: "Video" },
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
  const [syncResult, setSyncResult] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);


  const { user: authUser } = useContext(AuthContext)
  const [syncing, setSyncing] = useState(false)



  const handleSync = async () => {
    setSyncing(true);

    try {
      const res = await axiosPublic.get("/course/sync");

      setSyncResult(res.data);   // 🔥 STORE RESULT
      setSyncing(false);

      refetch();
    } catch (err) {
      setSyncing(false);
      console.log(err);
    }
  };


  console.log(syncResult)




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
      regularPrice : form.regularPrice.value ? Number(form.regularPrice.value) : null,
      price: form.price.value ? Number(form.price.value) : null,
      code: form?.code?.value
    };
    console.log(payload)
    await handleSave(payload, form, "/course")

  };

  const actionsCell = (row) => (
    <div className="flex -mr-4 justify-end gap-2">
      <button
        className="btn disabled:bg-blue-800 btn-sm bg-blue-600 btn-primary"
        onClick={() => setEditCourse(row)}           // <- selected row here
        disabled={authUser?.role !== "admin"}
      >
        Edit
      </button>
      <button
        className="btn disabled:bg-red-800 btn-sm bg-red-500"
        onClick={() => handleDelete(`/course/${row._id ?? row.id}`)} // <- selected row id
        disabled={authUser?.role !== "admin"}
      >
        Delete
      </button>
    </div>
  )

  const courseConfig = {
    header: ["Name", "Type",  "Regular Price" , "Sell Price", "Code", "Action"],
    body: ["name", "type",  "regularPrice","price", "code", actionsCell]
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
    <div className="flex  min-h-[calc(100vh-200px)] lg:h-screen overflow-hidden">
      {loading ? (
        <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
      ) : error ? <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p> : (
        <>






          <div className=" flex-1 justify-between items-center overflow-auto lg:overflow-x-hidden  ">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4  bg-gray-900/50 rounded-xl  border-gray-800">

              {/* LEFT SIDE: Stats (Hidden on mobile, clean on Desktop) */}
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-400">
                  Total courses: <span className="text-white">{courses?.length}</span>
                  <span className="mx-2 text-gray-700">|</span>
                  <span className="text-blue-400">{online}</span> Online
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-gray-400">{offline}</span> Offline
                </p>
              </div>

              {/* RIGHT SIDE: All Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">

                {/* Dropdowns Group */}
                <div className="flex gap-2">
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
                    label="Type"
                    options={["All", "Online", "Offline"]}
                    setCurrentPage={setCurrentPage}
                    defaultOptions={"All"}
                  />
                </div>

                {/* Search Bar - flex-grow ensures it takes available space without breaking */}
                <form
                  className="flex-grow max-w-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearchQuery(searchText);
                  }}
                >
                  <div className="relative">
                    <span className="absolute z-[500] inset-y-0 left-3 flex items-center text-gray-500"> 🔍︎</span>
                    <input
                      type="text"
                      id="course-search-input"
                      placeholder="Search courses..."
                      className="input input-bordered h-10 pl-9 w-full focus:outline-0 focus:border-blue-600 bg-gray-800 border-gray-700 text-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </form>

                {/* SYNC SECTION - Fixed width area to prevent layout shifting */}
                <div className="flex items-center min-w-fit">
                  {syncResult && !syncing ? (

                    <div className="flex items-center gap-2 bg-gray-800 p-1 rounded-lg border border-gray-700">
                      {/* Compact Success Indicator */}
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-green-500 uppercase tracking-tight">

                        Done
                      </div>

                      {/* Button Group (DaisyUI Join) */}
                      <div className="join">
                        <button
                          className="join-item btn btn-xs h-8 bg-gray-700 border-none text-white hover:bg-gray-600 px-3"
                          onClick={() => setShowSyncModal(true)}
                        >
                          View
                        </button>
                        <button
                          className="join-item btn btn-xs h-8 bg-blue-600 border-none text-white hover:bg-blue-700 px-3"
                          onClick={handleSync}
                        >
                          Sync Again
                        </button>
                      </div>
                    </div>

                  ) : (
                    <button
                      onClick={handleSync}
                      disabled={syncing}
                      className="btn btn-sm bg-blue-600 hover:bg-blue-700 border-none text-white h-10 min-h-0 px-4"
                    >
                      <FaSync className={syncing ? "animate-spin" : ""} />
                      {syncing ? "Syncing..." : "Sync Price"}
                    </button>
                  )}
                </div>

              </div>
            </div>
            <div className="lg:-mr-4 overflow-auto  ">
              <Table data={courses} config={courseConfig} />
            </div>
          </div>

          {/* Drawer / Form */}
          <div className={`h-[calc(100vh-60px)] 2xl:h-screen   ${showModal ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-9999 block " : "hidden lg:block"}  w-[400px] bg-gray-800 shadow-lg p-6`}>
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
                  type="number"
                  name="regularPrice"
                  placeholder="Regular Price (৳)"
                  defaultValue={editCourse?.regularPrice ?? ""}
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
                <button type="submit" className="btn bg-blue-600 btn-primary w-full" disabled={isSubmitting || (authUser?.role !== "admin")}>
                  {isSubmitting ? (editCourse ? "Updating..." : "Creating...") : editCourse ? "Update Course" : "Create Course"}
                </button>

              </div>
            </form>
          </div>



    {showSyncModal && syncResult && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-4">
    <div className="bg-gray-900 border border-gray-800 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      
      {/* HEADER */}
      <div className="bg-blue-600 px-4 py-2.5 flex justify-between items-center shrink-0">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Sync Summary Report
        </h2>
        <button onClick={() => setShowSyncModal(false)} className="text-white/80 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-6">
        
        {/* STATS STRIP */}
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-500/10 border border-blue-500/20 p-2 rounded-lg text-center">
            <p className="text-[10px] text-blue-400 font-bold uppercase">Updated</p>
            <p className="text-lg font-bold text-white">{syncResult.changedCount}</p>
          </div>
          <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-center">
            <p className="text-[10px] text-emerald-400 font-bold uppercase">Added</p>
            <p className="text-lg font-bold text-white">{syncResult.addedCount}</p>
          </div>
          <div className="flex-1 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg text-center">
            <p className="text-[10px] text-rose-400 font-bold uppercase">Deleted</p>
            <p className="text-lg font-bold text-white">{syncResult.deletedCount}</p>
          </div>
        </div>

        {/* UPDATED SECTION */}
        <section>
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Updated Courses</h3>
          <div className="space-y-2">
            {syncResult.changed?.map((c, i) => (
              <div key={i} className="text-[11px] bg-gray-800/40 p-3 rounded-lg border border-gray-800/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-blue-100 leading-tight">{c.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded border border-gray-700 shrink-0 font-mono uppercase">{c.type}</span>
                </div>
                
                <div className="grid grid-cols-1 gap-1.5">
                  {/* DIFF: CODE */}
                  {c.oldCode && c.newCode && c.oldCode !== c.newCode && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-12 text-[9px] uppercase text-gray-600">Code:</span>
                      <span className="line-through opacity-50">{c.oldCode}</span>
                      <span className="text-blue-400">→</span>
                      <span className="text-blue-400 font-bold px-1 bg-blue-400/10 rounded">{c.newCode}</span>
                    </div>
                  )}

                  {/* DIFF: SALE PRICE */}
                  {c.newPrice !== undefined && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-12 text-[9px] uppercase text-gray-600">Sale:</span>
                      <span className="line-through text-rose-500/60">${c.oldPrice || '0'}</span>
                      <span className="text-emerald-400">→</span>
                      <span className="text-emerald-400 font-bold">${c.newPrice}</span>
                    </div>
                  )}

                  {/* DIFF: REGULAR PRICE */}
                  {c.newRegularPrice !== undefined && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-12 text-[9px] uppercase text-gray-600">Reg:</span>
                      <span className="line-through text-rose-500/60">${c.oldRegularPrice || '0'}</span>
                      <span className="text-blue-400">→</span>
                      <span className="text-blue-400 font-bold">${c.newRegularPrice}</span>
                    </div>
                  )}

                   {/* DIFF: TYPE */}
                   {c.oldType && c.newType && c.oldType !== c.newType && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-12 text-[9px] uppercase text-gray-600">Type:</span>
                      <span className="line-through opacity-50">{c.oldType}</span>
                      <span>→</span>
                      <span className="text-white font-medium">{c.newType}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ADDED SECTION */}
        <section>
          <h3 className="text-[11px] font-bold text-emerald-500/70 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Added Courses</h3>
          <div className="space-y-1.5">
            {syncResult.added?.map((c, i) => (
              <div key={i} className="flex flex-col bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded text-[11px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-200 font-bold tracking-tight">{c.name}</span>
                  <span className="text-[9px] text-gray-300 font-mono uppercase bg-gray-800 px-1 rounded">{c.code}</span>
                </div>
                <div className="flex gap-3">
                   <span className="text-emerald-400 font-bold">Sale: ${c.price}</span>
                   {c.regularPrice && <span className="text-gray-500">Reg: ${c.regularPrice}</span>}
                   <span className="text-gray-400 ml-auto uppercase text-[10px] italic">{c.type}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DELETED SECTION */}
        {syncResult.deleted?.length > 0 && (
          <section>
            <h3 className="text-[11px] font-bold text-rose-500/70 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1">Deleted Courses</h3>
            <div className="space-y-1.5">
              {syncResult.deleted?.map((c, i) => (
                <div key={i} className="flex justify-between items-center bg-rose-500/5 border border-rose-500/10 p-2.5 rounded text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-gray-400 line-through decoration-rose-500/50">{c.name}</span>
                    <span className="text-[10px] text-rose-500/40 font-mono uppercase">{c.code} • {c.type}</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 font-bold text-xs">
                    ×
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FOOTER */}
      <div className="p-3 border-t border-gray-800 bg-gray-900 flex justify-end">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-blue-900/20"
          onClick={() => setShowSyncModal(false)}
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  </div>
)}  
        </>
      )}

      <button onClick={() => setShowModal(true)} type="submit" className="btn z-50  lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full" >
        Create New course
      </button>
    </div>
  );
}
