import React, { useEffect, useState } from 'react'; // Hook React để quản lý trạng thái và hiệu ứng
import { useHistory } from "react-router"; // Dùng để điều hướng trang
import { toast } from 'react-toastify'; // Thư viện hiển thị thông báo cho người dùng
import './LoginWebPage.css'; // Import CSS cho trang login
import { FacebookLoginButton, GoogleLoginButton } from "react-social-login-buttons"; // Button đăng nhập xã hội
import { handleLoginService, checkPhonenumberEmail, createNewUser } from '../../services/userService'; // Dịch vụ liên quan đến người dùng
import Otp from "./Otp"; // Component nhập OTP
import { authentication } from "../../utils/firebase"; // Firebase authentication
import { signInWithPopup, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth' // Các phương thức đăng nhập Firebase
import { async } from "@firebase/util"; // Đảm bảo thực thi bất đồng bộ

const LoginWebPage = () => {
    // Khai báo trạng thái quản lý thông tin người dùng
    const [inputValues, setInputValues] = useState({
        email: '', // Email của người dùng
        password: 'passwordsecrect', // Mật khẩu mặc định (sẽ thay đổi khi người dùng nhập)
        lastName: '', // Họ và tên
        phonenumber: '', // Số điện thoại
        isOpen: false, // Trạng thái hiển thị OTP
        dataUser: {} // Dữ liệu người dùng cần tạo khi đăng ký
    });

    let history = useHistory(); // Sử dụng hook để điều hướng trang

    // Hàm xử lý sự kiện thay đổi giá trị input
    const handleOnChange = event => {
        const { name, value } = event.target; // Lấy tên và giá trị của trường nhập
        setInputValues({ ...inputValues, [name]: value }); // Cập nhật trạng thái inputValues
    };

    // Hàm xử lý đăng nhập
    let handleLogin = async () => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault(); // Ngăn ngừa việc gửi form
        });

        // Gọi API xử lý đăng nhập
        let res = await handleLoginService({
            email: inputValues.email,
            password: inputValues.password
        });

        if (res && res.errCode === 0) {
            // Lưu thông tin người dùng và token vào localStorage
            localStorage.setItem("userData", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.accessToken));

            // Điều hướng trang tùy theo vai trò người dùng
            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin"; // Đối với admin
            } else {
                window.location.href = "/"; // Đối với người dùng bình thường
            }
        } else {
            toast.error(res.errMessage); // Hiển thị thông báo lỗi nếu đăng nhập không thành công
        }
    };

    // Hàm xử lý đăng nhập với tài khoản xã hội (Facebook/Google)
    let handleLoginSocial = async (email) => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();
        });

        let res = await handleLoginService({
            email: email,
            password: inputValues.password
        });

        if (res && res.errCode === 0) {
            localStorage.setItem("userData", JSON.stringify(res.user));
            localStorage.setItem("token", JSON.stringify(res.accessToken));

            if (res.user.roleId === "R1" || res.user.roleId === "R4") {
                window.location.href = "/admin";
            } else {
                window.location.href = "/";
            }
        } else {
            toast.error(res.errMessage);
        }
    };

    // Hàm kiểm tra số điện thoại và email, nếu chưa có tài khoản sẽ mở form đăng ký
    let handleSaveUser = async () => {
        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();
        });

        let res = await checkPhonenumberEmail({
            phonenumber: inputValues.phonenumber,
            email: inputValues.email
        });

        if (res.isCheck === true) {
            toast.error(res.errMessage); // Thông báo nếu số điện thoại/email đã tồn tại
        } else {
            // Nếu chưa có tài khoản, chuyển sang form OTP
            setInputValues({
                ...inputValues,
                ["dataUser"]: {
                    email: inputValues.email,
                    lastName: inputValues.lastName,
                    phonenumber: inputValues.phonenumber,
                    password: inputValues.password,
                    roleId: 'R2', // Vai trò người dùng
                },
                ["isOpen"]: true
            });
        }
    };

    // Hàm chuyển đổi URL hình ảnh thành base64
    const getBase64FromUrl = async (url) => {
        const data = await fetch(url); // Lấy dữ liệu từ URL
        const blob = await data.blob(); // Chuyển dữ liệu thành blob
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob); // Đọc blob thành base64
            reader.onloadend = () => {
                const base64data = reader.result;
                resolve(base64data); // Trả về base64
            };
        });
    };

    // Hàm đăng nhập bằng tài khoản Facebook
    let signInwithFacebook = () => {
        const provider = new FacebookAuthProvider();
        signInWithPopup(authentication, provider)
            .then((re) => {
                LoginWithSocial(re); // Gọi hàm xử lý sau khi đăng nhập thành công
            })
            .catch((err) => {
                console.log(err.message); // Log lỗi nếu đăng nhập thất bại
            });
    };

    // Hàm xử lý đăng nhập với thông tin tài khoản xã hội (Google hoặc Facebook)
    let LoginWithSocial = async (re) => {
        let res = await checkPhonenumberEmail({
            phonenumber: re.user.providerData[0].phoneNumber,
            email: re.user.providerData[0].email
        });

        if (res.isCheck === true) {
            setInputValues({
                ...inputValues,
                ["email"]: re.user.providerData[0].email,
            });
            handleLoginSocial(re.user.providerData[0].email);
        } else {
            getBase64FromUrl(re.user.providerData[0].photoURL).then(async (value) => {
                let res = await createNewUser({
                    email: re.user.providerData[0].email,
                    lastName: re.user.providerData[0].displayName,
                    phonenumber: re.user.providerData[0].phoneNumber,
                    avatar: value, // Lưu ảnh đại diện người dùng
                    roleId: "R2", // Vai trò người dùng
                    password: inputValues.password
                });

                if (res && res.errCode === 0) {
                    toast.success("Tạo tài khoản thành công");
                    handleLoginSocial(re.user.providerData[0].email); // Tiến hành đăng nhập ngay sau khi tạo tài khoản
                } else {
                    toast.error(res.errMessage); // Thông báo lỗi khi tạo tài khoản không thành công
                }
            });
        }
    };

    // Hàm đăng nhập với tài khoản Google
    let signInwithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(authentication, provider)
            .then(async (re) => {
                LoginWithSocial(re); // Gọi hàm xử lý sau khi đăng nhập thành công
            })
            .catch((err) => {
                console.log(err.message); // Log lỗi nếu đăng nhập thất bại
            });
    };

    return (
        <>
            {/* Hiển thị form đăng nhập hoặc OTP dựa trên trạng thái isOpen */}
            {inputValues.isOpen === false &&
                <div className="box-login">
                    <div className="login-container">
                        <section id="formHolder">
                            <div className="row">
                                <div className="col-sm-6 brand">
                                    <a href="#" className="logo">MR <span>.</span></a>
                                    <div className="heading">
                                        <h2>Esier</h2>
                                        <p>Sự lựa chọn của bạn</p>
                                    </div>
                                </div>

                                <div className="col-sm-6 form">
                                    <div className="login form-peice">
                                        <form className="login-form" >
                                            <div className="form-group">
                                                <label htmlFor="loginemail">Địa chỉ email</label>
                                                <input name="email" onChange={(event) => handleOnChange(event)} type="email" id="loginemail" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="loginPassword">Mật khẩu</label>
                                                <input name="password" onChange={(event) => handleOnChange(event)} type="password" id="loginPassword" required />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleLogin()} type="submit" value="Đăng nhập" />
                                                <a style={{ cursor: 'pointer', }} className="switch">Tài khoản mới</a>
                                            </div>
                                            <FacebookLoginButton text="Đăng nhập với Facebook" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px", marginTop: "40px", marginBottom: "10px" }} onClick={() => signInwithFacebook()} />
                                            <GoogleLoginButton text="Đăng nhập với Google" iconSize="25px" style={{ width: "300px", height: "40px", fontSize: "16px" }} onClick={() => signInwithGoogle()} />
                                        </form>
                                    </div>
                                    <div className="signup form-peice switched">
                                        <form className="signup-form">
                                            <div className="form-group">
                                                <label htmlFor="name">Họ và tên</label>
                                                <input type="text" name="lastName" onChange={(event) => handleOnChange(event)} id="name" className="name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Địa chỉ email</label>
                                                <input type="email" name="email" onChange={(event) => handleOnChange(event)} id="email" className="email" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="phone">Số điện thoại</label>
                                                <input type="text" name="phonenumber" onChange={(event) => handleOnChange(event)} id="phone" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Mật khẩu</label>
                                                <input type="password" name="password" onChange={(event) => handleOnChange(event)} id="password" className="pass" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="passwordCon">Xác nhận mật khẩu</label>
                                                <input type="password" name="passwordCon" id="passwordCon" className="passConfirm" />
                                            </div>
                                            <div className="CTA">
                                                <input onClick={() => handleSaveUser()} type="submit" value="Lưu" id="submit" />
                                                <a style={{ cursor: 'pointer' }} className="switch">Tôi có tài khoản</a>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }

            {/* Hiển thị component OTP nếu trạng thái isOpen là true */}
            {inputValues.isOpen === true && <Otp dataUser={inputValues.dataUser} />}
        </>
    );
};

export default LoginWebPage;
