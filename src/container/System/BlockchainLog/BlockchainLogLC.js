import React, { useEffect, useState } from "react";
import { getAllBlockchainLogLC } from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import { PAGINATION2 } from "../../../utils/constant";
import ReactPaginate from "react-paginate";
import CommonUtils from "../../../utils/CommonUtils";
import FormSearch from "../../../component/Search/FormSearch";

const ManageBlockchainLogLC = () => {
    const [logs, setLogs] = useState([]);
    const [count, setCount] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchAllLogs();
    }, []);

    const fetchAllLogs = async () => {
        try {
            let res = await getAllBlockchainLogLC(PAGINATION2.pagerow);
            if (res) {
                setLogs(res);
                setCount(Math.ceil(res.length / PAGINATION2.pagerow));
            }
        } catch (error) {
            toast.error(" Lỗi khi lấy dữ liệu từ blockchain!");
        }
    };

    const handleChangePage = async (number) => {
        setNumberPage(number.selected);
    };

    const handleSearch = async (keyword) => {
        setKeyword(keyword);
        fetchAllLogs();
    };

    const handleExport = async () => {
        try {
            let res = await getAllBlockchainLogLC();
            if (res) {
                await CommonUtils.exportExcel(res, "Blockchain Logs", "BlockchainLogs");
            }
        } catch (error) {
            toast.error(" Lỗi khi xuất dữ liệu!");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Danh sách các bản ghi đã có trên Ganache</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách các bản ghi đã có trên Ganache
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-4">
                            <FormSearch title={"Tìm theo bảng"} handleSearch={handleSearch} />
                        </div>
                        <div className="col-8">
                            <button
                                style={{ float: "right" }}
                                onClick={handleExport}
                                className="btn btn-success"
                            >
                                Xuất excel <i className="fa-solid fa-file-excel"></i>
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-bordered" width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Bảng</th>
                                    <th>Record ID</th>
                                    <th>Hành động</th>
                                    <th>Hash</th>
                                    <th>Transaction Hash</th>
                                    <th>Block Hash</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 &&
                                    logs.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.tableName}</td>
                                            <td>{item.recordId}</td>
                                            <td>{item.action}</td>
                                            <td>{item.hash}</td>
                                            <td>{item.transactionHash || "N/A"}</td>
                                            <td>{item.blockHash || "N/A"}</td>
                                            <td>{item.address || "N/A"}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* <ReactPaginate
                previousLabel={"Quay lại"}
                nextLabel={"Tiếp"}
                breakLabel={"..."}
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
            /> */}
        </div>
    );
};

export default ManageBlockchainLogLC;
