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
  EnvironmentOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import moment from 'moment';
import ApiDonDat from '../../Api/ApiDonDat';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const { Title, Text } = Typography;

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
  const [contractPreviewVisible, setContractPreviewVisible] = useState(false);
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
      
      await ApiDonDat.giaHanDonDat(id, datasend);
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
    Modal.confirm({
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
  
  // Tạo PDF hợp đồng
  const generateContractPDF = async () => {
    const contractElement = document.getElementById('contract-content');
    
    if (!contractElement) {
      toast.error('Không thể tạo hợp đồng');
      return;
    }

    try {
      // Tạo canvas từ HTML element
      const canvas = await html2canvas(contractElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Thêm trang đầu tiên
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Thêm các trang tiếp theo nếu cần
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Lưu file PDF
      pdf.save(`hop-dong-thue-xe-${order.donDatXeId}.pdf`);
      toast.success('Đã tạo hợp đồng PDF thành công!');
      setContractPreviewVisible(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Có lỗi khi tạo file PDF');
    }
  };

  // Hiển thị preview hợp đồng
  const showContractPreview = () => {
    setContractPreviewVisible(true);
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
  
  // Component nội dung hợp đồng
  const ContractContent = () => (
    <div id="contract-content" style={{ 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      color: 'black',
      lineHeight: '1.6'
    }}>
      {/* Header hợp đồng */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>
          HỢP ĐỒNG THUÊ XE MÁY
        </h1>
        <p style={{ fontSize: '16px', margin: '10px 0' }}>
          <strong>Số hợp đồng: {order.donDatXeId}</strong>
        </p>
        <p style={{ fontSize: '14px', margin: '5px 0' }}>
          Ngày lập: {moment().format('DD/MM/YYYY')}
        </p>
      </div>

      {/* Thông tin bên cho thuê */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          BÊN CHO THUÊ (Bên A):
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ margin: '8px 0' }}><strong>Công ty:</strong> MotoVip - Dịch vụ cho thuê xe máy</p>
          <p style={{ margin: '8px 0' }}><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HÀ NỘI</p>
          <p style={{ margin: '8px 0' }}><strong>Điện thoại:</strong> 0123-456-789</p>
          <p style={{ margin: '8px 0' }}><strong>Email:</strong> contact@motovip.com</p>
          <p style={{ margin: '8px 0' }}><strong>Mã số thuế:</strong> 0123456789</p>
        </div>
      </div>

      {/* Thông tin bên thuê */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          BÊN THUÊ (Bên B):
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ margin: '8px 0' }}><strong>Họ tên:</strong> {order.khachHangName}</p>
          <p style={{ margin: '8px 0' }}><strong>Số điện thoại:</strong> </p>
          <p style={{ margin: '8px 0' }}><strong>Email:</strong></p>
          <p style={{ margin: '8px 0' }}><strong>Địa chỉ nhận xe:</strong> {order.diaDiemNhanXe}</p>
        </div>
      </div>

      {/* Thông tin xe thuê */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          THÔNG TIN XE THUÊ:
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          {order.chiTiet?.map((detail, index) => (
            <div key={index} style={{ marginBottom: '15px', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Xe {index + 1}:</p>
              <p style={{ margin: '5px 0' }}>• Tên xe: {detail.xe?.mauXe?.tenMau || 'N/A'}</p>
              <p style={{ margin: '5px 0' }}>• Biển số: <strong>{detail.xe?.bienSo || 'N/A'}</strong></p>
              <p style={{ margin: '5px 0' }}>• Hãng xe: {detail.xe?.mauXe?.hangXe?.tenHangXe || 'N/A'}</p>
              <p style={{ margin: '5px 0' }}>• Giá thuê/ngày: <strong>{formatCurrency(detail.xe?.mauXe?.giaThueNgay || 0)}</strong></p>
              <p style={{ margin: '5px 0' }}>• Thành tiền: <strong>{formatCurrency(detail.thanhTien || 0)}</strong></p>
            </div>
          ))}
        </div>
      </div>

      {/* Thời gian thuê */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          THỜI GIAN THUÊ:
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ margin: '8px 0' }}><strong>Ngày bắt đầu:</strong> {formatDate(order.ngayBatDau)}</p>
          <p style={{ margin: '8px 0' }}><strong>Ngày kết thúc:</strong> {formatDate(order.ngayKetThuc)}</p>
          <p style={{ margin: '8px 0' }}><strong>Số ngày thuê:</strong> {Math.ceil((new Date(order.ngayKetThuc) - new Date(order.ngayBatDau)) / (1000 * 60 * 60 * 24))} ngày</p>
          <p style={{ margin: '8px 0' }}><strong>Địa điểm nhận xe:</strong> {order.diaDiemNhanXe}</p>
        </div>
      </div>

      {/* Thông tin thanh toán */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          THÔNG TIN THANH TOÁN:
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ margin: '8px 0' }}><strong>Tổng tiền thuê:</strong> <span style={{ color: '#d73527', fontWeight: 'bold' }}>{formatCurrency(order.tongTien)}</span></p>
          {/* <p style={{ margin: '8px 0' }}><strong>Tiền đặt cọc:</strong> {formatCurrency(order.tongTienLandau)}</p>
          <p style={{ margin: '8px 0' }}><strong>Số tiền còn lại:</strong> <span style={{ color: '#d73527', fontWeight: 'bold' }}>{formatCurrency(order.soTienCanThanhToan)}</span></p>
          <p style={{ margin: '8px 0' }}><strong>Phương thức thanh toán:</strong> {order.phuongThucThanhToan}</p> */}
          <p style={{ margin: '8px 0' }}><strong>Trạng thái thanh toán:</strong> {paymentStatusMap[order.trangThaiThanhToan]}</p>
        </div>
      </div>

      {/* Điều khoản hợp đồng */}
      <div style={{ marginBottom: '25px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', textTransform: 'uppercase' }}>
          ĐIỀU KHOẢN HỢP ĐỒNG:
        </h3>
        <div style={{ paddingLeft: '20px' }}>
          <p style={{ margin: '8px 0' }}><strong>1.</strong> Bên B có trách nhiệm bảo quản xe trong thời gian thuê, không được tự ý sửa chữa hoặc thay đổi cấu trúc xe.</p>
          <p style={{ margin: '8px 0' }}><strong>2.</strong> Bên B phải trả xe đúng thời hạn và trong tình trạng như ban đầu (trừ hao mòn tự nhiên).</p>
          <p style={{ margin: '8px 0' }}><strong>3.</strong> Bên B chịu trách nhiệm về các vi phạm giao thông và tai nạn xảy ra trong thời gian thuê xe.</p>
          <p style={{ margin: '8px 0' }}><strong>4.</strong> Trường hợp xe bị hư hỏng, mất mát do lỗi của Bên B, Bên B phải bồi thường theo giá thị trường.</p>
          <p style={{ margin: '8px 0' }}><strong>5.</strong> Bên B không được cho thuê lại xe cho bên thứ ba mà không có sự đồng ý của Bên A.</p>
          <p style={{ margin: '8px 0' }}><strong>6.</strong> Hợp đồng có hiệu lực kể từ ngày ký và chấm dứt khi Bên B trả xe cho Bên A.</p>
          <p style={{ margin: '8px 0' }}><strong>7.</strong> Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng hoặc theo pháp luật Việt Nam.</p>
        </div>
      </div>

      {/* Cam kết */}
      <div style={{ marginBottom: '30px', textAlign: 'center', fontStyle: 'italic' }}>
        <p>Hai bên đã đọc kỹ hợp đồng, hiểu rõ quyền và nghĩa vụ của mình, đồng ý ký tên dưới đây.</p>
      </div>

      {/* Chữ ký */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '50px' }}>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>BÊN CHO THUÊ</p>
          <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '5px 0' }}>(Ký và ghi rõ họ tên)</p>
          <div style={{ height: '80px' }}></div>
          <p style={{ fontWeight: 'bold', borderTop: '1px solid #000', paddingTop: '5px' }}>
            MotoVip
          </p>
        </div>
        <div style={{ textAlign: 'center', width: '40%' }}>
          <p style={{ fontWeight: 'bold', fontSize: '16px' }}>BÊN THUÊ</p>
          <p style={{ fontSize: '14px', fontStyle: 'italic', margin: '5px 0' }}>(Ký và ghi rõ họ tên)</p>
          <div style={{ height: '80px' }}></div>
          <p style={{ fontWeight: 'bold', borderTop: '1px solid #000', paddingTop: '5px' }}>
            {order.khachHangName}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '12px', color: '#666' }}>
        <p>--- HẾT ---</p>
        <p>Hợp đồng được lập tại: TP. Hà Nôi</p>
        <p>Ngày: {moment().format('DD')} tháng {moment().format('MM')} năm {moment().format('YYYY')}</p>
      </div>
    </div>
  );
  
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
          <Button onClick={() => navigate(-1)} type="primary">
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
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            Quay lại
          </Button>
          <Title level={3} className="mb-0">
            Chi tiết đơn đặt xe #{id}
          </Title>
        </div>
        <Space>
          {/* Nút In hợp đồng */}
          <Button
            type="default"
            icon={<PrinterOutlined />}
            onClick={showContractPreview}
            disabled={order.trangThai === ORDER_STATUS.HUY}
          >
            In hợp đồng
          </Button>
          
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
            <>
              <Button
                type="primary"
                icon={<CarOutlined />}
                onClick={() => handleStatusChange(ORDER_STATUS.DANG_THUE)}
              >
                Giao xe
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
      
      {/* Modal preview hợp đồng */}
      <Modal
        title="Xem trước hợp đồng thuê xe"
        open={contractPreviewVisible}
        onCancel={() => setContractPreviewVisible(false)}
        width={900}
        style={{ top: 20 }}
        footer={[
          <Button key="back" onClick={() => setContractPreviewVisible(false)}>
            Đóng
          </Button>,
          <Button key="download" type="primary" icon={<PrinterOutlined />} onClick={generateContractPDF}>
            Tải xuống PDF
          </Button>
        ]}
      >
        <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
          <ContractContent />
        </div>
      </Modal>
      
      {/* Modal gia hạn đơn đặt */}
      <Modal
        title="Gia hạn đơn đặt xe"
        open={extendModalVisible}
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