import React, { useEffect, useState } from 'react';
import './ReviewProduct.scss'; // Import file CSS cho component
import Lightbox from 'react-image-lightbox'; // Thư viện để xem ảnh trong lightbox
import 'react-image-lightbox/style.css'; // Đảm bảo rằng style của Lightbox được áp dụng
import CommonUtils from '../../utils/CommonUtils'; // Hàm tiện ích dùng chung
import { createNewReviewService, getAllReviewByProductIdService, ReplyReviewService, deleteReviewService } from '../../services/userService'; // Các hàm service gọi API
import { useParams } from 'react-router'; // Lấy tham số từ URL
import { toast } from 'react-toastify'; // Thư viện hiển thị thông báo
import ReviewModal from './ReviewModal'; // Modal để viết phản hồi cho đánh giá

function ReviewProduct(props) {
    const { id } = useParams(); // Lấy productId từ URL params
    const [inputValues, setInputValues] = useState({
        activeStar: '', imageReview: '', image: '', content: '', user: JSON.parse(localStorage.getItem('userData')), dataReview: [], countStar: {}, isOpen: false,
        isOpenModal: false, parentId: ''
    });

    // Hàm lấy tất cả các đánh giá cho sản phẩm
    useEffect(() => {
        let fetchAllReview = async () => {
            await loadAllReview();
        };
        fetchAllReview();
    }, []);

    // Mở ảnh để xem trong lightbox
    let openPreviewImage = (url) => {
        setInputValues({ ...inputValues, ["imageReview"]: url, ["isOpen"]: true });
    };

    // Hàm load các đánh giá và tính toán số lượng sao
    let loadAllReview = async () => {
        let res = await getAllReviewByProductIdService(id);
        if (res && res.errCode === 0) {
            let count5 = res.data.filter(item => item.star === 5);
            let count4 = res.data.filter(item => item.star === 4);
            let count3 = res.data.filter(item => item.star === 3);
            let count2 = res.data.filter(item => item.star === 2);
            let count1 = res.data.filter(item => item.star === 1);

            await setInputValues({
                ...inputValues, ["dataReview"]: res.data, ["countStar"]: {
                    star5: count5.length,
                    star4: count4.length,
                    star3: count3.length,
                    star2: count2.length,
                    star1: count1.length,
                    average: ((count5.length * 5) + (count4.length * 4) + (count3.length * 3) + (count2.length * 2) + (count1.length * 1)) / (count5.length + count4.length + count3.length + count2.length + count1.length),
                    quantity: count5.length + count4.length + count3.length + count2.length + count1.length
                },
                ["content"]: '', ["image"]: '', ["imageReview"]: '', ["activeStar"]: '', ["isOpenModal"]: false
            });
        }
    };

    // Hàm xử lý chọn sao cho đánh giá
    let handleChooseStart = (number) => {
        setInputValues({ ...inputValues, ["activeStar"]: number });
    };

    // Hàm xử lý khi người dùng chọn ảnh để review
    let handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if (file.size > 31312281) {
            toast.error("Dung lượng file bé hơn 30mb");
        } else {
            let base64 = await CommonUtils.getBase64(file);
            let objectUrl = URL.createObjectURL(file);
            setInputValues({ ...inputValues, ["image"]: base64, ["imageReview"]: objectUrl });
        }
    };

    // Hàm xử lý thay đổi nội dung đánh giá
    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    // Hàm lưu đánh giá người dùng
    let handleSaveComment = async () => {
        if (!inputValues.activeStar) toast.error("Bạn chưa chọn sao !");
        else if (!inputValues.content) toast.error("Nội dung không được để trống !");
        else {
            let response = await createNewReviewService({
                productId: id,
                content: inputValues.content,
                image: inputValues.image,
                userId: inputValues.user.id,
                star: inputValues.activeStar
            });
            if (response && response.errCode === 0) {
                toast.success("Đăng đánh giá thành công !");
                await loadAllReview();
            } else {
                toast.error(response.errMessage);
            }
        }
    };

    // Đóng modal
    let closeModal = () => {
        setInputValues({ ...inputValues, ["isOpenModal"]: false, ["parentId"]: '' });
    };

    // Mở modal để phản hồi
    let handleOpenModal = (id) => {
        setInputValues({ ...inputValues, ["isOpenModal"]: true, ["parentId"]: id });
    };

    // Gửi phản hồi từ modal
    let sendDataFromReViewModal = async (content) => {
        let res = await ReplyReviewService({
            content: content,
            productId: id,
            userId: inputValues.user.id,
            parentId: inputValues.parentId
        });
        if (res && res.errCode === 0) {
            toast.success("Phản hồi thành công !");
            await loadAllReview();
        }
    };

    // Xóa phản hồi
    let handleDeleteReply = async (id) => {
        let res = await deleteReviewService({
            data: {
                id: id
            }
        });
        if (res && res.errCode === 0) {
            toast.success("Xóa phản hồi thành công !");
            await loadAllReview();
        } else {
            toast.error(res.errMessage);
        }
    };

    return (
        <div className="row">
            <div className="col-lg-12">
                {/* Hiển thị sao trung bình và tổng số lượt đánh giá */}
                <div className="row total_rate">
                    <div className="col-6">
                        <div className="box_total">
                            <h5>Sao trung bình</h5>
                            <h4>{inputValues.countStar.average ? Math.round(inputValues.countStar.average * 10) / 10 : 0}</h4>
                            <h6>({inputValues.countStar.quantity} lượt đánh giá)</h6>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="rating_list">
                            <h3>{inputValues.countStar.quantity} lượt đánh giá</h3>
                            <ul className="list">
                                {/* Danh sách đánh giá theo số sao */}
                                <li>
                                    <a href="#">5
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star5} lượt đánh giá</a>
                                </li>
                                <li>
                                    <a href="#">4
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" />
                                        <i className="fa fa-star" /> Có {inputValues.countStar.star4} lượt đánh giá</a>
                                </li>
                                {/* Tương tự cho sao 3, 2, 1 */}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Hiển thị danh sách đánh giá */}
                <div className="review_list">
                    {inputValues.user &&
                        <div className="review_item">
                            <div className="form-group">
                                <label style={{ color: '#333', fontSize: '16px', fontWeight: '600' }}>Viết đánh giá của bạn</label>
                                <textarea name="content" value={inputValues.content} onChange={(event) => handleOnChange(event)} rows="3" className="form-control"></textarea>
                            </div>
                            <div className="content-review">
                                {/* Chọn sao và thêm ảnh */}
                                <div className="content-left">
                                    <label style={{ marginBottom: '0', cursor: 'pointer' }} htmlFor="cmtImg"><i className="fas fa-camera" ></i></label>
                                    <input type="file" id="cmtImg" accept=".jpg,.png"
                                        hidden onChange={(event) => handleOnChangeImage(event)}
                                    />
                                    <div className={inputValues.activeStar === 1 ? 'box-star active' : 'box-star'} onClick={() => handleChooseStart(1)}><i className="fa fa-star" /></div>
                                    {/* Các sao khác */}
                                </div>
                                <div className="content-right">
                                    <button onClick={() => handleSaveComment()} className="btn btn-primary"><i className="fas fa-pencil-alt"></i> Share</button>
                                </div>
                            </div>
                            <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} className="preview-cmt-img"></div>
                        </div>
                    }

                    {/* Hiển thị danh sách đánh giá đã có */}
                    {inputValues.dataReview && inputValues.dataReview.length > 0 &&
                        inputValues.dataReview.map((item, index) => {
                            if (!item.parentId) {
                                let name = `${item.user.firstName ? item.user.firstName : ''} ${item.user.lastName}`;
                                let arrStar = [];
                                for (let i = 0; i < item.star; i++) {
                                    arrStar[i] = 1;
                                }
                                return (
                                    <div key={index} className="review_item">
                                        <div className="media">
                                            <div className="d-flex">
                                                <img className="img-avatar" src={item.user.image} alt="" />
                                            </div>
                                            <div className="media-body">
                                                <h4>{name}</h4>
                                                {arrStar && arrStar.length > 0 &&
                                                    arrStar.map((item, index) => {
                                                        return (
                                                            <i key={index} className="fa fa-star" />
                                                        )
                                                    })
                                                }
                                                {inputValues.user && inputValues.user.roleId === "R1" &&
                                                    <a style={{ cursor: 'pointer' }} onClick={() => handleOpenModal(item.id)} className="reply_btn" >Phản hồi</a>
                                                }
                                            </div>
                                        </div>
                                        <div style={{ marginLeft: '88px' }}>
                                            <p style={{ paddingTop: '0px' }}>
                                                {item.content}
                                            </p>
                                            {item.image &&
                                                <img onClick={() => openPreviewImage(item.image)} className="img-cmt" src={item.image}></img>
                                            }
                                            {item.childComment && item.childComment.length > 0 &&
                                                item.childComment.map((item, index) => {
                                                    return (
                                                        <div key={index} className="box-reply-comment">
                                                            <div className="media">
                                                                <div className="d-flex">
                                                                    <img className="img-avatar" src={item.user.image} alt="" />
                                                                </div>
                                                                <div className="media-body">
                                                                    <h4>{item.user.firstName ? item.user.firstName : ""} {item.user.lastName ? item.user.lastName : ''}</h4>
                                                                    <p>{item.content}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            {/* Hiển thị lightbox khi click vào ảnh */}
            {inputValues.isOpen && (
                <Lightbox
                    mainSrc={inputValues.imageReview}
                    onCloseRequest={() => setInputValues({ ...inputValues, isOpen: false })}
                />
            )}

            {/* Modal để phản hồi */}
            <ReviewModal
                show={inputValues.isOpenModal}
                closeModal={closeModal}
                sendDataFromReViewModal={sendDataFromReViewModal}
            />
        </div>
    );
}

export default ReviewProduct;
