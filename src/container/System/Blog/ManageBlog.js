import React from 'react';
import { useEffect, useState } from 'react';
import { getAllBlog, deleteBlogService } from '../../../services/userService'; // Nhập các dịch vụ để lấy danh sách bài viết và xóa bài viết
import moment from 'moment'; // Thư viện để định dạng thời gian
import { toast } from 'react-toastify'; // Thư viện để hiển thị thông báo toast
import Lightbox from 'react-image-lightbox'; // Thư viện để hiển thị ảnh xem trước trong Lightbox
import 'react-image-lightbox/style.css'; // CSS cho Lightbox
import '../Banner/AddBanner.scss'; // Nhập CSS để sử dụng cho trang
import { PAGINATION } from '../../../utils/constant'; // Tham chiếu đến các hằng số liên quan đến phân trang
import ReactPaginate from 'react-paginate'; // Thư viện phân trang
import CommonUtils from '../../../utils/CommonUtils'; // Các tiện ích dùng chung
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useParams } from "react-router-dom"; // Các thành phần router để điều hướng
import FormSearch from '../../../component/Search/FormSearch'; // Thành phần tìm kiếm bài viết

const ManageBlog = () => {
    // Khai báo các state cần thiết cho quản lý bài đăng
    const [dataBlog, setdataBlog] = useState([]); // Dữ liệu các bài viết
    const [imgPreview, setimgPreview] = useState(''); // Dữ liệu hình ảnh xem trước
    const [isOpen, setisOpen] = useState(false); // Trạng thái mở Lightbox xem ảnh
    const [count, setCount] = useState(''); // Tổng số trang
    const [numberPage, setnumberPage] = useState(''); // Trang hiện tại
    const [keyword, setkeyword] = useState(''); // Từ khóa tìm kiếm

    useEffect(() => {
        loadBlog(keyword); // Gọi hàm loadBlog khi trang được render
    }, []);

    // Hàm để lấy danh sách blog
    let loadBlog = async (keyword) => {
        let arrData = await getAllBlog({
            subjectId: '',
            limit: PAGINATION.pagerow, // Giới hạn số bài viết mỗi trang
            offset: 0, // Vị trí bắt đầu
            keyword: keyword // Từ khóa tìm kiếm
        });
        if (arrData && arrData.errCode === 0) {
            setdataBlog(arrData.data); // Cập nhật dữ liệu bài viết
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Tính toán số trang
        }
    }

    // Hàm mở Lightbox để xem ảnh
    let openPreviewImage = (url) => {
        setimgPreview(url); // Lấy đường dẫn ảnh
        setisOpen(true); // Mở Lightbox
    }

    // Hàm xóa bài viết
    let handleDeleteBlog = async (id) => {
        let response = await deleteBlogService({
            data: {
                id: id
            }
        });
        if (response && response.errCode === 0) {
            toast.success("Xóa bài đăng thành công!"); // Hiển thị thông báo thành công
            // Sau khi xóa, gọi lại hàm lấy danh sách blog
            let arrData = await getAllBlog({
                subjectId: '',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                keyword: keyword
            });
            if (arrData && arrData.errCode === 0) {
                setdataBlog(arrData.data); // Cập nhật lại danh sách bài viết
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow)); // Cập nhật lại số trang
            }
        } else {
            toast.error("Xóa bài đăng thất bại!"); // Hiển thị thông báo lỗi
        }
    }

    // Hàm thay đổi trang khi phân trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại
        let arrData = await getAllBlog({
            subjectId: '',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow, // Thay đổi offset khi thay đổi trang
            keyword: keyword
        });
        if (arrData && arrData.errCode === 0) {
            setdataBlog(arrData.data); // Cập nhật dữ liệu bài viết
        }
    }

    // Hàm tìm kiếm bài viết
    let handleSearchBlog = (keyword) => {
        loadBlog(keyword); // Gọi hàm loadBlog để tải lại danh sách với từ khóa tìm kiếm
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    }

    // Hàm thay đổi từ khóa tìm kiếm khi nhập vào ô tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            loadBlog(keyword); // Nếu không có từ khóa, tải lại tất cả bài viết
            setkeyword(keyword);
        }
    }

    // Hàm xuất dữ liệu ra file excel
    let handleOnClickExport = async () => {
        let res = await getAllBlog({
            subjectId: '',
            limit: '',
            offset: '',
            keyword: ''
        });
        if (res && res.errCode === 0) {
            res.data.forEach(element => {
                element.image = ""; // Xóa ảnh trong dữ liệu để không xuất ra file
            });
            await CommonUtils.exportExcel(res.data, "Danh sách bài viết", "ListBlog"); // Xuất ra excel
        }
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý bài đăng</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách bài đăng
                </div>
                <div className="card-body">
                    {/* Tìm kiếm bài viết và nút xuất excel */}
                    <div className='row'>
                        <div className='col-4'>
                            <FormSearch title={"tiêu đề"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearchBlog} />
                        </div>
                        <div className='col-8'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success">Xuất excel <i className="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên bài đăng</th>
                                    <th>Chủ đề</th>
                                    <th>Hình ảnh</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Hiển thị danh sách bài viết */}
                                {dataBlog && dataBlog.length > 0 &&
                                    dataBlog.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.title}</td>
                                                <td>{item.subjectData.value}</td>
                                                <td style={{ width: '30%' }} >
                                                    <div onClick={() => openPreviewImage(item.image)} className="box-img-preview" style={{ backgroundImage: `url(${item.image})`, width: '100%' }}></div>
                                                </td>
                                                <td style={{ width: '20%' }}>
                                                    <Link to={`/admin/edit-blog/${item.id}`}>Edit</Link>
                                                    &nbsp; &nbsp;
                                                    <span onClick={() => handleDeleteBlog(item.id)} style={{ color: '#0E6DFE', cursor: 'pointer' }} >Delete</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Phân trang */}
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={count}
                    marginPagesDisplayed={3}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    activeClassName={"active"}
                    onPageChange={handleChangePage}
                />
            </div>
            {/* Hiển thị hình ảnh xem trước trong Lightbox */}
            {isOpen === true &&
                <Lightbox mainSrc={imgPreview} onCloseRequest={() => setisOpen(false)} />
            }
        </div>
    )
}

export default ManageBlog;
