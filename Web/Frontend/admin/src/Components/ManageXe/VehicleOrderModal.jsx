import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Spin, Tag, message } from 'antd';
import moment from 'moment';
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
      return <Tag color="default">Không xác định</Tag>;
  }
};

const formatDate = (dateString) => {
  return moment(dateString).format("DD/MM/YYYY HH:mm");
};

const VehicleOrderModal = ({ visible, xeId, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && xeId) {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await ApiDonDat.getalldondatbyidxe(xeId);
          if (response.data.success) {
            setOrders(response.data.data);
          } else {
            message.error("Không thể tải danh sách đơn đặt xe");
          }
        } catch (error) {
          console.error("Error fetching vehicle orders:", error);
          message.error("Có lỗi khi tải danh sách đơn đặt xe");
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [visible, xeId]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "donDatXeId",
      key: "donDatXeId",
      width: 80,
    },
    {
      title: "Khách hàng",
      dataIndex: "khachHangName",
      key: "khachHangName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "ngayBatDau",
      key: "ngayBatDau",
      render: (text) => formatDate(text),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "ngayKetThuc",
      key: "ngayKetThuc",
      render: (text) => formatDate(text),
    },
    {
      title: "Địa điểm nhận xe",
      dataIndex: "diaDiemNhanXe",
      key: "diaDiemNhanXe",
      ellipsis: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      render: (price) => `${price?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status) => getStatusTag(status),
    },
  ];

  return (
    <Modal
      title={`Danh sách đơn đặt xe cho xe #${xeId}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={1000}
    >
      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="donDatXeId"
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            showTotal: (total) => `Tổng ${total} đơn đặt xe`,
          }}
        />
      )}
    </Modal>
  );
};

export default VehicleOrderModal;