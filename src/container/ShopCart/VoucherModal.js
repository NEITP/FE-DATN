import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Modal, ModalHeader, ModalFooter, ModalBody, Button } from 'reactstrap';
import '../User/StoreVoucher.scss';
import { getAllVoucherByUserIdService } from '../../services/userService';
import CommonUtils from '../../utils/CommonUtils';
import VoucherItemSmall from '../User/VoucherItemSmall';

const VoucherModal = (props) => {
    // Khai báo state để lưu trữ các giá trị liên quan đến mã voucher và nút bật/tắt
    const [inputValues, setInputValues] = useState({
        codeVoucher: '', activeBtn: false
    });
    // Khai báo state để lưu dữ liệu voucher
    const [dataVoucher, setdataVoucher] = useState([]);

    // Đóng modal hiện tại
    let handleCloseModal = () => {
        props.closeModal(); // Đóng modal thông qua hàm truyền từ props
    }

    // Hàm so sánh ngày tháng: kiểm tra nếu d1 nhỏ hơn hoặc bằng d2 (ngày hiện tại) thì trả về true
    function compareDates(d1, d2) {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]); // Chuyển ngày thành số để so sánh
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true; // Nếu ngày d1 nhỏ hơn hoặc bằng d2 thì hợp lệ
        if (d1 >= d2) return false; // Ngược lại, không hợp lệ
    }

    // Dùng useEffect để fetch dữ liệu voucher khi modal được mở
    useEffect(() => {
        let id = props.id; // Lấy id từ props truyền vào
        if (id) {
            let fetchData = async () => {
                let arrData = await getAllVoucherByUserIdService({
                    limit: '',
                    offset: '',
                    id: props.id
                });
                let arrTemp = [];
                if (arrData && arrData.errCode === 0) {
                    let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY'); // Lấy ngày hiện tại

                    for (let i = 0; i < arrData.data.length; i++) {
                        let fromDate = moment.unix(arrData.data[i].voucherData.fromDate / 1000).format('DD/MM/YYYY');
                        let toDate = moment.unix(arrData.data[i].voucherData.toDate / 1000).format('DD/MM/YYYY');
                        let amount = arrData.data[i].voucherData.amount;
                        let usedAmount = arrData.data[i].voucherData.usedAmount;
                        let minValue = arrData.data[i].voucherData.typeVoucherOfVoucherData.minValue;

                        // Kiểm tra các điều kiện: voucher chưa dùng hết, ngày sử dụng hợp lệ và giá trị tối thiểu hợp lệ
                        if (amount > usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true && minValue <= props.price) {
                            arrTemp[i] = arrData.data[i];
                        }
                    }
                    setdataVoucher(arrTemp); // Cập nhật dữ liệu voucher vào state
                }
            }
            fetchData(); // Gọi hàm fetch dữ liệu
        }

    }, [props.isOpenModal]); // Chạy lại khi modal mở lại

    // Hàm xử lý thay đổi giá trị input (mã voucher)
    const handleOnChange = event => {
        const { name, value } = event.target;

        if (value !== '') {
            setInputValues({ ...inputValues, ["activeBtn"]: true, [name]: value }); // Kích hoạt nút khi có giá trị
        } else {
            setInputValues({ ...inputValues, ["activeBtn"]: false, [name]: value }); // Tắt nút nếu không có giá trị
        }
    };

    // Hàm đóng modal từ VoucherItemSmall
    let closeModalFromVoucherItem = () => {
        props.closeModalFromVoucherItem();
    }

    return (
        <div className="">
            <Modal isOpen={props.isOpenModal} className={'booking-modal-container'} size="md" centered>
                <div className="modal-header">
                    <h5 className="modal-title">Chọn Eiser Voucher</h5>
                    <button onClick={handleCloseModal} type="button" className="btn btn-time" aria-label="Close">X</button>
                </div>
                <ModalBody>
                    {/* Khung chứa danh sách voucher */}
                    <div style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }} className="container-voucher">
                        {dataVoucher && dataVoucher.length > 0 && // Kiểm tra nếu có voucher
                            dataVoucher.map((item, index) => {
                                let percent = ""; // Khởi tạo biến lưu giá trị voucher
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "percent") {
                                    percent = item.voucherData.typeVoucherOfVoucherData.value + "%"; // Nếu là voucher % thì lưu theo dạng phần trăm
                                }
                                if (item.voucherData.typeVoucherOfVoucherData.typeVoucher === "money") {
                                    percent = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.value); // Nếu là voucher tiền thì định dạng lại giá trị
                                }
                                let MaxValue = CommonUtils.formatter.format(item.voucherData.typeVoucherOfVoucherData.maxValue); // Định dạng giá trị tối đa có thể giảm

                                return (
                                    <VoucherItemSmall
                                        closeModalFromVoucherItem={closeModalFromVoucherItem}
                                        data={item}
                                        id={item.id}
                                        key={index}
                                        name={item.voucherData.codeVoucher}
                                        maxValue={MaxValue}
                                        usedAmount={Math.round((item.voucherData.usedAmount * 100 / item.voucherData.amount) * 10) / 10}
                                        typeVoucher={percent} />
                                );
                            })
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleCloseModal}>Hủy</Button>
                </ModalFooter>
            </Modal>
        </div >
    );
}

export default VoucherModal;
