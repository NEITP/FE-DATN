import React, { useState, useEffect } from 'react';
// Các component được import từ thư mục HomeFeature
import HomeBanner from "../../component/HomeFeature/HomeBanner";
import MainFeature from "../../component/HomeFeature/MainFeature";
import ProductFeature from "../../component/HomeFeature/ProductFeature";
import NewProductFeature from "../../component/HomeFeature/NewProductFeature"
import HomeBlog from '../../component/HomeFeature/HomeBlog';

// Các hàm service để lấy dữ liệu từ API
import {
    getAllBanner,
    getProductFeatureService,
    getProductNewService,
    getNewBlog,
    getProductRecommendService
} from '../../services/userService';

// Import Slider và các style của nó
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function HomePage(props) {
    // Khai báo các state để lưu trữ dữ liệu cho từng phần của trang
    const [dataProductFeature, setDataProductFeature] = useState([]); // Lưu trữ các sản phẩm đặc trưng
    const [dataNewProductFeature, setNewProductFeature] = useState([]); // Lưu trữ các sản phẩm mới
    const [dataNewBlog, setdataNewBlog] = useState([]); // Lưu trữ các bài blog mới
    const [dataBanner, setdataBanner] = useState([]); // Lưu trữ các banner trang chủ
    const [dataProductRecommend, setdataProductRecommend] = useState([]); // Lưu trữ các sản phẩm gợi ý

    // Cấu hình cho Slider (carousel)
    let settings = {
        dots: false, // Tắt dots (chấm tròn dưới slider)
        Infinity: false, // Không quay lại slider đầu tiên sau khi đến cuối
        speed: 500, // Thời gian chuyển slide (500ms)
        slidesToShow: 1, // Hiển thị 1 slide mỗi lần
        slidesToScroll: 1, // Cuộn 1 slide mỗi lần
        autoplaySpeed: 2000, // Tự động chuyển slide sau 2000ms
        autoplay: true, // Bật autoplay cho slider
        cssEase: "linear" // Cách thức chuyển động của slider
    }

    // useEffect dùng để gọi API khi trang được load lần đầu
    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        // Nếu có thông tin người dùng, gọi API lấy sản phẩm gợi ý
        if (userData) {
            fetchProductRecommend(userData.id);
        }

        // Các API khác để lấy dữ liệu
        fetchBlogFeature();
        fetchDataBrand();
        fetchProductFeature();
        fetchProductNew();

        // Scroll trang về đầu
        window.scrollTo(0, 0);
    }, []); // Mảng phụ thuộc trống để chỉ chạy lần đầu khi trang được load

    // Hàm lấy dữ liệu blog mới
    let fetchBlogFeature = async () => {
        let res = await getNewBlog(3); // Lấy 3 bài blog mới
        if (res && res.errCode === 0) {
            setdataNewBlog(res.data); // Lưu dữ liệu blog vào state
        }
    };

    // Hàm lấy dữ liệu sản phẩm đặc trưng
    let fetchProductFeature = async () => {
        let res = await getProductFeatureService(6); // Lấy 6 sản phẩm đặc trưng
        if (res && res.errCode === 0) {
            setDataProductFeature(res.data); // Lưu dữ liệu sản phẩm vào state
        }
    };

    // Hàm lấy sản phẩm gợi ý cho người dùng
    let fetchProductRecommend = async (userId) => {
        let res = await getProductRecommendService({
            limit: 20,
            userId: userId
        });
        if (res && res.errCode === 0) {
            setdataProductRecommend(res.data); // Lưu dữ liệu sản phẩm gợi ý vào state
        }
    };

    // Hàm lấy dữ liệu banner
    let fetchDataBrand = async () => {
        let res = await getAllBanner({
            limit: 6,
            offset: 0,
            keyword: ''
        });
        if (res && res.errCode === 0) {
            setdataBanner(res.data); // Lưu dữ liệu banner vào state
        }
    };

    // Hàm lấy sản phẩm mới
    let fetchProductNew = async () => {
        let res = await getProductNewService(8); // Lấy 8 sản phẩm mới
        if (res && res.errCode === 0) {
            setNewProductFeature(res.data); // Lưu dữ liệu sản phẩm mới vào state
        }
    };

    return (
        <div>
            {/* Phần slider hiển thị các banner */}
            <Slider {...settings}>
                {dataBanner && dataBanner.length > 0 &&
                    dataBanner.map((item, index) => {
                        return (
                            <HomeBanner image={item.image} name={item.name} key={index} />
                        );
                    })
                }
            </Slider>

            {/* Phần hiển thị các tính năng chính */}
            <MainFeature />

            {/* Phần hiển thị các sản phẩm gợi ý */}
            <ProductFeature title={"Gợi ý sản phẩm"} data={dataProductRecommend} />

            {/* Phần hiển thị các sản phẩm đặc trưng */}
            <ProductFeature title={"Sản phẩm đặc trưng"} data={dataProductFeature} />

            {/* Phần hiển thị các sản phẩm mới */}
            <NewProductFeature title="Sản phẩm mới" description="Những sản phẩm vừa ra mắt mới lạ cuốn hút người xem" data={dataNewProductFeature} />

            {/* Phần hiển thị các bài blog mới */}
            <HomeBlog data={dataNewBlog} />
        </div>
    );
}

export default HomePage;
