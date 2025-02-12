import { SHOP_CART } from '../utils/constant';  // Nhập các hằng số liên quan đến giỏ hàng từ constants

// Định nghĩa trạng thái khởi tạo (initial state) của reducer
const initState = {
    listCartItem: [],  // Danh sách các mặt hàng trong giỏ hàng
    dataVoucher: {},   // Thông tin về voucher (nếu có)
    dataTypeShip: {}   // Thông tin về loại vận chuyển (nếu có)
}

// Reducer xử lý các action liên quan đến giỏ hàng
const shopCartReducer = (state = initState, action) => {
    switch (action.type) {  // Dựa trên action.type, sẽ quyết định thao tác nào được thực hiện
        case SHOP_CART.ADD_ITEM_CART_SUCCESS:  // Khi thêm thành công một mặt hàng vào giỏ hàng
            {
                return {
                    ...state,  // Giữ nguyên trạng thái hiện tại của giỏ hàng
                }
            }
        case SHOP_CART.ADD_ITEM_CART_FAILD:  // Khi thêm mặt hàng vào giỏ hàng thất bại
            {
                return {
                    ...state,  // Giữ nguyên trạng thái hiện tại của giỏ hàng
                }
            }
        case SHOP_CART.GET_ITEM_CART_SUCCESS:  // Khi lấy thành công danh sách mặt hàng trong giỏ hàng
            {
                let copyState = { ...state }  // Tạo bản sao của state hiện tại để không thay đổi trực tiếp state ban đầu
                copyState.listCartItem = action.data  // Cập nhật danh sách mặt hàng trong giỏ hàng từ dữ liệu mới

                return {
                    ...copyState,  // Trả về trạng thái mới với danh sách mặt hàng đã cập nhật
                }
            }
        case SHOP_CART.GET_ITEM_CART_FAILD:  // Khi lấy danh sách mặt hàng trong giỏ hàng thất bại
            {
                state.listCartItem = []  // Đặt lại danh sách giỏ hàng về mảng rỗng

                return {
                    ...state,  // Trả về trạng thái mới với giỏ hàng rỗng
                }
            }
        case SHOP_CART.CHOOSE_VOUCHER_START:  // Khi chọn một voucher
            {
                let copyState = { ...state }  // Tạo bản sao của state hiện tại
                copyState.dataVoucher = action.data  // Cập nhật thông tin voucher vào state

                return {
                    ...copyState,  // Trả về trạng thái mới với thông tin voucher đã cập nhật
                }
            }
        case SHOP_CART.CHOOSE_TYPESHIP_START:  // Khi chọn một loại vận chuyển
            {
                let copyState = { ...state }  // Tạo bản sao của state hiện tại
                copyState.dataTypeShip = action.data  // Cập nhật thông tin loại vận chuyển vào state

                return {
                    ...copyState,  // Trả về trạng thái mới với thông tin loại vận chuyển đã cập nhật
                }
            }
        default:
            return state  // Nếu action.type không khớp với bất kỳ case nào, trả về state hiện tại
    }
}

export default shopCartReducer  // Xuất reducer để có thể sử dụng trong store của Redux
