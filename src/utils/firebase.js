// Import Firebase SDK và các module cần thiết
import firebase from 'firebase/compat/app';  // Import module 'app' từ Firebase (Dùng với Firebase v9 trở về trước)
import 'firebase/compat/auth';  // Import module 'auth' để sử dụng chức năng xác thực người dùng trong Firebase

// Import các phương thức từ Firebase SDK phiên bản mới (v9 trở lên)
import { getAuth } from 'firebase/auth';  // Import phương thức để lấy đối tượng 'auth' trong Firebase v9
import { initializeApp } from 'firebase/app';  // Import phương thức khởi tạo ứng dụng Firebase trong v9

// Cấu hình Firebase của bạn (Lấy từ Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC6BDR8vZuUHiqt7VQkhLJ3pxYroNNjntA",  // Khóa API để xác thực và kết nối ứng dụng của bạn với Firebase
  authDomain: "ecom-chat-1d35c.firebaseapp.com",  // Địa chỉ URL dùng để xác thực người dùng (chủ yếu cho các phương thức auth của Firebase)
  projectId: "ecom-chat-1d35c",  // ID của dự án Firebase
  storageBucket: "ecom-chat-1d35c.appspot.com",  // Tên bucket lưu trữ của Firebase, dùng để lưu trữ tệp
  messagingSenderId: "517909678281",  // ID của người gửi tin nhắn (dùng cho Firebase Cloud Messaging)
  appId: "1:517909678281:web:ee31dcdc6180e6a3cee518",  // ID ứng dụng Firebase của bạn
  measurementId: "G-3X0P8VH3KR"  // Mã đo lường (dùng cho Google Analytics)
};

// Khởi tạo ứng dụng Firebase với cấu hình trên
firebase.initializeApp(firebaseConfig);  // Khởi tạo Firebase bằng cấu hình được cung cấp

// Xuất đối tượng firebase để sử dụng trong các phần khác của ứng dụng
export default firebase;

// Khởi tạo và xuất đối tượng authentication từ Firebase để sử dụng các phương thức xác thực người dùng
export const authentication = getAuth(initializeApp(firebaseConfig));  // Sử dụng phương thức 'getAuth' để lấy đối tượng 'auth' và xác thực người dùng
