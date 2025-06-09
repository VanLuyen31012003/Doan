import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Image,
  Typography,
  Tag,
  Pagination,
  Input,
  Select,
  Empty,
  Spin,
  Button,
  DatePicker,
  message,
} from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import ApiMauXe from "../api/ApiMauXe"; // Import API
import moment from "moment"; // Đã cài đặt moment

function AllProducts() {
  const [products, setProducts] = useState([]); // Dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [searchText, setSearchText] = useState(""); // Tìm kiếm
  const [filteredCategory, setFilteredCategory] = useState({
    hangXeId: null,
    loaiXeId: null,
  }); // Lọc danh mục
  const [startDate, setStartDate] = useState(null); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(null); // Ngày kết thúc
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(12); // Số sản phẩm mỗi trang
  const [totalProducts, setTotalProducts] = useState(0); // Tổng số sản phẩm
  const [hangXeList, setHangXeList] = useState([]);
  const [loaiXeList, setLoaiXeList] = useState([]);

  const { Title, Text } = Typography;
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  // Gọi API để lấy dữ liệu sản phẩm
 // Hàm gọi API sửa đổi
const fetchProducts = async () => {
  setLoading(true);
  try {
    if (startDate && endDate && startDate.isAfter(endDate)) {
      message.error("Ngày bắt đầu phải trước ngày kết thúc!");
      setStartDate(null);
      setEndDate(null);
      return;
    }
    
    // Log ra để kiểm tra
    console.log("StartDate:", startDate ? startDate.format("YYYY-MM-DD") : "null");
    console.log("EndDate:", endDate ? endDate.format("YYYY-MM-DD") : "null");
    
    // Định dạng ngày tháng đúng cách
    const formattedStartDate = startDate ? startDate.format("YYYY-MM-DD") + "T00:00:00" : "";
    const formattedEndDate = endDate ? endDate.format("YYYY-MM-DD") + "T23:59:59" : "";
    
    console.log("Formatted StartDate:", formattedStartDate);
    console.log("Formatted EndDate:", formattedEndDate);
    
    const response = await ApiMauXe.searchMauxe(
      searchText,
      filteredCategory.hangXeId || "",
      filteredCategory.loaiXeId || "",
      formattedStartDate,
      formattedEndDate,
      currentPage - 1,
      pageSize
    );
    
    setProducts(response.data.data.content || []);
    setTotalProducts(response.data.data.page?.totalElements || 0);
  } catch (error) {
    console.error("Error fetching products:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const hangXeResponse = await ApiMauXe.getallHangXe();
        const loaiXeResponse = await ApiMauXe.getallLoaiXe();

        if (hangXeResponse.data.success) {
          setHangXeList(hangXeResponse.data.data);
        }
        if (loaiXeResponse.data.success) {
          setLoaiXeList(loaiXeResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilters();
  }, []);

  // Gọi API khi component được mount hoặc khi các điều kiện thay đổi
  useEffect(() => {
    fetchProducts();
  }, [searchText, filteredCategory, startDate, endDate, currentPage, pageSize]);

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Xử lý lọc danh mục
  const handleCategoryFilter = (value, type) => {
    if (type === "hangXe") {
      setFilteredCategory({ ...filteredCategory, hangXeId: value });
    } else if (type === "loaiXe") {
      setFilteredCategory({ ...filteredCategory, loaiXeId: value });
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  };

  // Xử lý chọn khoảng thời gian
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(null);
      setEndDate(null);
    }
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi ngày
  };

  // Xử lý reset bộ lọc
  const handleReset = () => {
    setSearchText("");
    setFilteredCategory({ hangXeId: null, loaiXeId: null });
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  // Xử lý phân trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="px-4 py-6 w-[80%] mx-auto mt-11 font-medium text-xl">
      <Title level={2}>Tất cả sản phẩm</Title>

      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="min-w-48">
            <Text strong>Tìm kiếm</Text>
            <Input
              placeholder="Tên sản phẩm"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
            />
          </div>

          <div className="min-w-48">
            <Text strong>Hãng xe</Text>
            <Select
              placeholder="Chọn hãng xe"
              value={filteredCategory.hangXeId || null}
              onChange={(value) => handleCategoryFilter(value, "hangXe")}
              style={{ width: "100%" }}
              allowClear
            >
              {hangXeList.map((hangXe) => (
                <Option key={hangXe.hangXeId} value={hangXe.hangXeId}>
                  {hangXe.tenHang}
                </Option>
              ))}
            </Select>
          </div>

          <div className="min-w-48">
            <Text strong>Loại xe</Text>
            <Select
              placeholder="Chọn loại xe"
              value={filteredCategory.loaiXeId || null}
              onChange={(value) => handleCategoryFilter(value, "loaiXe")}
              style={{ width: "100%" }}
              allowClear
            >
              {loaiXeList.map((loaiXe) => (
                <Option key={loaiXe.loaiXeId} value={loaiXe.loaiXeId}>
                  {loaiXe.tenLoai}
                </Option>
              ))}
            </Select>
          </div>

          <div className="min-w-48">
            <Text strong>Khoảng thời gian</Text>
            <RangePicker
              value={startDate && endDate ? [startDate, endDate] : null}
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              style={{ width: "100%" }}
              placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
              allowClear
            />
          </div>

          <Button icon={<FilterOutlined />} onClick={handleReset}>
            Đặt lại bộ lọc
          </Button>
        </div>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : products.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.mauXeId}>
                <Card
                  hoverable
                  cover={
  <div className="flex justify-center items-center h-[200px] w-full overflow-hidden">
    <Image
      width="100%"
      height="100%"
      style={{ objectFit: "cover" }}
      src={product.anhDefault || "link ảnh mặc định"}
      alt={product.tenMau}
      preview={false}
    />
  </div>
}
                  className="h-full flex flex-col "
                >
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between">
                      <Tag
                        color={product.soLuongxeconlai > 0 ? "green" : "red"}
                        className="self-start mb-2"
                      >
                        {product.soLuongxeconlai > 0 ? "Còn hàng" : "Hết hàng"}
                      </Tag>
                      <Title
                        level={5}
                        className="mb-1"
                        ellipsis={{ rows: 2, tooltip: product.tenMau }}
                      >
                        {product.tenMau}
                      </Title>
                    </div>

                    <div className="mt-auto pt-2">
                      <Title level={4} className="mb-2 fire">
                        {formatPrice(product.giaThueNgay)}
                      </Title>
                      <div className="flex justify-between items-center px-2">
                        <Link to={`/chitietsp/${product.mauXeId}`}>
                          <IoMdHeart
                            size={36}
                            className="text-cam hover:scale-110 duration-300"
                          />
                        </Link>
                        <Link to={`/chitietsp/${product.mauXeId}`}>
                          <button className="bg-cam py-2 px-4 rounded-sm hover:bg-ghi text-white">
                            Đặt xe ngay
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-6 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["6", "12", "24", "36"]}
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} sản phẩm`
              }
            />
          </div>
        </>
      ) : (
        <Empty description="Không tìm thấy sản phẩm nào" />
      )}
    </div>
  );
}

export default AllProducts;