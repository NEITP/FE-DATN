import React from 'react'; // Import React để sử dụng các chức năng của React.
import { useEffect, useState } from 'react'; // Import useState và useEffect từ React để quản lý trạng thái và hiệu ứng phụ.
import { getStatisticStockProduct } from '../../../services/userService'; // Import hàm API lấy thông tin thống kê sản phẩm tồn kho từ dịch vụ userService.
import moment from 'moment'; // Import thư viện moment để xử lý và định dạng thời gian.
import { toast } from 'react-toastify'; // Import thư viện toast để hiển thị thông báo cho người dùng.
import { PAGINATION } from '../../../utils/constant'; // Import đối tượng PAGINATION chứa các thông số phân trang.
import ReactPaginate from 'react-paginate'; // Import thư viện ReactPaginate để xử lý phân trang.
import CommonUtils from '../../../utils/CommonUtils'; // Import các tiện ích chung, như hàm xuất Excel.
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom"; // Import các thành phần của react-router-dom để quản lý điều hướng.

const StockProduct = () => {
    // State để lưu trữ dữ liệu sản phẩm tồn kho.
    const [dataStockProduct, setdataStockProduct] = useState([]);
    // State để lưu số lượng trang cần hiển thị.
    const [count, setCount] = useState('');
    // State để lưu số trang hiện tại.
    const [numberPage, setnumberPage] = useState('');

    // useEffect để gọi hàm loadStockProduct khi component được render lần đầu.
    useEffect(() => {
        loadStockProduct();
    }, []);

    // Hàm tải dữ liệu sản phẩm tồn kho từ API.
    let loadStockProduct = () => {
        try {
            let fetchData = async () => {
                // Gọi API lấy thông tin sản phẩm tồn kho với tham số phân trang.
                let arrData = await getStatisticStockProduct({
                    limit: PAGINATION.pagerow, // Số lượng sản phẩm trên mỗi trang.
                    offset: 0, // Vị trí bắt đầu của dữ liệu.
                });

                if (arrData && arrData.errCode === 0) { // Kiểm tra nếu API trả về thành công.
                    // Cập nhật dữ liệu sản phẩm vào state dataStockProduct.
                    setdataStockProduct(arrData.data);
                    // Tính số trang dựa trên tổng số sản phẩm và số sản phẩm mỗi trang, sau đó cập nhật vào state count.
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
                }
            }
            fetchData(); // Gọi hàm lấy dữ liệu.
        } catch (error) {
            console.log(error); // Nếu có lỗi trong quá trình lấy dữ liệu, log lỗi ra console.
        }
    };

    // Hàm xử lý khi người dùng chuyển trang.
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật số trang hiện tại vào state numberPage.

        // Gọi API lấy dữ liệu sản phẩm tồn kho cho trang mới.
        let arrData = await getStatisticStockProduct({
            limit: PAGINATION.pagerow, // Số sản phẩm trên mỗi trang.
            offset: number.selected * PAGINATION.pagerow, // Tính toán offset cho trang hiện tại.
        });

        if (arrData && arrData.errCode === 0) { // Kiểm tra nếu API trả về thành công.
            setdataStockProduct(arrData.data); // Cập nhật dữ liệu sản phẩm tồn kho vào state dataStockProduct.
        }
    };

    // Hàm xử lý khi người dùng nhấn nút xuất file Excel.
    let handleOnClickExport = async () => {
        // Gọi API để lấy tất cả sản phẩm tồn kho.
        let res = await getStatisticStockProduct({
            limit: '', // Không giới hạn số lượng sản phẩm.
            offset: '', // Không sử dụng offset.
        });

        if (res && res.errCode == 0) { // Kiểm tra nếu API trả về thành công.
            // Gọi hàm exportExcel từ CommonUtils để xuất dữ liệu ra một file Excel.
            await CommonUtils.exportExcel(res.data, "Danh sách sản phẩm tồn kho", "ListOrder");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý sản phẩm tồn kho</h1>


            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách sản phẩm tồn kho
                </div>

                <div className="card-body">
                    <div className='row'>

                        <div className='col-12 mb-2'>
                            <button style={{ float: 'right' }} onClick={() => handleOnClickExport()} className="btn btn-success" >Xuất excel <i class="fa-solid fa-file-excel"></i></button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" style={{ border: '1' }} width="100%" cellspacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Danh mục</th>
                                    <th>nhãn hàng</th>
                                    <th>Chất liệu</th>
                                    <th>Số lượng tồn</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dataStockProduct && dataStockProduct.length > 0 &&
                                    dataStockProduct.map((item, index) => {

                                        let name = `${item.productdData.name} - ${item.productDetaildData.nameDetail} - ${item.sizeData.value}`
                                        return (
                                            <tr key={index}>
                                                <td>{index}</td>
                                                <td>{name}</td>
                                                <td>{item.productdData.categoryData.value}</td>
                                                <td>{item.productdData.brandData.value}</td>
                                                <td>{item.productdData.material}</td>
                                                <td>{item.stock}</td>
                                            </tr>
                                        )


                                    })
                                }


                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
    )
}
export default StockProduct;