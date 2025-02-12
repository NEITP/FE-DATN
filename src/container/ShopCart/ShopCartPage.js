import React, { useEffect, useState } from 'react';
import ShopCartItem from '../../component/ShopCart/ShopCartItem';  // Component để hiển thị các item trong giỏ hàng
import { useSelector, useDispatch } from 'react-redux'; // Dùng Redux để quản lý trạng thái
import { ChooseTypeShipStart, getItemCartStart } from '../../action/ShopCartAction'; // Các action để lấy thông tin giỏ hàng và loại ship
import storeVoucherLogo from '../../../src/resources/img/storeVoucher.png'; // Logo voucher cửa hàng
import { getAllTypeShip, getAllAddressUserByUserIdService, createNewAddressUserrService } from '../../services/userService'; // Các service gọi API
import './ShopCartPage.scss'; // CSS cho trang giỏ hàng
import VoucherModal from './VoucherModal'; // Modal cho voucher
import { Link, useHistory } from 'react-router-dom'; // Sử dụng Link và useHistory từ react-router-dom để điều hướng
import AddressUsersModal from './AdressUserModal'; // Modal thêm địa chỉ người dùng
import { toast } from 'react-toastify'; // Thông báo khi có hành động xảy ra
import CommonUtils from '../../utils/CommonUtils'; // Các hàm tiện ích chung

function ShopCartPage(props) {
    const dispatch = useDispatch(); // Hàm dispatch dùng để gọi action của Redux
    let history = useHistory(); // Dùng để điều hướng tới trang khác
    const [isOpenModal, setisOpenModal] = useState(false); // Trạng thái để mở/đóng modal voucher
    const [isOpenModalAddressUser, setisOpenModalAddressUser] = useState(false); // Trạng thái để mở/đóng modal địa chỉ
    const [user, setuser] = useState(); // Lưu thông tin người dùng
    const [typeShip, settypeShip] = useState([]); // Lưu thông tin loại vận chuyển
    let dataTypeShip = useSelector(state => state.shopcart.dataTypeShip); // Lấy loại vận chuyển từ Redux store
    let dataCart = useSelector(state => state.shopcart.listCartItem); // Lấy danh sách item trong giỏ hàng từ Redux store
    let dataVoucher = useSelector(state => state.shopcart.dataVoucher); // Lấy voucher từ Redux store
    const [priceShip, setpriceShip] = useState(0); // Lưu giá tiền vận chuyển

    // useEffect được sử dụng để chạy mã sau khi component được render hoặc khi có sự thay đổi
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData')); // Lấy dữ liệu người dùng từ localStorage
        setuser(userData); // Cập nhật state user
        if (userData) {
            dispatch(getItemCartStart(userData.id)); // Gọi action lấy giỏ hàng của người dùng
        } else {
            toast.error("Hãy đăng nhập để mua hàng"); // Hiển thị thông báo nếu người dùng chưa đăng nhập
            return;
        }

        let fetchTypeShip = async () => {
            let res = await getAllTypeShip({
                limit: '',
                offset: '',
                keyword: ''
            }); // Gọi API lấy tất cả các loại vận chuyển
            if (res && res.errCode === 0) {
                settypeShip(res.data); // Cập nhật các loại vận chuyển vào state
            }
        };
        fetchTypeShip(); // Gọi hàm lấy dữ liệu loại vận chuyển
        if (dataTypeShip && dataTypeShip.price) {
            setpriceShip(dataTypeShip.price); // Cập nhật giá vận chuyển nếu có
        }
    }, []); // useEffect chạy khi component được mount (lần đầu tiên) và không phụ thuộc vào bất kỳ state nào

    let price = 0; // Khai báo biến lưu giá trị tổng tiền (chưa có giảm giá)

    let closeModal = () => {
        setisOpenModal(false); // Đóng modal voucher
    };

    let closeModaAddressUser = () => {
        setisOpenModalAddressUser(false); // Đóng modal địa chỉ
    };

    let handleOpenModal = () => {
        setisOpenModal(true); // Mở modal voucher
    };

    // Hàm mở modal để thêm hoặc chọn địa chỉ người dùng
    let handleOpenAddressUserModal = async () => {
        if (user && user.id) {
            let res = await getAllAddressUserByUserIdService(user.id); // Lấy tất cả địa chỉ của người dùng từ server
            if (res && res.errCode === 0 && res.data.length > 0) {
                history.push(`/order/${user.id}`); // Nếu đã có địa chỉ, chuyển tới trang order
            } else {
                setisOpenModalAddressUser(true); // Nếu chưa có địa chỉ, mở modal để thêm địa chỉ
            }
        } else {
            toast.error("Hãy đăng nhập để mua hàng"); // Thông báo nếu người dùng chưa đăng nhập
        }
    };

    // Hàm tính tổng giá sau khi áp dụng voucher
    let totalPriceDiscount = (price, discount) => {
        if (discount.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
            // Nếu voucher là giảm giá theo tỷ lệ phần trăm
            if (((price * discount.voucherData.typeVoucherOfVoucherData.value) / 100) > discount.voucherData.typeVoucherOfVoucherData.maxValue) {
                return price - discount.voucherData.typeVoucherOfVoucherData.maxValue; // Giảm tối đa theo giá trị voucher
            } else {
                return price - ((price * discount.voucherData.typeVoucherOfVoucherData.value) / 100); // Giảm theo tỷ lệ phần trăm
            }
        } else {
            return price - discount.voucherData.typeVoucherOfVoucherData.maxValue; // Nếu voucher là giảm theo giá trị cố định
        }
    };

    // Hàm gửi dữ liệu từ modal địa chỉ người dùng về server để thêm địa chỉ mới
    let sendDataFromModalAddress = async (data) => {
        setisOpenModalAddressUser(false); // Đóng modal địa chỉ người dùng

        let res = await createNewAddressUserrService({
            shipName: data.shipName,
            shipAdress: data.shipAdress,
            shipEmail: data.shipEmail,
            shipPhonenumber: data.shipPhonenumber,
            userId: user.id
        }); // Gọi API thêm địa chỉ người dùng
        if (res && res.errCode === 0) {
            toast.success("Thêm địa chỉ thành công !"); // Thông báo thêm địa chỉ thành công
            history.push(`/order/${user.id}`); // Chuyển tới trang order
        } else {
            toast.error(res.errMessage); // Thông báo lỗi nếu có
        }
    };

    let closeModalFromVoucherItem = () => {
        setisOpenModal(false); // Đóng modal voucher
    };

    // Hàm xử lý thay đổi loại vận chuyển
    let hanldeOnChangeTypeShip = (item) => {
        setpriceShip(item.price); // Cập nhật giá vận chuyển theo loại được chọn
        dispatch(ChooseTypeShipStart(item)); // Gửi action để lưu loại vận chuyển vào Redux store
    };
    return (
        <section className="cart_area">
            <div className="container">
                <div className="cart_inner">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>

                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Giá</th>
                                    <th style={{ textAlign: 'center' }} scope="col">Số lượng</th>
                                    <th style={{ textAlign: 'center' }} scope="col">Tổng tiền</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>

                                {dataCart && dataCart.length > 0 &&
                                    dataCart.map((item, index) => {
                                        price += item.quantity * item.productDetail.discountPrice

                                        let name = `${item.productData.name} - ${item.productDetail.nameDetail} - ${item.productdetailsizeData.sizeData.value}`
                                        return (
                                            <ShopCartItem isOrder={false} id={item.id} userId={user && user.id} productdetailsizeId={item.productdetailsizeData.id} key={index} name={name} price={item.productDetail.discountPrice} quantity={item.quantity} image={item.productDetailImage[0].image} />
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="box-shipping">


                    <h6>
                        Chọn đơn vị vận chuyển
                    </h6>
                    <div>
                        {typeShip && typeShip.length > 0 &&
                            typeShip.map((item, index) => {
                                return (
                                    <div key={index} className="form-check">
                                        <input className="form-check-input" checked={item.id === dataTypeShip.id ? true : false} type="radio" name="exampleRadios" id="exampleRadios1" onChange={() => hanldeOnChangeTypeShip(item)} />
                                        <label className="form-check-label" for="exampleRadios1">
                                            {item.type} - {CommonUtils.formatter.format(item.price)}
                                        </label>
                                    </div>
                                )
                            })
                        }


                    </div>



                </div>
                <div className="box-shopcart-bottom">
                    <div className="content-left">
                        <div className="wrap-voucher">
                            <img width="20px" height="20px" style={{ marginLeft: "-3px" }} src={storeVoucherLogo}></img>
                            <span className="name-easier">Easier voucher</span>
                            <span onClick={() => handleOpenModal()} className="choose-voucher">Chọn Hoặc Nhập Mã</span>
                            {dataVoucher && dataVoucher.voucherData &&
                                <span className="choose-voucher">Mã voucher: {dataVoucher.voucherData.codeVoucher}</span>
                            }

                        </div>
                    </div>
                    <div className="content-right">
                        <div className="wrap-price">
                            <span className="text-total">Tổng thanh toán ({dataCart && dataCart.length} sản phẩm): </span>
                            <span className="text-price">{dataVoucher && dataVoucher.voucherData ? CommonUtils.formatter.format(totalPriceDiscount(price, dataVoucher) + priceShip) : CommonUtils.formatter.format(price + (+priceShip))}</span>
                        </div>

                        <div className="checkout_btn_inner">
                            <a onClick={() => handleOpenAddressUserModal()} className="main_btn" >Đi đến thanh toán</a>
                        </div>
                    </div>
                </div>
            </div>
            <VoucherModal closeModalFromVoucherItem={closeModalFromVoucherItem} price={price + (+priceShip)} isOpenModal={isOpenModal}
                closeModal={closeModal} id={user && user.id} />
            <AddressUsersModal sendDataFromModalAddress={sendDataFromModalAddress} isOpenModal={isOpenModalAddressUser} closeModaAddressUser={closeModaAddressUser} />
        </section>
    );
}

export default ShopCartPage;