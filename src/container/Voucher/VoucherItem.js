import React from 'react';

// Import hình ảnh logo voucher và utils để định dạng giá trị
import logoVoucher from '../../../src/resources/img/logoVoucher.png'
import CommonUtils from '../../utils/CommonUtils'; // Import CommonUtils để sử dụng các phương thức định dạng
import './VoucherItem.scss' // Import stylesheet cho VoucherItem

function VoucherItem(props) {
    // Hàm để lưu mã giảm giá khi người dùng nhấn "Lưu"
    let handleSaveVoucher = () => {
        props.sendDataFromVoucherItem(props.id) // Gửi ID voucher cho hàm cha để lưu thông tin voucher
    }

    return (
        <div>
            {/* Box chứa voucher với kích thước truyền vào từ props */}
            <div style={{ width: props.width, height: props.height }} className="box-voucher">
                {/* Phần bên trái của voucher, chứa logo và tên voucher */}
                <div className="content-left">
                    <img src={logoVoucher} alt="Logo Voucher" /> {/* Hiển thị logo voucher */}
                    <span>{props.name}</span> {/* Hiển thị tên voucher */}
                </div>

                {/* Phần ngăn cách giữa các phần, có thể được sử dụng để thêm viền hoặc hiệu ứng */}
                <div className="border-center"></div>

                {/* Phần bên phải của voucher, chứa các thông tin chi tiết */}
                <div className="content-right">
                    <div className="box-content-right">
                        {/* Hiển thị mức giảm giá theo kiểu tiền hoặc phần trăm */}
                        <span className="name-voucher">Giảm {props.typeVoucher}</span>
                        {/* Hiển thị giá trị giảm tối đa */}
                        <span className="max-value-voucher">Giảm tối đa {CommonUtils.formatter.format(props.maxValue)}</span>

                        {/* Thanh hiển thị phần trăm số lượng voucher đã được sử dụng */}
                        <div className="box-percent">
                            <div className="wrap-percent">
                                {/* Thanh tiến độ dựa trên phần trăm đã dùng */}
                                <div style={{ width: `${props.widthPercent}%` }} className="percent"></div>
                            </div>
                            {/* Hiển thị số phần trăm đã được sử dụng */}
                            <span className="used-percent">Đã dùng {props.usedAmount}%</span>
                        </div>

                        {/* Nút để lưu mã giảm giá */}
                        <button onClick={() => handleSaveVoucher()} className="btn-voucher">Lưu</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default VoucherItem;
