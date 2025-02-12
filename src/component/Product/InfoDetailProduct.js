import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox'; // Thư viện Lightbox dùng để xem ảnh chi tiết
import 'react-image-lightbox/style.css'; // Đảm bảo có stylesheet cho Lightbox
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'; // Thông báo lỗi khi người dùng chưa đăng nhập
import { addItemCartStart } from '../../action/ShopCartAction'; // Action để thêm sản phẩm vào giỏ hàng
import './InfoDetailProduct.scss';
import CommonUtils from '../../utils/CommonUtils'; // Công cụ định dạng tiền tệ

function InfoDetailProduct(props) {
    let { dataProduct } = props; // Lấy dữ liệu sản phẩm từ props
    let [arrDetail, setarrDetail] = useState([]); // Lưu trữ chi tiết sản phẩm (size, ảnh, mô tả)
    const [productDetail, setproductDetail] = useState([]); // Lưu trữ các phiên bản chi tiết của sản phẩm (ví dụ: các kích thước khác nhau)
    const [isOpen, setisOpen] = useState(false); // Trạng thái mở cửa sổ Lightbox khi xem ảnh
    const [imgPreview, setimgPreview] = useState(''); // Lưu ảnh được chọn để xem trước trong Lightbox
    const [activeLinkId, setactiveLinkId] = useState(''); // Mã của size sản phẩm đang được chọn
    const [quantity, setquantity] = useState(''); // Lưu số lượng sản phẩm có sẵn cho size hiện tại
    const [quantityProduct, setquantityProduct] = useState(1); // Số lượng sản phẩm người dùng muốn mua

    // useEffect hook để xử lý khi dữ liệu sản phẩm thay đổi
    useEffect(() => {
        let { productDetail } = dataProduct ? dataProduct : []; // Lấy thông tin chi tiết sản phẩm từ props

        if (productDetail) {
            setproductDetail(productDetail); // Cập nhật chi tiết sản phẩm
            setarrDetail(productDetail[0]); // Lấy chi tiết sản phẩm đầu tiên để hiển thị
            setactiveLinkId(productDetail[0].productDetailSize[0].id); // Lấy ID size đầu tiên
            setquantity(productDetail[0].productDetailSize[0].stock); // Lấy số lượng sản phẩm có sẵn cho size đầu tiên
            props.sendDataFromInforDetail(productDetail[0].productDetailSize[0]); // Gửi thông tin chi tiết size đầu tiên lên component cha
        }
    }, [props.dataProduct]); // Khi dữ liệu sản phẩm thay đổi, useEffect sẽ được gọi lại

    // Hàm xử lý khi người dùng thay đổi lựa chọn size
    let handleSelectDetail = (event) => {
        setarrDetail(productDetail[event.target.value]); // Cập nhật chi tiết sản phẩm khi chọn size khác
        if (productDetail[event.target.value] && productDetail[event.target.value].productDetailSize.length > 0) {
            setactiveLinkId(productDetail[event.target.value].productDetailSize[0].id); // Cập nhật ID size
            setquantity(productDetail[event.target.value].productDetailSize[0].stock); // Cập nhật số lượng cho size mới
            props.sendDataFromInforDetail(productDetail[event.target.value].productDetailSize[0]); // Gửi thông tin size mới lên component cha
        }
    }

    // Hàm mở cửa sổ xem ảnh lớn (Lightbox)
    let openPreviewImage = (url) => {
        setimgPreview(url); // Cập nhật URL ảnh xem trước
        setisOpen(true); // Mở cửa sổ Lightbox
    }

    // Hàm xử lý khi người dùng chọn size sản phẩm
    let handleClickBoxSize = (data) => {
        setactiveLinkId(data.id); // Cập nhật ID size đang được chọn
        setquantity(data.stock); // Cập nhật số lượng sản phẩm có sẵn cho size đó
        props.sendDataFromInforDetail(data); // Gửi thông tin size lên component cha
    }

    const dispatch = useDispatch();

    // Hàm thêm sản phẩm vào giỏ hàng
    let handleAddShopCart = () => {
        if (props.userId) {
            // Nếu người dùng đã đăng nhập, dispatch action thêm sản phẩm vào giỏ hàng
            dispatch(addItemCartStart({
                userId: props.userId,
                productdetailsizeId: activeLinkId,
                quantity: quantityProduct,
            }));
        } else {
            // Nếu người dùng chưa đăng nhập, hiển thị thông báo yêu cầu đăng nhập
            toast.error("Đăng nhập để thêm vào giỏ hàng");
        }
    }

    return (
        <div className="row s_product_inner">
            <div className="col-lg-6">
                <div className="s_product_img">
                    {/* Carousel hiển thị ảnh sản phẩm */}
                    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                        <div>
                            <ol className="carousel-indicators">
                                {/* Render các chỉ báo ảnh */}
                                {arrDetail && arrDetail.productImage && arrDetail.productImage.length > 0 &&
                                    arrDetail.productImage.map((item, index) => {
                                        return (
                                            <li data-target="#carouselExampleIndicators" data-slide-to={index} className={index === 0 ? 'active' : ''}>
                                                <img height="60px" className="w-100" src={item.image} alt="" />
                                            </li>
                                        )
                                    })
                                }
                            </ol>
                        </div>
                        <div className="carousel-inner">
                            {/* Render các ảnh sản phẩm */}
                            {arrDetail && arrDetail.productImage && arrDetail.productImage.length > 0 &&
                                arrDetail.productImage.map((item, index) => {
                                    return (
                                        <div onClick={() => openPreviewImage(item.image)} style={{ cursor: 'pointer' }} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img className="d-block w-100" src={item.image} alt="Ảnh bị lỗi" />
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
                <div className="s_product_text">
                    <h3>{dataProduct.name}</h3> {/* Tên sản phẩm */}
                    <h2>{CommonUtils.formatter.format(arrDetail.discountPrice)}</h2> {/* Giá sản phẩm */}
                    <ul className="list">
                        <li>
                            <a className="active" href="#">
                                <span>Loại</span> : {dataProduct && dataProduct.categoryData ? dataProduct.categoryData.value : ''}
                            </a>
                        </li>
                        <li>
                            <a href="#"> <span>Trạng thái</span> : {quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</a>
                        </li>
                        <li>
                            <div className="box-size">
                                <a href="#"> <span>Size</span></a>
                                {/* Render các lựa chọn size sản phẩm */}
                                {arrDetail && arrDetail.productDetailSize && arrDetail.productDetailSize.length > 0 &&
                                    arrDetail.productDetailSize.map((item, index) => {
                                        return (
                                            <div onClick={() => handleClickBoxSize(item)} key={index} className={item.id === activeLinkId ? 'product-size active' : 'product-size'}>
                                                {item.sizeData.value} {/* Hiển thị kích thước */}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </li>
                        <li>
                            <a href="#">{quantity} sản phẩm có sẵn</a>
                        </li>
                    </ul>
                    <p>{arrDetail.description}</p> {/* Mô tả sản phẩm */}
                    <div style={{ display: 'flex' }}>
                        <div className="product_count">
                            <label htmlFor="qty">Số lượng</label>
                            {/* Input để người dùng nhập số lượng sản phẩm muốn mua */}
                            <input type="number" value={quantityProduct} onChange={(event) => setquantityProduct(event.target.value)} min="1" />
                        </div>
                        <div className="form-group">
                            <label style={{ fontSize: '14px', color: '#797979', fontFamily: '"Roboto",sans-serif', marginLeft: '16px' }} htmlFor="type">Loại sản phẩm</label>
                            <select onChange={(event) => handleSelectDetail(event)} className="sorting" name="type" style={{ outline: 'none', border: '1px solid #eee', marginLeft: '16px' }}>
                                {/* Render các tùy chọn chi tiết sản phẩm */}
                                {dataProduct && productDetail && productDetail.length > 0 &&
                                    productDetail.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>{item.nameDetail}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="card_area">
                        {/* Button thêm sản phẩm vào giỏ hàng */}
                        <a className="main_btn" onClick={() => handleAddShopCart()}>Thêm vào giỏ</a>
                        <a className="icon_btn" href="#">
                            <i className="lnr lnr lnr-heart" />
                        </a>
                    </div>
                </div>
            </div>
            {/* Lightbox hiển thị ảnh khi người dùng click vào ảnh sản phẩm */}
            {isOpen && <Lightbox mainSrc={imgPreview} onCloseRequest={() => setisOpen(false)} />}
        </div>
    );
}

export default InfoDetailProduct;
