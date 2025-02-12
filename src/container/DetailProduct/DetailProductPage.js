import React, { useEffect, useState } from 'react';  // Import React và các hooks cần thiết từ React
import { Link, useParams } from "react-router-dom";  // Import các component từ react-router-dom để xử lý điều hướng
import { getDetailProductByIdService, getProductRecommendService } from '../../services/userService';  // Import các dịch vụ API để lấy dữ liệu sản phẩm
import ImgDetailProduct from '../../component/Product/ImgDetailProduct';  // Component hiển thị ảnh chi tiết sản phẩm
import InfoDetailProduct from '../../component/Product/InfoDetailProduct';  // Component hiển thị thông tin chi tiết sản phẩm
import CommentProduct from '../../component/Product/CommentProduct';  // Component hiển thị bình luận sản phẩm
import ProfileProduct from '../../component/Product/ProfileProduct';  // Component hiển thị hồ sơ sản phẩm
import ReviewProduct from '../../component/Product/ReviewProduct';  // Component hiển thị đánh giá sản phẩm
import DescriptionProduct from '../../component/Product/DescriptionProduct';  // Component hiển thị mô tả chi tiết sản phẩm
import NewProductFeature from "../../component/HomeFeature/NewProductFeature";  // Component hiển thị sản phẩm mới
import ProductFeature from '../../component/HomeFeature/ProductFeature';  // Component hiển thị các sản phẩm được gợi ý

// Component chi tiết sản phẩm
function DetailProductPage(props) {
    const [dataProduct, setDataProduct] = useState({})  // State lưu thông tin sản phẩm
    const [dataDetailSize, setdataDetailSize] = useState({})  // State lưu thông tin chi tiết về kích thước sản phẩm
    const { id } = useParams();  // Hook useParams để lấy id sản phẩm từ URL
    const [user, setUser] = useState({})  // State lưu thông tin người dùng
    const [dataProductRecommend, setdataProductRecommend] = useState([])  // State lưu danh sách sản phẩm gợi ý

    useEffect(async () => {
        // Khi component được render, lấy thông tin người dùng từ localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            fetchProductFeature(userData.id)  // Nếu có người dùng, gọi API lấy các sản phẩm gợi ý
            setUser(userData)  // Lưu thông tin người dùng vào state
        }

        window.scrollTo(0, 0);  // Cuộn trang lên đầu

        fetchDetailProduct()  // Gọi API để lấy thông tin sản phẩm
    }, [])  // useEffect chỉ chạy 1 lần khi component được render lần đầu

    // Hàm truyền dữ liệu từ component con InfoDetailProduct
    let sendDataFromInforDetail = (data) => {
        setdataDetailSize(data)  // Cập nhật state dataDetailSize với dữ liệu từ component con
    }

    // Hàm lấy chi tiết sản phẩm từ API
    let fetchDetailProduct = async () => {
        let res = await getDetailProductByIdService(id)  // Gọi API lấy chi tiết sản phẩm theo id
        if (res && res.errCode === 0) {  // Nếu API trả về thành công
            setDataProduct(res.data)  // Lưu dữ liệu sản phẩm vào state dataProduct
        }
    }

    // Hàm lấy các sản phẩm gợi ý từ API
    let fetchProductFeature = async (userId) => {
        let res = await getProductRecommendService({
            limit: 20,  // Giới hạn 20 sản phẩm gợi ý
            userId: userId  // Truyền id người dùng vào để lấy sản phẩm gợi ý phù hợp
        })
        if (res && res.errCode === 0) {  // Nếu API trả về thành công
            setdataProductRecommend(res.data)  // Lưu danh sách sản phẩm gợi ý vào state dataProductRecommend
        }
    }

    return (
        <div>
            {/* Banner area - Hiển thị tiêu đề và các liên kết điều hướng */}
            <section className="banner_area">
                <div className="banner_inner d-flex align-items-center">
                    <div className="container">
                        <div className="banner_content d-md-flex justify-content-between align-items-center">
                            <div className="mb-3 mb-md-0">
                                <h2>Chi tiết sản phẩm</h2>  {/* Tiêu đề trang */}
                                <p>
                                    Thông số chi tiết về sản phẩm
                                </p>
                            </div>
                            <div className="page_link">
                                {/* Các liên kết điều hướng */}
                                <Link to={"/"}>Trang chủ</Link>
                                <Link to={"/shop"}>Cửa hàng</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần hiển thị ảnh và thông tin chi tiết sản phẩm */}
            <div className="product_image_area">
                <div className="container">
                    {/* Truyền dữ liệu sản phẩm và hàm gửi dữ liệu chi tiết vào component con InfoDetailProduct */}
                    <InfoDetailProduct userId={user && user.id ? user.id : ''} dataProduct={dataProduct} sendDataFromInforDetail={sendDataFromInforDetail} />
                </div>
            </div>

            {/* Phần tab cho mô tả sản phẩm và các đánh giá */}
            <section className="product_description_area">
                <div className="container">
                    {/* Các tab điều hướng */}
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="profile-tab" data-toggle="tab" href="#profile"
                                role="tab" aria-controls="profile" aria-selected="false">Thông số chi tiết</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link " id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Mô tả chi tiết</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="review-tab" data-toggle="tab" href="#review"
                                role="tab" aria-controls="review" aria-selected="false">Đánh giá</a>
                        </li>
                    </ul>

                    {/* Nội dung các tab */}
                    <div className="tab-content" id="myTabContent">
                        {/* Tab "Thông số chi tiết" */}
                        <div className="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <ProfileProduct data={dataDetailSize} />  {/* Component hiển thị thông tin chi tiết về sản phẩm */}
                        </div>

                        {/* Tab "Mô tả chi tiết" */}
                        <div className="tab-pane fade" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <DescriptionProduct data={dataProduct.contentHTML} />  {/* Component hiển thị mô tả chi tiết sản phẩm */}
                        </div>

                        {/* Tab "Đánh giá" */}
                        <div className="tab-pane fade" id="review" role="tabpanel" aria-labelledby="review-tab">
                            <ReviewProduct />  {/* Component hiển thị đánh giá sản phẩm */}
                        </div>
                    </div>
                </div>

                {/* Nếu có sản phẩm gợi ý thì hiển thị danh sách sản phẩm */}
                {user && dataProductRecommend && dataProductRecommend.length > 0 &&
                    <ProductFeature title={"Sản phẩm bạn quan tâm"} data={dataProductRecommend} />
                }
            </section>
        </div>
    );
}

export default DetailProductPage;  
