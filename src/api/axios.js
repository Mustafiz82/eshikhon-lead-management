const { default: axios } = require("axios");

const axiosPublic = axios.create({
    baseURL : "http://localhost:3001/api" ,
    headers : {
        "Content-Type" : "application/json",
    }
})

export default axiosPublic