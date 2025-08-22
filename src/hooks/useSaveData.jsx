import axiosPublic from "@/api/axios";
import { useState } from "react";

const useSaveData = (refetch) => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [editCourse, setEditCourse] = useState(null)

    const handleSave = async (payload , form , path) => {
        console.log("called" , payload)

        setLoading(true);
        setError("");

        try {
            if (editCourse) {
                const id = editCourse._id || editCourse.id;
                await axiosPublic.put(`${path}/${id}`, payload);
            } else {
                await axiosPublic.post(`${path}`, payload);
            }

            await refetch()
            form.reset();
            setEditCourse(null);
        } catch (err) {
        
            const msg = err?.response?.data?.error || err.message;

            if (typeof msg === "string" && msg.startsWith("E11000")) {
                setError("Duplicate value not allowed.");
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return { setEditCourse, handleSave , loading , error , editCourse }
}

export default useSaveData