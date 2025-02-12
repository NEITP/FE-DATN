import React, { useEffect, useState } from "react";
import { getAllBlockchainLog } from "../../../services/userService";
import moment from "moment";
import { toast } from "react-toastify";
import { PAGINATION } from "../../../utils/constant";
import ReactPaginate from "react-paginate";
import CommonUtils from "../../../utils/CommonUtils";
import FormSearch from "../../../component/Search/FormSearch";

const ManageBlockchainLog = () => {
    const [logs, setLogs] = useState([]);
    const [count, setCount] = useState(0);
    const [numberPage, setNumberPage] = useState(0);
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        fetchAllLogs(keyword);
    }, []);

    const fetchAllLogs = async (keyword) => {
        let res = await getAllBlockchainLog({
            limit: PAGINATION.pagerow,
            offset: 0,
            keyword: keyword
        });

        if (res) {
            setLogs(res.data);
            setCount(Math.ceil(res.count / PAGINATION.pagerow));
        }
    };

    const handleChangePage = async (number) => {
        setNumberPage(number.selected);

        let res = await getAllBlockchainLog({
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            keyword: keyword,
        });

        if (res && res.data) {
            setLogs(res.data);
        } else {
            toast.error("Không có dữ liệu cho trang này.");
        }
    };


    const handleSearch = (keyword) => {
        fetchAllLogs(keyword);
        setKeyword(keyword);
    };

    const handleExport = async () => {
        let res = await getAllBlockchainLog({ limit: "", offset: "", keyword: "" });
        if (res) {
            await CommonUtils.exportExcel(res.data, "Blockchain Logs", "BlockchainLogs");
        }
    };

    return (
        <div className="container-fluid px-4">
            <h1 className="mt-4">Quản lý bản ghi trên CSDL</h1>
            <div className="card mb-4">
                <div className="card-header">
                    <i className="fas fa-table me-1" />
                    Danh sách bản ghi trên CSDL
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
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 &&
                                    logs.map((item, index) => {
                                        let date = moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss");
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.tableName}</td>
                                                <td>{item.recordId}</td>
                                                <td>{item.action}</td>
                                                <td>{item.hash}</td>
                                                <td>{date}</td>
                                                <td>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ReactPaginate
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
            />
        </div>
    );
};

export default ManageBlockchainLog;
