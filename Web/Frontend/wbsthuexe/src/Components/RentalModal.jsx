import React, { useEffect, useState } from "react";
import { message, Modal } from "antd";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker"; // Thêm react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Thêm CSS
import { format } from "date-fns"; // Để định dạng ngày

const RentalModal = ({
  visible,
  onOk,
  onCancel,
  data,
  pricePerDay1,
}) => {
  const [user, setUser] = useState(null);
  const [rentalDate, setRentalDate] = useState(null); // Dùng null cho DatePicker
  const [returnDate, setReturnDate] = useState(null); // Dùng null cho DatePicker
  const [rentalLocation, setRentalLocation] = useState("");
  const pricePerDay = pricePerDay1 || 0;
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiKhachHang.getinfo();
      setUser(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  // Tính tổng tiền dựa trên số ngày thuê
  useEffect(() => {
    if (rentalDate && returnDate) {
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      const days = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 0);
      setTotalPrice(days * pricePerDay);
    }
  }, [rentalDate, returnDate, pricePerDay]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleConfirm = async () => {
    if (!rentalDate || !returnDate || !rentalLocation) {
      toast(`Vui lòng nhập đủ thông tin`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    if (rentalDate >= returnDate) {
      toast(`Ngày trả xe phải lớn hơn ngày nhận xe`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    const startDate = new Date(rentalDate);
    const endDate = new Date(returnDate);
    const days = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 0);

    const orderData = {
      nguoiDungId: 1,
      ngayBatDau: format(rentalDate, "yyyy-MM-dd") + "T08:00:00",
      ngayKetThuc: format(returnDate, "yyyy-MM-dd") + "T18:00:00",
      tongTien: totalPrice,
      trangThai: 0,
      diaDiemNhanXe: rentalLocation,
      chiTiet: [
        {
          mauXeId: data.mauXeId,
          soNgayThue: days,
          thanhTien: totalPrice,
        },
      ],
    };

    try {
      await ApiDonDat.addDonDatByToken(orderData);
      toast(`Đã đặt đơn thành công`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 500,
      });
      message.success("Đơn đặt xe đã được thêm thành công!");
      onOk();
    } catch (error) {
      console.error("Lỗi khi thêm đơn đặt xe:", error);
      toast(`Đặt đơn thất bại: ${error.response.data.message}`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 500,
      });
    }
  };

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
          onClick={handleConfirm}
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
              <DatePicker
                selected={rentalDate}
                onChange={(date) => setRentalDate(date)}
                dateFormat="dd/MM/yyyy" // Định dạng DD/MM/YYYY
                placeholderText="Chọn ngày nhận xe"
                className="w-full px-3 py-2 border rounded-lg text-[#777777]"
                required
              />
            </div>
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Ngày trả xe <span className="text-red-500">*</span>
              </label>
              <DatePicker
                selected={returnDate}
                onChange={(date) => setReturnDate(date)}
                dateFormat="dd/MM/yyyy" // Định dạng DD/MM/YYYY
                placeholderText="Chọn ngày trả xe"
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