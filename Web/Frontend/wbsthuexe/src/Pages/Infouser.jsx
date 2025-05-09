import React, {  useEffect, useState } from "react";
import { FaFaceSmileWink } from "react-icons/fa6";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import TableOrder from "../Components/Tableorder";

function Infouser() {
  const [userInfo, setUserInfo] = useState(null);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await ApiDonDat.getdondatbytoken();
      setOrders(response.data.data);
      // alert(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const fetchUserInfo = async () => {
    try {
      const response = await ApiKhachHang.getinfo();
      setUserInfo(response.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    fetchUserInfo();
    fetchOrders();
  }, []);



  return (
    <>
      <div className=" text-[#ffffff] h-[400px] bg-[#555555] flex items-center">
        <div className=" w-[70%] items-start flex flex-col  gap-5 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">
            {" "}
            Thông tin tài khoản
          </h1>
          <p className="text-xs md:text-xl flex gap-4 items-center font-semibold ">
            Hello Luyện!!! <FaFaceSmileWink size={42} />
          </p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto  shadow-lg mb-10  bg-white -mt-20   rounded  text-ghi">
        <h2 className="text-2xl text-cam font-bold mb-6">
          Xin chào {userInfo?.hoTen}
        </h2>

        {/* Thông tin cá nhân */}
        <div className="mb-6 text-ghi">
          <div className="mb-4">
            <strong>Họ tên:</strong> {userInfo?.hoTen}
          </div>
          <div className="mb-4">
            <strong>Email:</strong> {userInfo?.email}
          </div>
          <div className="mb-4">
            <strong>Số điện thoại:</strong> {userInfo?.soDienThoai}
          </div>
          <div className="mb-4">
            <strong>Địa chỉ:</strong> Phúc Tân hoàn kiếm hà nội
          </div>
        </div>
        {/* Các đơn đang thuê */}
        <h2 className="text-2xl font-bold text-cam mb-4">Đơn đang thuê</h2>
        {orders.filter((orders)=> orders.trangThai===4).length === 0 ? (
          <p>Không có đơn nào chờ xác nhận.</p>
        ) : (
          <TableOrder orders={orders.filter((order)=>order.trangThai===4)}/>
        )}
        {/* Các đơn đã xác nhận */}
        <h2 className="text-2xl font-bold text-cam mb-4">Đơn đã xác nhận</h2>
        {orders.filter((orders)=> orders.trangThai===1).length === 0 ? (
          <p>Không có đơn nào chờ xác nhận.</p>
        ) : (
          <TableOrder orders={orders.filter((order)=>order.trangThai===1)}/>
        )}
        
        {/* Các xe đang thuê */}
        <h2 className="text-2xl font-bold text-cam mb-4">Đơn chờ xác nhận</h2>
        {orders.filter((orders)=> orders.trangThai===0).length === 0 ? (
          <p>Không có đơn nào chờ xác nhận.</p>
        ) : (
          <TableOrder orders={orders.filter((order)=>order.trangThai===0)}/>
        )}

        {/* Lịch sử đặt xe */}
       
        {orders.filter((orders)=> orders.trangThai===2).length === 0 ? (
          <p></p>
        ) : (
            <> <h2 className="text-2xl font-bold text-cam mb-4">Lịch sử đặt xe</h2>
            <TableOrder orders={orders.filter((orders)=> orders.trangThai===2)} /></>
            
        )}
        
        {/* Các đơn đã hủy */}
        {orders.filter((orders)=> orders.trangThai===3).length === 0 ? (
          <></>
        ) : (
            <> <h2 className="text-2xl font-bold text-cam mb-4">Các đơn đã hủy</h2>
            <TableOrder orders={orders.filter((orders)=> orders.trangThai===3)} /></>
                   
        )}
      </div>
    </>
  );
}

export default Infouser;
