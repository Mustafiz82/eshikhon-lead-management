const { default: axios } = require("axios");

const axiosPublic = axios.create({
    baseURL : "http://localhost:3001/api" ,
    // baseURL : "http://192.168.10.3:3001/api" ,
    // baseURL : "http://192.168.10.42:3001/api" ,
    // baseURL : "http://192.168.10.15:3001/api" ,
    // baseURL : "http://192.168.10.73:3001/api" ,
    // baseURL : "eshikhon-lead-backend.vercel.app/api" ,
    // baseURL : "https://lead-backend-nu.vercel.app/api" ,
    headers : {
        "Content-Type" : "application/json",
    }
})

export default axiosPublic
    