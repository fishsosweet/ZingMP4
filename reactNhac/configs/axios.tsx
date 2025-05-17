import axios from "axios";//Axios de gui cac Request nhuw GET, POST,...

const axiosInstance =axios.create({
    baseURL:'http://127.0.0.1:8000/api/',
    headers:{
        'Content-Type': 'application/json'
    }
})
export default axiosInstance;
