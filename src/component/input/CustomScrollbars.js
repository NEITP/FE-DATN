import React, { Component } from 'react'; // Import React và Component từ thư viện React
import { Scrollbars } from 'react-custom-scrollbars'; // Import Scrollbars từ thư viện react-custom-scrollbars để tạo thanh cuộn tùy chỉnh

import './CustomScrollbars.scss'; // Import CSS cho CustomScrollbars

class CustomScrollbars extends Component {

    ref = React.createRef(); // Khởi tạo một ref để tham chiếu đến component Scrollbars

    // Hàm trả về vị trí cuộn ngang hiện tại
    getScrollLeft = () => {
        const scrollbars = this.ref.current; // Lấy đối tượng Scrollbars từ ref
        return scrollbars.getScrollLeft(); // Trả về vị trí cuộn ngang
    }

    // Hàm trả về vị trí cuộn dọc hiện tại
    getScrollTop = () => {
        const scrollbars = this.ref.current; // Lấy đối tượng Scrollbars từ ref
        return scrollbars.getScrollTop(); // Trả về vị trí cuộn dọc
    }

    // Hàm cuộn xuống đáy của Scrollbar
    scrollToBottom = () => {
        if (!this.ref || !this.ref.current) { // Kiểm tra nếu ref chưa được gán giá trị
            return;
        }
        const scrollbars = this.ref.current; // Lấy đối tượng Scrollbars từ ref
        const targetScrollTop = scrollbars.getScrollHeight(); // Lấy chiều cao của nội dung trong Scrollbar
        this.scrollTo(targetScrollTop); // Cuộn đến đáy
    };

    // Hàm cuộn đến một vị trí chỉ định (targetTop)
    scrollTo = (targetTop) => {
        const { quickScroll } = this.props; // Lấy prop quickScroll từ component cha
        if (!this.ref || !this.ref.current) { // Kiểm tra nếu ref chưa được gán giá trị
            return;
        }
        const scrollbars = this.ref.current; // Lấy đối tượng Scrollbars từ ref
        const originalTop = scrollbars.getScrollTop(); // Lấy vị trí cuộn dọc ban đầu
        let iteration = 0; // Biến đếm số lần lặp

        // Hàm cuộn với hiệu ứng
        const scroll = () => {
            iteration++; // Tăng biến đếm số lần lặp
            if (iteration > 30) { // Nếu đã lặp quá 30 lần, dừng lại
                return;
            }
            scrollbars.scrollTop(originalTop + (targetTop - originalTop) / 30 * iteration); // Cuộn từng chút về vị trí đích

            // Nếu quickScroll là true, cuộn liên tục mà không dừng lại
            if (quickScroll && quickScroll === true) {
                scroll(); // Cuộn ngay lập tức
            } else {
                setTimeout(() => { // Nếu không, cuộn từ từ
                    scroll();
                }, 20); // Sau 20ms lại tiếp tục cuộn
            }
        };

        scroll(); // Khởi chạy hàm cuộn
    };

    // Hàm render thanh cuộn ngang (horizontal)
    renderTrackHorizontal = (props) => {
        return (
            <div {...props} className="track-horizontal" /> // Tạo div với class track-horizontal
        );
    };

    // Hàm render thanh cuộn dọc (vertical)
    renderTrackVertical = (props) => {
        return (
            <div {...props} className="track-vertical" /> // Tạo div với class track-vertical
        );
    };

    // Hàm render phần tay cầm thanh cuộn ngang (horizontal thumb)
    renderThumbHorizontal = (props) => {
        return (
            <div {...props} className="thumb-horizontal" /> // Tạo div với class thumb-horizontal
        );
    };

    // Hàm render phần tay cầm thanh cuộn dọc (vertical thumb)
    renderThumbVertical = (props) => {
        return (
            <div {...props} className="thumb-vertical" /> // Tạo div với class thumb-vertical
        );
    };

    // Hàm render khi không có thanh cuộn
    renderNone = (props) => {
        return (
            <div /> // Trả về div rỗng nếu không có thanh cuộn
        );
    };

    render() {
        const { className, disableVerticalScroll, disableHorizontalScroll, children, ...otherProps } = this.props; // Lấy props từ component cha
        return (
            <Scrollbars
                ref={this.ref} // Gán ref cho Scrollbars để có thể thao tác sau này
                autoHide={true} // Tự động ẩn thanh cuộn khi không cần thiết
                autoHideTimeout={200} // Thời gian ẩn thanh cuộn
                hideTracksWhenNotNeeded={true} // Ẩn thanh cuộn khi không cần thiết
                className={className ? className + ' custom-scrollbar' : 'custom-scrollbar'} // Gán class cho Scrollbars
                {...otherProps} // Truyền các props còn lại vào component Scrollbars
                renderTrackHorizontal={disableHorizontalScroll ? this.renderNone : this.renderTrackHorizontal} // Render thanh cuộn ngang nếu không bị vô hiệu hóa
                renderTrackVertical={disableVerticalScroll ? this.renderNone : this.renderTrackVertical} // Render thanh cuộn dọc nếu không bị vô hiệu hóa
                renderThumbHorizontal={disableHorizontalScroll ? this.renderNone : this.renderThumbHorizontal} // Render tay cầm thanh cuộn ngang nếu không bị vô hiệu hóa
                renderThumbVertical={disableVerticalScroll ? this.renderNone : this.renderThumbVertical} // Render tay cầm thanh cuộn dọc nếu không bị vô hiệu hóa
            >
                {children} // Hiển thị nội dung con của CustomScrollbars
            </Scrollbars>
        );
    }
}

export default CustomScrollbars; // Xuất component để sử dụng ở nơi khác
