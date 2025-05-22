import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Button, Space, Typography, Popconfirm, Modal, Form, message, Tag, Tooltip, Spin } from 'antd';
import { 
  SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, ReloadOutlined, UserOutlined, PhoneOutlined, 
  MailOutlined, EnvironmentOutlined, IdcardOutlined
} from '@ant-design/icons';
import ApiKhachHang from '../../Api/ApiKhachHang';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

function ManageKhachHang() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Lấy danh sách khách hàng
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await ApiKhachHang.getAllKhachHang();
      if (response.data.success) {
        setCustomers(response.data.data);
      } else {
        message.error('Lỗi khi tải danh sách khách hàng');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      message.error('Đã xảy ra lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Điều hướng đến trang chi tiết khách hàng
  const goToCustomerDetail = (customer) => {
    navigate(`/dashboard/khachang/${customer.id}`);
  };

  // Mở modal chỉnh sửa khách hàng
  const showEditModal = (customer, e) => {
    // Ngăn sự kiện click lan truyền đến hàng chứa nút
    e.stopPropagation();
    
    setCurrentCustomer(customer);
    form.setFieldsValue({
      hoTen: customer.hoTen,
      email: customer.email,
      soDienThoai: customer.soDienThoai,
      diaChi: customer.diaChi,
      soCccd: customer.soCccd,
      matKhau: '' // Để trống mật khẩu
    });
    setIsModalVisible(true);
  };

  // Xử lý cập nhật thông tin khách hàng
  const handleUpdate = async (values) => {
    try {
      // Nếu mật khẩu trống, giữ nguyên mật khẩu cũ
      if (!values.matKhau) {
        values.matKhau = currentCustomer.matKhau;
      }
      
      const response = await ApiKhachHang.updateKhachHang(currentCustomer.id, values);
      if (response.data.success) {
        message.success('Cập nhật thông tin khách hàng thành công');
        setIsModalVisible(false);
        fetchCustomers(); // Tải lại danh sách khách hàng
      } else {
        message.error('Lỗi khi cập nhật: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      message.error('Đã xảy ra lỗi khi cập nhật');
    }
  };

  // Xử lý xóa khách hàng
  const handleDelete = async (id, e) => {
    // Ngăn sự kiện click lan truyền đến hàng chứa nút
    if (e) e.stopPropagation();
    
    try {
      const response = await ApiKhachHang.deleteKhachHang(id);
      if (response.data.success) {
        message.success('Xóa khách hàng thành công');
        fetchCustomers(); // Tải lại danh sách khách hàng
      } else {
        message.error('Lỗi khi xóa: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      message.error('Đã xảy ra lỗi khi xóa khách hàng');
    }
  };

  // Lọc khách hàng theo từ khóa tìm kiếm
  const filteredCustomers = customers.filter(customer =>
    customer.hoTen?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.soDienThoai?.includes(searchText) ||
    customer.diaChi?.toLowerCase().includes(searchText.toLowerCase()) ||
    customer.soCccd?.includes(searchText)
  );

  // Định nghĩa cột cho bảng
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      key: 'hoTen',
      sorter: (a, b) => a.hoTen.localeCompare(b.hoTen),
      render: (text) => <Text strong><UserOutlined className="mr-2" />{text}</Text>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => <span><MailOutlined className="mr-2" />{email}</span>
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      render: (phone) => <span><PhoneOutlined className="mr-2" />{phone}</span>
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'diaChi',
      key: 'diaChi',
      ellipsis: true,
      render: (address) => (
        <Tooltip title={address}>
          <span><EnvironmentOutlined className="mr-2" />{address || "Chưa cập nhật"}</span>
        </Tooltip>
      )
    },
    {
      title: 'Số CCCD',
      dataIndex: 'soCccd',
      key: 'soCccd',
      render: (cccd) => <span><IdcardOutlined className="mr-2" />{cccd || "Chưa cập nhật"}</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="small" onClick={e => e.stopPropagation()}>
          <Tooltip title="Xem chi tiết">
            <Button 
              type="primary" 
              size="small" 
              icon={<EyeOutlined />} 
              onClick={() => goToCustomerDetail(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="default" 
              size="small" 
              icon={<EditOutlined />} 
              onClick={(e) => showEditModal(record, e)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa khách hàng này?"
              onConfirm={(e) => handleDelete(record.id, e)}
              okText="Xóa"
              cancelText="Hủy"
              onClick={e => e.stopPropagation()}
            >
              <Button type="danger" size="small" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card className="mb-4">
      {/* Tiêu đề và công cụ tìm kiếm */}
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="m-0">Quản lý khách hàng</Title>
        <Space>
          <Input
            placeholder="Tìm kiếm khách hàng..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={fetchCustomers}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>
      
      {/* Thông tin số lượng */}
      <div className="mb-4">
        <Tag color="blue">Tổng số: {customers.length} khách hàng</Tag>
      </div>

      {/* Bảng danh sách khách hàng */}
      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: total => `Tổng ${total} khách hàng`,
        }}
        onRow={(record) => ({
          onClick: () => goToCustomerDetail(record),
          style: { cursor: 'pointer' }
        })}
      />

      {/* Modal chỉnh sửa thông tin khách hàng */}
      <Modal
        title={
          <div className="flex items-center">
            <UserOutlined className="mr-2 text-blue-500" />
            <span>Chỉnh sửa thông tin khách hàng</span>
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={currentCustomer}
        >
          <Form.Item
            name="hoTen"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ tên khách hàng" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          
          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
          
          <Form.Item
            name="diaChi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ" />
          </Form.Item>
          
          <Form.Item
            name="soCccd"
            label="Số CCCD"
            rules={[
              { required: true, message: 'Vui lòng nhập số CCCD!' },
              { len: 12, message: 'Số CCCD phải có đủ 12 chữ số!' },
              { pattern: /^\d+$/, message: 'Số CCCD chỉ được chứa chữ số!' }
            ]}
          >
            <Input prefix={<IdcardOutlined />} placeholder="Số căn cước công dân" maxLength={12} />
          </Form.Item>
          
          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            tooltip="Để trống nếu không muốn thay đổi mật khẩu"
          >
            <Input.Password placeholder="Nhập mật khẩu mới (tùy chọn)" />
          </Form.Item>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </Card>
  );
}

export default ManageKhachHang;