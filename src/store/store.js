import { createStore, applyMiddleware, compose } from 'redux'  // Nhập các hàm để tạo store, áp dụng middleware, và compose enhancers từ Redux
import { logger } from "redux-logger";  // Nhập logger middleware cho Redux để log các hành động
import thunkMiddleware from "redux-thunk";  // Nhập middleware redux-thunk cho phép xử lý các action bất đồng bộ
import rootReducer from '../reducer'  // Nhập reducer gốc, kết hợp từ tất cả các reducers của ứng dụng
import { SHOP_CART } from '../utils/constant';  // Nhập các hằng số liên quan đến giỏ hàng
import { persistStore } from 'redux-persist';  // Nhập hàm persistStore để duy trì trạng thái store giữa các lần tải lại trang
import { createStateSyncMiddleware } from 'redux-state-sync';  // Nhập middleware để đồng bộ trạng thái Redux giữa các tab trình duyệt

const environment = process.env.NODE_ENV || "development";  // Lấy môi trường từ biến môi trường (ví dụ: "development" hoặc "production")
let isDevelopment = environment === "development";  // Kiểm tra xem môi trường có phải là "development" không

// Đặt lại giá trị của isDevelopment thành false (để tắt logger trong môi trường phát triển)
isDevelopment = false;

const reduxStateSyncConfig = {
    whitelist: [
        SHOP_CART.GET_ITEM_CART_SUCCESS,  // Chỉ đồng bộ trạng thái khi hành động này xảy ra (GET_ITEM_CART_SUCCESS)
    ]
}

// Định nghĩa một mảng middleware, bao gồm redux-thunk (xử lý action bất đồng bộ) và redux-state-sync
const middleware = [
    thunkMiddleware,  // Redux thunk middleware để xử lý action bất đồng bộ
    createStateSyncMiddleware(reduxStateSyncConfig),  // Middleware để đồng bộ trạng thái giữa các tab trình duyệt
]

// Nếu môi trường là "development", thêm redux-logger vào mảng middleware để ghi log các hành động Redux
if (isDevelopment) middleware.push(logger);

// Cấu hình Redux DevTools nếu môi trường là "development"
const composeEnhancers = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__  // Sử dụng DevTools nếu có
    : compose;  // Nếu không có DevTools, sử dụng compose bình thường

// Tạo store Redux, áp dụng các middleware và enhancers (nếu có)
const store = createStore(
    rootReducer,  // Gọi reducer gốc đã kết hợp tất cả các reducer
    composeEnhancers(applyMiddleware(...middleware))  // Áp dụng middleware và enhancers (như Redux DevTools)
)

// Xuất ra dispatch của store để có thể gọi dispatch trong các component hoặc action creators
export const dispatch = store.dispatch;

// Tạo và xuất persistor để đồng bộ hóa trạng thái store với local storage (hoặc nơi lưu trữ khác)
export const persistor = persistStore(store);

// Xuất store để có thể sử dụng trong ứng dụng (ví dụ: trong React Provider)
export default store;
