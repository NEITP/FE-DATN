import React from 'react';  // Import React để sử dụng JSX
import { useEffect, useState } from 'react';  // Import hooks useEffect và useState
import { Link, NavLink, useHistory } from 'react-router-dom';  // Import các component và hook từ 'react-router-dom' để điều hướng và tạo liên kết
import './Header.scss';  // Import file SCSS cho styling của component này

// TopMenu component nhận props là một đối tượng chứa thông tin người dùng (user)
const TopMenu = props => {
    let history = useHistory();  // Hook useHistory để điều hướng người dùng

    // Hàm xử lý đăng xuất, xóa thông tin người dùng và token khỏi localStorage và chuyển hướng người dùng đến trang login
    let handleLogout = () => {
        localStorage.removeItem("userData");  // Xóa thông tin người dùng
        localStorage.removeItem("token");  // Xóa token
        window.location.href = '/login';  // Chuyển hướng người dùng tới trang đăng nhập
    }

    // Lấy tên đầy đủ của người dùng nếu có, nếu không sẽ là chuỗi rỗng
    let name = props.user && props.user.id ? `${props.user && props.user.firstName ? props.user.firstName : ''} ${props.user.lastName}` : ''

    return (
        <div className="top_menu">  {/* Wrapper cho top menu */}
            <div className="container">
                <div className="row">
                    {/* Cột chứa thông tin điện thoại và email */}
                    <div className="col-lg-7">
                        <div className="float-left">
                            <p>Điện thoại: 093102322323  </p>  {/* Vị trí hiển thị số điện thoại */}
                            <p>email: dinhquoctien230302@gmail.com </p>  {/* Vị trí hiển thị email */}
                        </div>
                    </div>
                    {/* Cột chứa các liên kết người dùng, đăng nhập, đăng xuất */}
                    <div className="col-lg-5">
                        <div className="float-right">
                            <ul className="right_side">  {/* Danh sách các liên kết ở bên phải top menu */}
                                <li>
                                    {/* Nếu người dùng đã đăng nhập thì hiển thị tên người dùng và liên kết đến trang chi tiết */}
                                    {props.user && props.user.id ? <NavLink exact to={`/user/detail/${props.user && props.user.id ? props.user.id : ''}`}>
                                        {name}  {/* Hiển thị tên người dùng */}
                                    </NavLink>
                                        :
                                        // Nếu người dùng chưa đăng nhập, hiển thị liên kết đến trang login
                                        <a href="/login">
                                            Đăng nhập
                                        </a>
                                    }
                                </li>
                                <li style={{ cursor: 'pointer' }}>
                                    {/* Nếu người dùng đã đăng nhập thì hiển thị liên kết đăng xuất */}
                                    {props.user && props.user.id ? <a onClick={() => handleLogout()}>
                                        Đăng xuất
                                    </a>
                                        :
                                        // Nếu người dùng chưa đăng nhập, hiển thị liên kết đăng ký
                                        <a href="/login">
                                            Đăng ký
                                        </a>
                                    }
                                </li>
                                <li>
                                    {/* Hiển thị lựa chọn ngôn ngữ, trong trường hợp này chỉ có 'VI' */}
                                    <a>VI</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopMenu;  
