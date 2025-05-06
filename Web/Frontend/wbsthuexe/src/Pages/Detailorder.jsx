import React, { useEffect, useState } from "react";
import { FaFaceSmileWink } from "react-icons/fa6";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import { useParams } from "react-router-dom";

function Detailorder() {
  const [userInfo, setUserInfo] = useState(null);
    const [order, setOrder] = useState(null);
      const { id } = useParams();  // Lấy giá trị của 'id' từ URL


  // Fetch thông tin đơn đặt xe qua ID
  const fetchOrder = async (id) => {
    try {
      const response = await ApiDonDat.getDonDatById(id); // Gọi API với ID
      setOrder(response.data.data); // Lưu dữ liệu đơn đặt xe vào state
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  // Fetch thông tin người dùng
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
    fetchOrder(id); // Gọi API với ID đơn đặt xe (ví dụ: 19)
  }, [id]);

  return (
    <>
      <div className="text-[#ffffff] h-[400px] bg-[#555555] flex items-center">
        <div className="w-[70%] items-start flex flex-col gap-5 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Thông tin đơn đặt xe</h1>
          <p className="text-xs md:text-xl flex gap-4 items-center font-semibold">
            Hello {userInfo?.hoTen}!!! <FaFaceSmileWink size={42} />
          </p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto shadow-lg mb-10 bg-white -mt-20 rounded text-ghi">
        <h2 className="text-2xl text-cam font-bold mb-6">Chi tiết đơn đặt xe</h2>

        {/* Thông tin đơn đặt */}
        <div className="mb-6 text-ghi">
          <div className="mb-4">
            <strong>Mã đơn đặt:</strong> {order?.donDatXeId}
          </div>
          <div className="mb-4">
            <strong>Khách hàng:</strong> {order?.khachHangName}
          </div>
          <div className="mb-4">
            <strong>Người xử lý:</strong> {order?.nguoiDungName}
          </div>
          <div className="mb-4">
            <strong>Ngày bắt đầu:</strong> {order?.ngayBatDau.slice(0, 10)}
          </div>
          <div className="mb-4">
            <strong>Ngày kết thúc:</strong> {order?.ngayKetThuc.slice(0, 10)}
          </div>
          <div className="mb-4">
            <strong>Địa điểm nhận xe:</strong> {order?.diaDiemNhanXe}
          </div>
          <div className="mb-4">
            <strong>Tổng tiền:</strong> {order?.tongTien.toLocaleString()} VNĐ
          </div>
          <div className="mb-4">
            <strong>Trạng thái:</strong> {order?.trangThai === 2 ? "Hoàn thành" : "Không xác định"}
          </div>
        </div>

        {/* Danh sách chi tiết xe */}
        <h2 className="text-2xl text-cam font-bold mb-6">Chi tiết xe</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-10">
            <thead>
                          <tr>
                                              <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>

                <th className="border border-gray-300 px-4 py-2">Biển số</th>
                <th className="border border-gray-300 px-4 py-2">Tên xe</th>
                <th className="border border-gray-300 px-4 py-2">Số ngày thuê</th>
                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order?.chiTiet?.map((detail) => (
                <tr key={detail.chiTietId}>
                <td className="border border-gray-300 px-4 py-2 text-center ">
                          
                          <img src={detail.xe.mauXe?.anhdefault} alt="" className="w-20 h-20 object-contain mx-auto" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.xe.bienSo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.xe.mauXe.tenMau}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.soNgayThue}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.thanhTien.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Detailorder;