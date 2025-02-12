import React, { useEffect, useState } from 'react';
import CommentBlog from '../../component/Blog/CommentBlog'; // Component để hiển thị từng bình luận
import CommentFormBlog from '../../component/Blog/CommentFormBlog'; // Component để hiển thị form thêm bình luận
import RightBlog from '../../component/Blog/RightBlog'; // Component bên phải hiển thị các bài blog đặc biệt
import {
  getDetailBlogByIdService, // Dịch vụ lấy chi tiết bài viết theo id
  getAllCategoryBlogService, // Dịch vụ lấy danh mục bài viết
  createNewcommentService, // Dịch vụ để thêm bình luận mới
  getAllcommentByBlogIdService, // Dịch vụ lấy tất cả bình luận của bài viết
  getFeatureBlog // Dịch vụ lấy các bài viết đặc biệt
} from '../../services/userService';
import { Link, useParams } from "react-router-dom"; // Thư viện dùng để tạo đường dẫn và lấy tham số URL
import { toast } from 'react-toastify'; // Thư viện để thông báo cho người dùng
import moment from 'moment'; // Thư viện dùng để xử lý thời gian và hiển thị thời gian trong quá khứ

function DetailBlog(props) {
  const [dataSubject, setdataSubject] = useState([]); // Lưu danh mục bài viết
  const [dataComment, setdataComment] = useState([]); // Lưu danh sách bình luận của bài viết
  const [dataBlog, setdataBlog] = useState({}); // Lưu thông tin chi tiết của bài viết
  const { id } = useParams(); // Lấy tham số id từ URL
  const [user, setUser] = useState({}); // Lưu thông tin người dùng
  const [dataFeatureBlog, setdataFeatureBlog] = useState([]); // Lưu các bài blog đặc biệt

  // Hàm useEffect để gọi các hàm khi component được render lần đầu tiên hoặc khi id thay đổi
  useEffect(() => {
    try {
      window.scrollTo(0, 0); // Cuộn trang lên đầu khi component được tải lại
      loadCategoryBlog(); // Lấy danh mục bài viết
      loadFeatureBlog(); // Lấy các bài viết đặc biệt
      if (id) {
        loadDataBlog(id); // Nếu có id, tải thông tin chi tiết bài viết
        loadComment(id); // Lấy các bình luận của bài viết theo id
      }
      const userData = JSON.parse(localStorage.getItem('userData')); // Lấy dữ liệu người dùng từ localStorage
      if (userData) {
        setUser(userData); // Lưu thông tin người dùng vào state
      }
    } catch (error) {
      console.log(error);
    }
  }, [id]); // Dependency array, chỉ chạy lại khi id thay đổi

  // Hàm lấy danh sách bình luận của bài viết
  let loadComment = async (id) => {
    let res = await getAllcommentByBlogIdService(id); // Gọi dịch vụ lấy bình luận
    if (res && res.errCode === 0) {
      setdataComment(res.data); // Lưu kết quả vào state
    }
  };

  // Hàm lấy các bài viết đặc biệt
  let loadFeatureBlog = async () => {
    let res = await getFeatureBlog(6); // Lấy 6 bài viết đặc biệt
    if (res && res.errCode == 0) {
      setdataFeatureBlog(res.data); // Lưu kết quả vào state
    }
  };

  // Hàm lấy danh mục bài viết
  let loadCategoryBlog = async () => {
    let res = await getAllCategoryBlogService('SUBJECT'); // Lấy danh mục bài viết
    if (res && res.errCode == 0) {
      setdataSubject(res.data); // Lưu kết quả vào state
    }
  };

  // Hàm lấy chi tiết bài viết theo id
  let loadDataBlog = async (id) => {
    let res = await getDetailBlogByIdService(id); // Gọi dịch vụ lấy chi tiết bài viết
    if (res && res.errCode == 0) {
      setdataBlog(res.data); // Lưu thông tin chi tiết bài viết vào state
    }
  };

  // Hàm xử lý thêm bình luận mới
  let handleAddComment = async (content) => {
    if (user && user.id) {
      let res = await createNewcommentService({
        content: content, // Nội dung bình luận
        blogId: id, // ID bài viết
        userId: user.id, // ID người dùng
      });
      if (res && res.errCode == 0) {
        toast.success('Đăng bình luận thành công'); // Thông báo thành công
        loadComment(id); // Tải lại bình luận của bài viết
      } else {
        toast.error(res.errMessage); // Thông báo lỗi nếu có
      }
    } else {
      toast.error("Hãy đăng nhập để bình luận"); // Thông báo nếu người dùng chưa đăng nhập
    }
  };

  return (
    <>
      {/* Phần banner của trang */}
      <section class="banner_area">
        <div class="banner_inner d-flex align-items-center">
          <div class="container">
            <div class="banner_content d-md-flex justify-content-between align-items-center">
              <div class="mb-3 mb-md-0">
                <h2>Chi tiết bài đăng</h2>
                <p>Theo dõi bài đăng để nhận thông tin mới nhất</p>
              </div>
              <div class="page_link">
                <Link to={"/"}>Trang chủ</Link> {/* Liên kết trang chủ */}
                <Link to={"/blog"}>Tin tức</Link> {/* Liên kết danh sách bài viết */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Phần hiển thị chi tiết bài viết và bình luận */}
      <section className="blog_area single-post-area section_gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 posts-list">
              <div className="single-post">
                {/* Hiển thị hình ảnh bài viết */}
                <div className="feature-img">
                  <img style={{ width: '100%', height: '514px', objectFit: 'cover' }} className="img-fluid" src={dataBlog.image} alt="" />
                </div>
                <div className="blog_details">
                  <h2>{dataBlog.title}</h2> {/* Tiêu đề bài viết */}
                  <ul className="blog-info-link mt-3 mb-4">
                    {/* Thông tin tác giả và số lượng bình luận */}
                    <li><a href="#"><i className="ti-user" /> {dataBlog.userData && dataBlog.userData.firstName + " " + dataBlog.userData.lastName}</a></li>
                    <li><a href="#"><i className="ti-comments" /> {dataComment.length} Bình luận</a></li>
                  </ul>
                  <div className="quote-wrapper">
                    <div className="quotes">
                      {dataBlog.shortdescription} {/* Mô tả ngắn về bài viết */}
                    </div>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: dataBlog.contentHTML }} className="excert">
                    {/* Nội dung bài viết */}
                  </p>
                </div>
              </div>

              {/* Phần bình luận của bài viết */}
              <div className="comments-area">
                <h4>{dataComment.length} Bình luận</h4> {/* Hiển thị số lượng bình luận */}
                {dataComment && dataComment.length > 0 &&
                  dataComment.map((item, index) => {
                    if (item.user) {
                      let name = item.user.firstName + " " + item.user.lastName; // Tên người bình luận
                      return (
                        <CommentBlog img={item.user.image} name={name} content={item.content} key={index}
                          date={moment(item.createdAt).fromNow()} // Thời gian tạo bình luận
                        />
                      );
                    }
                  })
                }
              </div>

              {/* Form để thêm bình luận */}
              <CommentFormBlog handleAddComment={handleAddComment} />
            </div>

            {/* Phần bài viết đặc biệt bên phải */}
            <RightBlog dataFeatureBlog={dataFeatureBlog} isPage={false} data={dataSubject} />
          </div>
        </div>
      </section>
    </>
  );
}

export default DetailBlog;
