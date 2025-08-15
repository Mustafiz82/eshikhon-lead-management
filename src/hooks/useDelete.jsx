import axiosPublic from "@/api/axios";
import Swal from "sweetalert2";

const useDelete = (refetch , term ) => {
    
    const handleDelete = async (path) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `This action will permanently delete the ${term || "item"}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosPublic.delete(path);
                Swal.fire("Deleted!", `${term || "item"} has been deleted.`, "success");
                 refetch()
            } catch (error) {
                Swal.fire("Error", error?.response?.data?.error || error.message, "error");
            }
        }
    };


    return {handleDelete}
}

export default useDelete