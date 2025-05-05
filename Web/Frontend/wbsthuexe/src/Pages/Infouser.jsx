import React, { use, useEffect, useState } from "react";
import { FaFaceSmileWink } from "react-icons/fa6";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";


function Infouser() {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const[orders,setOrders] = useState([]);
  
  const fetchOrders = async () => {
    try {
      const response = await ApiDonDat.getdondatbytoken();
      setOrders(response.data.data);
      // alert(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error); 
    }
  };

    const handleOrderClick = (orderId) => {
  setSelectedOrderId(orderId === selectedOrderId ? null : orderId); // Toggle hiển thị
    
  };
    const fetchUserInfo =async () => {
        try {
          const response = await ApiKhachHang.getinfo();
          setUserInfo(response.data.data);
          
        } catch (error) {
          
        }
    
      }
   useEffect(() => {
        
     fetchUserInfo();
     fetchOrders();
      },[])
  
 const rentedCars = [
  {
    id: "R001",
    carName: "Honda SH",
    startDate: "2025-04-25",
    endDate: "2025-04-30",
    status: "Đang thuê",
  },
  {
    id: "R002",
    carName: "Toyota Fortuner",
    startDate: "2025-04-20",
    endDate: "2025-04-25",
    status: "Đang thuê",
  },
];   

const orders1 = [
  {
    id: "DH001",
    carName: "Honda Vision",
    date: "2025-04-01",
    status: "Đã hoàn thành",
    details: "Chi tiết đơn hàng DH001: Xe Honda Vision, màu đỏ, thuê 3 ngày.",
  },
  {
    id: "DH002",
    carName: "Yamaha Sirius",
    date: "2025-04-15",
    status: "Đang xử lý",
    details: "Chi tiết đơn hàng DH002: Xe Yamaha Sirius, màu xanh, thuê 2 ngày.",
  },
  {
    id: "DH003",
    carName: "Toyota Camry",
    date: "2025-04-20",
    status: "Đã hủy",
    details: "Chi tiết đơn hàng DH003: Xe Toyota Camry, màu đen, thuê 5 ngày.",
  },
];
    return (
        <>
              <div className=' text-[#ffffff] h-[400px] bg-[#555555] flex items-center'  >
                <div className=' w-[70%] items-start flex flex-col  gap-5 mx-auto'>
                    <h1 className='text-2xl md:text-4xl font-bold'> Thông tin tài khoản</h1>
                    <p className='text-xs md:text-xl flex gap-4 items-center font-semibold '>Hello Luyện!!! <FaFaceSmileWink size={42} />
</p>
                </div>
            </div>
              <div className="p-6 max-w-4xl mx-auto  shadow-lg mb-10  bg-white -mt-10   rounded  text-ghi">
         
          <h2 className="text-2xl text-cam font-bold mb-6">Xin chào {userInfo?.hoTen }</h2>

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
                {/* Các xe đang thuê */}
<h2 className="text-2xl font-bold text-cam mb-4">Các xe đang thuê</h2>
{rentedCars.length === 0 ? (
  <p>Không có xe nào đang thuê.</p>
) : (
  <table className="w-full border-collapse border border-gray-300 mb-10 ">
    <thead>
      <tr>
        <th className="border border-gray-300 px-4 py-2">Mã thuê</th>
        <th className="border border-gray-300 px-4 py-2">Tên xe</th>
        <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu</th>
        <th className="border border-gray-300 px-4 py-2">Ngày kết thúc</th>
        <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
      </tr>
    </thead>
    <tbody>
      {orders?.map((car) => (
        <tr key={car.id}>
          <td className="border border-gray-300 px-4 py-2">{car.donDatXeId}</td>
          <td className="border border-gray-300 px-4 py-2">{car.ngayBatDau}</td>
          <td className="border border-gray-300 px-4 py-2">{car.ngayKetThuc}</td>
          <td className="border border-gray-300 px-4 py-2">{car.tongTien}</td>
          <td className="border border-gray-300 px-4 py-2">{car.trangThai}</td>
        </tr>
      ))}
    </tbody>
  </table>
)}

      {/* Lịch sử đặt xe */}
      <h2 className="text-2xl font-bold text-cam mb-4">Lịch sử đặt xe</h2>
      {orders.length === 0 ? (
        <p>Không có đơn đặt xe nào.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Mã đơn</th>
              <th className="border border-gray-300 px-4 py-2">Tên xe</th>
              <th className="border border-gray-300 px-4 py-2">Ngày đặt</th>
              <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
  {orders.map((order) => (
    <React.Fragment key={order.id}>
      <tr
        className="cursor-pointer hover:bg-gray-100"
        onClick={() => handleOrderClick(order.id)}
      >
        <td className="border border-gray-300 px-4 py-2">{order.id}</td>
        <td className="border border-gray-300 px-4 py-2">{order.carName}</td>
        <td className="border border-gray-300 px-4 py-2">{order.date}</td>
        <td className="border border-gray-300 px-4 py-2">{order.status}</td>
      </tr>
      {selectedOrderId === order.id && (
        <tr>
          <td
            colSpan="4"
            className="border border-gray-300 px-4 py-2 bg-gray-50 text-left"
          >
            {order.details}
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
        </table>
      )}
    </div>
      </>
    
  );
}

export default Infouser;