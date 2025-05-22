import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, Typography, Descriptions, Tag, Button, Table, Space, 
  Image, Divider, Badge, Statistic, Modal, DatePicker, Spin, Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  UserOutlined,
  DollarOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ApiDonDat from '../../Api/ApiDonDat';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Định nghĩa trạng thái đơn hàng
const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1,
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4,
};

// Map trạng thái đơn hàng sang text hiển thị
const statusMap = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Hoàn thành",
  3: "Đã hủy",
  4: "Đang thuê",
};

// Map trạng thái thanh toán sang text hiển thị
const paymentStatusMap = {
  0: "Chưa thanh toán",
  1: "Đã thanh toán",
};

const DetailOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newEndDate, setNewEndDate] = useState(null);
  const [extendModalVisible, setExtendModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  
  const today = new Date();
  
  // Lấy thông tin đơn đặt
  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await ApiDonDat.getDonDatById(id);
      if (response.data.success) {
        setOrder(response.data.data);
      } else {
        toast.error("Không thể tải thông tin đơn đặt xe");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Đã xảy ra lỗi khi tải thông tin đơn đặt xe");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrder();
  }, [id]);
  
  // Tính ngày kết thúc
  const ngayKetThuc = order ? new Date(order.ngayKetThuc) : null;
  
  // Tính số ngày gia hạn và số tiền gia hạn
  const calculateExtension = () => {
    if (!newEndDate || !order || !ngayKetThuc) {
      return { days: 0, cost: 0 };
    }
    
    // Tính số ngày gia hạn
    const diffTime = newEndDate - ngayKetThuc;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Tính tổng giá thuê ngày của tất cả xe
    const totalDailyPrice = order.chiTiet?.reduce((sum, detail) => {
      return sum + (detail.xe.mauXe.giaThueNgay || 0);
    }, 0);
    
    // Tính số tiền gia hạn
    const cost = days * totalDailyPrice;
    
    return { days: days > 0 ? days : 0, cost: cost > 0 ? cost : 0 };
  };
  
  const { days, cost } = calculateExtension();
  
  // Xử lý gia hạn đơn đặt
  const handleExtendOrder = async () => {
    if (!newEndDate) {
      toast.error("Vui lòng chọn ngày gia hạn");
      return;
    }
    
    setConfirmLoading(true);
    try {
      const adjustedDate = new Date(newEndDate);
      adjustedDate.setHours(23, 59, 59, 0);
      
      // Chuyển đổi sang định dạng YYYY-MM-DDTHH:mm:ss
      const formattedDate = adjustedDate.toISOString().slice(0, 19);
      
      const datasend = {
        newEndDate: formattedDate,
      };
      
      const response = await ApiDonDat.giaHanDonDat(id, datasend);
      toast.success("Gia hạn đơn đặt xe thành công!");
      setExtendModalVisible(false);
      setNewEndDate(null);
      fetchOrder();
    } catch (error) {
      console.error("Error extending order:", error.response?.data);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi gia hạn đơn đặt xe");
    } finally {
      setConfirmLoading(false);
    }
  };
  
  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (newStatus) => {
    confirm({
      title: `Xác nhận thay đổi trạng thái`,
      content: `Bạn có chắc chắn muốn chuyển đơn hàng #${id} sang trạng thái ${statusMap[newStatus]}?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await ApiDonDat.updateDonDat(id, { trangThai: newStatus });
          toast.success(`Đã cập nhật trạng thái đơn hàng #${id} thành công`);
          fetchOrder();
        } catch (error) {
          console.error("Error updating order status:", error);
          toast.error("Có lỗi khi cập nhật trạng thái đơn hàng");
        }
      },
    });
  };
  
  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY HH:mm");
  };
  
  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + " VNĐ";
  };
  
  // Lấy tag trạng thái đơn hàng
  const getStatusTag = (status) => {
    if (status === ORDER_STATUS.DANG_THUE && ngayKetThuc && ngayKetThuc < today) {
      return <Tag color="red" icon={<WarningOutlined />}>Quá hạn</Tag>;
    }
    
    switch (status) {
      case ORDER_STATUS.CHO_XAC_NHAN:
        return <Tag color="blue" icon={<InfoCircleOutlined />}>Chờ xác nhận</Tag>;
      case ORDER_STATUS.DA_XAC_NHAN:
        return <Tag color="orange" icon={<CheckCircleOutlined />}>Đã xác nhận</Tag>;
      case ORDER_STATUS.HOAN_THANH:
        return <Tag color="green" icon={<CheckCircleOutlined />}>Hoàn thành</Tag>;
      case ORDER_STATUS.HUY:
        return <Tag color="red" icon={<CloseCircleOutlined />}>Đã hủy</Tag>;
      case ORDER_STATUS.DANG_THUE:
        return <Tag color="purple" icon={<CarOutlined />}>Đang cho thuê</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };
  
  // Cấu hình cột bảng chi tiết xe
  const vehicleColumns = [
    {
      title: 'Hình ảnh',
      dataIndex: ['xe', 'mauXe', 'anhdefault'],
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
      dataIndex: ['xe', 'bienSo'],
      key: 'bienSo',
      render: (text) => <Badge status="processing" color="blue" text={text} />,
    },
    {
      title: 'Tên xe',
      dataIndex: ['xe', 'mauXe', 'tenMau'],
      key: 'tenMau',
    },
    {
      title: 'Giá thuê/ngày',
      dataIndex: ['xe', 'mauXe', 'giaThueNgay'],
      key: 'giaThueNgay',
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Số ngày thuê',
      dataIndex: 'soNgayThue',
      key: 'soNgayThue',
      render: (days) => `${days} ngày`,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'thanhTien',
      key: 'thanhTien',
      render: (amount) => formatCurrency(amount),
    },
  ];
  
  // Cấu hình cột bảng hóa đơn gia hạn
  const extensionColumns = [
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
      title: 'Tổng tiền',
      dataIndex: 'tongTienGiaHan',
      key: 'tongTienGiaHan',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'trangThaiThanhToan',
      key: 'trangThaiThanhToan',
      render: (status) => (
        status === 1 
          ? <Tag color="green">Đã thanh toán</Tag>
          : <Tag color="red">Chưa thanh toán</Tag>
      ),
    },
  ];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
      </div>
    );
  }
  
  if (!order) {
    return (
      <Alert
        message="Không tìm thấy thông tin đơn hàng"
        description="Đơn hàng không tồn tại hoặc đã bị xóa."
        type="error"
        showIcon
        action={
          <Button onClick={() => navigate('/dashboard/orders')} type="primary">
            Quay lại danh sách
          </Button>
        }
      />
    );
  }
  
  return (
    <Card className="shadow-md">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex items-center">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/dashboard/orders')}
            className="mr-4"
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Chi tiết đơn đặt xe #{id}
          </Title>
        </div>
        <Space>
          {order.trangThai === ORDER_STATUS.CHO_XAC_NHAN && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => handleStatusChange(ORDER_STATUS.DA_XAC_NHAN)}
              >
                Xác nhận đơn
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleStatusChange(ORDER_STATUS.HUY)}
              >
                Hủy đơn
              </Button>
            </>
          )}
          {order.trangThai === ORDER_STATUS.DA_XAC_NHAN && (
            <Button
              type="primary"
              icon={<CarOutlined />}
              onClick={() => handleStatusChange(ORDER_STATUS.DANG_THUE)}
            >
              Giao xe
            </Button>
          )}
          {order.trangThai === ORDER_STATUS.DANG_THUE && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusChange(ORDER_STATUS.HOAN_THANH)}
              >
                Hoàn thành đơn
              </Button>
              <Button
                type="default"
                icon={<CalendarOutlined />}
                onClick={() => setExtendModalVisible(true)}
              >
                Gia hạn đơn
              </Button>
            </>
          )}
        </Space>
      </div>
      
      {order.trangThai === ORDER_STATUS.DANG_THUE && ngayKetThuc && ngayKetThuc < today && (
        <Alert
          message="Đơn hàng đã quá hạn"
          description="Đơn hàng này đã quá thời hạn trả xe. Vui lòng liên hệ khách hàng để xử lý."
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          className="mb-4"
          banner
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <Statistic
            title="Tổng tiền đơn hàng"
            value={order.tongTien}
            formatter={(value) => formatCurrency(value)}
            valueStyle={{ color: '#3f8600' }}
            prefix={<DollarOutlined />}
          />
        </Card>
        <Card className="shadow-sm">
          <Statistic
            title="Số tiền còn phải thanh toán"
            value={order.soTienCanThanhToan}
            formatter={(value) => formatCurrency(value)}
            valueStyle={{ color: '#cf1322' }}
            prefix={<DollarOutlined />}
          />
        </Card>
        <Card className="shadow-sm">
          <Statistic
            title="Trạng thái đơn hàng"
            value={statusMap[order.trangThai]}
            valueStyle={{ 
              color: order.trangThai === ORDER_STATUS.HOAN_THANH ? '#3f8600' : 
                     order.trangThai === ORDER_STATUS.HUY ? '#cf1322' : '#1890ff' 
            }}
          />
          {getStatusTag(order.trangThai)}
        </Card>
      </div>
      
      <Divider orientation="left">Thông tin đơn hàng</Divider>
      
      <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label="Mã đơn" span={1}>
          <Text strong>{order.donDatXeId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng" span={2}>
  <div 
    className="flex items-center cursor-pointer text-blue-600 hover:text-blue-800"
    onClick={() => navigate(`/dashboard/khachang/${order.idKhachHang}`)}
  >
    <UserOutlined className="mr-2" />
    <Text strong className="hover:underline">{order.khachHangName}</Text>
    <span className="ml-1 text-xs text-gray-500">(Click để xem chi tiết)</span>
  </div>
</Descriptions.Item>
        <Descriptions.Item label="Người xử lý" span={2}>
          {order.nguoiDungName || "Chưa có"}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày bắt đầu">
          <CalendarOutlined className="mr-1" />
          {formatDate(order.ngayBatDau)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày kết thúc">
          <CalendarOutlined className="mr-1" />
          {formatDate(order.ngayKetThuc)}
        </Descriptions.Item>
        <Descriptions.Item label="Địa điểm nhận xe" span={3}>
          <EnvironmentOutlined className="mr-1" />
          {order.diaDiemNhanXe}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {order.phuongThucThanhToan}
        </Descriptions.Item>
        <Descriptions.Item label="Tiền đặt đơn">
          <Text strong>{formatCurrency(order.tongTienLandau)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán">
          {order.trangThaiThanhToan === 1 ? (
            <Tag color="green">Đã thanh toán</Tag>
          ) : (
            <Tag color="red">Chưa thanh toán</Tag>
          )}
        </Descriptions.Item>
      </Descriptions>
      
      <Divider orientation="left">Chi tiết xe thuê</Divider>
      
      <Table
        columns={vehicleColumns}
        dataSource={order.chiTiet}
        rowKey="chiTietId"
        pagination={false}
        className="mb-6"
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={5} align="right">
                <Text strong>Tổng cộng:</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong type="danger">{formatCurrency(order.tongTien)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      
      {order.hoaDonGiaHan && order.hoaDonGiaHan.length > 0 && (
        <>
          <Divider orientation="left">Lịch sử gia hạn</Divider>
          <Table
            columns={extensionColumns}
            dataSource={order.hoaDonGiaHan}
            rowKey="hoaDonGiaHanId"
            pagination={false}
            className="mb-6"
          />
        </>
      )}
      
      {/* Modal gia hạn đơn đặt */}
      <Modal
        title="Gia hạn đơn đặt xe"
        visible={extendModalVisible}
        onCancel={() => {
          setExtendModalVisible(false);
          setNewEndDate(null);
        }}
        footer={[
          <Button 
            key="back" 
            onClick={() => {
              setExtendModalVisible(false);
              setNewEndDate(null);
            }}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleExtendOrder}
            disabled={!newEndDate}
          >
            Xác nhận gia hạn
          </Button>
        ]}
      >
        <div className="mb-4">
          <Text strong>Ngày kết thúc hiện tại:</Text>
          <div>{formatDate(order.ngayKetThuc)}</div>
        </div>
        
        <div className="mb-4">
          <Text strong>Chọn ngày kết thúc mới:</Text>
          <DatePicker
            className="w-full mt-2"
            format="DD/MM/YYYY"
            placeholder="Chọn ngày"
            onChange={setNewEndDate}
            disabledDate={(current) => {
              return current && current < moment(order.ngayKetThuc).endOf('day');
            }}
          />
        </div>
        
        {newEndDate && (
          <>
            <div className="mb-2">
              <Text strong>Số ngày gia hạn:</Text>
              <div>{days} ngày</div>
            </div>
            
            <div className="mb-2">
              <Text strong>Chi phí gia hạn:</Text>
              <div className="text-lg text-red-600 font-bold">
                {formatCurrency(cost)}
              </div>
            </div>
          </>
        )}
      </Modal>
    </Card>
  );
};

export default DetailOrder;