import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Typography, Spin, Select, DatePicker, Space } from 'antd';
import { DollarOutlined, FileTextOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import 'moment/locale/vi';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ApiDonDat from '../../Api/ApiDonDat';

const { Title, Text } = Typography;
const { Option } = Select;

const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1, 
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4
};

const statusMap = {
  [ORDER_STATUS.CHO_XAC_NHAN]: 'Chờ xác nhận',
  [ORDER_STATUS.DA_XAC_NHAN]: 'Đã xác nhận',
  [ORDER_STATUS.HOAN_THANH]: 'Hoàn thành',
  [ORDER_STATUS.HUY]: 'Đã hủy',
  [ORDER_STATUS.DANG_THUE]: 'Đang thuê'
};

const quarterList = [1, 2, 3, 4];

const ManageMoney = () => {
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [statType, setStatType] = useState('month'); // 'day' | 'month' | 'quarter' | 'year'
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedDay, setSelectedDay] = useState(moment().toDate());
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    completedOrders: 0,
    canceledOrders: 0,
    avgOrderValue: 0
  });

  // Danh sách năm
  const years = [];
  for (let year = 2020; year <= moment().year(); year++) {
    years.push(year);
  }
  // Danh sách tháng
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
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Tính toán số liệu tổng hợp khi orders hoặc filter thay đổi
  useEffect(() => {
    if (orders.length) {
      calculateSummaryData(orders);
    }
    // eslint-disable-next-line
  }, [orders, statType, selectedYear, selectedMonth, selectedQuarter, selectedDay]);

  // Tính toán dữ liệu tổng hợp
  const calculateSummaryData = (orderData) => {
    let filteredOrders = [];
    if (statType === 'day') {
      filteredOrders = orderData.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.isSame(moment(selectedDay), 'day');
      });
    } else if (statType === 'month') {
      filteredOrders = orderData.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear && orderDate.month() + 1 === selectedMonth;
      });
    } else if (statType === 'quarter') {
      filteredOrders = orderData.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear && Math.ceil((orderDate.month() + 1) / 3) === selectedQuarter;
      });
    } else if (statType === 'year') {
      filteredOrders = orderData.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear;
      });
    }

    const completedOrders = filteredOrders.filter(order => order.trangThai === ORDER_STATUS.HOAN_THANH);
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.tongTien || 0), 0);
    const completed = completedOrders.length;
    const canceled = filteredOrders.filter(order => order.trangThai === ORDER_STATUS.HUY).length;
    const avgOrderValue = completed ? totalRevenue / completed : 0;

    setSummaryData({
      totalRevenue,
      completedOrders: completed,
      canceledOrders: canceled,
      avgOrderValue
    });
  };

  // Xử lý thay đổi bộ lọc
  const handleYearChange = (year) => setSelectedYear(year);
  const handleMonthChange = (month) => setSelectedMonth(month);
  const handleQuarterChange = (quarter) => setSelectedQuarter(quarter);
  const handleDayChange = (date) => setSelectedDay(date ? date.toDate() : null);

  // Dữ liệu cho biểu đồ
  const getChartData = () => {
    if (!orders.length) return [];

    if (statType === 'day') {
      // Theo giờ trong ngày
      const filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH && orderDate.isSame(moment(selectedDay), 'day');
      });
      const hourlyData = {};
      for (let h = 0; h < 24; h++) {
        hourlyData[h] = { label: `${h}:00`, revenue: 0 };
      }
      filteredOrders.forEach(order => {
        const hour = moment(order.ngayBatDau).hour();
        hourlyData[hour].revenue += order.tongTien || 0;
      });
      return Object.values(hourlyData);
    }

    if (statType === 'month') {
      // Theo ngày trong tháng
      const filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear &&
          orderDate.month() + 1 === selectedMonth;
      });
      const daysInMonth = moment(`${selectedYear}-${selectedMonth}`, 'YYYY-MM').daysInMonth();
      const dailyData = {};
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = moment(`${selectedYear}-${selectedMonth}-${day}`, 'YYYY-MM-DD').format('DD/MM');
        dailyData[day] = { label: dateStr, revenue: 0 };
      }
      filteredOrders.forEach(order => {
        const day = moment(order.ngayBatDau).date();
        if (dailyData[day]) {
          dailyData[day].revenue += order.tongTien || 0;
        }
      });
      return Object.values(dailyData);
    }

    if (statType === 'quarter') {
      // Theo tháng trong quý
      const filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear &&
          Math.ceil((orderDate.month() + 1) / 3) === selectedQuarter;
      });
      const monthsInQuarter = [(selectedQuarter - 1) * 3 + 1, (selectedQuarter - 1) * 3 + 2, (selectedQuarter - 1) * 3 + 3];
      const monthlyData = {};
      monthsInQuarter.forEach(month => {
        monthlyData[month] = { label: `Tháng ${month}`, revenue: 0 };
      });
      filteredOrders.forEach(order => {
        const month = moment(order.ngayBatDau).month() + 1;
        if (monthlyData[month]) {
          monthlyData[month].revenue += order.tongTien || 0;
        }
      });
      return Object.values(monthlyData);
    }

    if (statType === 'year') {
      // Theo tháng trong năm
      const filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear;
      });
      const monthlyData = {};
      for (let month = 1; month <= 12; month++) {
        monthlyData[month] = { label: `Tháng ${month}`, revenue: 0 };
      }
      filteredOrders.forEach(order => {
        const month = moment(order.ngayBatDau).month() + 1;
        monthlyData[month].revenue += order.tongTien || 0;
      });
      return Object.values(monthlyData);
    }

    return [];
  };

  // Top đơn hàng giá trị cao
  const getTopOrdersData = () => {
    if (!orders.length) return [];
    let filteredOrders = [];
    if (statType === 'day') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH && orderDate.isSame(moment(selectedDay), 'day');
      });
    } else if (statType === 'month') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear &&
          orderDate.month() + 1 === selectedMonth;
      });
    } else if (statType === 'quarter') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear &&
          Math.ceil((orderDate.month() + 1) / 3) === selectedQuarter;
      });
    } else if (statType === 'year') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return order.trangThai === ORDER_STATUS.HOAN_THANH &&
          orderDate.year() === selectedYear;
      });
    }
    return filteredOrders
      .sort((a, b) => (b.tongTien || 0) - (a.tongTien || 0))
      .slice(0, 5);
  };

  // Lấy đơn hàng đã lọc theo thời gian
  const getFilteredOrders = () => {
    if (!orders.length) return [];
    
    let filteredOrders = [];
    if (statType === 'day') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.isSame(moment(selectedDay), 'day');
      });
    } else if (statType === 'month') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear && orderDate.month() + 1 === selectedMonth;
      });
    } else if (statType === 'quarter') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear && Math.ceil((orderDate.month() + 1) / 3) === selectedQuarter;
      });
    } else if (statType === 'year') {
      filteredOrders = orders.filter(order => {
        const orderDate = moment(order.ngayBatDau);
        return orderDate.year() === selectedYear;
      });
    }
    
    return filteredOrders.sort((a, b) => moment(b.ngayBatDau) - moment(a.ngayBatDau));
  };

  // Hàm lấy text mô tả thời gian hiện tại
  const getPeriodText = () => {
    if (statType === 'day') {
      return moment(selectedDay).format('DD/MM/YYYY');
    }
    if (statType === 'month') {
      return `Tháng ${selectedMonth}/${selectedYear}`;
    }
    if (statType === 'quarter') {
      return `Quý ${selectedQuarter}/${selectedYear}`;
    }
    if (statType === 'year') {
      return `Năm ${selectedYear}`;
    }
    return '';
  };

  // Hàm xuất Excel
  const exportToExcel = () => {
    setExporting(true);
    
    try {
      // Tạo workbook
      const workbook = XLSX.utils.book_new();
      
      // Sheet 1: Tổng quan
      const summarySheet = [
        ['BÁO CÁO DOANH THU', '', '', ''],
        ['Thời gian:', getPeriodText(), '', ''],
        ['Ngày xuất:', moment().format('DD/MM/YYYY HH:mm:ss'), '', ''],
        ['', '', '', ''],
        ['TỔNG QUAN', '', '', ''],
        ['Chỉ tiêu', 'Giá trị', '', ''],
        ['Tổng doanh thu', `${summaryData.totalRevenue.toLocaleString('vi-VN')} VNĐ`, '', ''],
        ['Đơn hàng hoàn thành', `${summaryData.completedOrders} đơn`, '', ''],
        ['Đơn hàng bị hủy', `${summaryData.canceledOrders} đơn`, '', ''],
        ['Giá trị trung bình/đơn', `${summaryData.avgOrderValue.toLocaleString('vi-VN')} VNĐ`, '', '']
      ];
      
      const summaryWS = XLSX.utils.aoa_to_sheet(summarySheet);
      
      // Merge cells cho tiêu đề
      summaryWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Tiêu đề chính
        { s: { r: 4, c: 0 }, e: { r: 4, c: 3 } }  // Tiêu đề tổng quan
      ];
      
      // Set column widths
      summaryWS['!cols'] = [
        { width: 25 },
        { width: 25 },
        { width: 15 },
        { width: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, summaryWS, 'Tổng quan');
      
      // Sheet 2: Chi tiết doanh thu theo thời gian
      const chartData = getChartData();
      const revenueDetailSheet = [
        ['CHI TIẾT DOANH THU THEO THỜI GIAN', ''],
        ['Thời gian', 'Doanh thu (VNĐ)'],
        ...chartData.map(item => [
          item.label,
          item.revenue
        ])
      ];
      
      const revenueWS = XLSX.utils.aoa_to_sheet(revenueDetailSheet);
      
      // Merge cell cho tiêu đề
      revenueWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }
      ];
      
      // Set column widths
      revenueWS['!cols'] = [
        { width: 20 },
        { width: 20 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, revenueWS, 'Chi tiết doanh thu');
      
      // Sheet 3: Top đơn hàng giá trị cao
      const topOrders = getTopOrdersData();
      const topOrdersSheet = [
        ['TOP ĐƠN HÀNG GIÁ TRỊ CAO', '', '', '', ''],
        ['Mã đơn', 'Khách hàng', 'Ngày bắt đầu', 'Ngày kết thúc', 'Giá trị đơn hàng (VNĐ)'],
        ...topOrders.map(order => [
          order.donDatXeId,
          order.khachHangName,
          moment(order.ngayBatDau).format('DD/MM/YYYY'),
          moment(order.ngayKetThuc).format('DD/MM/YYYY'),
          order.tongTien || 0
        ])
      ];
      
      const topOrdersWS = XLSX.utils.aoa_to_sheet(topOrdersSheet);
      
      // Merge cell cho tiêu đề
      topOrdersWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }
      ];
      
      // Set column widths
      topOrdersWS['!cols'] = [
        { width: 10 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 20 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, topOrdersWS, 'Top đơn hàng');
      
      // Sheet 4: Tất cả đơn hàng trong kỳ
      const filteredOrders = getFilteredOrders();
      const allOrdersSheet = [
        ['TẤT CẢ ĐƠN HÀNG TRONG KỲ', '', '', '', '', '', ''],
        ['Mã đơn', 'Khách hàng', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái', 'Tổng tiền (VNĐ)', 'Ghi chú'],
        ...filteredOrders.map(order => [
          order.donDatXeId,
          order.khachHangName,
          moment(order.ngayBatDau).format('DD/MM/YYYY'),
          moment(order.ngayKetThuc).format('DD/MM/YYYY'),
          statusMap[order.trangThai] || 'Không xác định',
          order.tongTien || 0,
          order.trangThai === ORDER_STATUS.HOAN_THANH ? 'Đã thanh toán' : 
          order.trangThai === ORDER_STATUS.HUY ? 'Đơn hàng bị hủy' : 'Chưa thanh toán'
        ])
      ];
      
      const allOrdersWS = XLSX.utils.aoa_to_sheet(allOrdersSheet);
      
      // Merge cell cho tiêu đề
      allOrdersWS['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }
      ];
      
      // Set column widths
      allOrdersWS['!cols'] = [
        { width: 10 },
        { width: 20 },
        { width: 15 },
        { width: 15 },
        { width: 15 },
        { width: 18 },
        { width: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, allOrdersWS, 'Tất cả đơn hàng');
      
      // Xuất file
      const fileName = `BaoCaoDoanhThu_${getPeriodText().replace(/[/\s]/g, '_')}_${moment().format('DDMMYYYY_HHmmss')}.xlsx`;
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Có lỗi xảy ra khi xuất file Excel');
    } finally {
      setExporting(false);
    }
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

  // Tiêu đề động cho biểu đồ và bảng
  const getTitle = () => {
    if (statType === 'day') {
      return `Doanh thu theo giờ - ${moment(selectedDay).format('DD/MM/YYYY')}`;
    }
    if (statType === 'month') {
      return `Doanh thu theo ngày - Tháng ${selectedMonth}/${selectedYear}`;
    }
    if (statType === 'quarter') {
      return `Doanh thu theo tháng - Quý ${selectedQuarter}/${selectedYear}`;
    }
    if (statType === 'year') {
      return `Doanh thu theo tháng - Năm ${selectedYear}`;
    }
    return '';
  };

  const getTopTitle = () => {
    if (statType === 'day') {
      return `Top 5 đơn hàng giá trị cao - ${moment(selectedDay).format('DD/MM/YYYY')}`;
    }
    if (statType === 'month') {
      return `Top 5 đơn hàng giá trị cao - Tháng ${selectedMonth}/${selectedYear}`;
    }
    if (statType === 'quarter') {
      return `Top 5 đơn hàng giá trị cao - Quý ${selectedQuarter}/${selectedYear}`;
    }
    if (statType === 'year') {
      return `Top 5 đơn hàng giá trị cao - Năm ${selectedYear}`;
    }
    return '';
  };

  return (
    <div className="revenue-dashboard">
      <Title level={2}>
        <DollarOutlined style={{ marginRight: 8 }} />
        Thống kê doanh thu
      </Title>
      
      {/* Bộ lọc */}
      <Card className="mb-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Text strong>Chọn loại thống kê:</Text>
          <Select
            value={statType}
            onChange={setStatType}
            style={{ width: 120 }}
          >
            <Option value="day">Ngày</Option>
            <Option value="month">Tháng</Option>
            <Option value="quarter">Quý</Option>
            <Option value="year">Năm</Option>
          </Select>
          {statType === 'day' && (
            <DatePicker
              value={selectedDay ? moment(selectedDay) : null}
              onChange={handleDayChange}
              format="DD/MM/YYYY"
              style={{ width: 140 }}
            />
          )}
          {statType === 'month' && (
            <>
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
            </>
          )}
          {statType === 'quarter' && (
            <>
              <Select
                value={selectedQuarter}
                onChange={handleQuarterChange}
                style={{ width: 120 }}
              >
                {quarterList.map(q => (
                  <Option key={q} value={q}>Quý {q}</Option>
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
            </>
          )}
          {statType === 'year' && (
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: 100 }}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          )}
          
          <Space>
            <Button type="primary" onClick={fetchData} loading={loading}>
              Cập nhật dữ liệu
            </Button>
            <Button 
              type="default" 
              icon={<FileExcelOutlined />}
              onClick={exportToExcel}
              loading={exporting}
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
            >
              Xuất Excel
            </Button>
          </Space>
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
      
      {/* Biểu đồ doanh thu */}
      <Card 
        title={getTitle()}
        className="mb-4"
        extra={
          <Space>
            <Text type="secondary">{`Tổng doanh thu: ${summaryData.totalRevenue.toLocaleString('vi-VN')} VNĐ`}</Text>
            <Button 
              size="small"
              icon={<DownloadOutlined />}
              onClick={exportToExcel}
              loading={exporting}
            >
              Xuất báo cáo
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div className="flex justify-center items-center" style={{ height: 400 }}>
            <Spin size="large" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={getChartData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={formatTooltip} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
      
      {/* Top đơn hàng có giá trị cao */}
      <Card title={getTopTitle()}>
        <Table
          columns={topOrdersColumns}
          dataSource={getTopOrdersData()}
          rowKey="donDatXeId"
          pagination={false}
          loading={loading}
          locale={{ emptyText: 'Không có dữ liệu' }}
        />
      </Card>
    </div>
  );
};

export default ManageMoney;