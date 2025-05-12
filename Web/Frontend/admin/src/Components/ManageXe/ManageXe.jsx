import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Space, Input, Modal, Form, Select, DatePicker, Image, message, Typography, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;

const ManageXe = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [modelList, setModelList] = useState([]);
  const [form] = Form.useForm();

  // Trạng thái xe
  const STATUS = {
    AVAILABLE: 0,   // Có sẵn
    IN_USE: 1,      // Đang được thuê
    MAINTENANCE: 2, // Đang bảo trì
    INACTIVE: 3,    // Không hoạt động
  };

  // Fetch danh sách xe
  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/xe/getallxe');
      if (response.data.success) {
        setVehicles(response.data.data);
      } else {
        message.error('Không thể tải danh sách xe');
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Lỗi khi tải danh sách xe');
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách mẫu xe
  const fetchModels = async () => {
    try {
      const response = await axios.get('http://localhost:8080/mauxe/getallmauxe');
      if (response.data.success) {
        setModelList(response.data.data.content || []);
      } else {
        message.error('Không thể tải danh sách mẫu xe');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  // Load dữ liệu khi component mount
  useEffect(() => {
    fetchVehicles();
    fetchModels();
  }, []);

  // Lọc xe theo từ khóa tìm kiếm
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.bienSo.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.mauXe.tenMau.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mở modal thêm xe mới
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentVehicle(null);
    form.resetFields();
    form.setFieldsValue({
      trangThai: STATUS.AVAILABLE,
      ngayDangKy: moment(),
    });
    setIsModalVisible(true);
  };

  // Mở modal sửa xe
  const showEditModal = (vehicle) => {
    setIsEditMode(true);
    setCurrentVehicle(vehicle);
    form.setFieldsValue({
      bienSo: vehicle.bienSo,
      mauXeId: vehicle.mauXe.mauXeId,
      trangThai: vehicle.trangThai,
      ngayDangKy: moment(vehicle.ngayDangKy),
    });
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const submissionData = {
        bienSo: values.bienSo,
        mauXeId: values.mauXeId,
        trangThai: values.trangThai,
        ngayDangKy: values.ngayDangKy.format('YYYY-MM-DD'),
      };

      if (isEditMode) {
        // Cập nhật xe
        await axios.put(`http://localhost:8080/xe/updatexe/${currentVehicle.xeId}`, submissionData);
        message.success('Cập nhật xe thành công');
      } else {
        // Thêm xe mới
        await axios.post('http://localhost:8080/xe/themxe', submissionData);
        message.success('Thêm xe mới thành công');
      }

      setIsModalVisible(false);
      fetchVehicles(); // Refresh danh sách
    } catch (error) {
      console.error('Submission error:', error);
      message.error('Có lỗi xảy ra khi lưu thông tin xe');
    }
  };

  // Xóa xe
  const deleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/xe/xoaxe/${id}`);
      message.success('Xóa xe thành công');
      fetchVehicles(); // Refresh danh sách
    } catch (error) {
      console.error('Delete error:', error);
      message.error('Không thể xóa xe');
    }
  };

  // Hiển thị trạng thái xe
  const getStatusTag = (status) => {
    switch (status) {
      case STATUS.AVAILABLE:
        return <Tag color="green">Có sẵn</Tag>;
      case STATUS.IN_USE:
        return <Tag color="blue">Đang thuê</Tag>;
      case STATUS.MAINTENANCE:
        return <Tag color="orange">Đang bảo trì</Tag>;
      case STATUS.INACTIVE:
        return <Tag color="red">Không hoạt động</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  // Cấu hình cột
  const columns = [
    {
      title: 'ID',
      dataIndex: 'xeId',
      key: 'xeId',
      width: 60,
    },
    {
      title: 'Hình ảnh',
      dataIndex: ['mauXe', 'anhdefault'],
      key: 'anhdefault',
      width: 120,
      render: (url) => (
        <Image
          src={url || 'https://placehold.co/100x70?text=No+Image'}
          alt="Xe"
          style={{ width: 100, height: 70, objectFit: 'cover' }}
          fallback="https://placehold.co/100x70?text=Error"
          className="rounded-lg"
        />
      ),
    },
    {
      title: 'Biển số',
      dataIndex: 'bienSo',
      key: 'bienSo',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Tên xe',
      dataIndex: ['mauXe', 'tenMau'],
      key: 'tenMau',
    },
    {
      title: 'Giá thuê/ngày',
      dataIndex: ['mauXe', 'giaThueNgay'],
      key: 'giaThueNgay',
      render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Ngày đăng ký',
      dataIndex: 'ngayDangKy',
      key: 'ngayDangKy',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => getStatusTag(status),
      filters: [
        { text: 'Có sẵn', value: STATUS.AVAILABLE },
        { text: 'Đang thuê', value: STATUS.IN_USE },
        { text: 'Đang bảo trì', value: STATUS.MAINTENANCE },
        { text: 'Không hoạt động', value: STATUS.INACTIVE },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
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
            title="Bạn có chắc muốn xóa xe này?"
            onConfirm={() => deleteVehicle(record.xeId)}
            okText="Xóa"
            cancelText="Hủy"
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
      ),
    },
  ];

  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <Title level={3}>Quản lý Xe</Title>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm theo biển số, tên xe"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
            Thêm xe mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredVehicles}
        rowKey="xeId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Tổng ${total} xe`,
        }}
      />

      {/* Modal thêm/sửa xe */}
      <Modal
        title={isEditMode ? 'Cập nhật thông tin xe' : 'Thêm xe mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={isEditMode ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="bienSo"
            label="Biển số xe"
            rules={[{ required: true, message: 'Vui lòng nhập biển số xe!' }]}
          >
            <Input placeholder="Ví dụ: 59A-12345" />
          </Form.Item>

          <Form.Item
            name="mauXeId"
            label="Mẫu xe"
            rules={[{ required: true, message: 'Vui lòng chọn mẫu xe!' }]}
          >
            <Select placeholder="Chọn mẫu xe">
              {modelList.map(model => (
                <Option key={model.mauXeId} value={model.mauXeId}>
                  {model.tenMau} - {model.giaThueNgay?.toLocaleString('vi-VN')} VNĐ/ngày
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="trangThai"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái xe!' }]}
          >
            <Select placeholder="Chọn trạng thái xe">
              <Option value={STATUS.AVAILABLE}>Có sẵn</Option>
              <Option value={STATUS.IN_USE}>Đang thuê</Option>
              <Option value={STATUS.MAINTENANCE}>Đang bảo trì</Option>
              <Option value={STATUS.INACTIVE}>Không hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ngayDangKy"
            label="Ngày đăng ký"
            rules={[{ required: true, message: 'Vui lòng chọn ngày đăng ký!' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageXe;