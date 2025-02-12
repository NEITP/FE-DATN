import React, { Component } from 'react';  // Import React và Component để tạo class component
import Flatpickr from 'react-flatpickr';  // Import Flatpickr, thư viện datepicker
import moment from 'moment';  // Thư viện để xử lý và định dạng ngày tháng

import KeyCodeUtils from "../../utils/KeyCodeUtils";  // Thư viện giúp xác định mã phím (keyCode)
import './DatePicker.scss';  // Import file SCSS cho component

class DatePicker extends Component {

    flatpickrNode = null;  // Khai báo biến để lưu trữ instance của flatpickr

    nodeRef = element => {
        // Hàm này để lấy tham chiếu tới đối tượng DOM của Flatpickr
        this.flatpickr = element && element.flatpickr;
        this.flatpickrNode = element && element.node;

        // Thêm các event listener vào Flatpickr
        if (this.flatpickrNode) {
            this.flatpickrNode.addEventListener('blur', this.handleBlur);
            this.flatpickrNode.addEventListener('keydown', this.handlerKeyDown);
        }
    };

    handlerKeyDown = (event) => {
        // Hàm xử lý sự kiện nhấn phím trên bàn phím (keydown)
        const keyCode = event.which || event.keyCode;

        // Nếu phím Enter được nhấn
        if (keyCode === KeyCodeUtils.ENTER) {
            event.preventDefault();  // Ngăn chặn hành động mặc định (thường là submit form)
            const { onChange } = this.props;
            const value = event.target.value;

            // Xử lý giá trị nhập vào và chuyển thành đối tượng moment
            const valueMoment = moment(value, 'DD/MM/YYYY');
            onChange([valueMoment.toDate(), valueMoment.toDate()]);
        }
    }

    componentWillUnmount() {
        // Xóa các event listener khi component bị hủy
        if (this.flatpickrNode) {
            this.flatpickrNode.removeEventListener('blur', this.handleBlur);
            this.flatpickrNode.removeEventListener('keydown', this.handlerKeyDown);
        }
    }

    handleBlur = (event) => {
        // Hàm xử lý sự kiện mất tiêu điểm (blur) của input
        const { onChange } = this.props;
        const value = event.target.value;

        // Xử lý giá trị nhập vào và chuyển thành đối tượng moment
        event.preventDefault();  // Ngăn chặn hành động mặc định
        const valueMoment = moment(value, 'DD/MM/YYYY');
        onChange([valueMoment.toDate(), valueMoment.toDate()]);
    };

    onOpen = () => {
        // Hàm xử lý khi mở Flatpickr, làm mờ input để trigger sự kiện blur
        if (this.flatpickrNode) {
            this.flatpickrNode.blur();
        }
    }

    close() {
        // Hàm đóng Flatpickr
        this.flatpickr.close();
    }

    checkDateValue = (str, max) => {
        // Hàm kiểm tra và điều chỉnh giá trị ngày, tháng cho hợp lệ
        if (str.charAt(0) !== '0' || str === '00') {
            var num = parseInt(str);
            if (isNaN(num) || num <= 0 || num > max) num = 1;
            str = num > parseInt(max.toString().charAt(0)) && num.toString().length === 1 ? '0' + num : num.toString();
        };
        return str;
    }

    autoFormatOnChange = (value, seperator) => {
        // Hàm tự động định dạng lại giá trị ngày tháng khi người dùng nhập
        var input = value;

        let regexForDeleting = new RegExp(`\\D\\${seperator}$`);

        // Xóa ký tự nếu có dấu phân cách (VD: "12/12/ => 12/1")
        if (regexForDeleting.test(input)) input = input.substr(0, input.length - 3);

        var values = input.split(seperator).map(function (v) {
            return v.replace(/\D/g, '');  // Xóa tất cả ký tự không phải số
        });

        if (values[0]) values[0] = this.checkDateValue(values[0], 31);  // Kiểm tra ngày
        if (values[1]) values[1] = this.checkDateValue(values[1], 12);  // Kiểm tra tháng

        // Tạo lại chuỗi ngày tháng với dấu phân cách
        var output = values.map(function (v, i) {
            return v.length === 2 && i < 2 ? v + ' ' + seperator + ' ' : v;
        });
        return output.join('').substr(0, 14);  // Trả về chuỗi định dạng lại
    }

    onInputChange = (e) => {
        // Hàm xử lý sự kiện thay đổi giá trị input
        if (this.DISPLAY_FORMAT === this.DATE_FORMAT_AUTO_FILL) {
            let converted = this.autoFormatOnChange(e.target.value, this.SEPERATOR);
            e.target.value = converted;
        }
    }

    onInputBlur = (e) => {
        // Hàm xử lý sự kiện mất tiêu điểm của input, nhưng không làm gì ở đây
    }

    // Các hằng số liên quan đến format và dấu phân cách
    SEPERATOR = "/";  // Dấu phân cách ngày/tháng/năm
    DATE_FORMAT_AUTO_FILL = "d/m/Y";  // Format tự động cho ngày tháng
    DISPLAY_FORMAT = "d/m/Y";  // Format ngày hiển thị

    render() {
        // Lấy các props truyền vào
        const { value, onChange, minDate, onClose, ...otherProps } = this.props;

        // Các tuỳ chọn cho Flatpickr
        const options = {
            dateFormat: this.DISPLAY_FORMAT,  // Định dạng ngày hiển thị
            allowInput: true,  // Cho phép nhập liệu trực tiếp
            disableMobile: true,  // Tắt giao diện mobile
            onClose: onClose,  // Callback khi đóng Flatpickr
            onOpen: this.onOpen,  // Callback khi mở Flatpickr
        };

        // Nếu có minDate, thêm vào options
        if (minDate) {
            options.minDate = minDate;
        }

        return (
            <Flatpickr
                ref={this.nodeRef}  // Gán tham chiếu cho Flatpickr
                value={value}  // Truyền giá trị ngày cho Flatpickr
                onChange={onChange}  // Gọi hàm onChange khi giá trị thay đổi
                options={options}  // Các tuỳ chọn cho Flatpickr
                {...otherProps}  // Truyền các props khác
            />
        );
    }
}

export default DatePicker;
