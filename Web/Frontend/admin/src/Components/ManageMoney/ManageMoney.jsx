import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Typography, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import ApiDonDat from '../../Api/ApiDonDat';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Định nghĩa trạng thái đơn hàng
const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1, 
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4
};

const ManageMoney = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().subtract(30, 'days'),
    moment()
  ]);
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    canceledOrders: 0,
    avgOrderValue: 0
  });

  // Lấy dữ liệu đơn hàng từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ApiDonDat.getAllDonDat();
      if (response.data.success) {
        const orderData = response.data.data;
        setOrders(orderData);
        calculateSummaryData(orderData);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Tính toán các số liệu tổng hợp khi orders hoặc dateRange thay đổi
  useEffect(() => {
    if (orders.length) {
      calculateSummaryData(orders);
    }
  }, [orders, dateRange]);

  // Tính toán dữ liệu tổng hợp
  const calculateSummaryData = (orderData) => {
    const filteredOrders = filterOrdersByDateRange(orderData);
    
    // Tính doanh thu từ các đơn hoàn thành (trạng thái 2 - HOAN_THANH)
    const completedOrders = filteredOrders.filter(order => order.trangThai === ORDER_STATUS.HOAN_THANH);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.tongTien, 0);
    
    // Tính số lượng đơn hàng theo trạng thái
    const completed = completedOrders.length;
    const canceled = filteredOrders.filter(order => order.trangThai === ORDER_STATUS.HUY).length;
    
    // Tính giá trị trung bình đơn hàng
    const avgOrderValue = completed ? totalRevenue / completed : 0;
    
    setSummaryData({
      totalRevenue,
      completedOrders: completed,
      canceledOrders: canceled,
      avgOrderValue
    });
  };

  // Lọc đơn hàng theo khoảng thời gian được chọn
  const filterOrdersByDateRange = (orderData) => {
    if (!dateRange || !dateRange[0] || !dateRange[1]) return orderData;
    
    const startDate = dateRange[0].startOf('day');
    const endDate = dateRange[1].endOf('day');
    
    return orderData.filter(order => {
      const orderDate = moment(order.ngayBatDau);
      return orderDate.isBetween(startDate, endDate, null, '[]');
    });
  };

  // Xử lý thay đổi khoảng thời gian
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  // Tính toán dữ liệu cho biểu đồ cột (doanh thu theo tháng)
  const getMonthlyRevenueData = () => {
    if (!orders.length) return [];
    
    const completedOrders = orders.filter(order => order.trangThai === ORDER_STATUS.HOAN_THANH);
    
    // Nhóm theo tháng
    const monthlyData = {};
    
    completedOrders.forEach(order => {
      const month = moment(order.ngayBatDau).format('YYYY-MM');
      const monthName = moment(order.ngayBatDau).format('MM/YYYY');
      
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month: monthName,
          revenue: 0
        };
      }
      
      monthlyData[month].revenue += order.tongTien;
    });
    
    // Chuyển đổi thành mảng và sắp xếp theo thời gian
    return Object.values(monthlyData)
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split('/');
        const [monthB, yearB] = b.month.split('/');
        return new Date(`${yearA}-${monthA}`) - new Date(`${yearB}-${monthB}`);
      })
      .slice(-6); // Lấy 6 tháng gần nhất
  };

  // Danh sách top đơn hàng có giá trị cao nhất
  const getTopOrdersData = () => {
    if (!orders.length) return [];
    
    return orders
      .filter(order => order.trangThai === ORDER_STATUS.HOAN_THANH)
      .sort((a, b) => b.tongTien - a.tongTien)
      .slice(0, 5); // Lấy 5 đơn đầu tiên
  };

  // Các cột cho bảng top đơn hàng
  const topOrdersColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHangName',
      key: 'khachHangName',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (value) => `${value?.toLocaleString('vi-VN')} VNĐ`,
    },
  ];

  // Format giá trị trục y
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value;
  };

  return (
    <div className="revenue-dashboard">
      <Title level={2}>
        <DollarOutlined style={{ marginRight: 8 }} />
        Quản lý doanh thu
      </Title>
      
      {/* Bộ lọc */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Text strong>Thời gian:</Text>
            <RangePicker 
              value={dateRange}
              onChange={handleDateRangeChange}
              format="DD/MM/YYYY"
              allowClear={false}
            />
          </div>
          <Button type="primary" onClick={fetchData} loading={loading}>Cập nhật</Button>
        </div>
      </Card>
      
      {/* Số liệu tổng quan */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={summaryData.totalRevenue}
              formatter={(value) => `${(value).toLocaleString('vi-VN')} VNĐ`}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng hoàn thành"
              value={summaryData.completedOrders}
              suffix="đơn"
              valueStyle={{ color: '#0050b3' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng bị hủy"
              value={summaryData.canceledOrders}
              suffix="đơn"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giá trị trung bình/đơn"
              value={summaryData.avgOrderValue}
              formatter={(value) => `${(value).toLocaleString('vi-VN')} VNĐ`}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Biểu đồ doanh thu theo tháng */}
      <Card title="Doanh thu 6 tháng gần nhất" className="mb-4">
        {loading ? (
          <div className="flex justify-center items-center" style={{ height: 400 }}>
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getMonthlyRevenueData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={(value) => [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh thu']} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      
      {/* Top đơn hàng có giá trị cao */}
      <Card title="Top 5 đơn hàng giá trị cao nhất">
        <Table
          columns={topOrdersColumns}
          dataSource={getTopOrdersData()}
          rowKey="donDatXeId"
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ManageMoney;