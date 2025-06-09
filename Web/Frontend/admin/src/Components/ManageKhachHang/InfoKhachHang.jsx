import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Button, Table, Tag, Descriptions, 
  Statistic, Tabs, Skeleton, Divider, Space, Badge, 
  Empty, Alert, Avatar, Row, Col, Tooltip
} from 'antd';
import {
  UserOutlined, PhoneOutlined, MailOutlined, ArrowLeftOutlined,
  CalendarOutlined, EnvironmentOutlined, DollarOutlined,
  CheckCircleOutlined, CloseCircleOutlined, CarOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import ApiKhachHang from '../../Api/ApiKhachHang';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Định nghĩa ánh xạ trạng thái đơn hàng
const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1,
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4
};

function InfoKhachHang() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // Lấy thông tin khách hàng
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoadingCustomer(true);
        const response = await ApiKhachHang.getKhachHangById(id);
        if (response.data.success) {
          setCustomer(response.data.data);
        } else {
          setError("Không thể tải thông tin khách hàng");
        }
      } catch (error) {
        console.error("Error fetching customer:", error);
        setError("Có lỗi xảy ra khi tải thông tin khách hàng");
      } finally {
        setLoadingCustomer(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const response = await ApiKhachHang.getDonDatByidKhachHang(id);
        if (response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchCustomer();
    fetchOrders();
  }, [id]);

  // Định dạng ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' VNĐ';
  };

  // Hiển thị tag trạng thái đơn hàng
  const getStatusTag = (status) => {
    switch (status) {
      case ORDER_STATUS.CHO_XAC_NHAN:
        return <Tag color="blue" icon={<CalendarOutlined />}>Chờ xác nhận</Tag>;
      case ORDER_STATUS.DA_XAC_NHAN:
        return <Tag color="orange" icon={<CalendarOutlined />}>Đã xác nhận</Tag>;
      case ORDER_STATUS.HOAN_THANH:
        return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
      case ORDER_STATUS.HUY:
        return <Tag color="red" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
      case ORDER_STATUS.DANG_THUE:
        return <Tag color="purple" icon={<CarOutlined />}>Đang cho thuê</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  // Hiển thị tag trạng thái thanh toán
  const getPaymentStatusTag = (status) => {
    return status === 1 
      ? <Tag color="green">Đã thanh toán</Tag>
      : <Tag color="red">Chưa thanh toán</Tag>;
  };

  // Thống kê các đơn hàng theo trạng thái
  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      completed: orders.filter(o => o.trangThai === ORDER_STATUS.HOAN_THANH).length,
      active: orders.filter(o => o.trangThai === ORDER_STATUS.DANG_THUE).length,
      pending: orders.filter(o => o.trangThai === ORDER_STATUS.CHO_XAC_NHAN).length,
      confirmed: orders.filter(o => o.trangThai === ORDER_STATUS.DA_XAC_NHAN).length,
      canceled: orders.filter(o => o.trangThai === ORDER_STATUS.HUY).length,
      totalSpent: orders
        .filter(o => o.trangThai !== ORDER_STATUS.HUY)
        .reduce((sum, order) => sum + (order.tongTien || 0), 0),
      unpaidAmount: orders
        .filter(o => o.trangThaiThanhToan === 0)
        .reduce((sum, order) => sum + (order.tongTien || 0), 0)
    };
    return stats;
  };

  // Định nghĩa cột cho bảng đơn đặt
  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
      render: (id) => <Badge status="processing" text={`${id}`} />,
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.ngayBatDau) - new Date(b.ngayBatDau),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      render: (date) => formatDate(date),
    },
    {
      title: 'Địa điểm nhận xe',
      dataIndex: 'diaDiemNhanXe',
      key: 'diaDiemNhanXe',
      ellipsis: true,
      render: (text) => (
        <Tooltip title={text}>
          <Space>
            <EnvironmentOutlined />
            <span>{text}</span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      render: (amount) => <Text strong type="success">{formatCurrency(amount)}</Text>,
      sorter: (a, b) => a.tongTien - b.tongTien,
    },
    {
      title: 'Trạng thái đơn',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Chờ xác nhận', value: ORDER_STATUS.CHO_XAC_NHAN },
        { text: 'Đã xác nhận', value: ORDER_STATUS.DA_XAC_NHAN },
        { text: 'Hoàn thành', value: ORDER_STATUS.HOAN_THANH },
        { text: 'Đã hủy', value: ORDER_STATUS.HUY },
        { text: 'Đang thuê', value: ORDER_STATUS.DANG_THUE },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'trangThaiThanhToan',
      key: 'trangThaiThanhToan',
      render: (status) => getPaymentStatusTag(status),
      filters: [
        { text: 'Đã thanh toán', value: 1 },
        { text: 'Chưa thanh toán', value: 0 },
      ],
      onFilter: (value, record) => record.trangThaiThanhToan === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => navigate(`/dashboard/orders/${record.donDatXeId}`)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Cấu hình cột cho bảng hóa đơn gia hạn
  const extensionColumns = [
    {
      title: 'Mã đơn đặt',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'ngayBatDauGiaHan',
      key: 'ngayBatDauGiaHan',
      render: (date) => formatDate(date),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThucGiaHan',
      key: 'ngayKetThucGiaHan',
      render: (date) => formatDate(date),
    },
    {
      title: 'Số tiền',
      dataIndex: 'tongTienGiaHan',
      key: 'tongTienGiaHan',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'trangThaiThanhToan',
      key: 'trangThaiThanhToan',
      render: (status) => getPaymentStatusTag(status),
    },
    {
      title: 'Phương thức',
      dataIndex: 'phuongThucThanhToan',
      key: 'phuongThucThanhToan',
    },
  ];

  // Lấy tất cả hóa đơn gia hạn từ các đơn đặt
  const getAllExtensions = () => {
    const extensions = [];
    orders.forEach(order => {
      if (order.hoaDonGiaHan && order.hoaDonGiaHan.length > 0) {
        order.hoaDonGiaHan.forEach(extension => {
          extensions.push(extension);
        });
      }
    });
    return extensions;
  };

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate(-1)} type="primary">
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  const orderStats = getOrderStats();
  const extensions = getAllExtensions();

  return (
    <Card className="shadow-md">
      <div className="flex items-center mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          Quay lại
        </Button>
        <Title level={3} className="mb-0">
          Chi tiết khách hàng
        </Title>
      </div>

      {loadingCustomer ? (
        <Skeleton active paragraph={{ rows: 4 }} />
      ) : (
        <Card className="mb-4">
          <Row gutter={24}>
            <Col span={4}>
              <Avatar 
                size={100} 
                icon={<UserOutlined />} 
                className="mb-4"
                style={{ backgroundColor: '#1890ff' }}
              />
            </Col>
            <Col span={20}>
              <Descriptions title="Thông tin cá nhân" bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
                <Descriptions.Item label="Họ tên">
                  <Text strong><UserOutlined className="mr-2" />{customer?.hoTen}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  <MailOutlined className="mr-2" />{customer?.email}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  <PhoneOutlined className="mr-2" />{customer?.soDienThoai}
                </Descriptions.Item>
                <Descriptions.Item label="ID">{customer?.id}</Descriptions.Item>
                
                {/* Thêm các trường mới */}
                <Descriptions.Item label="Địa chỉ" span={2}>
                  <EnvironmentOutlined className="mr-2" />{customer?.diaChi || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Số CCCD">
                  <IdcardOutlined className="mr-2" />{customer?.soCccd || "Chưa cập nhật"}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo tài khoản">
                  <CalendarOutlined className="mr-2" />
                  {customer?.ngayTao ? new Date(customer.ngayTao).toLocaleString('vi-VN') : "N/A"}
                </Descriptions.Item>
                
                <Descriptions.Item label="Tổng đơn đặt">
                  <Text strong>{orderStats.total}</Text> đơn
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Row gutter={16} className="mb-4">
                <Col span={6}>
                  <Statistic 
                    title="Tổng số tiền đã chi tiêu" 
                    value={orderStats.totalSpent} 
                    formatter={(value) => formatCurrency(value)}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<DollarOutlined />}
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Đơn hoàn thành" 
                    value={orderStats.completed}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                    suffix="đơn"
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Đơn đang thuê" 
                    value={orderStats.active}
                    valueStyle={{ color: '#722ed1' }}
                    prefix={<CarOutlined />}
                    suffix="đơn"
                  />
                </Col>
                <Col span={6}>
                  <Statistic 
                    title="Đơn đã hủy" 
                    value={orderStats.canceled}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<CloseCircleOutlined />}
                    suffix="đơn"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      <Tabs defaultActiveKey="orders" type="card">
        <TabPane 
          tab={
            <span>
              <CarOutlined /> Đơn đặt xe ({orders.length})
            </span>
          } 
          key="orders"
        >
          {loadingOrders ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : orders.length === 0 ? (
            <Empty description="Khách hàng này chưa có đơn đặt xe nào" />
          ) : (
            <Table
              columns={orderColumns}
              dataSource={orders}
              rowKey="donDatXeId"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total) => `Tổng ${total} đơn đặt xe`,
              }}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={4} align="right">
                      <Text strong>Tổng cộng:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1} colSpan={4}>
                      <Text strong type="danger">{formatCurrency(orderStats.totalSpent)}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <CalendarOutlined /> Lịch sử gia hạn ({extensions.length})
            </span>
          } 
          key="extensions"
        >
          {loadingOrders ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : extensions.length === 0 ? (
            <Empty description="Khách hàng này chưa có lịch sử gia hạn nào" />
          ) : (
            <Table
              columns={extensionColumns}
              dataSource={extensions}
              rowKey="hoaDonGiaHanId"
              pagination={{ pageSize: 10 }}
            />
          )}
        </TabPane>
        
        <TabPane 
          tab={
            <span>
              <DollarOutlined /> Thống kê thanh toán
            </span>
          } 
          key="payments"
        >
          <Card>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic 
                  title="Tổng số tiền đã chi tiêu" 
                  value={orderStats.totalSpent} 
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Số tiền chưa thanh toán" 
                  value={orderStats.unpaidAmount} 
                  formatter={(value) => formatCurrency(value)}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Số đơn đã thanh toán" 
                  value={orders.filter(o => o.trangThaiThanhToan === 1).length}
                  suffix={`/${orders.length} đơn`}
                />
              </Col>
            </Row>
            
            <Divider />
            
            <h3>Phân tích đơn đặt theo trạng thái</h3>
            <Row gutter={16}>
              <Col span={4}>
                <Statistic 
                  title="Chờ xác nhận" 
                  value={orderStats.pending}
                  valueStyle={{ color: '#1890ff' }}
                  suffix="đơn"
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title="Đã xác nhận" 
                  value={orderStats.confirmed}
                  valueStyle={{ color: '#fa8c16' }}
                  suffix="đơn"
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title="Đang thuê" 
                  value={orderStats.active}
                  valueStyle={{ color: '#722ed1' }}
                  suffix="đơn"
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title="Hoàn thành" 
                  value={orderStats.completed}
                  valueStyle={{ color: '#52c41a' }}
                  suffix="đơn"
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title="Đã hủy" 
                  value={orderStats.canceled}
                  valueStyle={{ color: '#cf1322' }}
                  suffix="đơn"
                />
              </Col>
              <Col span={4}>
                <Statistic 
                  title="Tổng đơn" 
                  value={orderStats.total}
                  valueStyle={{ color: '#000000' }}
                  suffix="đơn"
                />
              </Col>
            </Row>
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default InfoKhachHang;