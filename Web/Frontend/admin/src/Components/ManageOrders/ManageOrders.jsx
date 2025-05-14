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
  message,
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
import { toast } from "react-toastify";
import OrderDetailModal from "./OrderDetailModal";

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
  const getStatusTag = (status, ngayKetThuc) => {
    if (status === ORDER_STATUS.DANG_THUE && ngayKetThuc) {
      const endDate = moment(ngayKetThuc);
      const currentDate = moment();
      if (endDate.isBefore(currentDate)) {
        return <Tag color="red">Quá hạn</Tag>;
      }
    }
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      await ApiDonDat.updateDonDat(orderId, {
        trangThai: newStatus
      });

      toast.success(`Đã cập nhật trạng thái đơn hàng #${orderId} thành công`);
      fetchData();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi khi cập nhật trạng thái đơn hàng");
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
      render: (status, record) => getStatusTag(status, record.ngayKetThuc),
      filters: [
        { text: "Chờ xác nhận", value: ORDER_STATUS.CHO_XAC_NHAN },
        { text: "Đã xác nhận", value: ORDER_STATUS.DA_XAC_NHAN },
        { text: "Hoàn thành", value: ORDER_STATUS.HOAN_THANH },
        { text: "Đã hủy", value: ORDER_STATUS.HUY },
        { text: "Đang cho thuê", value: ORDER_STATUS.DANG_THUE },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
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

      <OrderDetailModal
        visible={detailModalVisible}
        order={selectedOrder}
        onClose={() => setDetailModalVisible(false)}
      />
    </Card>
  );
};

export default ManageOrders;