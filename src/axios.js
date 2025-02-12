// Import thư viện axios và lodash, dotenv cho việc quản lý biến môi trường
import axios from "axios";
import _ from "lodash";
require("dotenv").config(); // Đọc và sử dụng biến môi trường từ file .env

// Tạo một instance của axios với cấu hình riêng
const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL, // Địa chỉ cơ bản của backend được lưu trong .env
    // withCredentials: true // Nếu cần thiết, có thể kích hoạt gửi cookie với request
});

// Kiểm tra nếu có token trong localStorage
if (localStorage.getItem("token")) {
    // Nếu có token, sử dụng interceptor để thêm Authorization header vào request
    instance.interceptors.request.use(
        (config) => {
            // Thêm token vào header của request dưới dạng Bearer token
            config.headers.authorization =
                "Bearer " + localStorage.getItem("token").replaceAll('"', ""); // Lấy token và bỏ dấu " nếu có

            return config; // Trả về config đã được thêm token
        },
        (error) => {
            // Nếu có lỗi khi xử lý request, trả về lỗi
            return Promise.reject(error);
        }
    );
}

// Interceptor cho response để xử lý kết quả trả về
instance.interceptors.response.use((response) => {
    // Lấy data từ response và trả về, có thể xử lý thêm nếu cần
    const { data } = response; // Trích xuất data từ response
    return response.data; // Trả về dữ liệu của response
});

// Xuất instance axios đã cấu hình để sử dụng ở các phần khác của ứng dụng
export default instance;
