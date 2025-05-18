import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Descriptions, Row, Col, Spin, Tag, message, Table } from 'antd';
import moment from 'moment';
import ApiDonDat from '../../Api/ApiDonDat';

const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1,
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4,
};

const PAYMENT_STATUS = {
  0: <Tag color="red">Chưa thanh toán</Tag>,
  1: <Tag color="green">Đã thanh toán</Tag>,
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

const OrderDetailModal = ({ visible, order, onClose }) => {
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && order?.donDatXeId) {
      const fetchInvoiceDetails = async () => {
        setLoading(true);
        try {
          const response = await ApiDonDat.getDonDatById(order.donDatXeId);
          if (response.data.success) {
            setInvoiceDetails(response.data.data);
          } else {
            message.error("Không thể tải chi tiết hóa đơn");
          }
        } catch (error) {
          console.error("Error fetching invoice details:", error);
          message.error("Có lỗi khi tải chi tiết hóa đơn");
        } finally {
          setLoading(false);
        }
      };
      fetchInvoiceDetails();
    }
  }, [visible, order]);

  if (!order) return null;

  // Columns for chiTiet table
  const chiTietColumns = [
    {
      title: "Mã chi tiết",
      dataIndex: "chiTietId",
          key: "chiTietId",
          width: 80, // Thu nhỏ chiều rộng cột

      },
      {
        title: "Hình ảnh",
        dataIndex: ["xe", "mauXe", "anhdefault"],
        key: "anhdefault",
        render: (url) =>
          url ? (
            <img
              src={url}
              alt="Xe"
              style={{ width: 80, height: 80, objectFit: 'contain' }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/50?text=No+Image')}
            />
          ) : (
            <span>Không có ảnh</span>
          ),
      },
    {
      title: "Tên xe",
      dataIndex: ["xe", "mauXe", "tenMau"],
      key: "tenMau",
      },
      {
        title: "ảnh xe",
        dataIndex: ["xe", "mauXe", "tenMau"],
        key: "tenMau",
      },
    // {
    //   title: "Hãng xe",
    //   dataIndex: ["xe", "mauXe", "hangXeId"],
    //   key: "hangXeId",
    //   render: (hangXeId) => `Hãng ${hangXeId}` // Adjust based on actual hangXe data
    // },
    {
      title: "Biển số",
      dataIndex: ["xe", "bienSo"],
      key: "bienSo",
    },
    {
      title: "Số ngày thuê",
      dataIndex: "soNgayThue",
      key: "soNgayThue",
    },
    {
      title: "Thành tiền",
      dataIndex: "thanhTien",
      key: "thanhTien",
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
    },
  ];

  // Columns for hoaDonGiaHan table
  const hoaDonGiaHanColumns = [
    {
      title: "Mã hóa đơn gia hạn",
      dataIndex: "hoaDonGiaHanId",
      key: "hoaDonGiaHanId",
      },
    
    {
      title: "Ngày bắt đầu gia hạn",
      dataIndex: "ngayBatDauGiaHan",
      key: "ngayBatDauGiaHan",
      render: (text) => formatDate(text),
    },
    {
      title: "Ngày kết thúc gia hạn",
      dataIndex: "ngayKetThucGiaHan",
      key: "ngayKetThucGiaHan",
      render: (text) => formatDate(text),
    },
    {
      title: "Tổng tiền gia hạn",
      dataIndex: "tongTienGiaHan",
      key: "tongTienGiaHan",
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "trangThaiThanhToan",
      key: "trangThaiThanhToan",
      render: (status) => PAYMENT_STATUS[status] || <Tag color="default">Không xác định</Tag>,
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "phuongThucThanhToan",
      key: "phuongThucThanhToan",
      render: (text) => text || "N/A",
    },
  ];

  return (
    <Modal
      title={`Chi tiết đơn hàng #${order.donDatXeId}`}
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
        <div>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title="Thông tin cơ bản" bordered={false}>
                <Descriptions column={2}>
                  <Descriptions.Item label="Khách hàng">
                    {invoiceDetails?.khachHangName || order.khachHangName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Nhân viên">
                    {invoiceDetails?.nguoiDungName || order.nguoiDungName || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái">
                    {getStatusTag(invoiceDetails?.trangThai ?? order.trangThai)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">
                    {(invoiceDetails?.tongTien ?? order.tongTien)?.toLocaleString("vi-VN")} VNĐ
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày bắt đầu">
                    {formatDate(invoiceDetails?.ngayBatDau ?? order.ngayBatDau)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày kết thúc">
                    {formatDate(invoiceDetails?.ngayKetThuc ?? order.ngayKetThuc)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa điểm nhận xe">
                    {invoiceDetails?.diaDiemNhanXe ?? order.diaDiemNhanXe}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức thanh toán">
                    {invoiceDetails?.phuongThucThanhToan || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng thái thanh toán">
                    {invoiceDetails?.trangThaiThanhToan != null
                      ? PAYMENT_STATUS[invoiceDetails.trangThaiThanhToan]
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền lần đầu">
                    {invoiceDetails?.tongTienLandau
                      ? `${invoiceDetails.tongTienLandau.toLocaleString("vi-VN")} VNĐ`
                      : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số tiền cần thanh toán">
                    {invoiceDetails?.soTienCanThanhToan
                      ? `${invoiceDetails.soTienCanThanhToan.toLocaleString("vi-VN")} VNĐ`
                      : "N/A"}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Thông tin xe thuê" bordered={false}>
                {invoiceDetails?.chiTiet?.length > 0 ? (
                  <Table
                    columns={chiTietColumns}
                    dataSource={invoiceDetails.chiTiet}
                    rowKey="chiTietId"
                    pagination={false}
                  />
                ) : (
                  <p>Không có thông tin xe</p>
                )}
              </Card>
            </Col>

            {invoiceDetails?.hoaDonGiaHan?.length > 0 && (
              <Col span={24}>
                <Card title="Hóa đơn gia hạn" bordered={false}>
                  <Table
                    columns={hoaDonGiaHanColumns}
                    dataSource={invoiceDetails.hoaDonGiaHan}
                    rowKey="hoaDonGiaHanId"
                    pagination={false}
                  />
                </Card>
              </Col>
            )}

            {invoiceDetails?.ghiChu && (
              <Col span={24}>
                <Card title="Ghi chú" bordered={false}>
                  <p>{invoiceDetails.ghiChu}</p>
                </Card>
              </Col>
            )}
          </Row>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailModal;