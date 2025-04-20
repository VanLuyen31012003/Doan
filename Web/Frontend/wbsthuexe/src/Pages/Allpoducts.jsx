import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Image, Typography, Tag, Pagination, Input, Select,  Empty, Spin, Button } from 'antd';
import { SearchOutlined, FilterOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { IoMdHeart } from "react-icons/io";

function AllProducts() {
  // Mock data - trong thực tế bạn sẽ lấy dữ liệu từ API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [filteredCategory, setFilteredCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  const { Title, Text } = Typography;
  const { Option } = Select;

  useEffect(() => {
    // Giả lập API call để lấy dữ liệu
    setTimeout(() => {
      const dummyData = [];
      const categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện', 'Đồng hồ'];
      const brands = ['Apple', 'Samsung', 'Xiaomi', 'Dell', 'HP', 'Asus'];
      
      for (let i = 1; i <= 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        dummyData.push({
          key: i,
          id: `SP${1000 + i}`,
          name: `${brand} ${category} ${Math.floor(Math.random() * 20)}`,
          price: Math.floor(Math.random() * 50 + 1) * 1000000,
          stock: Math.floor(Math.random() * 100),
          category: category,
          brand: brand,
          status: Math.random() > 0.2 ? 'Còn hàng' : 'Hết hàng',
          image: `/api/placeholder/300/300`
        });
      }
      setProducts(dummyData);
      setLoading(false);
    }, 1000);
  }, []);

  // Lọc sản phẩm dựa vào tìm kiếm và danh mục
  const filteredProducts = products.filter(product => {
    const matchSearch = searchText ? 
      product.name.toLowerCase().includes(searchText.toLowerCase()) : true;
    const matchCategory = filteredCategory ? 
      product.category === filteredCategory : true;
    return matchSearch && matchCategory;
  });

  // Lấy danh sách danh mục duy nhất cho bộ lọc
  const categories = [...new Set(products.map(item => item.category))];

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Xử lý lọc danh mục
  const handleCategoryFilter = (value) => {
    setFilteredCategory(value);
    setCurrentPage(1); // Reset về trang đầu tiên khi lọc
  };

  // Xử lý reset bộ lọc
  const handleReset = () => {
    setSearchText('');
    setFilteredCategory(null);
    setCurrentPage(1);
  };

  // Xử lý phân trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // Lấy sản phẩm của trang hiện tại
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Format giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
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
            <Text strong>Danh mục</Text>
            <Select
              placeholder="Chọn danh mục"
              value={filteredCategory}
              onChange={handleCategoryFilter}
              style={{ width: '100%' }}
              allowClear
            >
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </div>
          
          <Button  icon={<FilterOutlined />}
            onClick={handleReset}>
            Đặt lại bộ lọc
          </Button>
        </div>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <Row gutter={[16, 16]}>
            {getCurrentPageData().map(product => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card 
                  hoverable 
                  cover={<Image alt={product.name} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXtJvMPveA9AsEBbUby5dBBhUnqA3it7JzoQ&s' preview={false} />}
                  className="h-full flex flex-col"
                >
                  <div className="flex flex-col flex-grow">
                    <div>
                       <Tag color={product.status === 'Còn hàng' ? 'green' : 'red'} className="self-start mb-2">
                      {product.status}
                    </Tag>
                    <Text type="secondary" className="mb-1">{product.category}</Text>
                    </div>
                   
                    <Title level={5} className="mb-1" ellipsis={{ rows: 2, tooltip: product.name }}>
                      {product.name}
                    </Title>
                    <Text type="secondary" className="mb-1">{product.brand}</Text>
                    <div className="mt-auto pt-2">
                      <Title level={4} className="mb-2 fire">{formatPrice(product.price)}</Title>
                      <div className='flex justify-between items-center px-2'>
                         <Link to="/chitietsp">
                        <IoMdHeart size={36} className='text-cam hover:scale-110 duration-300' />

                      </Link>
                      <Link to="/chitietsp">
                         <button
                        icon={<ShoppingCartOutlined />} 
                        block
                        className='bg-cam py-2 px-4 rounded-sm  hover:bg-ghi text-white !important'
                      >
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
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={['12', '24', '36', '48']}
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`}
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