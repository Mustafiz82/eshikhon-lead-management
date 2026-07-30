"use client";

import axiosPublic from "@/api/axios";
import Dropdown from "@/components/agentLeads/Dropdown";
import { AuthContext } from "@/context/AuthContext";
import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import React, { useContext, useEffect, useState } from "react";
import { FaSync } from "react-icons/fa";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const courseOptions = [
  { value: "Online", label: "Online" },
  { value: "Offline", label: "Offline" },
  { value: "Video Course", label: "Video Course" },
  { value: "Download Course", label: "Download Course" },
  { value: "Free course", label: "Free Course" },
];

export default function ManageCoursePage() {
  const [courseTypes, setCourseTypes] = useState(["Online"]);

  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSortMethod, setSelectedSortMethod] = useState("Default");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchText, setSearchText] = useState("");

  const [filterCourseType, setFilterCourseType] = useState("All");

  const { data: courses, loading, error, refetch } = useFetch(
    `/course?sort=${selectedSortMethod}&q=${searchQuery}&type=${
      filterCourseType !== "All" ? filterCourseType : ""
    }`
  );

  const {
    setEditCourse,
    editCourse,
    handleSave,
    loading: isSubmitting,
    error: submitError,
  } = useSaveData(refetch);

  const { handleDelete } = useDelete(refetch, "course");

  /* ====================================================================
   * SYNC FEATURE STATES & HANDLER (COMMENTED OUT)
   * ==================================================================== */
  // const [syncResult, setSyncResult] = useState(null);
  // const [showSyncModal, setShowSyncModal] = useState(false);
  // const [syncing, setSyncing] = useState(false);

  // const handleSync = async () => {
  //   setSyncing(true);
  //   try {
  //     const res = await axiosPublic.get("/course/sync");
  //     setSyncResult(res.data);
  //     setSyncing(false);
  //     refetch();
  //   } catch (err) {
  //     setSyncing(false);
  //     console.log(err);
  //   }
  // };

  const { user: authUser } = useContext(AuthContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
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

    // Payload constructed with NO price fields
    const payload = {
      name: form.course_name.value.trim(),
      type: courseTypes,
      /* price: form.price?.value ? Number(form.price.value) : null, */ // 👈 COMMENTED OUT
      /* regularPrice: form.regularPrice?.value ? Number(form.regularPrice.value) : null, */ // 👈 COMMENTED OUT
      code: form?.code?.value ? form.code.value.trim().toUpperCase() : null,
    };

    console.log("Submitting Course Payload:", payload);
    await handleSave(payload, form, "/course");

    if (!editCourse) {
      setCourseTypes(["Online"]);
    }
  };

  const actionsCell = (row) => (
    <div className="flex -mr-4 justify-end gap-2">
      <button
        className="btn disabled:bg-blue-800 btn-sm bg-blue-600 btn-primary"
        onClick={() => setEditCourse(row)}
        disabled={authUser?.role !== "admin"}
      >
        Edit
      </button>
      <button
        className="btn disabled:bg-red-800 btn-sm bg-red-500"
        onClick={() => handleDelete(`/course/${row._id ?? row.id}`)}
        disabled={authUser?.role !== "admin"}
      >
        Delete
      </button>
    </div>
  );

  const courseConfig = {
    header: ["Name", "Type", /* "Regular Price", */ /* "Sell Price", */ "Code", "Action"],
    body: [
      "name",
      (row) => (Array.isArray(row.type) ? row.type.join(", ") : row.type),
      /* "regularPrice", */ // 👈 COMMENTED OUT
      /* "price", */        // 👈 COMMENTED OUT
      "code",
      actionsCell,
    ],
  };

  useEffect(() => {
    if (editCourse) {
      const types = Array.isArray(editCourse?.type)
        ? editCourse.type
        : editCourse?.type
        ? [editCourse.type]
        : ["Online"];
      setCourseTypes(types);
    } else {
      setCourseTypes(["Online"]);
    }
  }, [editCourse]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setSearchQuery(searchText);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  const list = Array.isArray(courses?.items) ? courses.items : courses;

  const online =
    list?.filter((i) =>
      Array.isArray(i?.type)
        ? i.type.some((t) => t.toLowerCase() === "online")
        : i?.type?.toLowerCase() === "online"
    )?.length || 0;

  const offline =
    list?.filter((i) =>
      Array.isArray(i?.type)
        ? i.type.some((t) => t.toLowerCase() === "offline")
        : i?.type?.toLowerCase() === "offline"
    )?.length || 0;

  return (
    <div className="flex min-h-[calc(100vh-200px)] lg:h-screen overflow-hidden">
      {loading ? (
        <p className="h-[300px] flex justify-center items-center w-full">
          Loading...
        </p>
      ) : error ? (
        <p className="h-[300px] text-red-500 flex justify-center items-center w-full">
          Error Fetching Data
        </p>
      ) : (
        <>
          <div className="flex-1 justify-between items-center overflow-auto lg:overflow-x-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 bg-gray-900/50 rounded-xl border-gray-800">
              {/* LEFT SIDE: Stats */}
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-400">
                  Total courses:{" "}
                  <span className="text-white">{courses?.length}</span>
                  <span className="mx-2 text-gray-700">|</span>
                  <span className="text-blue-400">{online}</span> Online
                  <span className="mx-2 text-gray-600">•</span>
                  <span className="text-gray-400">{offline}</span> Offline
                </p>
              </div>

              {/* RIGHT SIDE: Actions */}
              <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto">
                <div className="flex gap-2">
                  <Dropdown
                    dropdownPosition="dropdown-start"
                    selectedState={selectedSortMethod}
                    setSelectedState={setSelectedSortMethod}
                    label="Sort By"
                    options={[
                      "Default",
                      "Name (Ascending)",
                      "Name (Descending)",
                    ]}
                    setCurrentPage={setCurrentPage}
                    defaultOptions={"Default"}
                  />
                  <Dropdown
                    dropdownPosition="dropdown-end"
                    selectedState={filterCourseType}
                    setSelectedState={setFilterCourseType}
                    label="Type"
                    options={[
                      "All",
                      "Online",
                      "Offline",
                      "Video Course",
                      "Download Course",
                      "Free course",
                    ]}
                    setCurrentPage={setCurrentPage}
                    defaultOptions={"All"}
                  />
                </div>

                <form
                  className="flex-grow max-w-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSearchQuery(searchText);
                  }}
                >
                  <div className="relative">
                    <span className="absolute z-[500] inset-y-0 left-3 flex items-center text-gray-500">
                      🔍︎
                    </span>
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
              </div>
            </div>

            <div className="lg:-mr-4 overflow-auto">
              <Table data={courses} config={courseConfig} />
            </div>
          </div>

          {/* Drawer / Form */}
          <div
            className={`h-[calc(100vh-60px)] 2xl:h-screen ${
              showModal
                ? "fixed lg:static top-0 left-0 w-full lg:w-auto z-9999 block"
                : "hidden lg:block"
            } w-[400px] bg-gray-800 shadow-lg p-6`}
          >
            <form
              autoComplete="off"
              onSubmit={handleSubmit}
              className="flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button
                  type="button"
                  className={`btn btn-xs btn-outline ${
                    !editCourse && !showModal && "hidden"
                  }`}
                  onClick={() => {
                    setEditCourse(null);
                    setCourseTypes(["Online"]);
                    setShowModal(false);
                  }}
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <input
                  name="course_name"
                  required
                  placeholder="Course Name"
                  defaultValue={editCourse?.name || ""}
                  key={editCourse ? editCourse._id : "new-course-name"}
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                />

                {/* MultiSelect Component for Course Types */}
                <div>
                  <MultiSelect
                    options={courseOptions}
                    value={courseTypes}
                    onChange={(e) => setCourseTypes(e.value)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Select course(s)"
                    showSelectAll
                    filter
                    display="chip"
                    className="w-full"
                    disabled={isSubmitting}
                    pt={{
                      root: { className: "bg-gray-700 text-white" },
                    }}
                  />
                </div>

                {/* 🔹 ALL PRICE INPUTS COMMENTED OUT */}
                {/*
                <input
                  type="number"
                  name="price"
                  placeholder="Price (৳)"
                  defaultValue={editCourse?.price ?? ""}
                  key={editCourse ? `price-${editCourse._id}` : "new-price"}
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                  min={0}
                  step="1"
                />

                <input
                  type="number"
                  name="regularPrice"
                  placeholder="Regular Price (৳)"
                  defaultValue={editCourse?.regularPrice ?? ""}
                  key={
                    editCourse
                      ? `regularPrice-${editCourse._id}`
                      : "new-reg-price"
                  }
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                  min={0}
                  step="1"
                />
                */}

                <input
                  type="text"
                  name="code"
                  placeholder="Short Code (e.g. DIMA)"
                  defaultValue={editCourse?.code ?? ""}
                  key={editCourse ? `code-${editCourse._id}` : "new-code"}
                  className="input bg-gray-900 input-bordered w-full focus:outline-0 focus:border-blue-500"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {submitError && (
                <div className="mt-3 text-red-500 text-sm">{submitError}</div>
              )}

              <div className="mt-auto pt-4 flex gap-2">
                <button
                  type="submit"
                  className="btn bg-blue-600 btn-primary w-full"
                  disabled={isSubmitting || authUser?.role !== "admin"}
                >
                  {isSubmitting
                    ? editCourse
                      ? "Updating..."
                      : "Creating..."
                    : editCourse
                    ? "Update Course"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <button
        onClick={() => setShowModal(true)}
        type="button"
        className="btn z-50 lg:hidden fixed bottom-2 bg-blue-600 btn-primary w-full"
      >
        Create New Course
      </button>
    </div>
  );
}