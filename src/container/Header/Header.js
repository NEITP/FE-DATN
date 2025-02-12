import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getItemCartStart } from '../../action/ShopCartAction'; // Import action để lấy dữ liệu giỏ hàng
import { listRoomOfUser } from '../../services/userService'; // Import service để lấy danh sách phòng chat của người dùng
import './Header.scss'; // Import các file CSS hoặc SCSS cho header
import TopMenu from './TopMenu'; // Import component TopMenu
import socketIOClient from "socket.io-client"; // Sử dụng Socket.io để kết nối WebSocket với server
require('dotenv').config(); // Load các biến môi trường từ file .env

const Header = props => {
    // Khai báo các state để quản lý dữ liệu trong component
    const [quantityMessage, setquantityMessage] = useState(''); // Số lượng tin nhắn chưa đọc
    const [user, setUser] = useState({}); // Thông tin người dùng
    const dispatch = useDispatch(); // Hook để dispatch các action từ Redux
    let dataCart = useSelector(state => state.shopcart.listCartItem); // Lấy danh sách sản phẩm trong giỏ hàng từ Redux store
    const host = process.env.REACT_APP_BACKEND_URL; // URL backend từ biến môi trường
    const socketRef = useRef(); // Dùng useRef để giữ tham chiếu socket.io client
    const [id, setId] = useState(); // ID của người dùng cho socket connection

    // Hook useEffect để thực hiện các hành động khi component mount
    useEffect(() => {
        socketRef.current = socketIOClient.connect(host); // Kết nối với server qua WebSocket

        const userData = JSON.parse(localStorage.getItem('userData')); // Lấy thông tin người dùng từ localStorage
        setUser(userData); // Cập nhật state user với dữ liệu lấy từ localStorage

        if (userData) {
            dispatch(getItemCartStart(userData.id)); // Dispatch action để lấy giỏ hàng khi có user
            socketRef.current.on('getId', data => { // Lắng nghe sự kiện từ server để nhận ID của người dùng
                setId(data);
            });

            fetchListRoom(userData.id); // Gọi API để lấy danh sách phòng chat của người dùng

            socketRef.current.on('sendDataServer', dataGot => { // Lắng nghe sự kiện khi có dữ liệu mới từ server
                fetchListRoom(userData.id); // Cập nhật lại danh sách phòng chat
            });

            socketRef.current.on('loadRoomServer', dataGot => { // Lắng nghe sự kiện khi danh sách phòng chat được tải lại
                fetchListRoom(userData.id);
            });

            return () => {
                socketRef.current.disconnect(); // Ngắt kết nối socket khi component unmount
            };
        }
    }, []); // Chỉ chạy lần đầu khi component mount

    // Hàm xử lý sự kiện khi cuộn trang để làm cho header cố định
    let scrollHeader = () => {
        window.addEventListener("scroll", function () {
            var header = document.querySelector(".main_menu");
            if (header) {
                header.classList.toggle("sticky", window.scrollY > 0); // Thêm class sticky khi cuộn trang
            }
        });
    };

    // Hàm để lấy danh sách các phòng chat và tính số tin nhắn chưa đọc
    let fetchListRoom = async (userId) => {
        let res = await listRoomOfUser(userId); // Gọi API để lấy danh sách phòng chat của người dùng
        if (res && res.errCode === 0) {
            let count = 0;
            if (res.data && res.data.length > 0 && res.data[0].messageData && res.data[0].messageData.length > 0) {
                res.data[0].messageData.forEach((item) => {
                    if (item.unRead === 1 && item.userId !== userId) count = count + 1; // Tính số tin nhắn chưa đọc
                });
            }
            setquantityMessage(count); // Cập nhật số lượng tin nhắn chưa đọc vào state
        }
    };

    scrollHeader(); // Gọi hàm để xử lý sự kiện scroll

    return (
        <header className="header_area">
            <TopMenu user={user && user} /> {/* Component hiển thị thông tin người dùng trên menu */}
            <div className="main_menu">
                <div className="container">
                    <nav className="navbar navbar-expand-lg navbar-light w-100">
                        {/* Logo và các menu điều hướng */}
                        <NavLink to="/" className="navbar-brand logo_h">
                            <img src="/resources/img/logo.png" alt="" />
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>

                        {/* Các menu chính của website */}
                        <div className="collapse navbar-collapse offset w-100" id="navbarSupportedContent">
                            <div className="row w-100 mr-0">
                                <div className="col-lg-9 pr-0">
                                    <ul className="nav navbar-nav center_nav pull-right">
                                        {/* Các link menu chính */}
                                        <li className="nav-item">
                                            <NavLink exact to="/" className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                                Trang chủ
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/shop" className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                                Cửa hàng
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/blog" className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                                Tin tức
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/voucher" className="nav-link"
                                                activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                                Giảm giá
                                            </NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink to="/about" className="nav-link" activeClassName="selected" activeStyle={{ color: '#71cd14' }}>
                                                Giới thiệu
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>

                                {/* Các biểu tượng và thông tin người dùng */}
                                <div className="col-lg-3 pr-0">
                                    <ul className="nav navbar-nav navbar-right right_nav pull-right">
                                        {/* Biểu tượng messenger và thông báo tin nhắn chưa đọc */}
                                        <li className="nav-item">
                                            <Link to={"/user/messenger"} className="icons">
                                                <i className="fa-brands fa-facebook-messenger"></i>
                                            </Link>
                                            {quantityMessage > 0 &&
                                                <span className="box-message-quantity">{quantityMessage}</span>
                                            }
                                        </li>
                                        {/* Biểu tượng giỏ hàng */}
                                        <li className="nav-item">
                                            <Link to={"/shopcart"} className="icons">
                                                <i className="ti-shopping-cart" />
                                            </Link>
                                            <span className="box-quantity-cart">{dataCart && dataCart.length}</span>
                                        </li>
                                        {/* Biểu tượng thông tin người dùng */}
                                        <li className="nav-item">
                                            <Link to={`/user/detail/${user && user.id ? user.id : ''}`} className="icons">
                                                <i className="ti-user" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
