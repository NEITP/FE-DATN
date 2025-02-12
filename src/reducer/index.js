import shopCartReducer from './shopCartReducer'  // Nhập reducer xử lý giỏ hàng
import { combineReducers } from 'redux'  // Nhập hàm combineReducers từ Redux để kết hợp nhiều reducer lại
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';  // Nhập state reconciler để quản lý trạng thái giữa redux và localStorage/sessionStorage
import storage from 'redux-persist/lib/storage';  // Nhập storage từ redux-persist, nơi sẽ lưu trữ dữ liệu (thường là localStorage hoặc sessionStorage)
import { persistReducer } from 'redux-persist';  // Nhập persistReducer để làm cho reducer có thể lưu trữ dữ liệu trong redux-persist

// Cấu hình chung cho redux-persist, bao gồm cách dữ liệu sẽ được kết hợp lại giữa bộ nhớ redux và bộ nhớ bền vững (localStorage/sessionStorage)
const persistCommonConfig = {
    storage: storage,  // Dữ liệu sẽ được lưu trữ trong localStorage hoặc sessionStorage
    stateReconciler: autoMergeLevel2,  // Sử dụng state reconciler autoMergeLevel2 để hợp nhất trạng thái giữa redux và lưu trữ bền vững
};

// Cấu hình đặc biệt cho shopcart, chỉ lưu trữ dữ liệu giỏ hàng trong localStorage/sessionStorage
const shopcartPersistConfig = {
    ...persistCommonConfig,  // Kế thừa cấu hình chung đã định nghĩa ở trên
    key: 'shopcart',  // Xác định tên khóa trong localStorage/sessionStorage (có thể lấy từ ứng dụng web khi reload)
    whitelist: ['listCartItem'],  // Chỉ lưu trữ trạng thái của `listCartItem` (danh sách mặt hàng trong giỏ hàng)
};

// Kết hợp tất cả các reducer lại thành một reducer tổng
const rootReducer = combineReducers({
    shopcart: persistReducer(shopcartPersistConfig, shopCartReducer),  // Kết hợp reducer shopCartReducer với redux-persist
});

// Xuất reducer tổng này để sử dụng trong store của Redux
export default rootReducer;
