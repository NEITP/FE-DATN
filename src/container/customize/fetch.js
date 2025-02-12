import React from 'react';  // Import React (không sử dụng ở đây, có thể xóa nếu không cần thiết)
import { useEffect, useState } from 'react';  // Import các hooks cần thiết từ React (useEffect và useState)
import { getAllCodeService } from '../../services/userService';  // Import dịch vụ API để lấy dữ liệu mã (code) từ backend

// Custom hook sử dụng để lấy dữ liệu mã (code) từ API
const useFetchAllcode = (type) => {
    const [data, setdata] = useState([])  // Khai báo state 'data' để lưu trữ dữ liệu nhận được từ API

    useEffect(() => {  // Hook useEffect được sử dụng để thực hiện hành động sau khi component được render
        try {
            // Hàm bất đồng bộ để lấy dữ liệu mã từ API
            let fetchData = async () => {
                // Gọi API getAllCodeService để lấy dữ liệu mã theo type (thông qua tham số type)
                let arrData = await getAllCodeService(type)

                // Nếu API trả về dữ liệu hợp lệ (errCode === 0), cập nhật state 'data'
                if (arrData && arrData.errCode === 0) {
                    setdata(arrData.data)  // Lưu dữ liệu vào state 'data'
                }
            }
            fetchData();  // Gọi hàm fetchData khi component render lần đầu
        } catch (error) {  // Nếu có lỗi trong quá trình lấy dữ liệu, ghi lỗi ra console
            console.log(error)
        }
    }, []);  // useEffect chỉ chạy một lần khi component render lần đầu, vì dependency array là rỗng

    // Trả về dữ liệu đã lấy từ API (state 'data') cho các component sử dụng hook này
    return { data }
}

// Xuất custom hook để sử dụng ở các nơi khác trong ứng dụng
export {
    useFetchAllcode
}
