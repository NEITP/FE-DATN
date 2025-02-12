import React, { useState, useEffect } from 'react'; // Import React và các hook useState, useEffect
import ItemProduct from '../Product/ItemProduct'; // Import component ItemProduct để hiển thị sản phẩm
import { getAllProductUser } from '../../services/userService'; // Import service để lấy danh sách sản phẩm từ API
import { PAGINATION } from '../../utils/constant'; // Import constant PAGINATION để sử dụng cấu hình phân trang
import ReactPaginate from 'react-paginate'; // Import thư viện ReactPaginate để thực hiện phân trang
import FormSearch from '../Search/FormSearch'; // Import component FormSearch để tìm kiếm sản phẩm theo từ khóa

function MainShop(props) {
    // Khai báo các state để lưu trữ dữ liệu và quản lý trạng thái trong component
    const [dataProduct, setdataProduct] = useState([]); // Lưu trữ danh sách sản phẩm
    const [count, setCount] = useState(''); // Lưu trữ tổng số trang cho phân trang
    const [numberPage, setnumberPage] = useState(''); // Lưu trữ trang hiện tại
    const [limitPage, setlimitPage] = useState(PAGINATION.pagerow); // Lưu trữ số lượng sản phẩm hiển thị mỗi trang
    const [sortPrice, setsortPrice] = useState(''); // Lưu trữ trạng thái sắp xếp theo giá
    const [sortName, setsortName] = useState(''); // Lưu trữ trạng thái sắp xếp theo tên
    const [offset, setoffset] = useState(0); // Lưu trữ chỉ số bắt đầu (offset) cho việc phân trang
    const [categoryId, setcategoryId] = useState(''); // Lưu trữ ID danh mục
    const [brandId, setbrandId] = useState(''); // Lưu trữ ID thương hiệu
    const [keyword, setkeyword] = useState(''); // Lưu trữ từ khóa tìm kiếm

    // Hook useEffect để tải sản phẩm khi component được render lần đầu tiên
    useEffect(() => {
        loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword);
    }, []);

    // Hook useEffect để theo dõi sự thay đổi của categoryId và brandId từ props
    useEffect(() => {
        setcategoryId(props.categoryId); // Cập nhật lại categoryId khi props.categoryId thay đổi
        setbrandId(props.brandId); // Cập nhật lại brandId khi props.brandId thay đổi

        // Hàm lấy danh sách sản phẩm theo các tham số đã truyền
        let fetchCategory = async () => {
            let arrData = await getAllProductUser({
                sortPrice: sortPrice,
                sortName: sortName,
                limit: limitPage,
                offset: offset,
                categoryId: props.categoryId,
                brandId: props.brandId,
                keyword: keyword,
            });

            if (arrData && arrData.errCode === 0) {
                setdataProduct(arrData.data); // Cập nhật danh sách sản phẩm
                setCount(Math.ceil(arrData.count / limitPage)); // Cập nhật tổng số trang phân trang
            }
        };
        fetchCategory();
    }, [props.categoryId, props.brandId]); // Hook này sẽ được gọi mỗi khi props.categoryId hoặc props.brandId thay đổi

    // Hàm load dữ liệu sản phẩm từ API
    let loadProduct = async (limitPage, sortName, sortPrice, offset, categoryId, keyword) => {
        let arrData = await getAllProductUser({
            sortPrice: sortPrice,
            sortName: sortName,
            limit: limitPage,
            offset: offset,
            categoryId: categoryId,
            brandId: brandId,
            keyword: keyword,
        });

        if (arrData && arrData.errCode === 0) {
            setdataProduct(arrData.data); // Cập nhật dữ liệu sản phẩm
            setCount(Math.ceil(arrData.count / limitPage)); // Cập nhật số trang phân trang
        }
    };

    // Hàm xử lý khi người dùng thay đổi số lượng sản phẩm hiển thị trên mỗi trang
    let handleSelectLimitPage = async (event) => {
        setlimitPage(event.target.value); // Cập nhật lại số lượng sản phẩm hiển thị mỗi trang
        loadProduct(event.target.value, sortName, sortPrice, offset, categoryId, keyword); // Tải lại dữ liệu với số lượng sản phẩm mới
    };

    // Hàm xử lý khi người dùng chuyển trang
    let handleChangePage = async (number) => {
        setnumberPage(number.selected); // Cập nhật trang hiện tại
        loadProduct(limitPage, sortName, sortPrice, number.selected * limitPage, categoryId, keyword); // Tải lại dữ liệu sản phẩm
        setoffset(number.selected * limitPage); // Cập nhật offset cho phân trang
        props.myRef.current.scrollIntoView(); // Cuộn trang về phần trên của component
    };

    // Hàm xử lý khi người dùng thay đổi cách sắp xếp sản phẩm
    let handleSelectSort = async (event) => {
        let value = +event.target.value; // Lấy giá trị sắp xếp từ dropdown

        if (value === 1) {
            loadProduct(limitPage, '', '', offset, categoryId, keyword); // Sắp xếp theo mặc định
        } else if (value === 2) {
            loadProduct(limitPage, '', true, offset, categoryId, keyword); // Sắp xếp theo giá
            setsortPrice(true); // Cập nhật trạng thái sắp xếp theo giá
            setsortName('');
        } else if (value === 3) {
            loadProduct(limitPage, true, '', offset, categoryId, keyword); // Sắp xếp theo tên
            setsortPrice('');
            setsortName(true);
        }
    };

    // Hàm tìm kiếm khi người dùng nhập từ khóa
    let handleSearch = (keyword) => {
        loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword); // Tải lại sản phẩm với từ khóa tìm kiếm
        setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
    };

    // Hàm khi người dùng thay đổi từ khóa tìm kiếm
    let handleOnchangeSearch = (keyword) => {
        if (keyword === '') {
            loadProduct(limitPage, sortName, sortPrice, offset, categoryId, keyword); // Tải lại sản phẩm nếu từ khóa trống
            setkeyword(keyword); // Cập nhật từ khóa tìm kiếm
        }
    };

    return (
        <div className="col-lg-9">
            <div className="product_top_bar">
                <div className="left_dorp">
                    <select style={{ outline: 'none' }} onChange={(event) => handleSelectSort(event)} className="sorting">
                        <option value={1}>Sắp xếp</option>
                        <option value={2}>Theo giá tiền</option>
                        <option value={3}>Theo tên</option>
                    </select>
                    <select style={{ outline: 'none' }} onChange={(event) => handleSelectLimitPage(event)} className="show">
                        <option value={6}>Hiển thị 6</option>
                        <option value={12}>Hiển thị 12</option>
                        <option value={18}>Hiển thị 18</option>
                    </select>
                    <div style={{ display: 'inline-block', marginLeft: '10px', width: '300px' }}>
                        {/* FormSearch để tìm kiếm sản phẩm */}
                        <FormSearch title={"tên tên quần áo"} handleOnchange={handleOnchangeSearch} handleSearch={handleSearch} />
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: '10px' }} className="latest_product_inner">
                <div className="row">
                    {/* Hiển thị danh sách sản phẩm */}
                    {dataProduct && dataProduct.length > 0 &&
                        dataProduct.map((item, index) => {
                            return (
                                <ItemProduct
                                    id={item.id}
                                    width={"255px"}
                                    height={"254px"}
                                    type="col-lg-4 col-md-6"
                                    name={item.name}
                                    img={item.productDetail[0].productImage[0].image}
                                    discountPrice={item.productDetail[0].discountPrice}
                                    price={item.productDetail[0].originalPrice}
                                />
                            );
                        })
                    }
                </div>
            </div>
            {/* Phân trang */}
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
    );
}

export default MainShop;
