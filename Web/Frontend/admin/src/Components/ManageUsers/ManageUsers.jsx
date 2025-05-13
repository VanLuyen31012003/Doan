import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Space, Tag, Modal, Form, Select, message, Typography, Popconfirm } from 'antd';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import ApiNguoiDung from '../../Api/ApiNguoiDung';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // Roles options
  const rolesOptions = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' },
  ];

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
        const response= await ApiNguoiDung.getAllNguoiDung();
      if (response.data.success) {
        const usersWithKey = response.data.data.map((user, index) => ({ 
          ...user, 
          key: index, // Add key for table
          // Make sure vai_tro is always an array
          vai_tro: user.vai_tro || []
        }));
        setUsers(usersWithKey);
        setFilteredUsers(usersWithKey);
      } else {
        message.error('Không thể tải danh sách người dùng');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
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

  // Close modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (isEditMode && currentUser) {
        // Update existing user
        // This is where you would call your update API
        // For now, we'll update the local state as an example
        const updatedUsers = users.map(user => {
          if (user.key === currentUser.key) {
            return { ...user, ...values };
          }
          return user;
        });
        const newUser = {
          ...values,
          vai_tro: values.vai_tro || []
        };   
        await ApiNguoiDung.updateNguoiDung(currentUser.email, newUser)
        setUsers(updatedUsers);
        toast.success('Người dùng đã được cập nhật');
      } else {
        // Create new user
        // This is where you would call your create API
        // For now, we'll add to the local state as an example
        const newUser = {
          ...values,
          vai_tro: values.vai_tro || []
        };   
        await ApiNguoiDung.createNguoiDung(newUser)
        setUsers([...users, newUser]);
        // console.log('New user created:', newUser);
        toast.success('Người dùng mới đã được tạo');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.log('Form validation failed:', error);
      toast.error('Form validation failed:', error.response.data.message);
    }
  };

  // Handle user deletion
  const handleDeleteUser =async (user) => {
    // This is where you would call your delete API
    // For now, we'll remove from the local state as an example
    const updatedUsers = users.filter(u => u.key !== user.key);
    setUsers(updatedUsers);
    try {
      
      await ApiNguoiDung.deleteNguoiDung(user.email)
      toast.success('Xóa người dùng thành công');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Thất bại', error.response.data.message);
      
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

  // Table columns
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
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa người dùng này?"
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
      <Title level={2}>Quản lý Người Dùng</Title>
      
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
          Thêm người dùng
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
          showTotal: (total) => `Tổng cộng ${total} người dùng`,
        }}
      />

      {/* Add/Edit user modal */}
      <Modal
        title={isEditMode ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
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
    </Card>
  );
};

export default ManageUsers;