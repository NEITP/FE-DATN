import React, { useState, useEffect } from 'react';
import { useFetchAllcode } from '../../container/customize/fetch'; // Import hook tùy chỉnh để lấy dữ liệu mã code
import { getAllCodeService } from '../../services/userService'; // Import dịch vụ để lấy tất cả mã code từ API

function Category(props) {
    // Khai báo state để lưu trữ danh sách danh mục và mã danh mục đang được chọn
    const [arrCategory, setarrCategory] = useState([]); // Lưu trữ danh sách các danh mục
    const [activeLinkId, setactiveLinkId] = useState(''); // Lưu trữ mã danh mục hiện tại đang được chọn

    // useEffect hook sẽ chạy một lần khi component được render, để lấy dữ liệu danh mục từ API
    useEffect(() => {
        let fetchCategory = async () => {
            // Lấy dữ liệu danh mục từ API bằng dịch vụ getAllCodeService
            let arrData = await getAllCodeService('CATEGORY');
            if (arrData && arrData.errCode === 0) {
                // Nếu dữ liệu hợp lệ, thêm một mục "Tất cả" vào đầu danh sách danh mục
                arrData.data.unshift({
                    createdAt: null,
                    code: 'ALL', // Mã code cho mục "Tất cả"
                    type: "CATEGORY",
                    value: "Tất cả", // Tên hiển thị cho mục "Tất cả"
                });
                // Cập nhật state danh mục với dữ liệu nhận được từ API
                setarrCategory(arrData.data);
            }
        }
        fetchCategory(); // Gọi hàm fetchCategory khi component được mount
    }, []); // Empty dependency array đảm bảo useEffect chỉ chạy một lần khi component được render lần đầu

    // Hàm xử lý khi người dùng click vào một danh mục
    let handleClickCategory = (code) => {
        // Gửi mã danh mục đã chọn lên component cha (props.handleRecevieDataCategory) để xử lý
        props.handleRecevieDataCategory(code);
        // Cập nhật mã danh mục đang được chọn
        setactiveLinkId(code);
    }

    return (
        <aside className="left_widgets p_filter_widgets">
            <div className="l_w_title">
                <h3>Các danh mục</h3> {/* Tiêu đề danh mục */}
            </div>
            <div className="widgets_inner">
                <ul className="list">
                    {/* Duyệt qua danh sách danh mục và render từng danh mục */}
                    {arrCategory && arrCategory.length > 0 &&
                        arrCategory.map((item, index) => {
                            return (
                                <li className={item.code === activeLinkId ? 'active' : ''} // Kiểm tra xem danh mục hiện tại có đang được chọn không
                                    style={{ cursor: 'pointer' }} // Thêm hiệu ứng con trỏ chuột khi hover
                                    onClick={() => handleClickCategory(item.code)} // Khi click vào danh mục, gọi hàm handleClickCategory
                                    key={index}>
                                    <a>{item.value}</a> {/* Hiển thị tên danh mục */}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </aside>
    );
}

export default Category;
