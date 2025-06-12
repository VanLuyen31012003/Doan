import React, { useState, useEffect } from 'react';
import { Table, Image, Button, Tag, Space, Pagination, Typography, Card, Input, Modal, Form, Select, InputNumber, Upload, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, UploadOutlined, LoadingOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiLoaiXeVaHangXe from '../../Api/ApiLoaiXeVaHangXe';
import ApiMauXe from '../../Api/ApiMauXe';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ManageMauxe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [modelList, setModelList] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentModel, setCurrentModel] = useState(null);
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [hangXeList, setHangXeList] = useState([]);
  const [loaiXeList, setLoaiXeList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  // Hàm lấy danh sách mẫu xe từ API
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
      message.error('Không thể tải dữ liệu mẫu xe');
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy danh sách hãng xe
  const fetchHangXe = async () => {
    try {
      const response = await ApiLoaiXeVaHangXe.getAllHangxe();
      if (response.data.success) {
        setHangXeList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching car brands:', error);
      message.error('Không thể tải dữ liệu hãng xe');
    }
  };

  // Hàm lấy danh sách loại xe
  const fetchLoaiXe = async () => {
    try {
      const response = await ApiLoaiXeVaHangXe.getAllLoaiXe();
      if (response.data.success) {
        setLoaiXeList(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching car types:', error);
      message.error('Không thể tải dữ liệu loại xe');
    }
  };

  // Gọi API khi component mounted
  useEffect(() => {
    fetchData();
    fetchHangXe();
    fetchLoaiXe();
  }, []);

  // Xử lý khi thay đổi trang
  const handleTableChange = (pagination) => {
    fetchData(pagination.current - 1, pagination.pageSize);
  };

  // Mở modal thêm mẫu xe
  const showAddModal = () => {
    setIsEditMode(false);
    setCurrentModel(null);
    setImageUrl('');
    setSelectedFile(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Mở modal sửa mẫu xe
  const showEditModal = (record) => {
    setIsEditMode(true);
    setCurrentModel(record);
    setImageUrl(record.anhDefault);
    setSelectedFile(null);
    
    // Set form values
    form.setFieldsValue({
      tenMau: record.tenMau,
      hangXeId: record.hangXeId,
      loaiXeId: record.loaiXeReponse?.loaiXeId,
      giaThueNgay: record.giaThueNgay,
      moTa: record.moTa,
    });
    
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Xử lý upload ảnh
  const handleImageChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setUploadLoading(false);
    }
  };

  // Xử lý upload ảnh lên server
  const customUpload = async ({ file, onSuccess, onError }) => {
    setUploadLoading(true);
    
    try {
      // Lưu file để sử dụng khi gửi form
      setSelectedFile(file);
      
      // Tạo URL tạm thời để hiển thị preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      onSuccess({ url });
    } catch (error) {
      console.error('Error handling file:', error);
      onError(error);
    } finally {
      setUploadLoading(false);
    }
  };

  // Xử lý nút submit form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      
      if (isEditMode) {
        // Cập nhật mẫu xe
        await updateModel(values);
      } else {
        // Thêm mẫu xe mới
        await createModel(values);
      }
      
      setIsModalVisible(false);
      fetchData(pagination.current - 1, pagination.pageSize); // Refresh data
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setConfirmLoading(false);
    }
  };

  // Thêm mẫu xe mới
  const createModel = async (data) => {
    try {
      // Tạo FormData để gửi dữ liệu multipart/form-data
      const formData = new FormData();
      formData.append('tenMau', data.tenMau);
      formData.append('hangxeId', data.hangXeId);
      formData.append('loaiXeId', data.loaiXeId);
      formData.append('giaThueNgay', data.giaThueNgay);
      formData.append('moTa', data.moTa || '');
      
      // Thêm file ảnh nếu có
      if (selectedFile) {
        formData.append('anhDefault', selectedFile);
      }
      
      console.log('Form data entries:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'anhDefault' ? 'File' : pair[1]));
      }
      const response = await ApiMauXe.createMauXe(formData);
      
      if (response.data.success) {
        toast.success('Thêm mẫu xe thành công');
      } else {
        toast.error('Thêm mẫu xe không thành công');
      }
    } catch (error) {
      console.error('Error creating model:', error);
      toast.error('Lỗi khi thêm mẫu xe: ' + (error.response?.data?.message || error.message));
    }
  };

  // Cập nhật thông tin mẫu xe
  const updateModel = async (data) => {
    try {
      // Tạo FormData để gửi dữ liệu multipart/form-data
      const formData = new FormData();
      formData.append('tenMau', data.tenMau);
      formData.append('hangxeId', data.hangXeId);
      formData.append('loaiXeId', data.loaiXeId);
      formData.append('giaThueNgay', data.giaThueNgay);
      formData.append('moTa', data.moTa || '');
      
      // Thêm file ảnh nếu có file mới được chọn
      if (selectedFile) {
        formData.append('anhDefault', selectedFile);
      } else if (imageUrl && !imageUrl.startsWith('blob:')) {
        // Nếu đang sử dụng URL ảnh cũ từ server
        formData.append('anhDefaultUrl', imageUrl);
      }
      
      const response = await ApiMauXe.updateMauXe(currentModel.mauXeId, formData);
      
      if (response.data.success) {
        toast.success('Cập nhật mẫu xe thành công');
      } else {
        toast.error('Cập nhật mẫu xe không thành công');
      }
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error('Không thể cập nhật mẫu xe: ' + (error.response?.data?.message || error.message));
    }
  };

  // Xóa mẫu xe
  const deleteModel = async (id) => {
    try {
      const response = await ApiMauXe.deleteMauXe(id);
      if (response.data.success) {
        toast.success('Xóa mẫu xe thành công');
        fetchData(pagination.current - 1, pagination.pageSize); // Refresh data
      } else {
        toast.error('Xóa mẫu xe không thành công');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Xóa thất bại: ' + (error.response?.data?.message || error.message));
    }
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
      render: (text) => <span className="text-blue-500">{text}</span>
    },
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
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/dashboard/mauxe/${record.mauXeId}`)}
          >
            Chi tiết
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa mẫu xe này?"
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => deleteModel(record.mauXeId)}
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
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={showAddModal}
          >
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

      {/* Modal thêm/sửa mẫu xe */}
      <Modal
        title={isEditMode ? 'Cập nhật mẫu xe' : 'Thêm mẫu xe mới'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ giaThueNgay: 0 }}
        >
          <Form.Item
            name="tenMau"
            label="Tên mẫu xe"
            rules={[{ required: true, message: 'Vui lòng nhập tên mẫu xe' }]}
          >
            <Input placeholder="Nhập tên mẫu xe" />
          </Form.Item>

          <Form.Item
            name="hangXeId"
            label="Hãng xe"
            rules={[{ required: true, message: 'Vui lòng chọn hãng xe' }]}
          >
            <Select placeholder="Chọn hãng xe">
              {hangXeList.map(hang => (
                <Option key={hang.hangXeId} value={hang.hangXeId}>
                  {hang.tenHang}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="loaiXeId"
            label="Loại xe"
            rules={[{ required: true, message: 'Vui lòng chọn loại xe' }]}
          >
            <Select placeholder="Chọn loại xe">
              {loaiXeList.map(loai => (
                <Option key={loai.loaiXeId} value={loai.loaiXeId}>
                  {loai.tenLoai}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="giaThueNgay"
            label="Giá thuê ngày (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá thuê' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mô tả"
          >
            <TextArea rows={4} placeholder="Nhập mô tả mẫu xe" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
          >
            <Upload
              name="anhDefault"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={customUpload}
              onChange={handleImageChange}
              accept="image/*"
            >
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div>
                  {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
            <div style={{ marginTop: 8 }}>
              {imageUrl ? 'Đã chọn ảnh' : 'Chưa có ảnh được chọn'}
              {selectedFile && <span> ({selectedFile.name})</span>}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ManageMauxe;