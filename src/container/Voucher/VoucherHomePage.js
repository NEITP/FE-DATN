import React from 'react';
import { useEffect, useState } from 'react';  // Import các hook của React
import bannerPhoto from '../../../src/resources/img/banner-voucher.jfif'  // Import hình ảnh banner
import voucherTodayPhoto from '../../../src/resources/img/voucher-today.png'  // Import ảnh voucher hôm nay
import voucherAllPhoto from '../../../src/resources/img/voucher-all.jfif';  // Import ảnh tất cả các voucher
import applyVoucherPhoto from '../../../src/resources/img/applyVoucher.jfif';  // Import ảnh áp dụng voucher
import logoVoucher from '../../../src/resources/img/logoVoucher.png'  // Import logo của voucher
import './VoucherHomePage.scss';  // Import file scss cho styling
import VoucherItem from './VoucherItem';  // Import component VoucherItem để hiển thị voucher
import { getAllVoucher } from '../../services/userService';  // Import dịch vụ lấy tất cả các voucher
import moment, { now } from 'moment';  // Import thư viện moment.js để xử lý ngày tháng
import { toast } from 'react-toastify';  // Import thư viện thông báo toast
import { PAGINATION } from '../../utils/constant';  // Import hằng số pagination để xác định số lượng hàng trên mỗi trang
import ReactPaginate from 'react-paginate';  // Import ReactPaginate để tạo phân trang
import { saveUserVoucherService } from '../../services/userService';  // Import dịch vụ lưu voucher của người dùng
import CommonUtils from '../../utils/CommonUtils';  // Import các hàm tiện ích chung

function VoucherHomePage(props) {
    // Khai báo các state để lưu trữ dữ liệu
    const [dataVoucher, setdataVoucher] = useState([]);  // Dữ liệu voucher
    const [count, setCount] = useState('');  // Tổng số trang (để phân trang)
    const [numberPage, setnumberPage] = useState('');  // Số trang hiện tại
    const [user, setUser] = useState({});  // Dữ liệu người dùng

    // Hàm so sánh hai ngày (d1 và d2) dưới dạng chuỗi "DD/MM/YYYY"
    function compareDates(d1, d2) {
        var parts = d1.split('/');
        var d1 = Number(parts[2] + parts[1] + parts[0]);
        parts = d2.split('/');
        var d2 = Number(parts[2] + parts[1] + parts[0]);
        if (d1 <= d2) return true;
        if (d1 >= d2) return false;
    }

    // Hàm useEffect để tải dữ liệu khi component được render lần đầu
    useEffect(() => {
        try {
            // Lấy thông tin người dùng từ localStorage và gọi fetchData để lấy danh sách voucher
            const userData = JSON.parse(localStorage.getItem('userData'));
            setUser(userData);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, []);  // useEffect chỉ chạy một lần khi component mount

    // Hàm fetchData để lấy danh sách voucher từ API
    let fetchData = async () => {
        let arrData = await getAllVoucher({
            limit: PAGINATION.pagerow,  // Giới hạn số lượng item mỗi trang
            offset: 0  // Vị trí bắt đầu
        });

        let arrTemp = [];
        if (arrData && arrData.errCode === 0) {
            let nowDate = moment.unix(Date.now() / 1000).format('DD/MM/YYYY');  // Lấy ngày hiện tại

            // Lọc các voucher chưa hết hạn và chưa sử dụng hết
            for (let i = 0; i < arrData.data.length; i++) {
                let fromDate = moment.unix(arrData.data[i].fromDate / 1000).format('DD/MM/YYYY');
                let toDate = moment.unix(arrData.data[i].toDate / 1000).format('DD/MM/YYYY');
                let amount = arrData.data[i].amount;
                let usedAmount = arrData.data[i].usedAmount;

                if (amount !== usedAmount && compareDates(toDate, nowDate) === false && compareDates(fromDate, nowDate) === true) {
                    arrTemp[i] = arrData.data[i];
                }
            }
            setdataVoucher(arrTemp);  // Cập nhật dữ liệu voucher
            setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Tính số trang
        }
    };

    // Hàm xử lý sự kiện chuyển trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected);  // Cập nhật số trang hiện tại
        let arrData = await getAllVoucher({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow  // Tính toán vị trí bắt đầu của trang mới
        });

        if (arrData && arrData.errCode === 0) {
            setdataVoucher(arrData.data);  // Cập nhật lại danh sách voucher cho trang mới
        }
    };

    // Hàm lưu voucher của người dùng
    let sendDataFromVoucherItem = async (id) => {
        if (user && user.id) {
            let res = await saveUserVoucherService({
                userId: user.id,
                voucherId: id  // Lưu voucher cho người dùng
            });

            if (res && res.errCode === 0) {
                toast.success("Lưu mã voucher thành công !");  // Thông báo thành công
                await fetchData();  // Cập nhật lại danh sách voucher sau khi lưu
            } else {
                toast.error(res.errMessage);  // Thông báo lỗi nếu có
            }
        } else {
            toast.error("Đăng nhập để lưu mã giảm giá");  // Thông báo nếu người dùng chưa đăng nhập
        }
    };

    return (
        <div className="voucher-container">
            {/* Banner và các hình ảnh mô tả voucher */}
            <div className="voucher-banner">
                <img className="photo-banner" src={bannerPhoto}></img>
                <img src={voucherTodayPhoto}></img>
                <img src={voucherAllPhoto}></img>
                <img src={applyVoucherPhoto}></img>
            </div>

            {/* Danh sách voucher */}
            <div className="voucher-list">
                {dataVoucher && dataVoucher.length > 0 &&
                    dataVoucher.map((item, index) => {
                        let percent = "";
                        if (item.typeVoucherOfVoucherData.typeVoucher === "percent") {
                            percent = item.typeVoucherOfVoucherData.value + "%";  // Voucher giảm giá theo phần trăm
                        }
                        if (item.typeVoucherOfVoucherData.typeVoucher === "money") {
                            percent = CommonUtils.formatter.format(item.typeVoucherOfVoucherData.value);  // Voucher giảm giá theo tiền
                        }
                        let MaxValue = item.typeVoucherOfVoucherData.maxValue;

                        return (
                            <VoucherItem
                                sendDataFromVoucherItem={sendDataFromVoucherItem}
                                id={item.id}
                                width="550px"
                                height="330px"
                                key={index}
                                name={item.codeVoucher}
                                widthPercent={item.usedAmount * 100 / item.amount}
                                maxValue={MaxValue}
                                usedAmount={Math.round((item.usedAmount * 100 / item.amount) * 10) / 10}
                                typeVoucher={percent}
                            />
                        );
                    })
                }
            </div>

            {/* Phân trang */}
            <div className="box-pagination">
                <ReactPaginate
                    previousLabel={'Quay lại'}
                    nextLabel={'Tiếp'}
                    breakLabel={'...'}
                    pageCount={count}  // Số trang
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
                    onPageChange={handleChangePage}  // Hàm gọi khi thay đổi trang
                />
            </div>
        </div>
    );
}

export default VoucherHomePage;
