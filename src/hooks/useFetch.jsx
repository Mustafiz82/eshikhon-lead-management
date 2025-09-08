import axiosPublic from "@/api/axios";
import { useEffect, useState } from "react";

const useFetch = (path) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState(null)
    const [refetchState , setRefetchState] = useState(false)

    // console.log(path)

    const fetchCourses = async () => {
        setLoading(true);
        try {
         
            const res = await axiosPublic.get(`${path}`);
            console.log(res.data)
            const items = Array.isArray(res.data.items) ? res.data.items : res.data;
            setData(items || []);
        } catch (err) {
            setError(err?.message)
        } finally {
            setLoading(false);
            setError(null)
        }
    };

    const refetch = () => {
        setRefetchState(!refetchState)
    }

    useEffect(() => {
        fetchCourses();
    }, [refetchState]);

    return {data , loading , error , refetch}
}

export default useFetch