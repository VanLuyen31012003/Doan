import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Space, Tag, Modal, Form, Select, message, Typography, Popconfirm, Spin, Alert, Descriptions, Row, Col } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, FileTextOutlined, EyeOutlined, CalendarOutlined, UserOutlined, EnvironmentOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiNguoiDung from '../../Api/ApiNguoiDung';
import { toast } from 'react-toastify';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // States for Order Modal
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  // Roles options
  const rolesOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  ];

  // Trạng thái đơn đặt
  const ORDER_STATUS = {
    0: { text: 'Chờ xác nhận', color: 'orange' },
    1: { text: 'Đã xác nhận', color: 'blue' },
    2: { text: 'Đang thuê', color: 'green' },
    3: { text: 'Đã hoàn thành', color: 'success' },
    4: { text: 'Đã hủy', color: 'red' },
  };

  // Trạng thái thanh toán
  const PAYMENT_STATUS = {
    0: { text: 'Chưa thanh toán', color: 'red' },
    1: { text: 'Đã thanh toán', color: 'green' },
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY HH:mm');
  };

  // Navigate to order detail
  const handleViewOrderDetail = (orderId) => {
    navigate(`/dashboard/orders/${orderId}`);
  };

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await ApiNguoiDung.getAllNguoiDung();
      if (response.data.success) {
        const usersWithKey = response.data.data.map((user, index) => ({ 
          ...user, 
          key: index,
          vai_tro: user.vai_tro || []
        }));
        setUsers(usersWithKey);
        setFilteredUsers(usersWithKey);
      } else {
        message.error('Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders by user email
  const fetchOrders = async (email) => {
    setOrderLoading(true);
    setOrderError(null);
    try {
      const response = await ApiNguoiDung.getalldondatbyemailnguoidung(email);
      
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        throw new Error(response.data.message || 'Không thể tải danh sách đơn đặt');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrderError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setOrderLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search
  useEffect(() => {
    if (searchText) {
      const filtered = users.filter(
        user => 
          user.ho_ten.toLowerCase().includes(searchText.toLowerCase()) || 
          user.email.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchText, users]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Open add user modal
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open edit user modal
  const showEditModal = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    form.setFieldsValue({
      ho_ten: user.ho_ten,
      email: user.email,
      mat_khau: user.mat_khau,
      vai_tro: user.vai_tro
    });
    setIsModalVisible(true);
  };

  // Open order modal
  const showOrderModal = async (user) => {
    setSelectedUserEmail(user.email);
    setSelectedUserName(user.ho_ten);
    setIsOrderModalVisible(true);
    await fetchOrders(user.email);
  };

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Close order modal
  const handleOrderModalClose = () => {
    setIsOrderModalVisible(false);
    setOrders([]);
    setOrderError(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditMode && currentUser) {
        const newUser = {
          ...values,
          vai_tro: values.vai_tro || []
        };   
        await ApiNguoiDung.updateNguoiDung(currentUser.email, newUser);
        const updatedUsers = users.map(user => {
          if (user.key === currentUser.key) {
            return { ...user, ...values };
          }
          return user;
        });
        setUsers(updatedUsers);
        toast.success('Nhân viên đã được cập nhật');
      } else {
        const newUser = {
          ...values,
          vai_tro: values.vai_tro || []
        };   
        await ApiNguoiDung.createNguoiDung(newUser);
        setUsers([...users, newUser]);
        toast.success('Nhân viên mới đã được tạo');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Form validation failed:', error);
      toast.error('Thao tác thất bại: ' + error.response?.data?.message);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (user) => {
    try {
      await ApiNguoiDung.deleteNguoiDung(user.email);
      const updatedUsers = users.filter(u => u.key !== user.key);
      setUsers(updatedUsers);
      toast.success('Xóa nhân viên thành công');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Xóa thất bại: ' + error.response?.data?.message);
    }
  };

  // Filter by role
  const handleRoleFilter = (value) => {
    if (!value || value === 'ALL') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.vai_tro.includes(value)
      );
      setFilteredUsers(filtered);
    }
  };

  // Order table columns
  const orderColumns = [
    {
      title: 'Mã đơn',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
      width: 80,
      render: (id) => <Text strong>#{id}</Text>
    },
    {
      title: 'Khách hàng',
      dataIndex: 'khachHangName',
      key: 'khachHangName',
      width: 150,
      render: (name) => (
        <div>
          <UserOutlined style={{ marginRight: 4 }} />
          {name}
        </div>
      )
    },
    {
      title: 'Thời gian thuê',
      key: 'duration',
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <CalendarOutlined style={{ marginRight: 4 }} />
            Từ: {formatDate(record.ngayBatDau)}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Đến: {formatDate(record.ngayKetThuc)}
          </div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            ({moment(record.ngayKetThuc).diff(moment(record.ngayBatDau), 'days')} ngày)
          </Text>
        </div>
      )
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiemNhanXe',
      key: 'diaDiemNhanXe',
      width: 150,
      render: (location) => (
        <div style={{ fontSize: '12px' }}>
          <EnvironmentOutlined style={{ marginRight: 4 }} />
          {location}
        </div>
      )
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 120,
      render: (amount) => (
        <div>
          <DollarOutlined style={{ marginRight: 4, color: '#1890ff' }} />
          <Text strong style={{ color: '#1890ff' }}>
            {formatCurrency(amount)}
          </Text>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 100,
      render: (status) => {
        const statusInfo = ORDER_STATUS[status] || { text: 'Không xác định', color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Thanh toán',
      dataIndex: 'trangThaiThanhToan',
      key: 'trangThaiThanhToan',
      width: 110,
      render: (status) => {
        const statusInfo = PAYMENT_STATUS[status] || { text: 'Không xác định', color: 'default' };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 90,
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrderDetail(record.donDatXeId)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.trangThai === 0).length,
    active: orders.filter(o => o.trangThai === 2).length,
    completed: orders.filter(o => o.trangThai === 3).length,
    cancelled: orders.filter(o => o.trangThai === 4).length,
    totalRevenue: orders.reduce((sum, order) => sum + (order.tongTien || 0), 0),
    unpaidOrders: orders.filter(o => o.trangThaiThanhToan === 0).length
  };

  // User table columns
  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      width: 70,
      render: (key) => key + 1
    },
    {
      title: 'Họ và tên',
      dataIndex: 'ho_ten',
      key: 'ho_ten',
      sorter: (a, b) => a.ho_ten.localeCompare(b.ho_ten)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Vai trò',
      dataIndex: 'vai_tro',
      key: 'vai_tro',
      render: (roles) => (
        <span>
          {roles && roles.length > 0 ? (
            roles.map(role => {
              let color = role === 'ADMIN' ? 'red' : (role === 'USER' ? 'green' : 'blue');
              return (
                <Tag color={color} key={role}>
                  {role}
                </Tag>
              );
            })
          ) : (
            <Tag color="default">USER</Tag>
          )}
        </span>
      ),
      filters: [
        { text: 'Admin', value: 'ADMIN' },
        { text: 'User', value: 'USER' },
      ],
      onFilter: (value, record) => record.vai_tro.includes(value)
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="default"
            icon={<FileTextOutlined />}
            size="small"
            onClick={() => showOrderModal(record)}
          >
            Đơn phụ trách
          </Button>
          <Button 
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa nhân viên này?"
            onConfirm={() => handleDeleteUser(record)}
            okText="Đồng ý"
            cancelText="Hủy"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card>
      <Title level={2}>Quản lý Nhân Viên</Title>
      
      {/* Search and filters */}
      <div className="mb-4 flex justify-between items-center">
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select 
            placeholder="Lọc theo vai trò"
            style={{ width: 150 }}
            onChange={handleRoleFilter}
            allowClear
          >
            <Option value="ALL">Tất cả</Option>
            <Option value="ADMIN">Admin</Option>
            <Option value="USER">User</Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={showAddModal}
        >
          Thêm nhân viên
        </Button>
      </div>
      
      {/* Users table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="key"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng cộng ${total} nhân viên`,
        }}
      />

      {/* Add/Edit user modal */}
      <Modal
        title={isEditMode ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditMode ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="ho_ten"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mat_khau"
            label="Mật khẩu"
            rules={[
              { required: !isEditMode, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password placeholder={isEditMode ? "Để trống nếu không thay đổi" : ""} />
          </Form.Item>
          <Form.Item
            name="vai_tro"
            label="Vai trò"
          >
            <Select
              mode="multiple"
              placeholder="Chọn vai trò"
              allowClear
            >
              {rolesOptions.map(role => (
                <Option key={role.value} value={role.value}>{role.label}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* User Orders Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TeamOutlined />
            <span>Đơn thuê xe do {selectedUserName} phụ trách</span>
          </div>
        }
        open={isOrderModalVisible}
        onCancel={handleOrderModalClose}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        {orderLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
          </div>
        ) : orderError ? (
          <Alert
            message="Lỗi"
            description={orderError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        ) : (
          <>
            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      {orderStats.total}
                    </Title>
                    <Text type="secondary">Tổng đơn phụ trách</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                      {orderStats.active}
                    </Title>
                    <Text type="secondary">Đang thuê</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#faad14' }}>
                      {orderStats.pending}
                    </Title>
                    <Text type="secondary">Chờ xử lý</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#f5222d' }}>
                      {formatCurrency(orderStats.totalRevenue)}
                    </Title>
                    <Text type="secondary">Tổng doanh thu</Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Orders Table */}
            <Card 
              title={`Danh sách đơn thuê xe phụ trách (${orders.length} đơn)`}
              size="small"
            >
              <Table
                columns={orderColumns}
                dataSource={orders}
                rowKey="donDatXeId"
                size="small"
                scroll={{ x: 1100 }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total) => `Tổng ${total} đơn`
                }}
              />
            </Card>

            {/* Extension History */}
            {orders.some(order => order.hoaDonGiaHan && order.hoaDonGiaHan.length > 0) && (
              <Card 
                title="Lịch sử gia hạn đã xử lý" 
                size="small" 
                style={{ marginTop: 16 }}
              >
                {orders
                  .filter(order => order.hoaDonGiaHan && order.hoaDonGiaHan.length > 0)
                  .map(order => (
                    <div key={order.donDatXeId} style={{ marginBottom: 16 }}>
                      <Text strong>Đơn #{order.donDatXeId}:</Text>
                      {order.hoaDonGiaHan.map((extension, index) => (
                        <div key={extension.hoaDonGiaHanId} style={{ marginLeft: 16, marginTop: 4 }}>
                          <Tag color="blue">Gia hạn {index + 1}</Tag>
                          <Text style={{ fontSize: '12px' }}>
                            {formatDate(extension.ngayBatDauGiaHan)} → {formatDate(extension.ngayKetThucGiaHan)}
                          </Text>
                          <Text strong style={{ marginLeft: 8 }}>
                            {formatCurrency(extension.tongTienGiaHan)}
                          </Text>
                          <Tag 
                            color={extension.trangThaiThanhToan === 1 ? 'green' : 'red'}
                            style={{ marginLeft: 8 }}
                          >
                            {extension.trangThaiThanhToan === 1 ? 'Đã thanh toán' : 'Chưa thanh toán'}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  ))}
              </Card>
            )}
          </>
        )}
      </Modal>
    </Card>
  );
};

export default ManageUsers;