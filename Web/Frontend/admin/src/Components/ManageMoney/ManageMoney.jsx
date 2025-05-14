import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, DatePicker, Button, Typography, Spin, Select } from 'antd';
import { DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import 'moment/locale/vi';
import ApiDonDat from '../../Api/ApiDonDat';

const { Title, Text } = Typography;
const { Option } = Select;

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
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1); // Tháng hiện tại
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    canceledOrders: 0,
    avgOrderValue: 0
  });

  // Tạo danh sách năm (từ 2020 đến năm hiện tại)
  const years = [];
  for (let year = 2020; year <= moment().year(); year++) {
    years.push(year);
  }

  // Tạo danh sách tháng
  const months = [];
  for (let month = 1; month <= 12; month++) {
    months.push(month);
  }

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

  // Tính toán số liệu khi orders, selectedYear hoặc selectedMonth thay đổi
  useEffect(() => {
    if (orders.length) {
      calculateSummaryData(orders);
    }
  }, [orders, selectedYear, selectedMonth]);

  // Tính toán dữ liệu tổng hợp
  const calculateSummaryData = (orderData) => {
    // Lọc đơn hàng theo năm và tháng đã chọn
    const filteredOrders = orderData.filter(order => {
      const orderDate = moment(order.ngayBatDau);
      return orderDate.year() === selectedYear && orderDate.month() + 1 === selectedMonth;
    });
    
    // Tính doanh thu từ các đơn hoàn thành (trạng thái 2 - HOAN_THANH)
    const completedOrders = filteredOrders.filter(order => order.trangThai === ORDER_STATUS.HOAN_THANH);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.tongTien || 0), 0);
    
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

  // Xử lý khi thay đổi năm
  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  // Xử lý khi thay đổi tháng
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };

  // Tính toán dữ liệu cho biểu đồ doanh thu theo ngày trong tháng
  const getDailyRevenueData = () => {
    if (!orders.length) return [];
    
    // Lọc các đơn hoàn thành trong tháng đã chọn
    const filteredOrders = orders.filter(order => {
      const orderDate = moment(order.ngayBatDau);
      return order.trangThai === ORDER_STATUS.HOAN_THANH && 
             orderDate.year() === selectedYear && 
             orderDate.month() + 1 === selectedMonth;
    });
    
    // Tạo đối tượng lưu doanh thu theo ngày
    const dailyData = {};
    
    // Số ngày trong tháng đã chọn
    const daysInMonth = moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM').daysInMonth();
    
    // Khởi tạo dữ liệu cho tất cả các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = moment(`${selectedYear}-${selectedMonth}-${day}`, 'YYYY-MM-DD').format('DD/MM');
      dailyData[day] = {
        date: dateStr,
        revenue: 0
      };
    }
    
    // Tính tổng doanh thu theo ngày
    filteredOrders.forEach(order => {
      const day = moment(order.ngayBatDau).date();
      if (dailyData[day]) {
        dailyData[day].revenue += order.tongTien || 0;
      }
    });
    
    // Chuyển đổi thành mảng
    return Object.values(dailyData);
  };

  // Lấy danh sách top đơn hàng có giá trị cao nhất trong tháng đã chọn
  const getTopOrdersData = () => {
    if (!orders.length) return [];
    
    // Lọc các đơn hoàn thành trong tháng đã chọn
    return orders
      .filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH && 
               orderDate.year() === selectedYear && 
               orderDate.month() + 1 === selectedMonth;
      })
      .sort((a, b) => (b.tongTien || 0) - (a.tongTien || 0))
      .slice(0, 5); // Lấy 5 đơn đầu tiên
  };

  // Các cột cho bảng top đơn hàng
  const topOrdersColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
      width: 80,
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
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (value) => `${(value || 0).toLocaleString('vi-VN')} VNĐ`,
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

  // Format tooltip giá trị
  const formatTooltip = (value) => {
    return [`${value.toLocaleString('vi-VN')} VNĐ`, 'Doanh thu'];
  };

  return (
    <div className="revenue-dashboard">
      <Title level={2}>
        <DollarOutlined style={{ marginRight: 8 }} />
        Thống kê doanh thu
      </Title>
      
      {/* Bộ lọc */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Text strong>Chọn thời gian:</Text>
            <Select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: 120 }}
            >
              {months.map(month => (
                <Option key={month} value={month}>Tháng {month}</Option>
              ))}
            </Select>
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: 100 }}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          </div>
          <Button type="primary" onClick={fetchData} loading={loading}>Cập nhật dữ liệu</Button>
        </div>
      </Card>
      
      {/* Số liệu tổng quan */}
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu tháng"
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
              prefix={<FileTextOutlined />}
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
      
      {/* Biểu đồ doanh thu theo ngày trong tháng */}
      <Card 
        title={`Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`} 
        className="mb-4"
        extra={<Text type="secondary">{`Tổng doanh thu: ${summaryData.totalRevenue.toLocaleString('vi-VN')} VNĐ`}</Text>}
      >
        {loading ? (
          <div className="flex justify-center items-center" style={{ height: 400 }}>
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getDailyRevenueData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      
      {/* Top đơn hàng có giá trị cao */}
      <Card title={`Top 5 đơn hàng giá trị cao - Tháng ${selectedMonth}/${selectedYear}`}>
        <Table
          columns={topOrdersColumns}
          dataSource={getTopOrdersData()}
          rowKey="donDatXeId"
          pagination={false}
          loading={loading}
          locale={{ emptyText: 'Không có dữ liệu trong tháng này' }}
        />
      </Card>
    </div>
  );
};

export default ManageMoney;