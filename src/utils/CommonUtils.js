// Import thư viện XLSX để xử lý xuất Excel
import * as XLSX from 'xlsx/xlsx.mjs'
// Import các hằng số từ utils/constant
import { PREFIX_CURRENCY } from '../utils/constant'

class CommonUtils {
    // Hàm để chuyển đổi tệp tin hình ảnh (hoặc bất kỳ file nào) thành chuỗi base64
    // Dùng Promise để trả về kết quả bất đồng bộ
    static getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();  // Tạo một FileReader để đọc file
            reader.readAsDataURL(file);  // Đọc file dưới dạng Data URL (Base64)
            reader.onload = () => resolve(reader.result);  // Khi hoàn thành, trả về kết quả base64
            reader.onerror = error => reject(error)  // Nếu có lỗi khi đọc file, trả về lỗi
        })
    }

    // Hàm xuất dữ liệu ra file Excel
    static exportExcel(data, nameSheet, nameFile) {
        return new Promise((resolve, reject) => {
            var wb = XLSX.utils.book_new();  // Tạo một workbook mới (file Excel)
            var ws = XLSX.utils.json_to_sheet(data);  // Chuyển đổi dữ liệu JSON thành sheet Excel
            XLSX.utils.book_append_sheet(wb, ws, nameSheet);  // Thêm sheet vào workbook
            XLSX.writeFile(wb, `${nameFile}.xlsx`);  // Ghi và tải file Excel với tên được chỉ định
            resolve('oke');  // Khi hoàn thành, trả về thông báo thành công
        })
    }

    // Định dạng tiền tệ với đơn vị là VND (Việt Nam đồng)
    static formatter = new Intl.NumberFormat('en-VN', {
        style: 'currency',  // Định dạng theo kiểu tiền tệ
        currency: 'VND',  // Đơn vị tiền tệ là VND
        minimumFractionDigits: PREFIX_CURRENCY.minimumFractionDigits  // Số chữ số thập phân theo cấu hình
    })
}

// Export class CommonUtils để sử dụng ở các file khác
export default CommonUtils;
