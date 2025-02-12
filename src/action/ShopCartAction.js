import { SHOP_CART } from '../utils/constant'; // Import các constant từ file constants
import { addShopCartService, getAllShopCartByUserIdService } from '../services/userService'; // Import các service để thao tác với giỏ hàng
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo

// Action để thêm sản phẩm vào giỏ hàng
export const addItemCartStart = (data) => {
    return async (dispatch, getState) => { // Sử dụng async/await để gọi API
        try {
            // Gọi API để thêm sản phẩm vào giỏ hàng
            let res = await addShopCartService(data);

            if (res && res.errCode === 0) {
                // Nếu thêm thành công, dispatch action để lấy lại giỏ hàng của người dùng
                dispatch(getItemCartStart(data.userId));
                dispatch(addItemCartSuccess()); // Dispatch thành công
            } else {
                // Nếu có lỗi, dispatch action thất bại và hiển thị thông báo lỗi
                dispatch(addItemCartFaild());
                toast.error(res.errMessage); // Hiển thị thông báo lỗi qua Toast
            }
        } catch (error) {
            // Nếu có lỗi trong quá trình gọi API, dispatch action thất bại
            dispatch(addItemCartFaild());
        }
    }
}

// Action khi thêm sản phẩm vào giỏ hàng thành công
export const addItemCartSuccess = () => {
    return {
        type: SHOP_CART.ADD_ITEM_CART_SUCCESS, // Type action thành công
    }
}

// Action khi thêm sản phẩm vào giỏ hàng thất bại
export const addItemCartFaild = () => {
    return {
        type: SHOP_CART.ADD_ITEM_CART_FAILD, // Type action thất bại
    }
}

// Action để lấy giỏ hàng của người dùng (bắt đầu)
export const getItemCartStart = (id) => {
    return async (dispatch, getState) => { // Sử dụng async/await để gọi API
        try {
            // Gọi API để lấy giỏ hàng của người dùng
            let res = await getAllShopCartByUserIdService(id);
            if (res && res.errCode === 0) {
                // Nếu lấy giỏ hàng thành công, dispatch action để lưu trữ dữ liệu giỏ hàng vào Redux
                dispatch(getItemCartSuccess(res.data));
            } else {
                // Nếu có lỗi, dispatch action thất bại
                dispatch(getItemCartFaild());
            }
        } catch (error) {
            // Nếu có lỗi trong quá trình gọi API, dispatch action thất bại
            dispatch(getItemCartFaild());
        }
    }
}

// Action khi lấy giỏ hàng thành công
export const getItemCartSuccess = (data) => {
    return {
        type: SHOP_CART.GET_ITEM_CART_SUCCESS, // Type action thành công
        data: data // Dữ liệu giỏ hàng
    }
}

// Action khi lấy giỏ hàng thất bại
export const getItemCartFaild = () => {
    return {
        type: SHOP_CART.GET_ITEM_CART_FAILD, // Type action thất bại
    }
}

// Action để chọn voucher cho giỏ hàng
export const ChooseVoucherStart = (data) => {
    return {
        type: SHOP_CART.CHOOSE_VOUCHER_START, // Type action chọn voucher
        data: data // Dữ liệu voucher
    }
}

// Action để chọn phương thức vận chuyển cho giỏ hàng
export const ChooseTypeShipStart = (data) => {
    return {
        type: SHOP_CART.CHOOSE_TYPESHIP_START, // Type action chọn phương thức vận chuyển
        data: data // Dữ liệu phương thức vận chuyển
    }
}
