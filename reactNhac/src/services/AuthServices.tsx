import axiosInstance from "../../configs/axios.tsx";

type LoginAdmin={
    email:string,
    password:string,
}

const loginAdmin=async (loginAdmin:LoginAdmin)=>{
    try{
        const response=await axiosInstance.post('/auth/login',{
            email:loginAdmin.email,
            password:loginAdmin.password
        });
        const token = response.data.access_token;
        // Lưu token vào localStorage
        localStorage.setItem("token", token);
        // Gán token cho axiosInstance
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return response.data;

    }catch (error){
        console.error('Lỗi khi đăng nhập:', error);
        throw error;
    }
}

const logout =()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    // Xóa header Authorization của axiosInstance
    delete axiosInstance.defaults.headers.common['Authorization'];
}

export {loginAdmin,logout};

