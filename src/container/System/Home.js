import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2'; // Các thư viện biểu đồ Line, Pie, Bar
import { getCountCardStatistic, getCountStatusOrder, getStatisticByMonth, getStatisticByDay } from '../../services/userService'; // Các API để lấy dữ liệu thống kê
import moment from 'moment'; // Dùng để xử lý ngày tháng
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker"; // Thư viện chọn ngày

import "react-datepicker/dist/react-datepicker.css"; // Import kiểu dáng của DatePicker
ChartJS.register( // Đăng ký các thành phần cần thiết cho Chart.js
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Hàm để tạo cấu hình cho biểu đồ
let getOptions = (title) => {
  return {
    responsive: true, // Biểu đồ sẽ thay đổi kích thước theo khung chứa
    plugins: {
      legend: { position: 'top' }, // Đặt legend ở trên cùng của biểu đồ
      title: { display: true, text: title }, // Hiển thị tiêu đề của biểu đồ
    },
  }
}

const Home = () => {
  // Khai báo các state sử dụng trong component
  const [CountCard, setCountCard] = useState({}); // Dữ liệu số lượng thẻ
  const [CountStatusOrder, setCountStatusOrder] = useState({}); // Dữ liệu trạng thái đơn hàng
  const [StatisticOrderByMonth, setStatisticOrderByMonth] = useState({}); // Dữ liệu thống kê theo tháng
  const [StatisticOrderByDay, setStatisticOrderByDay] = useState({}); // Dữ liệu thống kê theo ngày
  const [dateRange, setDateRange] = useState([null, null]); // Khoảng thời gian để chọn
  const [startDate, endDate] = dateRange; // Ngày bắt đầu và kết thúc từ state dateRange
  const [DateTime, setDateTime] = useState(new Date()); // Thời gian hiện tại
  const [type, settype] = useState('month'); // Kiểu thống kê theo tháng hoặc ngày
  const [month, setmonth] = useState(new Date()); // Tháng hiện tại
  const [year, setyear] = useState(new Date()); // Năm hiện tại

  useEffect(() => {
    // Chạy khi component được mount
    loadCountCard(); // Lấy dữ liệu số lượng thẻ
    loadStatusOrder(); // Lấy dữ liệu trạng thái đơn hàng
    loadStatisticOrderByMonth(moment(year).format("YYYY")); // Thống kê theo tháng cho năm hiện tại
    loadStatisticOrderByDay(moment(year).format("YYYY"), moment(new Date()).format("M")); // Thống kê theo ngày cho tháng hiện tại
  }, []);

  // Cấu hình dữ liệu biểu đồ Pie (thống kê trạng thái đơn hàng)
  const dataPie = {
    labels: CountStatusOrder.arrayLable, // Nhãn cho các phần của biểu đồ
    datasets: [
      {
        label: '# of Votes', // Tiêu đề cho biểu đồ
        data: CountStatusOrder.arrayValue, // Dữ liệu cho biểu đồ
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ], // Màu nền của các phần trong biểu đồ
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ], // Màu viền của các phần trong biểu đồ
        borderWidth: 1, // Độ dày viền
      },
    ],
  };

  // Cấu hình dữ liệu biểu đồ Line (thống kê doanh thu theo tháng)
  const dataLine = {
    labels: StatisticOrderByMonth.arrayMonthLable, // Nhãn cho các tháng
    datasets: [
      {
        label: 'Doanh thu', // Tiêu đề cho biểu đồ
        data: StatisticOrderByMonth.arrayMonthValue, // Dữ liệu doanh thu theo tháng
        borderColor: 'rgb(53, 162, 235)', // Màu viền của đường
        backgroundColor: 'rgba(53, 162, 235, 0.5)', // Màu nền của đường
      },
    ],
  };

  // Cấu hình dữ liệu biểu đồ Bar (thống kê doanh thu theo ngày)
  const dataBar = {
    labels: StatisticOrderByDay.arrayDayLable, // Nhãn cho các ngày
    datasets: [
      {
        label: 'Doanh thu', // Tiêu đề cho biểu đồ
        data: StatisticOrderByDay.arrayDayValue, // Dữ liệu doanh thu theo ngày
        backgroundColor: 'rgba(255, 99, 132, 0.5)', // Màu nền của các thanh trong biểu đồ
      },
    ],
  };

  // Hàm lấy dữ liệu số lượng thẻ
  let loadCountCard = async () => {
    let res = await getCountCardStatistic(); // Gọi API để lấy số liệu
    if (res && res.errCode == 0) {
      setCountCard(res.data); // Lưu dữ liệu vào state
    }
  };

  // Hàm lấy dữ liệu trạng thái đơn hàng
  let loadStatusOrder = async () => {
    let res = await getCountStatusOrder({
      oneDate: type == 'day' ? startDate : DateTime, // Nếu chọn theo ngày, dùng startDate, nếu theo tháng dùng DateTime
      twoDate: endDate,
      type: type,
    });
    if (res && res.errCode == 0) {
      setCountStatusOrder(res.data); // Lưu dữ liệu vào state
    }
  };

  // Hàm xử lý sự kiện khi click để tải lại dữ liệu trạng thái đơn hàng
  let handleOnclick = () => {
    loadStatusOrder();
  };

  // Hàm lấy dữ liệu thống kê theo tháng
  let loadStatisticOrderByMonth = async (year) => {
    let res = await getStatisticByMonth(year); // Gọi API để lấy thống kê theo tháng
    if (res && res.errCode == 0) {
      setStatisticOrderByMonth(res.data); // Lưu dữ liệu vào state
    }
  };

  // Hàm lấy dữ liệu thống kê theo ngày
  let loadStatisticOrderByDay = async (year, month) => {
    let res = await getStatisticByDay({ year, month }); // Gọi API để lấy thống kê theo ngày
    if (res && res.errCode == 0) {
      setStatisticOrderByDay(res.data); // Lưu dữ liệu vào state
    }
  };

  // Hàm xử lý sự kiện khi thay đổi năm
  let handleOnChangeYear = (year) => {
    setyear(year); // Cập nhật state năm
    loadStatisticOrderByMonth(moment(year).format("YYYY")); // Lấy thống kê theo tháng cho năm đã chọn
  };

  // Hàm xử lý sự kiện khi thay đổi ngày trong DatePicker
  let handleOnChangeDatePickerFromDate = (date) => {
    setmonth(date); // Cập nhật state tháng
    loadStatisticOrderByDay(moment(date).format("YYYY"), moment(date).format("M")); // Lấy thống kê theo ngày cho tháng đã chọn
  };
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">THỐNG KÊ</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item active">Trang thống kê</li>
      </ol>
      <div className="row">
        <div className="col-xl-3 col-md-6">
          <div className="card bg-primary text-white mb-4">
            <div className="card-body">TỔNG SỐ ĐƠN HÀNG ({CountCard.countOrder})</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link className="small text-white stretched-link" to={'/admin/list-order'}>Chi tiết</Link>
              <div className="small text-white"><i className="fas fa-angle-right" /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-warning text-white mb-4">
            <div className="card-body">ĐÁNH GIÁ ({CountCard.countReview})</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <a className="small text-white stretched-link" href="#">Chi tiết</a>
              <div className="small text-white"><i className="fas fa-angle-right" /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-success text-white mb-4">
            <div className="card-body">SẢN PHẨM ({CountCard.countProduct})</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link className="small text-white stretched-link" to={'/admin/list-product'}>Chi tiết</Link>
              <div className="small text-white"><i className="fas fa-angle-right" /></div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6">
          <div className="card bg-danger text-white mb-4">
            <div className="card-body">THÀNH VIÊN ({CountCard.countUser})</div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <Link className="small text-white stretched-link" to={'/admin/list-user'}>Chi tiết</Link>
              <div className="small text-white"><i className="fas fa-angle-right" /></div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="col-md-8">
          <label>Chọn năm</label>
          <DatePicker
            selected={year}
            onChange={(date) => handleOnChangeYear(date)}
            dateFormat="yyyy"
            showYearPicker
            className='form-control col-md-2'
          />
          <Line options={getOptions('Biểu đồ doanh thu theo từng tháng trong năm')} data={dataLine} />
        </div>
        <div className="col-md-4">
          <form>
            <div className="form-row">
              <div className="form-group col-md-8">
                <label htmlFor="inputZip">Loại thống kê</label>
                <select value={type} name="type" onChange={(event) => settype(event.target.value)} id="inputState" className="form-control">
                  <option value="day">Ngày</option>
                  <option value="month">Tháng</option>
                  <option value="year">Năm</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              {type == "day" &&
                <>

                  <div className="form-group col-md-8">
                    <DatePicker
                      showMonthDropdown
                      showYearDropdown
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                      }}
                      className="form-control"
                      isClearable={true}
                    />
                  </div>


                </>
              }
              {type == "month" &&
                <>
                  <div className="form-group col-md-8">
                    <label htmlFor="inputCity">Chọn tháng</label>
                    <DatePicker
                      selected={DateTime}
                      onChange={(date) => setDateTime(date)}
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      className='form-control'
                    />
                  </div>
                </>
              }
              {type == "year" &&
                <>
                  <div className="form-group col-md-8">
                    <label htmlFor="inputCity">Chọn năm</label>
                    <DatePicker
                      selected={DateTime}
                      onChange={(date) => setDateTime(date)}
                      dateFormat="yyyy"
                      showYearPicker
                      className='form-control'
                    />
                  </div>
                </>
              }


            </div>
            <button type="button" onClick={() => handleOnclick()} className="btn btn-primary">Lọc</button>
          </form>
          <Pie data={dataPie} options={getOptions('Thống kê trạng thái đơn hàng')} />;
        </div>
      </div>
      <div className='row'>
        <div className='col-sm-11'>
          <label>Chọn tháng</label>
          <DatePicker
            selected={month}
            onChange={(date) => handleOnChangeDatePickerFromDate(date)}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className='form-control col-md-2'
          />
          <Bar options={getOptions('Biểu đồ doanh thu theo từng ngày trong tháng')} data={dataBar} />
        </div>

      </div>
    </div>
  )
}
export default Home;