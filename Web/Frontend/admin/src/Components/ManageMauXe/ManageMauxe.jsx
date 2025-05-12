import React, { useState, useEffect } from 'react';
import { Table, Image, Button, Tag, Space, Pagination, Typography, Card, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const ManageMauxe = () => {
  const [loading, setLoading] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');

  // Hàm lấy dữ liệu từ API
  const fetchData = async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/mauxe/getallmauxe?page=${page}&size=${size}`);
      const { content, page: pageInfo } = response.data.data;
      
      setModelList(content);
      setPagination({
        current: pageInfo.number + 1,
        pageSize: pageInfo.size,
        total: pageInfo.totalElements
      });
    } catch (error) {
      console.error('Error fetching car models:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý khi thay đổi trang
  const handleTableChange = (pagination) => {
    fetchData(pagination.current - 1, pagination.pageSize);
  };

  // Các cột của bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'mauXeId',
      key: 'mauXeId',
      width: 70,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'anhDefault',
      key: 'anhDefault',
      width: 120,
      render: (anhDefault) => (
        <Image 
          src={anhDefault || 'https://placehold.co/100x100?text=No+Image'} 
          alt="Mẫu xe" 
          style={{ width: 100, height: 70, objectFit: 'cover' }}
              fallback="https://placehold.co/100x100?text=Error"
              className='rounded-lg'
        />
      ),
    },
    {
      title: 'Tên mẫu xe',
      dataIndex: 'tenMau',
      key: 'tenMau',
      render: (text) => <span className="text-blue-500">{text}</span>    },
    {
      title: 'Hãng xe',
      dataIndex: 'tenHangXe',
      key: 'tenHangXe',
    },
    {
      title: 'Loại xe',
      dataIndex: ['loaiXeReponse', 'tenLoaiXe'],
      key: 'loaiXe',
    },
    {
      title: 'Giá thuê ngày',
      dataIndex: 'giaThueNgay',
      key: 'giaThueNgay',
      render: (price) => `${price.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Xe còn lại',
      dataIndex: 'soLuongxeconlai',
      key: 'soLuongxeconlai',
      render: (count) => (
        <Tag color={count > 0 ? 'green' : 'red'}>
          {count > 0 ? `${count} xe` : 'Hết xe'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Tìm kiếm theo tên mẫu xe
  const filteredData = searchText
    ? modelList.filter(item => 
        item.tenMau.toLowerCase().includes(searchText.toLowerCase()) ||
        item.tenHangXe.toLowerCase().includes(searchText.toLowerCase())
      )
    : modelList;

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Quản lý mẫu xe</Title>
        <div style={{ display: 'flex', gap: 16 }}>
          <Input
            placeholder="Tìm kiếm theo tên, hãng xe"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />}>
            Thêm mẫu xe mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="mauXeId"
        pagination={false}
        loading={loading}
        onChange={handleTableChange}
      />
      
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={(page, pageSize) => {
            fetchData(page - 1, pageSize);
          }}
          showSizeChanger
          showTotal={(total) => `Tổng cộng ${total} mẫu xe`}
        />
      </div>
    </Card>
  );
};

export default ManageMauxe;