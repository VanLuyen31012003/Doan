import React, { useState, useEffect } from 'react';
import { Modal, Table, Tag, Button, Spin, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { EyeOutlined } from '@ant-design/icons';
import ApiDonDat from '../../Api/ApiDonDat';

const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1,
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4,
};

const getStatusTag = (status) => {
  switch (status) {
    case ORDER_STATUS.CHO_XAC_NHAN:
      return <Tag color="blue">Chờ xác nhận</Tag>;
    case ORDER_STATUS.DA_XAC_NHAN:
      return <Tag color="orange">Đã xác nhận</Tag>;
    case ORDER_STATUS.HOAN_THANH:
      return <Tag color="green">Hoàn thành</Tag>;
    case ORDER_STATUS.HUY:
      return <Tag color="red">Đã hủy</Tag>;
    case ORDER_STATUS.DANG_THUE:
      return <Tag color="purple">Đang cho thuê</Tag>;
    default:
      return <Tag>Không xác định</Tag>;
  }
};

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

const VehicleOrderModal = ({ visible, xeId, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Thêm navigate hook

  useEffect(() => {
    if (visible && xeId) {
      fetchOrders();
    }
  }, [visible, xeId]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ApiDonDat.getalldondatbyidxe(xeId);
      if (response.data.success) {
        setOrders(response.data.data || []);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm để điều hướng đến trang chi tiết đơn hàng
  const goToOrderDetail = (orderId) => {
    onClose(); // Đóng modal trước khi chuyển hướng
    navigate(`/dashboard/orders/${orderId}`);
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: 'donDatXeId',
      key: 'donDatXeId',
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
      render: (text) => formatDate(text),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'ngayKetThuc',
      key: 'ngayKetThuc',
      render: (text) => formatDate(text),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => goToOrderDetail(record.donDatXeId)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Các đơn đặt xe ${xeId ? `#${xeId}` : ''}`}
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="back" onClick={onClose}>
          Đóng
        </Button>
      ]}
    >
      {loading ? (
        <div className="text-center py-5">
          <Spin />
          <div className="mt-2">Đang tải dữ liệu...</div>
        </div>
      ) : orders.length === 0 ? (
        <Empty description="Không tìm thấy đơn đặt xe nào" />
      ) : (
        <Table 
          columns={columns} 
          dataSource={orders} 
          rowKey="donDatXeId" 
          pagination={false}
          onRow={(record) => ({
            onClick: () => goToOrderDetail(record.donDatXeId),
            style: { cursor: 'pointer' } // Thêm style để hiển thị cursor pointer khi hover
          })}
        />
      )}
    </Modal>
  );
};

export default VehicleOrderModal;