import React, { useEffect, useState } from "react";
import { FaFaceSmileWink } from "react-icons/fa6";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import TableOrder from "../Components/Tableorder";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import Recomendbyhistory from "../Components/Recomendbyhistory";

function Infouser() {
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await ApiDonDat.getdondatbytoken();
      setOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchUserInfo = async () => {
    try {
      const response = await ApiKhachHang.getinfo();
      setUserInfo(response.data.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  
  useEffect(() => {
    fetchUserInfo();
    fetchOrders();
  }, []);

  // // Hàm để hiển thị trạng thái đơn hàng dạng text
  // const getOrderStatusText = (status) => {
  //   switch (status) {
  //     case 0: return "Chờ xác nhận";
  //     case 1: return "Đã xác nhận";
  //     case 2: return "Đã hoàn thành";
  //     case 3: return "Đã hủy";
  //     case 4: return "Đang thuê";
  //     default: return "Không xác định";
  //   }
  // };

  return (
    <>
      <div className="text-[#ffffff] h-[400px] bg-[#555555] flex items-center">
        <div className="w-[70%] items-start flex flex-col gap-5 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">
            Thông tin tài khoản
          </h1>
          <p className="text-xs md:text-xl flex gap-4 items-center font-semibold">
            Hello {userInfo?.hoTen}!!! <FaFaceSmileWink size={42} />
          </p>
        </div>
      </div>
      
      <div className="p-6 max-w-5xl mx-auto shadow-lg mb-10 bg-white -mt-20 rounded text-ghi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-[#dd5c36] font-bold">
            Xin chào {userInfo?.hoTen}
          </h2>
          <Link 
            to="/edit-profile" 
            className="flex items-center gap-2 bg-[#dd5c36] text-white px-4 py-2 rounded-md hover:bg-[#c14021] transition-colors"
          >
            <FaUserEdit /> Cập nhật thông tin
          </Link>
        </div>

        {/* Thông tin cá nhân */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
            Thông tin cá nhân
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <span className="font-bold text-gray-700 block mb-1">Họ tên:</span> 
              <span className="text-gray-800">{userInfo?.hoTen || "Chưa cập nhật"}</span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 block mb-1">Email:</span> 
              <span className="text-gray-800">{userInfo?.email || "Chưa cập nhật"}</span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 block mb-1">Số điện thoại:</span> 
              <span className="text-gray-800">{userInfo?.soDienThoai || "Chưa cập nhật"}</span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 block mb-1">Địa chỉ:</span> 
              <span className="text-gray-800">{userInfo?.diaChi || "Chưa cập nhật"}</span>
            </div>
            <div className="mb-4">
              <span className="font-bold text-gray-700 block mb-1">Số CCCD:</span> 
              <span className="text-gray-800">{userInfo?.soCccd || "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>
        
        {/* Hiển thị thông báo nếu không có đơn hàng */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dd5c36] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-gray-500 text-lg">Bạn chưa có đơn đặt xe nào</div>
            <Link to="/products" className="mt-4 inline-block bg-[#dd5c36] text-white px-6 py-2 rounded-md hover:bg-[#c14021] transition-colors">
              Thuê xe ngay
            </Link>
          </div>
        ) : (
          <>
            {/* Các đơn đang thuê */}
            {orders.filter((order) => order.trangThai === 4).length > 0 && (
              <TableOrder orders={orders.filter((order) => order.trangThai === 4)} name="Đơn đang thuê" />
            )}
            
            {/* Các đơn đã xác nhận */}
            {orders.filter((order) => order.trangThai === 1).length > 0 && (
              <TableOrder orders={orders.filter((order) => order.trangThai === 1)} name="Đơn đã xác nhận" />
            )}
            
            {/* Các đơn chờ xác nhận */}
            {orders.filter((order) => order.trangThai === 0).length > 0 && (
              <TableOrder orders={orders.filter((order) => order.trangThai === 0)} name="Đơn chờ xác nhận" />
            )}
            
            {/* Lịch sử đặt xe */}
            {orders.filter((order) => order.trangThai === 2).length > 0 && (
              <TableOrder orders={orders.filter((order) => order.trangThai === 2)} name="Lịch sử đặt xe" />
            )}
            
            {/* Các đơn đã hủy */}
            {orders.filter((order) => order.trangThai === 3).length > 0 && (
              <TableOrder orders={orders.filter((order) => order.trangThai === 3)} name="Các đơn đã hủy" />
            )}
          </>
        )}
      </div>
       {/* Chỉ render khi userInfo đã có dữ liệu */}
       {userInfo && <Recomendbyhistory data={userInfo.id} />}
    

    </>
  );
}

export default Infouser;