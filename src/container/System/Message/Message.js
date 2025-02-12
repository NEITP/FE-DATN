import React from 'react';  // Nhập thư viện React
import { useEffect, useState, useRef } from 'react';  // Hook React để quản lý state và hiệu ứng
import { useFetchAllcode } from '../../customize/fetch';  // Hook tùy chỉnh để fetch dữ liệu
import { listRoomOfAdmin } from '../../../services/userService';  // Dịch vụ để lấy danh sách phòng
import moment from 'moment';  // Thư viện moment.js để xử lý ngày tháng
import { toast } from 'react-toastify';  // Thư viện thông báo khi có sự kiện xảy ra

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";  // Thư viện React Router để điều hướng giữa các trang

import MessageDisscution from '../../Message/MessageDisscution';  // Component hiển thị cuộc thảo luận
import ChatWindow from '../../Message/ChatWindow';  // Component hiển thị cửa sổ chat
import socketIOClient from "socket.io-client";  // Thư viện để kết nối với Socket.IO
require('dotenv').config();  // Tải các biến môi trường từ file .env

const Message = () => {
  const [dataUser, setdataUser] = useState({});  // Lưu trữ thông tin người dùng
  const [dataRoom, setdataRoom] = useState([]);  // Lưu trữ danh sách phòng chat
  const [selectedRoom, setselectedRoom] = useState('');  // Lưu trữ phòng chat đã chọn
  const host = process.env.REACT_APP_BACKEND_URL;  // Lấy URL backend từ biến môi trường
  const socketRef = useRef();  // Hook để giữ tham chiếu đến socket
  const [id, setId] = useState();  // Lưu trữ ID của người dùng từ Socket.IO

  useEffect(() => {
    // Khi component được mount (render lần đầu)
    socketRef.current = socketIOClient.connect(host);  // Kết nối đến server Socket.IO

    const userData = JSON.parse(localStorage.getItem('userData'));  // Lấy dữ liệu người dùng từ localStorage
    setdataUser(userData);  // Cập nhật state với dữ liệu người dùng

    // Lắng nghe sự kiện 'getId' để nhận ID của người dùng từ server khi kết nối
    socketRef.current.on('getId', data => {
      setId(data);  // Lưu ID vào state khi nhận được từ server
    });

    // Lắng nghe sự kiện 'sendDataServer' từ server để cập nhật lại danh sách phòng khi có sự thay đổi
    socketRef.current.on('sendDataServer', dataGot => {
      fetchListRoom();  // Lấy lại danh sách phòng
    });

    // Lắng nghe sự kiện 'loadRoomServer' từ server để tải lại danh sách phòng khi có yêu cầu từ server
    socketRef.current.on('loadRoomServer', dataGot => {
      fetchListRoom(userData.id);  // Lấy lại danh sách phòng chat
    });

    // Cleanup: Ngắt kết nối socket khi component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);  // Mảng phụ thuộc rỗng, chỉ gọi 1 lần khi component mount

  // Hàm xử lý khi người dùng click vào phòng chat
  let handleClickRoom = (roomId) => {
    socketRef.current.emit('loadRoomClient');  // Gửi yêu cầu đến server để tải phòng chat
    setselectedRoom(roomId);  // Cập nhật phòng chat đã chọn
  };

  // Hàm để fetch danh sách phòng chat từ server
  let fetchListRoom = async () => {
    let res = await listRoomOfAdmin();  // Gọi API để lấy danh sách phòng
    if (res && res.errCode == 0) {
      setdataRoom(res.data);  // Cập nhật state với danh sách phòng nếu thành công
    }
  };
  return (
    <div className="container">
      <div className="ks-page-content">
        <div className="ks-page-content-body">
          <div className="ks-messenger">
            <MessageDisscution userId={dataUser.id} isAdmin={true} handleClickRoom={handleClickRoom} data={dataRoom} />
            {selectedRoom ? <ChatWindow userId={dataUser.id} roomId={selectedRoom} />
              : <div>
                <span className='title'>Chưa chọn phòng</span>
              </div>
            }


          </div>
        </div>
      </div>
    </div>
  )
}
export default Message;