import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { getItemCartStart } from '../../action/ShopCartAction'; // Import action để lấy danh sách giỏ hàng
import { addShopCartService, deleteItemShopCartService } from '../../services/userService'; // Các service để thêm, cập nhật giỏ hàng
import DeleteShopCartModal from '../../container/ShopCart/DeleteShopCartModal'; // Modal xác nhận xóa sản phẩm khỏi giỏ hàng
import CommonUtils from '../../utils/CommonUtils'; // Utils để định dạng tiền tệ

function ShopCartItem(props) {
    // Khai báo state cho số lượng sản phẩm và trạng thái của modal
    const [quantity, setquantity] = useState('');
    const [isOpenModal, setisOpenModal] = useState(false);

    const dispatch = useDispatch(); // Sử dụng dispatch để gửi action tới Redux

    // Hàm xử lý sự kiện thay đổi số lượng sản phẩm trong giỏ hàng
    let handleOnChange = async (event) => {
        setquantity(event.target.value); // Cập nhật số lượng mới vào state

        // Nếu số lượng được nhập là 0, sẽ mở modal để xác nhận xóa sản phẩm khỏi giỏ hàng
        if (event.target.value === "0") {
            setisOpenModal(true);
        } else {
            // Nếu số lượng khác 0 và có giá trị hợp lệ, gọi service cập nhật số lượng sản phẩm trong giỏ hàng
            if (event.target.value) {
                let res = await addShopCartService({
                    type: 'UPDATE_QUANTITY',
                    userId: props.userId,
                    productdetailsizeId: props.productdetailsizeId,
                    quantity: event.target.value,
                });

                // Nếu thành công, cập nhật lại giỏ hàng trong Redux
                if (res && res.errCode === 0) {
                    dispatch(getItemCartStart(props.userId));
                } else {
                    // Nếu có lỗi, thông báo lỗi và giữ nguyên số lượng cũ
                    toast.error(res.errMessage);
                    setquantity(res.quantity);
                }
            }
        }
    }

    // useEffect để đồng bộ số lượng sản phẩm khi props.quantity thay đổi
    useEffect(() => {
        setquantity(props.quantity);
    }, [props.quantity]);

    // Hàm đóng modal khi xác nhận xóa sản phẩm
    let closeModal = () => {
        setisOpenModal(false);
        setquantity(1); // Đặt lại số lượng về mặc định khi đóng modal
    }

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    let handleDeleteShopCart = async () => {
        let res = await deleteItemShopCartService({
            data: {
                id: props.id // ID sản phẩm cần xóa
            }
        });

        // Nếu xóa thành công, cập nhật lại giỏ hàng và đóng modal
        if (res && res.errCode === 0) {
            dispatch(getItemCartStart(props.userId));
            setisOpenModal(false);
        } else {
            // Nếu có lỗi, thông báo lỗi
            toast.error(res.errMessage);
        }
    }

    return (
        <tr>
            <td>
                {/* Hiển thị thông tin hình ảnh và tên sản phẩm */}
                <div className="media">
                    <div className="d-flex">
                        <img style={{ width: '147px', height: '100px', objectFit: 'cover' }} src={props.image} alt="" />
                    </div>
                    <div className="media-body">
                        <p className="text-justify">{props.name}</p>
                    </div>
                </div>
            </td>

            {/* Hiển thị giá sản phẩm, định dạng giá bằng CommonUtils */}
            <td>
                <h5>{CommonUtils.formatter.format(props.price)}</h5>
            </td>

            {/* Hiển thị số lượng sản phẩm, nếu là đơn hàng đã đặt thì không cho thay đổi */}
            <td style={{ textAlign: 'center' }}>
                {props.isOrder === true ? <span>{quantity}</span> :
                    <div className="product_count">
                        <input
                            type="number"
                            name="qty"
                            id="sst"
                            value={quantity}
                            title="Quantity:"
                            className="input-text qty"
                            min="0"
                            onChange={(event) => handleOnChange(event)}
                        />
                    </div>
                }
            </td>

            {/* Hiển thị tổng tiền của sản phẩm (Số lượng * giá sản phẩm) */}
            <td style={{ textAlign: 'center' }}>
                <h5 style={{ color: '#71cd14' }}>{CommonUtils.formatter.format(quantity * props.price)}</h5>
            </td>

            {/* Nếu sản phẩm chưa được đặt, cho phép xóa sản phẩm */}
            {props.isOrder === false &&
                <>
                    <td className="link-delete" onClick={() => setisOpenModal(true)}>Xóa</td>
                    {/* Modal xóa sản phẩm, sẽ hiển thị khi người dùng nhấn vào "Xóa" */}
                    <DeleteShopCartModal
                        handleDeleteShopCart={handleDeleteShopCart}
                        name={props.name}
                        isOpenModal={isOpenModal}
                        closeModal={closeModal}
                    />
                </>
            }

        </tr>
    );
}

export default ShopCartItem;
