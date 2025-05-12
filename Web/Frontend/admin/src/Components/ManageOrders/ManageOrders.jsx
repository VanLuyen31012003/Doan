import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Typography,
  Card,
  Input,
  DatePicker,
  Modal,
  Descriptions,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import {
  SearchOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  CarOutlined,
} from "@ant-design/icons";
import moment from "moment";
import ApiDonDat from "../../Api/ApiDonDat";

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Định nghĩa trạng thái đơn hàng
const ORDER_STATUS = {
  CHO_XAC_NHAN: 0,
  DA_XAC_NHAN: 1,
  HOAN_THANH: 2,
  HUY: 3,
  DANG_THUE: 4,
};

const ManageOrders = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Hàm lấy dữ liệu từ API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await ApiDonDat.getAllDonDat();
      if (response.data.success) {
        const orderData = response.data.data;
        setOrders(orderData);
        setFilteredOrders(orderData);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Hàm xử lý trạng thái đơn hàng
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

  // Định dạng ngày tháng
  const formatDate = (dateString) => {
    return moment(dateString).format("DD/MM/YYYY HH:mm");
  };

  // Xử lý tìm kiếm
  useEffect(() => {
    let result = orders;

    // Lọc theo từ khóa
    if (searchText) {
      result = result.filter(
        (order) =>
          order.khachHangName
            ?.toLowerCase()
            .includes(searchText.toLowerCase()) ||
          order.diaDiemNhanXe?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo khoảng thời gian
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");

      result = result.filter((order) => {
        const orderStartDate = moment(order.ngayBatDau);
        return orderStartDate.isBetween(startDate, endDate, null, "[]");
      });
    }

    // Lọc theo trạng thái
    if (statusFilter !== null) {
      result = result.filter((order) => order.trangThai === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchText, dateRange, statusFilter, orders]);

  // Hàm xử lý thay đổi trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    setConfirmLoading(true);
    try {
      // Thay thế bằng API thực tế của bạn
      // const response = await ApiDonDat.updateOrderStatus(orderId, newStatus);
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      message.success(`Đã cập nhật trạng thái đơn hàng #${orderId} thành công`);
      fetchData(); // Làm mới dữ liệu sau khi cập nhật
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Có lỗi khi cập nhật trạng thái đơn hàng");
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hiển thị modal chi tiết đơn hàng
  const showOrderDetail = (order) => {
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  // Các cột của bảng
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
      title: "Nhân viên",
      dataIndex: "nguoiDungName",
      key: "nguoiDungName",
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
      title: "Địa điểm",
      dataIndex: "diaDiemNhanXe",
      key: "diaDiemNhanXe",
      ellipsis: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "tongTien",
      key: "tongTien",
      render: (price) => `${price?.toLocaleString("vi-VN")} VNĐ`,
      sorter: (a, b) => a.tongTien - b.tongTien,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status) => getStatusTag(status),
      filters: [
        { text: "Chờ xác nhận", value: ORDER_STATUS.CHO_XAC_NHAN },
        { text: "Đã xác nhận", value: ORDER_STATUS.DA_XAC_NHAN },
        { text: "Hoàn thành", value: ORDER_STATUS.HOAN_THANH },
        { text: "Đã hủy", value: ORDER_STATUS.HUY },
        { text: "Đang cho thuê", value: ORDER_STATUS.DANG_THUE },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    // Sửa lại phần render Actions trong column definitions
    {
      title: "Thao tác",
      key: "action",
      width: 180, // Thêm độ rộng cố định cho cột
      render: (_, record) => (
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showOrderDetail(record)}
            style={{ width: "100%" }}
          >
            Chi tiết
          </Button>

          {record.trangThai === ORDER_STATUS.CHO_XAC_NHAN && (
            <>
              <Button
                type="primary"
                size="small"
                className="bg-green-500"
                icon={<CheckCircleOutlined />}
                onClick={() =>
                  handleStatusChange(
                    record.donDatXeId,
                    ORDER_STATUS.DA_XAC_NHAN
                  )
                }
                loading={confirmLoading}
                style={{ width: "100%" }}
              >
                Xác nhận
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() =>
                  handleStatusChange(record.donDatXeId, ORDER_STATUS.HUY)
                }
                loading={confirmLoading}
                style={{ width: "100%" }}
              >
                Hủy
              </Button>
            </>
          )}

          {record.trangThai === ORDER_STATUS.DA_XAC_NHAN && (
            <Button
              type="default"
              size="small"
              icon={<CarOutlined />}
              onClick={() =>
                handleStatusChange(record.donDatXeId, ORDER_STATUS.DANG_THUE)
              }
              loading={confirmLoading}
              style={{ width: "100%" }}
            >
              Giao xe
            </Button>
          )}

          {record.trangThai === ORDER_STATUS.DANG_THUE && (
            <Button
              type="default"
              size="small"
              onClick={() =>
                handleStatusChange(record.donDatXeId, ORDER_STATUS.HOAN_THANH)
              }
              loading={confirmLoading}
              style={{ width: "100%" }}
            >
              Hoàn thành
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Modal chi tiết đơn hàng
  const OrderDetailModal = ({ visible, order, onClose }) => {
    if (!order) return null;

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
        width={800}
      >
        {order ? (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Thông tin cơ bản" bordered={false}>
                  <Descriptions column={2}>
                    <Descriptions.Item label="Khách hàng">
                      {order.khachHangName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nhân viên">
                      {order.nguoiDungName || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {getStatusTag(order.trangThai)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                      {order.tongTien?.toLocaleString("vi-VN")} VNĐ
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày bắt đầu">
                      {formatDate(order.ngayBatDau)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày kết thúc">
                      {formatDate(order.ngayKetThuc)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa điểm nhận xe">
                      {order.diaDiemNhanXe}
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa điểm trả xe">
                      {order.diaDiemTraXe || "Như địa điểm nhận"}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              <Col span={24}>
                <Card title="Thông tin xe thuê" bordered={false}>
                  {order.mauXeName ? (
                    <Descriptions column={2}>
                      <Descriptions.Item label="Tên xe">
                        {order.mauXeName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Hãng xe">
                        {order.hangXeName}
                      </Descriptions.Item>
                      <Descriptions.Item label="Biển số">
                        {order.bienSo || "N/A"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Số ngày thuê">
                        {order.soNgayThue || "N/A"}
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <p>Không có thông tin xe</p>
                  )}
                </Card>
              </Col>

              {order.ghiChu && (
                <Col span={24}>
                  <Card title="Ghi chú" bordered={false}>
                    <p>{order.ghiChu}</p>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        )}
      </Modal>
    );
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Quản lý đơn đặt xe</Title>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm kiếm khách hàng, địa điểm"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <RangePicker
            onChange={(value) => setDateRange(value)}
            placeholder={["Từ ngày", "Đến ngày"]}
            format="DD/MM/YYYY"
          />
          <select
            className="border rounded p-2"
            onChange={(e) =>
              setStatusFilter(
                e.target.value === "" ? null : Number(e.target.value)
              )
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value={ORDER_STATUS.CHO_XAC_NHAN}>Chờ xác nhận</option>
            <option value={ORDER_STATUS.DA_XAC_NHAN}>Đã xác nhận</option>
            <option value={ORDER_STATUS.HOAN_THANH}>Hoàn thành</option>
            <option value={ORDER_STATUS.HUY}>Đã hủy</option>
            <option value={ORDER_STATUS.DANG_THUE}>Đang cho thuê</option>
          </select>
          <Button type="primary" onClick={fetchData} loading={loading}>
            Làm mới
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Space size="large">
          <Tag color="blue">
            {
              orders.filter((o) => o.trangThai === ORDER_STATUS.CHO_XAC_NHAN)
                .length
            }{" "}
            đơn chờ xác nhận
          </Tag>
          <Tag color="orange">
            {
              orders.filter((o) => o.trangThai === ORDER_STATUS.DA_XAC_NHAN)
                .length
            }{" "}
            đơn đã xác nhận
          </Tag>
          <Tag color="purple">
            {
              orders.filter((o) => o.trangThai === ORDER_STATUS.DANG_THUE)
                .length
            }{" "}
            đơn đang cho thuê
          </Tag>
          <Tag color="green">
            {
              orders.filter((o) => o.trangThai === ORDER_STATUS.HOAN_THANH)
                .length
            }{" "}
            đơn hoàn thành
          </Tag>
          <Tag color="red">
            {orders.filter((o) => o.trangThai === ORDER_STATUS.HUY).length} đơn
            đã hủy
          </Tag>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="donDatXeId"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
          showTotal: (total) => `Tổng ${total} đơn đặt xe`,
        }}
      />

      {/* Modal chi tiết đơn hàng */}
      <OrderDetailModal
        visible={detailModalVisible}
        order={selectedOrder}
        onClose={() => setDetailModalVisible(false)}
      />
    </Card>
  );
};

export default ManageOrders;
