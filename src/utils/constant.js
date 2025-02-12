// Định nghĩa các đường dẫn (URLs) cho các trang trong ứng dụng
export const path = {
    HOME: '/',  // Đường dẫn chính (trang chủ)
    HOMEPAGE: '/home',  // Đường dẫn đến trang chủ
};

// Các hằng số liên quan đến giỏ hàng (Shop Cart) để quản lý các hành động
export const SHOP_CART = {
    ADD_ITEM_CART_START: 'ADD_ITEM_CART_START',  // Hành động bắt đầu thêm sản phẩm vào giỏ
    ADD_ITEM_CART_SUCCESS: 'ADD_ITEM_CART_SUCCESS',  // Hành động thêm sản phẩm thành công vào giỏ
    ADD_ITEM_CART_FAILD: 'ADD_ITEM_CART_FAILD',  // Hành động thêm sản phẩm thất bại vào giỏ

    GET_ITEM_CART_START: 'GET_ITEM_CART_START',  // Hành động bắt đầu lấy danh sách sản phẩm trong giỏ
    GET_ITEM_CART_SUCCESS: 'GET_ITEM_CART_SUCCESS',  // Hành động lấy danh sách giỏ thành công
    GET_ITEM_CART_FAILD: 'GET_ITEM_CART_FAILD',  // Hành động lấy danh sách giỏ thất bại

    CHOOSE_VOUCHER_START: 'CHOOSE_VOUCHER_START',  // Hành động chọn voucher (mã giảm giá)
    CHOOSE_TYPESHIP_START: 'CHOOSE_TYPESHIP_START'  // Hành động chọn loại vận chuyển
};

// Các hành động CRUD (Create, Update) để quản lý các hoạt động dữ liệu
export const CRUD_ACTIONS = {
    CREATE: 'CREATE',  // Hành động tạo mới
    UPDATE: 'UPDATE'  // Hành động cập nhật
};

// Các hành động quản lý (thêm, chỉnh sửa, xóa)
export const manageActions = {
    ADD: "ADD",  // Thêm mới
    EDIT: "EDIT",  // Chỉnh sửa
    DELETE: "DELETE"  // Xóa
};

// Định dạng ngày tháng để gửi lên server
export const dateFormat = {
    SEND_TO_SERVER: 'DD/MM/YYYY'  // Định dạng ngày tháng (Ngày/Tháng/Năm) khi gửi lên server
};

// Các giá trị Yes/No dùng cho xác nhận hoặc các lựa chọn nhị phân
export const YesNoObj = {
    YES: 'Y',  // Giá trị 'Y' đại diện cho Yes
    NO: 'N'  // Giá trị 'N' đại diện cho No
};

// Các vai trò người dùng trong hệ thống
export const USER_ROLE = {
    ADMIN: 'R1',  // Vai trò admin với mã là 'R1'
    USER: 'R2',  // Vai trò người dùng thường với mã là 'R2'
};

// Cấu hình phân trang (số lượng sản phẩm trên mỗi trang)
export const PAGINATION = {
    pagerow: 15  // Mỗi trang sẽ hiển thị 15 sản phẩm
};

// Cấu hình phân trang (số lượng bản ghi trên mỗi trang)
export const PAGINATION2 = {
    pagerow: 500  // Mỗi trang sẽ hiển thị 500 bản ghi
};

// Cấu hình tiền tệ (định dạng số thập phân)
export const PREFIX_CURRENCY = {
    minimumFractionDigits: 0  // Đặt số chữ số thập phân là 0 (không có phần thập phân)
};

// Tỷ giá hối đoái, ví dụ, tỷ giá giữa VND và USD
export const EXCHANGE_RATES = {
    USD: 24300  // 1 USD = 24300 VND
};
