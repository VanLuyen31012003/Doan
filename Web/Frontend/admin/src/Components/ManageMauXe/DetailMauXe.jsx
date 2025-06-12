import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Descriptions,
  Carousel,
  Tag,
  Button,
  Spin,
  Alert,
  Divider,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Rate,
  List,
  Avatar,
  Empty,
  Pagination,
  Statistic,
  Popconfirm,
  Space
} from 'antd';
import {
  ArrowLeftOutlined,
  CarOutlined,
  ToolOutlined,
  SettingOutlined,
  StarOutlined,
  MessageOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import ApiMauXe from '../../Api/ApiMauXe';
// import ApiDanhGia from '../../Api/ApiDanhGia';
import { toast } from 'react-toastify';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const DetailMauXe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mauXe, setMauXe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  // States for reviews
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [reviewsStats, setReviewsStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Fetch data
  useEffect(() => {
    fetchMauXeDetail();
    fetchReviews(1);
  }, [id]);

  const fetchMauXeDetail = async () => {
    try {
      setLoading(true);
      const response = await ApiMauXe.getMauXeById(id);
      
      if (response.data.success) {
        setMauXe(response.data.data);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Không thể lấy thông tin mẫu xe');
      }
    } catch (error) {
      console.error('Error fetching mau xe:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải dữ liệu');
      toast.error('Không thể tải thông tin mẫu xe');
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews
  const fetchReviews = async (page = 1, pageSize = 10) => {
    try {
      setReviewsLoading(true);
      const response = await ApiMauXe.getAllDanhGiaByMauXeId(
        id, 
        page - 1, 
        pageSize, 
        'ngayDanhGia,desc'
      );
      
      if (response.data.success) {
        const reviewsData = response.data.data.content;
        const pageInfo = response.data.data.page;
        
        setReviews(reviewsData);
        setReviewsPagination({
          current: page,
          pageSize: pageSize,
          total: pageInfo.totalElements
        });

        // Calculate statistics
        calculateReviewsStats(reviewsData);
      } else {
        throw new Error(response.data.message || 'Không thể tải đánh giá');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Không thể tải danh sách đánh giá');
    } finally {
      setReviewsLoading(false);
    }
  };

  // Calculate reviews statistics
  const calculateReviewsStats = (reviewsData) => {
    const totalReviews = reviewsData.length;
    const totalRating = reviewsData.reduce((sum, review) => sum + review.soSao, 0);
    const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      distribution[review.soSao]++;
    });

    setReviewsStats({
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution: distribution
    });
  };

  // Handle pagination change
  const handleReviewsPaginationChange = (page, pageSize) => {
    fetchReviews(page, pageSize);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await ApiMauXe.deleteDanhGia(reviewId);
      
      if (response.data.success) {
        toast.success('Xóa đánh giá thành công!');
        // Refresh reviews list
        await fetchReviews(reviewsPagination.current, reviewsPagination.pageSize);
      } else {
        throw new Error(response.data.message || 'Xóa đánh giá thất bại');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa đánh giá');
    }
  };

  // Handle open update modal
  const handleOpenUpdateModal = () => {
    if (mauXe.thongTinKyThuat) {
      form.setFieldsValue({
        dongCo: mauXe.thongTinKyThuat.dongCo,
        dungTich: mauXe.thongTinKyThuat.dungTich,
        nhienLieu: mauXe.thongTinKyThuat.nhienLieu,
        kichThuoc: mauXe.thongTinKyThuat.kichThuoc,
        trongLuong: mauXe.thongTinKyThuat.trongLuong,
        loaiHopSo: mauXe.thongTinKyThuat.loaiHopSo,
        heThongPhanh: mauXe.thongTinKyThuat.heThongPhanh,
        phuocTruoc: mauXe.thongTinKyThuat.phuocTruoc,
        phuocSau: mauXe.thongTinKyThuat.phuocSau,
        dungTichBinhXang: mauXe.thongTinKyThuat.dungTichBinhXang,
        tieuThuNhienLieu: mauXe.thongTinKyThuat.tieuThuNhienLieu,
        loaiLop: mauXe.thongTinKyThuat.loaiLop,
        kichThuocLopTruoc: mauXe.thongTinKyThuat.kichThuocLopTruoc,
        kichThuocLopSau: mauXe.thongTinKyThuat.kichThuocLopSau,
        loaiDen: mauXe.thongTinKyThuat.loaiDen
      });
    }
    setUpdateModalVisible(true);
  };

  // Handle update technical info
  const handleUpdateTechnicalInfo = async (values) => {
    try {
      setUpdateLoading(true);
      
      const cleanedValues = {
        dongCo: values.dongCo?.trim(),
        dungTich: values.dungTich,
        nhienLieu: values.nhienLieu?.trim(),
        kichThuoc: values.kichThuoc?.trim(),
        trongLuong: values.trongLuong,
        loaiHopSo: values.loaiHopSo?.trim(),
        heThongPhanh: values.heThongPhanh?.trim(),
        phuocTruoc: values.phuocTruoc?.trim(),
        phuocSau: values.phuocSau?.trim(),
        dungTichBinhXang: values.dungTichBinhXang,
        tieuThuNhienLieu: values.tieuThuNhienLieu,
        loaiLop: values.loaiLop?.trim(),
        kichThuocLopTruoc: values.kichThuocLopTruoc?.trim(),
        kichThuocLopSau: values.kichThuocLopSau?.trim(),
        loaiDen: values.loaiDen?.trim()
      };

      const response = await ApiMauXe.updatethongtinkithuat(id, cleanedValues);
      
      if (response.data.success) {
        toast.success('Cập nhật thông tin kỹ thuật thành công!');
        setUpdateModalVisible(false);
        form.resetFields();
        await fetchMauXeDetail();
      } else {
        throw new Error(response.data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating technical info:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setUpdateLoading(false);
    }
  };

  // Render rating stars
  const renderRatingStars = (rating) => {
    return <Rate disabled defaultValue={rating} style={{ fontSize: '14px' }} />;
  };

  // Render rating distribution
  const renderRatingDistribution = () => {
    return (
      <div style={{ marginBottom: '16px' }}>
        {[5, 4, 3, 2, 1].map(star => (
          <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ width: '20px' }}>{star}</span>
            <StarOutlined style={{ color: '#fadb14', marginRight: '8px' }} />
            <div style={{ 
              width: '100px', 
              height: '8px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '4px',
              marginRight: '8px',
              overflow: 'hidden'
            }}>
              <div 
                style={{ 
                  width: `${(reviewsStats.ratingDistribution[star] / Math.max(reviewsStats.totalReviews, 1)) * 100}%`,
                  height: '100%',
                  backgroundColor: '#fadb14'
                }}
              />
            </div>
            <span>{reviewsStats.ratingDistribution[star]} đánh giá</span>
          </div>
        ))}
      </div>
    );
  };

  // Custom Comment Component with delete button
  const CustomComment = ({ avatar, author, content, datetime, reviewId, onDelete }) => (
    <div style={{ display: 'flex', marginBottom: '16px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '8px', backgroundColor: '#fafafa' }}>
      <div style={{ marginRight: '12px' }}>
        {avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <div>
            <div style={{ marginBottom: '4px' }}>
              {author}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {datetime}
            </div>
          </div>
          <Popconfirm
            title="Xóa đánh giá"
            description="Bạn có chắc chắn muốn xóa đánh giá này không?"
            onConfirm={() => onDelete(reviewId)}
            okText="Xóa"
            cancelText="Hủy"
            okType="danger"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              style={{ padding: '4px' }}
            />
          </Popconfirm>
        </div>
        <div>
          {content}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải thông tin mẫu xe...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi"
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  if (!mauXe) {
    return (
      <Alert
        message="Không tìm thấy"
        description="Không tìm thấy thông tin mẫu xe"
        type="warning"
        showIcon
        action={
          <Button size="small" onClick={() => navigate(-1)}>
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            Chi tiết mẫu xe: {mauXe.tenMau}
          </Title>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            type="default" 
            icon={<SettingOutlined />}
            onClick={handleOpenUpdateModal}
          >
            Cập nhật thông số kỹ thuật
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Cột trái - Hình ảnh */}
        <Col xs={24} lg={12}>
          <Card title="Hình ảnh xe" style={{ height: '100%' }}>
            <div style={{ marginBottom: '16px' }}>
              <Image
                src={mauXe.anhDefault}
                alt={mauXe.tenMau}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                fallback="https://placehold.co/400x300?text=No+Image"
              />
            </div>

            {mauXe.anhXeList && mauXe.anhXeList.length > 0 && (
              <>
                <Divider>Thư viện ảnh</Divider>
                <Carousel autoplay dots>
                  {mauXe.anhXeList.map((img, index) => (
                    <div key={index}>
                      <Image
                        src={img}
                        alt={`${mauXe.tenMau} ${index + 1}`}
                        style={{ 
                          width: '100%', 
                          height: '250px', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                        fallback="https://placehold.co/400x250?text=No+Image"
                      />
                    </div>
                  ))}
                </Carousel>
              </>
            )}
          </Card>
        </Col>

        {/* Cột phải - Thông tin */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <span>
                <CarOutlined style={{ marginRight: '8px' }} />
                Thông tin cơ bản
              </span>
            }
            style={{ marginBottom: '24px' }}
          >
            <Descriptions column={1} size="middle">
              <Descriptions.Item label="Tên mẫu xe">
                <Text strong style={{ fontSize: '16px' }}>{mauXe.tenMau}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hãng xe">
                <Tag color="blue" style={{ fontSize: '14px' }}>
                  {mauXe.tenHangXe}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Loại xe">
                <Tag color="green" style={{ fontSize: '14px' }}>
                  {mauXe.loaiXeReponse?.tenLoaiXe}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá thuê/ngày">
                <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                  {formatCurrency(mauXe.giaThueNgay)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng còn lại">
                <Tag color={mauXe.soLuongxeconlai > 0 ? 'success' : 'error'}>
                  {mauXe.soLuongxeconlai} xe
                </Tag>
              </Descriptions.Item>
              {mauXe.soluotdat !== null && (
                <Descriptions.Item label="Số lượt đặt">
                  <Text>{mauXe.soluotdat} lượt</Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Đánh giá">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Rate disabled defaultValue={reviewsStats.averageRating} allowHalf />
                  <Text strong>{reviewsStats.averageRating}/5</Text>
                  <Text type="secondary">({reviewsStats.totalReviews} đánh giá)</Text>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card 
            title="Mô tả chi tiết"
            style={{ marginBottom: '24px' }}
          >
            <Paragraph style={{ textAlign: 'justify', lineHeight: '1.6' }}>
              {mauXe.moTa}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* Thông tin kỹ thuật */}
      {mauXe.thongTinKyThuat && (
        <Card 
          title={
            <span>
              <ToolOutlined style={{ marginRight: '8px' }} />
              Thông tin kỹ thuật
            </span>
          }
          style={{ marginTop: '24px' }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Động cơ">
                  {mauXe.thongTinKyThuat.dongCo}
                </Descriptions.Item>
                <Descriptions.Item label="Dung tích">
                  {mauXe.thongTinKyThuat.dungTich} cc
                </Descriptions.Item>
                <Descriptions.Item label="Nhiên liệu">
                  {mauXe.thongTinKyThuat.nhienLieu}
                </Descriptions.Item>
                <Descriptions.Item label="Kích thước">
                  {mauXe.thongTinKyThuat.kichThuoc}
                </Descriptions.Item>
                <Descriptions.Item label="Trọng lượng">
                  {mauXe.thongTinKyThuat.trongLuong} kg
                </Descriptions.Item>
                <Descriptions.Item label="Loại hộp số">
                  {mauXe.thongTinKyThuat.loaiHopSo}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Hệ thống phanh">
                  {mauXe.thongTinKyThuat.heThongPhanh}
                </Descriptions.Item>
                <Descriptions.Item label="Phuộc trước">
                  {mauXe.thongTinKyThuat.phuocTruoc}
                </Descriptions.Item>
                <Descriptions.Item label="Phuộc sau">
                  {mauXe.thongTinKyThuat.phuocSau}
                </Descriptions.Item>
                <Descriptions.Item label="Dung tích bình xăng">
                  {mauXe.thongTinKyThuat.dungTichBinhXang} lít
                </Descriptions.Item>
                <Descriptions.Item label="Tiêu thụ nhiên liệu">
                  {mauXe.thongTinKyThuat.tieuThuNhienLieu} lít/100km
                </Descriptions.Item>
                <Descriptions.Item label="Loại đèn">
                  {mauXe.thongTinKyThuat.loaiDen}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
          
          <Divider>Thông tin lốp xe</Divider>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Loại lốp">
                  {mauXe.thongTinKyThuat.loaiLop}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Kích thước lốp trước">
                  {mauXe.thongTinKyThuat.kichThuocLopTruoc}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col xs={24} md={8}>
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Kích thước lốp sau">
                  {mauXe.thongTinKyThuat.kichThuocLopSau}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        </Card>
      )}

      {/* Đánh giá và nhận xét */}
      <Card 
        title={
          <span>
            <MessageOutlined style={{ marginRight: '8px' }} />
            Đánh giá từ khách hàng ({reviewsStats.totalReviews} đánh giá)
          </span>
        }
        style={{ marginTop: '24px' }}
      >
        <Row gutter={[24, 24]}>
          {/* Tổng quan đánh giá */}
          <Col xs={24} md={8}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fafafa' }}>
              <Statistic 
                title="Điểm đánh giá trung bình" 
                value={reviewsStats.averageRating} 
                precision={1}
                suffix="/ 5.0"
                valueStyle={{ fontSize: '32px', color: '#fadb14' }}
              />
              <div style={{ marginTop: '8px' }}>
                <Rate disabled defaultValue={reviewsStats.averageRating} allowHalf />
              </div>
              <Text type="secondary" style={{ marginTop: '8px', display: 'block' }}>
                Dựa trên {reviewsStats.totalReviews} đánh giá
              </Text>
            </Card>
            <div style={{ marginTop: '16px' }}>
              <Title level={5}>Phân bố đánh giá</Title>
              {renderRatingDistribution()}
            </div>
          </Col>

          {/* Danh sách đánh giá */}
          <Col xs={24} md={16}>
            <Spin spinning={reviewsLoading}>
              {reviews.length > 0 ? (
                <>
                  <List
                    itemLayout="vertical"
                    dataSource={reviews}
                    renderItem={(review) => (
                      <List.Item key={review.danhGiaId} style={{ border: 'none', padding: '8px 0' }}>
                        <CustomComment
                          avatar={
                            <Avatar 
                              icon={<UserOutlined />} 
                              style={{ backgroundColor: '#1890ff' }}
                            />
                          }
                          author={
                            <Text strong>{review.hoTenKhachHang}</Text>
                          }
                          datetime={
                            moment(review.ngayDanhGia, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
                          }
                          content={
                            <div>
                              <div style={{ marginBottom: '8px' }}>
                                {renderRatingStars(review.soSao)}
                              </div>
                              <Paragraph style={{ margin: 0 }}>
                                {review.binhLuan}
                              </Paragraph>
                            </div>
                          }
                          reviewId={review.danhGiaId}
                          onDelete={handleDeleteReview}
                        />
                      </List.Item>
                    )}
                  />
                  
                  {/* Pagination */}
                  {reviewsPagination.total > reviewsPagination.pageSize && (
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      <Pagination
                        current={reviewsPagination.current}
                        pageSize={reviewsPagination.pageSize}
                        total={reviewsPagination.total}
                        onChange={handleReviewsPaginationChange}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) => 
                          `${range[0]}-${range[1]} của ${total} đánh giá`
                        }
                      />
                    </div>
                  )}
                </>
              ) : (
                <Empty 
                  description="Chưa có đánh giá nào cho mẫu xe này"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Spin>
          </Col>
        </Row>
      </Card>

      {/* Modal cập nhật thông tin kỹ thuật */}
      <Modal
        title={
          <span>
            <SettingOutlined style={{ marginRight: '8px' }} />
            Cập nhật thông tin kỹ thuật - {mauXe.tenMau}
          </span>
        }
        open={updateModalVisible}
        onCancel={() => {
          setUpdateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateTechnicalInfo}
          autoComplete="off"
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Động cơ"
                name="dongCo"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin động cơ!' }]}
              >
                <Input placeholder="VD: 4 thì, xi-lanh đơn, SOHC" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Dung tích (cc)"
                name="dungTich"
                rules={[{ required: true, message: 'Vui lòng nhập dung tích!' }]}
              >
                <InputNumber
                  placeholder="150"
                  style={{ width: '100%' }}
                  min={50}
                  max={2000}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Nhiên liệu"
                name="nhienLieu"
                rules={[{ required: true, message: 'Vui lòng chọn loại nhiên liệu!' }]}
              >
                <Select placeholder="Chọn loại nhiên liệu">
                  <Option value="Xăng">Xăng</Option>
                  <Option value="Điện">Điện</Option>
                  <Option value="Xăng + Điện">Xăng + Điện</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Kích thước (DxRxC)"
                name="kichThuoc"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước!' }]}
              >
                <Input placeholder="1925 x 720 x 1090" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Trọng lượng (kg)"
                name="trongLuong"
                rules={[{ required: true, message: 'Vui lòng nhập trọng lượng!' }]}
              >
                <InputNumber
                  placeholder="116"
                  style={{ width: '100%' }}
                  min={50}
                  max={500}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Loại hộp số"
                name="loaiHopSo"
                rules={[{ required: true, message: 'Vui lòng nhập loại hộp số!' }]}
              >
                <Select placeholder="Chọn loại hộp số">
                  <Option value="Số tự động CVT">Số tự động CVT</Option>
                  <Option value="Tự động">Tự động</Option>
                  <Option value="Số sàn">Số sàn</Option>
                  <Option value="Côn tay">Côn tay</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Hệ thống phanh"
                name="heThongPhanh"
                rules={[{ required: true, message: 'Vui lòng nhập hệ thống phanh!' }]}
              >
                <Input placeholder="Đĩa/Đĩa" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phuộc trước"
                name="phuocTruoc"
                rules={[{ required: true, message: 'Vui lòng nhập loại phuộc trước!' }]}
              >
                <Input placeholder="Telescopic" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Phuộc sau"
                name="phuocSau"
                rules={[{ required: true, message: 'Vui lòng nhập loại phuộc sau!' }]}
              >
                <Input placeholder="Monoshock" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Dung tích bình xăng (lít)"
                name="dungTichBinhXang"
                rules={[{ required: true, message: 'Vui lòng nhập dung tích bình xăng!' }]}
              >
                <InputNumber
                  placeholder="5.5"
                  style={{ width: '100%' }}
                  min={1}
                  max={50}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tiêu thụ nhiên liệu (lít/100km)"
                name="tieuThuNhienLieu"
                rules={[{ required: true, message: 'Vui lòng nhập mức tiêu thụ nhiên liệu!' }]}
              >
                <InputNumber
                  placeholder="1.7"
                  style={{ width: '100%' }}
                  min={0.5}
                  max={20}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Loại lốp"
                name="loaiLop"
                rules={[{ required: true, message: 'Vui lòng chọn loại lốp!' }]}
              >
                <Select placeholder="Chọn loại lốp">
                  <Option value="Không săm">Không săm</Option>
                  <Option value="Có săm">Có săm</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Kích thước lốp trước"
                name="kichThuocLopTruoc"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước lốp trước!' }]}
              >
                <Input placeholder="100/80-14" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Kích thước lốp sau"
                name="kichThuocLopSau"
                rules={[{ required: true, message: 'Vui lòng nhập kích thước lốp sau!' }]}
              >
                <Input placeholder="120/80-14" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Loại đèn"
            name="loaiDen"
            rules={[{ required: true, message: 'Vui lòng chọn loại đèn!' }]}
          >
            <Select placeholder="Chọn loại đèn">
              <Option value="LED">LED</Option>
              <Option value="Halogen">Halogen</Option>
              <Option value="Xenon">Xenon</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: 'right', marginTop: '24px' }}>
            <Button 
              style={{ marginRight: '8px' }}
              onClick={() => {
                setUpdateModalVisible(false);
                form.resetFields();
              }}
            >
              Hủy
            </Button>
            <Button 
              type="primary" 
              htmlType="submit"
              loading={updateLoading}
            >
              Cập nhật
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DetailMauXe;