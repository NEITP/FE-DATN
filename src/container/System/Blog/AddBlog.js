import React from 'react';
import { useEffect, useState } from 'react';
import { createNewBlogrService, getDetailBlogByIdService, updateBlogService } from '../../../services/userService'; // Import các service cho CRUD bài đăng
import CommonUtils from '../../../utils/CommonUtils'; // Import công cụ xử lý ảnh và file
import Lightbox from 'react-image-lightbox'; // Thư viện hiển thị ảnh trong Lightbox
import 'react-image-lightbox/style.css'; // Import style của Lightbox
import { toast } from 'react-toastify'; // Thư viện thông báo
import { useParams } from "react-router-dom"; // Hook dùng để lấy tham số từ URL
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của thư viện thông báo
import moment from 'moment'; // Thư viện xử lý ngày giờ
import { useFetchAllcode } from '../../customize/fetch'; // Hook custom fetch dữ liệu mã code
import MarkdownIt from 'markdown-it'; // Thư viện render markdown thành HTML
import MdEditor from 'react-markdown-editor-lite'; // Thư viện editor markdown
import 'react-markdown-editor-lite/lib/index.css'; // Import CSS của editor

const AddBlog = (props) => {
    const mdParser = new MarkdownIt(); // Khởi tạo parser Markdown
    const { id } = useParams(); // Lấy id từ URL nếu có
    const { data: dataSubject } = useFetchAllcode('SUBJECT'); // Lấy dữ liệu danh sách chủ đề từ API
    const [inputValues, setInputValues] = useState({ // State lưu trữ dữ liệu form
        title: '', shortdescription: '', image: '', isActionADD: true, imageReview: '', isOpen: false, contentMarkdown: '',
        contentHTML: '', subjectId: ''
    });

    // Đặt mặc định subjectId khi chưa có giá trị
    if (dataSubject && dataSubject.length > 0 && inputValues.subjectId === '') {
        setInputValues({ ...inputValues, ["subjectId"]: dataSubject[0].code });
    }

    useEffect(() => { // Hàm useEffect chạy khi component được load
        if (id) { // Nếu có id tức là đang chỉnh sửa blog
            let fetchBlog = async () => {
                let res = await getDetailBlogByIdService(id); // Lấy chi tiết blog từ API
                if (res && res.errCode === 0) {
                    setStateBlog(res.data); // Cập nhật state với dữ liệu blog
                }
            }
            fetchBlog();
        }
    }, []); // Chạy một lần khi component mount

    let setStateBlog = (data) => { // Cập nhật giá trị state khi có dữ liệu blog
        setInputValues({
            ...inputValues,
            ["title"]: data.title,
            ["shortdescription"]: data.shortdescription,
            ["image"]: data.image,
            ["imageReview"]: data.image,
            ["isActionADD"]: false, // Đặt trạng thái là sửa thay vì thêm mới
            ["contentMarkdown"]: data.contentMarkdown,
            ["contentHTML"]: data.contentHTML,
            ["subjectId"]: data.subjectId,
        });
    }

    const handleOnChange = event => { // Xử lý sự kiện thay đổi input
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    let handleOnChangeImage = async (event) => { // Xử lý sự kiện chọn ảnh
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) { // Kiểm tra dung lượng file (tối đa 30MB)
            toast.error("Dung lượng file bé hơn 30mb");
        } else {
            let base64 = await CommonUtils.getBase64(file); // Chuyển ảnh sang base64
            let objectUrl = URL.createObjectURL(file); // Tạo URL đối tượng từ file
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl }); // Cập nhật state với ảnh base64 và URL
        }
    }

    let openPreviewImage = () => { // Mở ảnh preview khi click vào hình ảnh
        if (!inputValues.imageReview) return;
        setInputValues({ ...inputValues, ["isOpen"]: true });
    }

    let handleSaveBlog = async () => { // Xử lý lưu bài đăng
        if (inputValues.isActionADD === true) { // Nếu là tạo mới bài đăng
            let res = await createNewBlogrService({
                shortdescription: inputValues.shortdescription,
                title: inputValues.title,
                subjectId: inputValues.subjectId,
                image: inputValues.image,
                contentMarkdown: inputValues.contentMarkdown,
                contentHTML: inputValues.contentHTML,
                userId: JSON.parse(localStorage.getItem('userData')).id
            })
            if (res && res.errCode === 0) {
                toast.success("Tạo mới bài đăng thành công !");
                setInputValues({ // Reset form
                    ...inputValues,
                    ["shortdescription"]: '',
                    ["title"]: '',
                    ["subjectId"]: '',
                    ["image"]: '',
                    ["contentMarkdown"]: '',
                    ["contentHTML"]: '',
                    ["imageReview"]: ''
                })
            } else toast.error("Tạo mới bài đăng thất bại");
        } else { // Nếu là cập nhật bài đăng
            let res = await updateBlogService({
                shortdescription: inputValues.shortdescription,
                title: inputValues.title,
                subjectId: inputValues.subjectId,
                image: inputValues.image,
                contentMarkdown: inputValues.contentMarkdown,
                contentHTML: inputValues.contentHTML,
                id: id
            })
            if (res && res.errCode === 0) {
                toast.success("Cập nhật bài đăng thành công !");
            } else toast.error("Cập nhật bài đăng thất bại");
        }
    }

    let handleEditorChange = ({ html, text }) => { // Xử lý thay đổi trong markdown editor
        setInputValues({
            ...inputValues,
            ["contentMarkdown"]: text,
            ["contentHTML"]: html
        });
    }

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý bài đăng</h1>

            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    {inputValues.isActionADD === true ? 'Tạo mới bài đăng' : 'Cập nhật thông tin bài đăng'}
                </div>
                <div className="card-body">
                    <form>
                        <div className="form-row">
                            <div className="form-group col-md-3">
                                <label htmlFor="inputEmail4">Tên bài đăng</label>
                                <input type="text" value={inputValues.title} name="title" onChange={(event) => handleOnChange(event)} className="form-control" id="inputEmail4" />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputEmail4">Chủ đề</label>
                                <select value={inputValues.subjectId} name="subjectId" onChange={(event) => handleOnChange(event)} id="inputState" className="form-control">
                                    {dataSubject && dataSubject.length > 0 &&
                                        dataSubject.map((item, index) => {
                                            return (
                                                <option key={index} value={item.code}>{item.value}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 form-group">
                                <label>Chọn hình ảnh</label>
                                <input accept=".jpg,.png" onChange={(event) => handleOnChangeImage(event)} type="file" className="form-control form-file" />
                            </div>
                            <div className="form-group col-md-3">
                                <label htmlFor="inputEmail4">Hình ảnh hiển thị</label>
                                <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="box-img-preview"></div>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">Mô tả ngắn</label>
                                <textarea rows="4" value={inputValues.shortdescription} name="shortdescription" onChange={(event) => handleOnChange(event)} className="form-control"></textarea>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="inputAddress">Nội dung bài đăng</label>
                                <MdEditor
                                    style={{ height: '500px' }}
                                    renderHTML={text => mdParser.render(text)}
                                    onChange={handleEditorChange}
                                    value={inputValues.contentMarkdown}
                                />
                            </div>
                        </div>
                        <button onClick={() => handleSaveBlog()} type="button" className="btn btn-primary">Lưu thông tin</button>
                    </form>
                </div>
            </div>

            {/* Lightbox mở khi click vào ảnh */}
            {inputValues.isOpen === true &&
                <Lightbox mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, ["isOpen"]: false })}
                />
            }
        </div>
    )
}
export default AddBlog;
