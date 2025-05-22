import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Button, Tag, Typography, Input, Image, Badge, Tooltip, Spin, Empty, Space } from 'antd';
import { SearchOutlined, CalendarOutlined, ReloadOutlined,  } from '@ant-design/icons';
import { FaMotorcycle } from "react-icons/fa6";
import ApiXe from '../../Api/ApiXe';
import VehicleOrderModal from './VehicleOrderModal';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function XeRenting() {
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
    const [selectedXeId, setSelectedXeId] = useState(null);


  // Lấy danh sách xe đang cho thuê
  const fetchVehiclesRenting = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      const response = await ApiXe.getXeRenting(startDate, endDate);
      if (response.data.success) {
        setVehicles(response.data.data);
      } else {
        console.error('Failed to fetch renting vehicles:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching vehicles renting:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component mount hoặc khi thay đổi khoảng thời gian
  useEffect(() => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchVehiclesRenting(dateRange[0].startOf('day'), dateRange[1].endOf('day'));
    } else {
      fetchVehiclesRenting();
    }
  }, [dateRange]);

  // Mở modal xem lịch sử đơn đặt xe
  const showOrderModal = (xeId) => {
    setSelectedXeId(xeId);
    setIsOrderModalVisible(true);
  };

  // Làm mới dữ liệu
  const handleRefresh = () => {
    if (dateRange && dateRange[0] && dateRange[1]) {
      fetchVehiclesRenting(dateRange[0].startOf('day'), dateRange[1].endOf('day'));
    } else {
      fetchVehiclesRenting();
    }
  };

  // Lọc xe theo từ khóa tìm kiếm
  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.bienSo.toLowerCase().includes(searchText.toLowerCase()) ||
    vehicle.mauXe.tenMau.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình cột bảng
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
      render: (text) => (
        <Badge status="processing" color="blue">
          <span className="font-medium">{text}</span>
        </Badge>
      ),
    },
    {
      title: 'Tên xe',
      dataIndex: ['mauXe', 'tenMau'],
      key: 'tenMau',
    },
    {
      title: 'Hãng xe',
      dataIndex: ['mauXe', 'hangXeId'],
      key: 'hangXeId',
      render: (hangXeId) => {
        const hangXe = {
          1: 'Honda',
          2: 'Yamaha',
          3: 'Suzuki',
          4: 'Vinfast',
        };
        return hangXe[hangXeId] || 'Khác';
      },
    },
    {
      title: 'Loại xe',
      dataIndex: ['mauXe', 'loaiXeId'],
      key: 'loaiXeId',
      render: (loaiXeId) => {
        const loaiXe = {
          1: 'Xe tay ga',
          2: 'Xe số',
          3: 'Xe điện',
        };
        return loaiXe[loaiXeId] || 'Khác';
      },
    },
    {
      title: 'Giá thuê/ngày',
      dataIndex: ['mauXe', 'giaThueNgay'],
      key: 'giaThueNgay',
      render: (price) => `${price?.toLocaleString('vi-VN')} VNĐ`,
      sorter: (a, b) => a.mauXe.giaThueNgay - b.mauXe.giaThueNgay,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: () => <Tag color="blue"> Xe thuê</Tag>,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FaMotorcycle />}
          size="small"
          onClick={() => showOrderModal(record.xeId)}
        >
          Xem đơn thuê
        </Button>
      ),
    },
  ];

  return (
    <Card className="mt-6">
      <div className="mb-4 flex justify-between items-center">
        <Title level={3} className="flex items-center">
          <FaMotorcycle className="mr-2" /> Xe đang cho thuê
        </Title>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Tìm theo biển số, tên xe"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <RangePicker
            onChange={setDateRange}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
            allowClear
            className="w-64"
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
          </Tooltip>
        </div>
      </div>

      {dateRange && dateRange[0] && dateRange[1] && (
        <div className="mb-4">
          <Tag color="blue" icon={<CalendarOutlined />} className="px-3 py-1">
            Đang xem xe cho thuê từ {dateRange[0].format('DD/MM/YYYY')} đến {dateRange[1].format('DD/MM/YYYY')}
          </Tag>
        </div>
      )}

      {!dateRange && (
        <div className="mb-4">
          <Tag color="green" icon={<CalendarOutlined />} className="px-3 py-1">
            Đang xem xe đang cho thuê tại thời điểm hiện tại
          </Tag>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" />
          <span className="ml-3 text-gray-500">Đang tải danh sách xe...</span>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Empty 
          description={
            <Space direction="vertical" align="center">
              <span>Không có xe nào đang cho thuê</span>
              {dateRange && dateRange[0] && dateRange[1] && (
                <span className="text-gray-500">
                  trong khoảng thời gian từ {dateRange[0].format('DD/MM/YYYY')} đến {dateRange[1].format('DD/MM/YYYY')}
                </span>
              )}
            </Space>
          } 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredVehicles}
          rowKey="xeId"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Tổng ${total} xe đang cho thuê`,
          }}
          className="overflow-x-auto"
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>Tổng số xe đang cho thuê:</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} colSpan={3}>
                  <strong>{filteredVehicles.length}</strong> xe
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      )}

      {/* Modal danh sách đơn đặt xe */}
      <VehicleOrderModal
        visible={isOrderModalVisible}
        xeId={selectedXeId}
        onClose={() => setIsOrderModalVisible(false)}
      />
    </Card>
  );
}