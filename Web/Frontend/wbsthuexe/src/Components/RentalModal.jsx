import React, { useEffect, useState } from "react";
import {  Modal } from "antd";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker"; // Thêm react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Thêm CSS
import { format } from "date-fns"; // Để định dạng ngày
import ApiPayment from "../api/ApiPayment";

const RentalModal = ({ visible, onOk, onCancel, data, pricePerDay1 }) => {
  const [user, setUser] = useState(null);
  const [rentalDate, setRentalDate] = useState(null); // Dùng null cho DatePicker
  const [returnDate, setReturnDate] = useState(null); // Dùng null cho DatePicker
  const [rentalLocation, setRentalLocation] = useState("");
  const pricePerDay = pricePerDay1 || 0;
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt"); // Giá trị mặc định là "Tiền mặt"

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
      let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days <= 0) days = 1; // Tối thiểu 1 ngày
      setTotalPrice(days * pricePerDay);
    }
  }, [rentalDate, returnDate, pricePerDay]);
  useEffect(() => {
    if (visible) {
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);
      setRentalDate(today);
      setReturnDate(tomorrow);
    }
  }, [visible]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleConfirm = async () => {
    if (!rentalDate || !returnDate || !rentalLocation) {
      toast.error(`Vui lòng nhập đủ thông tin`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    if (rentalDate >= returnDate) {
      toast.error(`Ngày trả xe phải lớn hơn ngày nhận xe`, {
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
      phuongThucThanhToan: paymentMethod,
      chiTiet: [
        {
          mauXeId: data.mauXeId,
          soNgayThue: days,
          thanhTien: totalPrice,
        },
      ],
    };

    try {
      const response= await ApiDonDat.addDonDatByToken(orderData);
      
      if (paymentMethod === "Chuyển khoản") {
        try {
          const response1 = await ApiPayment.payment(response.data.data.donDatXeId, response.data.data.tongTien);
          window.location.href = response1.data.paymentUrl;
        } catch (error) {
          console.error("Lỗi khi tạo đường dẫn thanh toán:", error);
        }
      
        
      }
      else
      toast(`Đã đặt đơn thành công`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
      });
    
      onOk();
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(`Đặt đơn thất bại: ${error.response.data.message}`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
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
                minDate={new Date()} // Ngày hiện tại
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
                minDate={new Date()} // Ngày trả xe phải lớn hơn ngày nhận xe
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
          <div className="flex justify-between">
            <div className="mb-4 ">
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
          </div>
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col gap-4">
              {/* Tùy chọn Tiền mặt */}
              <div
                onClick={() => setPaymentMethod("Tiền mặt")}
                className={`cursor-pointer flex items-center justify-between px-4 py-3 border rounded-lg ${
                  paymentMethod === "Tiền mặt"
                    ? "border-[#dd5c36] bg-[#fff5f0]"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2331/2331943.png"
                    alt="Tiền mặt"
                    className="w-8 h-8"
                  />
                  <span className="text-[#777777] font-semibold">Tiền mặt</span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Tiền mặt"
                  checked={paymentMethod === "Tiền mặt"}
                  readOnly
                  className="cursor-pointer"
                />
              </div>

              {/* Tùy chọn Chuyển khoản */}
              <div
                onClick={() => setPaymentMethod("Chuyển khoản")}
                className={`cursor-pointer flex items-center justify-between px-4 py-3 border rounded-lg ${
                  paymentMethod === "Chuyển khoản"
                    ? "border-[#dd5c36] bg-[#fff5f0]"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                    alt="Chuyển khoản"
                    className="w-10  h-10 object-contain"
                  />
                  <span className="text-[#777777] font-semibold">
                    VNPay Credit

                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Chuyển khoản"
                  checked={paymentMethod === "Chuyển khoản"}
                  readOnly
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RentalModal;
