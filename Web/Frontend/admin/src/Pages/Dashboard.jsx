import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import {
  UserOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { FaMotorcycle } from "react-icons/fa6";
import { FaMoneyBill } from "react-icons/fa";
import { RiBillLine } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ManageMauxe from '../Components/ManageMauXe/ManageMauxe';
import ManageOrders from '../Components/ManageOrders/ManageOrders';
import ManageMoney from '../Components/ManageMoney/ManageMoney';
import { removeToken } from '../Lib/authenticate';
import ManageUsers from '../Components/ManageUsers/ManageUsers';
import ManageXe from '../Components/ManageXe/ManageXe';
import ManageChat from '../Components/ManageChart/MangageChat';
import DetailOrder from '../Components/DetailOrder/DetailOrder';
import ManageKhachHang from '../Components/ManageKhachHang/ManageKhachHang';
import InfoKhachHang from '../Components/ManageKhachHang/InfoKhachHang';

const { Header, Sider, Content } = Layout;

// Các component nội dung


const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy key từ đường dẫn hiện tại
  const getSelectedKeyFromPath = () => {
    const path = location.pathname;
    if (path.includes('/dashboard/mauxe')) return 'vehicles';
    if (path.includes('/dashboard/users')) return 'users';
    if (path.includes('/dashboard/orders')) return 'orders';
    if (path.includes('/dashboard/xe')) return 'xe';
    if (path.includes('/dashboard/khachang')) return 'customer';
    if (path.includes('/dashboard/doanhthu')) return 'doanhthu';
    return 'dashboard'; // Default
  };
  
  const [selectedKey, setSelectedKey] = useState(getSelectedKeyFromPath);
  
  const logout = () => {
    // Xử lý đăng xuất tại đây
    removeToken(); // Xóa token khỏi localStorage
    navigate('/');
  };

  // Xử lý khi click menu
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    switch (e.key) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'vehicles':
        navigate('/dashboard/mauxe');
        break;
      case 'users':
        navigate('/dashboard/users');
        break;
      case 'orders':
        navigate('/dashboard/orders');
        break;
      case 'xe':
        navigate('/dashboard/xe');
        break;
      case 'doanhthu':
        navigate('/dashboard/doanhthu');
        break;
        case 'customer':
          navigate('/dashboard/khachang');
          break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="80">
        <div className="logo" style={{ height: 32, margin: 16, color: '#fff' }}>
          🚀 MotoVip
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dashboard" icon={<MdDashboard />}>
            Chat
          </Menu.Item>
          <Menu.Item key="vehicles" icon={<FaMotorcycle />}>
            Quản lý mẫu xe
          </Menu.Item>
          <Menu.Item key="customer" icon={<UserOutlined />}>
            Quản lý khách hàng
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
          <Menu.Item key="orders" icon={<RiBillLine />}>
            Đơn thuê xe
          </Menu.Item>
          <Menu.Item key="xe" icon={<FileOutlined />}>
            Quản lý xe
          </Menu.Item>
          <Menu.Item key="doanhthu" icon={<FaMoneyBill />}>
            Quản lý doanh thu
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }}>
          <div className='flex justify-between px-6 items-center'>
            <h2 className="font-bold">Trang quản trị MotoVip</h2>
            <Button 
              className='hover:bg-blue-600 bg-blue-600 text-white'
              onClick={logout}
            >
              Đăng xuất
            </Button>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Routes>
              <Route path="/" element={<ManageChat />} />
              <Route path="/mauxe" element={<ManageMauxe />} />
              <Route path="/khachang" element={<ManageKhachHang />} />
              <Route path="/khachang/:id" element={<InfoKhachHang />} />
              <Route path="/users" element={<ManageUsers />} />
              <Route path="/orders" element={<ManageOrders />} />
              <Route path="/xe" element={<ManageXe />} />
              <Route path="/doanhthu" element={<ManageMoney />} />
              <Route path="/orders/:id" element={<DetailOrder />} />
              <Route path="*" element={<ManageChat />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;