"use client"
import useDelete from "@/hooks/useDelete";
import useFetch from "@/hooks/useFetch";
import useSaveData from "@/hooks/useSaveData";
import Table from "@/shared/Table";
import { formateDate } from "@/utils/date";
import { formateDiscount } from "@/utils/formateDiscount";

const page = () => {

    const { data: courses, loading, error, refetch } = useFetch("/discount")
    const { setEditCourse, editCourse, handleSave, loading: isSubmitting, error: submitError } = useSaveData(refetch)
    const { handleDelete } = useDelete(refetch, "course")


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

    const startDate = (row) => {
        return formateDate(row.startAt)
    }

    const endDate = (row) => {
        return formateDate(row.expireAt)
    }

    const getStatus = (row) => {
        const now = new Date();
        const start = new Date(row.startAt);
        const expire = new Date(row.expireAt);

        if (now < start) {
            return "pending";
        } else if (now > expire) {
            return "expired";
        } else {
            return "active";
        }
    };

    const courseViewButtton = (row) => {
        {/* Open the modal using document.getElementById('ID').showModal() method */ }
      return   <button className="btn btn-sm btn-primary bg-blue-600" onClick={() => document.getElementById('my_modal_1').showModal()}>veiw Courses</button>

    }


    const courseConfig = {
        header: ["Name", "Authority", "Discount", "Start Date", "Expire Date", "Status", "Appied to", "Action"],
        body: ["name", "authority", formateDiscount, , startDate, endDate, , getStatus, courseViewButtton, actionsCell]
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;

        const payload = {
            name: form.course_name.value.trim(),
            type: form.type.value,
            price: form.price.value ? Number(form.price.value) : null,
        };
        console.log(payload)
        await handleSave(payload, form)

    };


    return <div className="flex h-screen overflow-hidden">
        {loading ? (
            <p className="h-[300px] flex justify-center items-center w-full">Loading...</p>
        ) : error ? <p className="h-[300px] text-red-500 flex justify-center items-center w-full">Error Fetching Data</p> : (
            <>


                <Table courses={courses} config={courseConfig} />

                <dialog id="my_modal_1" className="modal !m-0 !p-0">
  <div className="modal-box bg-gray-900 text-gray-100 max-w-lg border-t-4 border-blue-500">
    <h3 className="font-bold text-2xl mb-4 text-blue-400">Available Courses</h3>
    <ul className="space-y-3 overflow-y-auto max-h-[250px]">
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">MERN Stack</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">React Basics</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">JavaScript Advanced</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">Tailwind CSS Mastery</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">MERN Stack</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">React Basics</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">JavaScript Advanced</span>
      </li>
      <li className="p-3 bg-gray-800 rounded-lg shadow-sm border border-gray-700 hover:border-blue-500 transition">
        <span className="font-semibold text-blue-300">Tailwind CSS Mastery</span>
      </li>
    </ul>

    <div className="modal-action">
      <form method="dialog">
        <button className="btn bg-blue-500 text-white hover:bg-blue-600 border-none">
          Close
        </button>
      </form>
    </div>
  </div>
</dialog>


                {/* Drawer / Form */}
                <div className="h-full w-[400px] bg-base-200 dark:bg-gray-800 shadow-lg p-6">
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
                                className="input dark:bg-gray-900 input-bordered w-full"
                                disabled={isSubmitting}
                            />

                            <select
                                name="type"
                                defaultValue={editCourse?.type || "Online"}
                                className="select dark:bg-gray-900 select-bordered w-full"
                                disabled={isSubmitting}
                            >
                                <option value="Online" className="text-black">Online</option>
                                <option value="Offline" className="text-black">Offline</option>
                                <option value="Video" className="text-black">Video</option>
                            </select>

                            <input
                                type="number"
                                name="price"
                                placeholder="Price (৳)"
                                defaultValue={editCourse?.price ?? ""}
                                className="input dark:bg-gray-900 input-bordered w-full"
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
};

export default page;