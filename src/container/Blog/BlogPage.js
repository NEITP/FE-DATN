import React, { useEffect, useState } from 'react';  // Import React và các hook cần thiết: useEffect, useState
import ItemBlog from '../../component/Blog/ItemBlog';  // Import component hiển thị bài blog
import Pagination from '../../component/Shop/Pagination';  // Import component phân trang (Pagination)
import SpecialItemBlog from '../../component/Blog/SpecialItemBlog';  // (Không sử dụng trong code này, có thể xóa)
import RightBlog from '../../component/Blog/RightBlog';  // Import component sidebar bên phải
import { PAGINATION } from '../../utils/constant';  // Import các hằng số liên quan đến phân trang từ constant
import { getAllBlog } from '../../services/userService';  // Import hàm lấy tất cả blog từ dịch vụ
import ReactPaginate from 'react-paginate';  // Import thư viện phân trang ReactPaginate
import { useFetchAllcode } from '../customize/fetch';  // Import hook custom để lấy tất cả các mã (code) từ API (không sử dụng ở đây)
import { getAllCategoryBlogService, getFeatureBlog } from '../../services/userService';  // Import các dịch vụ lấy danh mục blog và bài blog nổi bật
import { Link } from 'react-router-dom';  // Import Link để tạo liên kết điều hướng giữa các trang

function BlogPage(props) {
  // Các state để lưu trữ dữ liệu từ API
  const [dataBlog, setdataBlog] = useState([]);  // Lưu trữ danh sách blog
  const [dataFeatureBlog, setdataFeatureBlog] = useState([]);  // Lưu trữ các bài blog nổi bật
  const [dataSubject, setdataSubject] = useState([]);  // Lưu trữ danh mục blog
  const [count, setCount] = useState('');  // Lưu trữ số trang phân trang
  const [numberPage, setnumberPage] = useState('');  // Lưu trữ số trang hiện tại
  const [subjectId, setsubjectId] = useState('');  // Lưu trữ ID của danh mục blog đang được chọn
  const [keyword, setkeyword] = useState('');  // Lưu trữ từ khóa tìm kiếm blog

  // Hook useEffect được sử dụng để lấy dữ liệu khi component được render lần đầu
  useEffect(() => {
    try {
      window.scrollTo(0, 0);  // Cuộn trang lên trên khi vào trang
      loadCategoryBlog();  // Lấy danh mục blog
      fetchData('', keyword);  // Lấy danh sách blog (với subjectId mặc định và từ khóa tìm kiếm)
      loadFeatureBlog();  // Lấy các bài blog nổi bật
    } catch (error) {
      console.log(error);  // Nếu có lỗi thì ghi ra console
    }
  }, []);  // Mảng dependency rỗng, chỉ chạy khi component render lần đầu

  // Hàm lấy danh sách blog từ API
  let fetchData = async (code, keyword) => {
    let arrData = await getAllBlog({
      subjectId: code,  // ID danh mục (subjectId) lọc bài viết
      limit: PAGINATION.pagerow,  // Số bài viết trên một trang
      offset: 0,  // Bắt đầu từ bài viết đầu tiên (trang đầu)
      keyword: keyword,  // Từ khóa tìm kiếm
    });
    // Nếu nhận được dữ liệu hợp lệ, cập nhật state
    if (arrData && arrData.errCode === 0) {
      setdataBlog(arrData.data);  // Cập nhật danh sách blog
      setCount(Math.ceil(arrData.count / PAGINATION.pagerow));  // Cập nhật số trang phân trang
    }
  };

  // Hàm lấy các bài blog nổi bật
  let loadFeatureBlog = async () => {
    let res = await getFeatureBlog(6);  // Lấy 6 bài blog nổi bật
    if (res && res.errCode === 0) {
      setdataFeatureBlog(res.data);  // Cập nhật dữ liệu blog nổi bật
    }
  };

  // Hàm lấy danh mục blog
  let loadCategoryBlog = async () => {
    let res = await getAllCategoryBlogService('SUBJECT');  // Lấy danh mục blog với type 'SUBJECT'
    if (res && res.errCode === 0) {
      setdataSubject(res.data);  // Cập nhật danh sách danh mục
    }
  };

  // Hàm xử lý khi người dùng thay đổi trang phân trang
  let handleChangePage = async (number) => {
    setnumberPage(number.selected);  // Cập nhật số trang hiện tại
    let arrData = await getAllBlog({
      subjectId: subjectId,  // Danh mục đang được chọn
      limit: PAGINATION.pagerow,  // Số bài viết trên một trang
      offset: number.selected * PAGINATION.pagerow,  // Tính toán bài viết bắt đầu từ trang đã chọn
      keyword: keyword,  // Từ khóa tìm kiếm
    });
    if (arrData && arrData.errCode === 0) {
      setdataBlog(arrData.data);  // Cập nhật danh sách blog sau khi thay đổi trang
    }
  };

  // Hàm xử lý khi người dùng chọn một danh mục
  let handleClickCategory = (code) => {
    setsubjectId(code);  // Cập nhật subjectId theo mã danh mục được chọn
    fetchData(code, '');  // Tải lại blog với danh mục đã chọn
  };

  // Hàm tìm kiếm blog khi người dùng nhập từ khóa
  let handleSearchBlog = (text) => {
    fetchData('', text);  // Tải lại blog với từ khóa tìm kiếm mới
    setkeyword(text);  // Cập nhật từ khóa tìm kiếm
  };

  // Hàm thay đổi từ khóa tìm kiếm khi người dùng thay đổi ô tìm kiếm
  let handleOnchangeSearch = (keyword) => {
    if (keyword === '') {
      fetchData('', keyword);  // Lấy lại tất cả blog khi từ khóa trống
      setkeyword(keyword);  // Cập nhật từ khóa tìm kiếm
    }
  };

  return (
    <>
      {/* Banner */}
      <section class="banner_area">
        <div class="banner_inner d-flex align-items-center">
          <div class="container">
            <div class="banner_content d-md-flex justify-content-between align-items-center">
              <div class="mb-3 mb-md-0">
                <h2>Tin tức</h2>
                <p>Hãy theo dõi những bài viết để nhận được thông tin mới nhất</p>
              </div>
              <div class="page_link">
                <Link to={"/"}>Trang chủ</Link>  {/* Liên kết về trang chủ */}
                <Link to={"/blog"}>Tin tức</Link>  {/* Liên kết về trang tin tức */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog area */}
      <section className="blog_area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-5 mb-lg-0">
              <div className="blog_left_sidebar">
                {dataBlog && dataBlog.length > 0 &&  // Kiểm tra nếu có dữ liệu blog
                  dataBlog.map((item, index) => {
                    return (
                      <ItemBlog key={index} data={item} />  // Hiển thị từng bài blog
                    );
                  })
                }
              </div>

              {/* Phân trang */}
              <ReactPaginate
                previousLabel={'Quay lại'}
                nextLabel={'Tiếp'}
                breakLabel={'...'}
                pageCount={count}  // Tổng số trang
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
                onPageChange={handleChangePage}  // Sự kiện khi thay đổi trang
              />
            </div>

            {/* Sidebar: Các bài blog nổi bật và danh mục */}
            <RightBlog
              handleOnchangeSearch={handleOnchangeSearch}
              handleSearchBlog={handleSearchBlog}
              dataFeatureBlog={dataFeatureBlog}
              isPage={true}
              handleClickCategory={handleClickCategory}
              data={dataSubject}  // Danh mục blog
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogPage;
