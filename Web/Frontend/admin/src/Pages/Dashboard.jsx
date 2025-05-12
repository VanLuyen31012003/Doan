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
import { useNavigate } from 'react-router-dom';
import ManageMauxe from '../Components/ManageMauXe/ManageMauxe';
import ManageOrders from '../Components/ManageOrders/ManageOrders';
import ManageMoney from '../Components/ManageMoney/ManageMoney';
import { removeToken } from '../Lib/authenticate';
import ManageUsers from '../Components/ManageUsers/ManageUsers';

const { Header, Sider, Content } = Layout;

// Các component nội dung
const DashboardContent = () => (
  <div>
    <h3>Dashboard Overview</h3>
    <p>Thống kê và báo cáo tổng quan</p>
  </div>
);



const UsersContent = () => (
  <div>
    <h3>Quản lý người dùng</h3>
    <p>Danh sách người dùng và thông tin tài khoản</p>
  </div>
);
const Dashboard = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();
  const logout = () => {
    // Xử lý đăng xuất tại đây
    removeToken(); // Xóa token khỏi localStorage
    navigate('/');
  };

  // Xử lý khi click menu
  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  // Render nội dung tương ứng với menu được chọn
  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <DashboardContent />;
      case 'vehicles':
        return <ManageMauxe />;
      case 'users':
        return <ManageUsers />;
      case 'orders':
        return <ManageOrders />;
      case 'xe':
        return <ManageMauxe />;
      case 'doanhthu':
        return <ManageMoney />;
      default:
        return <DashboardContent />;
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
          defaultSelectedKeys={[selectedKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="dashboard" icon={<MdDashboard />
}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="vehicles" icon={<FaMotorcycle />
}>
            Quản lý mẫu xe
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
          <Menu.Item key="orders"  icon={<RiBillLine />
}>
            Đơn thuê xe
          </Menu.Item>
          <Menu.Item key="xe"  icon={<FileOutlined />}>
            Quản lý xe
          </Menu.Item>
          <Menu.Item key="doanhthu"  icon={<FaMoneyBill />}>
            Quản lý doanh thu
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung */}
      <Layout>
        <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }}>
          <div className='flex justify-between px-6 items-center' >
            <h2 className="font-bold ">Trang quản trị MotoVip</h2>
            <Button className='hover:bg-blue-600 bg-blue-600 text-white'
              onClick={logout}
              style={{ marginLeft: 'auto' }}
            > Đăng xuất</Button>
          </div>
          
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;