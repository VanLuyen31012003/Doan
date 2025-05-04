import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import ApiKhachHang from "../api/ApiKhachHang";

const RentalModal = ({
  visible,
  onOk,
  onCancel,
   
  pricePerDay1, // Giá thuê xe 1 ngày (truyền từ component cha)
}) => {
    const [user, setUser] = useState(null);
    const [rentalDate, setRentalDate] = useState(""); // Ngày nhận xe
    const[ returnDate,setReturnDate] = useState(); // Ngày trả xe
    const [rentalLocation,setRentalLocation] = useState(""); // Địa điểm nhận xe
    const pricePerDay = pricePerDay1 || 0; // Giá thuê xe 1 ngày
  const [totalPrice, setTotalPrice] = useState(0); // Tổng tiền

  const fetchUserInfo = async () => {
    try {
      const response = await ApiKhachHang.getinfo();
      setUser(response.data.data);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  // Tính tổng tiền dựa trên số ngày thuê
  useEffect(() => {
    if (rentalDate && returnDate) {
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      const days = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 0); // Tính số ngày thuê
      setTotalPrice(days * pricePerDay); // Tổng tiền = số ngày * giá thuê 1 ngày
    }
  }, [rentalDate, returnDate, pricePerDay]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <button
          key="cancel"
          onClick={onCancel}
          className="bg-gray-300 rounded px-4 py-2 hover:bg-gray-400 ml-2"
        >
          Hủy
        </button>,
        <button
          key="confirm"
          type="primary"
          onClick={onOk}
          className="bg-[#dd5c36] px-4 py-2 rounded hover:bg-cam hover:scale-110 ml-6 text-white"
        >
          Xác nhận
        </button>,
      ]}
    >
      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#DD5C36]">
          Nhập thông tin thuê xe
        </h2>

        <form>
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Địa điểm nhận xe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={rentalLocation}
              onChange={(e) => setRentalLocation(e.target.value)}
              placeholder="Nhập địa điểm nhận xe"
              className="w-full px-3 py-2 border rounded-lg text-[#777777]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Ngày nhận xe <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-[#777777]"
                required
              />
            </div>
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Ngày trả xe <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-[#777777]"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Số điện thoại 
            </label>
            <input
              type="tel"
              value={user?.soDienThoai || ""}
              placeholder="Nhập số điện thoại"
              className="w-full px-3 py-2 border rounded-lg text-[#777777]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Họ tên bạn
            </label>
            <input
              type="text"
              value={user?.hoTen || ""}
              placeholder="Nhập họ và tên"
              className="w-full px-3 py-2 border rounded-lg text-[#777777]"
            />
          </div>

          {/* Hiển thị giá tiền */}
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Giá thuê xe 1 ngày
            </label>
            <p className="text-lg font-semibold text-[#DD5C36]">
              {pricePerDay.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Tổng tiền
            </label>
            <p className="text-lg font-semibold text-[#DD5C36]">
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RentalModal;