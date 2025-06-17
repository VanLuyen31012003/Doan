import React, { useEffect, useState } from "react";
import { Modal, Spin } from "antd";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ApiPayment from "../api/ApiPayment";

const RentalModal = ({ visible, onOk, onCancel, data, pricePerDay1 }) => {
  const [user, setUser] = useState(null);
  const [rentalDate, setRentalDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [rentalLocation, setRentalLocation] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false); // Thêm loading state
  
  const pricePerDay = pricePerDay1 || 0;

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
      if (days <= 0) days = 1;
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
      // Reset loading khi mở modal
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // Reset form khi đóng modal
  const resetForm = () => {
    setRentalLocation("");
    setPaymentMethod("Tiền mặt");
    setLoading(false);
  };

  const handleCancel = () => {
    if (!loading) { // Chỉ cho phép cancel khi không loading
      resetForm();
      onCancel();
    }
  };

  const handleConfirm = async () => {
    // Prevent double click
    if (loading) {
      toast.warning("Đang xử lý đơn hàng, vui lòng chờ...", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    // Validation
    if (!rentalDate || !returnDate || !rentalLocation) {
      toast.error(`Vui lòng nhập đủ thông tin`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-red-500 text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (rentalDate >= returnDate) {
      toast.error(`Ngày trả xe phải lớn hơn ngày nhận xe`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-red-500 text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    // Set loading state
    setLoading(true);

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
      const response = await ApiDonDat.addDonDatByToken(orderData);
    
      // const response = {data: {data: {donDatXeId: 1, tongTien: totalPrice}}}; // Giả lập response để test
      if (paymentMethod === "Chuyển khoản VNPAY" || paymentMethod === "Chuyển khoản PAYPAL") {
        try {
          let response1;
          if (paymentMethod === "Chuyển khoản PAYPAL") {
             response1 = await ApiPayment.paymentPAYPAL(
              response.data.data.donDatXeId,
              response.data.data.tongTien
            );
          }
          if (paymentMethod === "Chuyển khoản VNPAY") {
             response1 = await ApiPayment.paymentVNPAY(
              response.data.data.donDatXeId,
              response.data.data.tongTien
            );
          }
          
          
          toast.success("Đang chuyển hướng đến trang thanh toán...", {
            position: "top-center",
            autoClose: 2000,
          });
          
          // Delay để user thấy thông báo
          setTimeout(() => {
            window.location.href = response1.data.paymentUrl;
          }, 1000);
          
        } catch (error) {
          console.error("Lỗi khi tạo đường dẫn thanh toán:", error);
          toast.error("Không thể tạo đường dẫn thanh toán", {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
          return;
        }
      } else {
        toast.success(`Đã đặt đơn thành công!`, {
          bodyClassName: "text-lg font-semibold",
          className: "bg-green-500 text-white font-bold p-4 rounded-xl",
          position: "top-center",
          autoClose: 2000,
        });
      }

      // Reset form và đóng modal
      resetForm();
      onOk();
      
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(`Đặt đơn thất bại: ${error.response?.data?.message || 'Có lỗi xảy ra'}`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-red-500 text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      // Luôn tắt loading state (trừ khi chuyển hướng thanh toán)
      if (paymentMethod !== "Chuyển khoản") {
        setLoading(false);
      }
    }
  };

  return (
    <Modal
      visible={visible}
      onOk={onOk}
      onCancel={handleCancel}
      closable={!loading} // Không cho đóng modal bằng X khi loading
      maskClosable={!loading} // Không cho đóng modal bằng click outside khi loading
      width={600}
      footer={[
        <button
          key="cancel"
          onClick={handleCancel}
          disabled={loading}
          className={`rounded px-4 py-2 ml-2 transition-colors ${
            loading 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          Hủy
        </button>,
        <button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          disabled={loading}
          className={`px-6 py-2 rounded transition-all ml-4 text-white font-semibold ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#dd5c36] hover:bg-[#bb4a2e] hover:scale-105'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Spin size="small" className="mr-2" />
              {paymentMethod === "Chuyển khoản" ? "Đang xử lý thanh toán..." : "Đang xử lý..."}
            </span>
          ) : (
            "Xác nhận đặt xe"
          )}
        </button>,
      ]}
    >
      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md max-w-xl mx-auto relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-lg">
            <Spin size="large" />
            <p className="mt-4 text-lg font-semibold text-gray-700">
              {paymentMethod === "Chuyển khoản" 
                ? "Đang tạo liên kết thanh toán..." 
                : "Đang xử lý đơn hàng..."}
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-[#DD5C36]">
          Thông tin thuê xe
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
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-[#777777] transition-colors ${
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
              }`}
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
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày nhận xe"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-[#777777] ${
                  loading ? 'bg-gray-100' : 'bg-white'
                }`}
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
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày trả xe"
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-[#777777] ${
                  loading ? 'bg-gray-100' : 'bg-white'
                }`}
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
              disabled={true} // Luôn disabled vì lấy từ user info
              className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Họ tên
            </label>
            <input
              type="text"
              value={user?.hoTen || ""}
              placeholder="Nhập họ và tên"
              disabled={true} // Luôn disabled vì lấy từ user info
              className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              readOnly
            />
          </div>

          <div className="flex justify-between mb-4">
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Giá thuê xe/ngày
              </label>
              <p className="text-lg font-semibold text-[#DD5C36]">
                {pricePerDay.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </p>
            </div>

            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Tổng tiền
              </label>
              <p className="text-xl font-bold text-[#DD5C36]">
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
            <div className="flex flex-col gap-3">
              {/* Tùy chọn Tiền mặt */}
              <div
                onClick={() => !loading && setPaymentMethod("Tiền mặt")}
                className={`cursor-pointer flex items-center justify-between px-4 py-3 border rounded-lg transition-all ${
                  loading 
                    ? 'cursor-not-allowed opacity-50' 
                    : paymentMethod === "Tiền mặt"
                    ? "border-[#dd5c36] bg-[#fff5f0] shadow-md"
                    : "border-gray-300 bg-white hover:border-[#dd5c36] hover:bg-[#fff5f0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2331/2331943.png"
                    alt="Tiền mặt"
                    className="w-8 h-8"
                  />
                  <span className="text-[#777777] font-semibold">
                    Thanh toán tiền mặt
                  </span>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Tiền mặt"
                  checked={paymentMethod === "Tiền mặt"}
                  disabled={loading}
                  readOnly
                  className="cursor-pointer"
                />
              </div>

              {/* Tùy chọn Chuyển khoản */}
              <div
                onClick={() => !loading && setPaymentMethod("Chuyển khoản VNPAY")}
                className={`cursor-pointer flex items-center justify-between px-4 py-3 border rounded-lg transition-all ${
                  loading 
                    ? 'cursor-not-allowed opacity-50' 
                    : paymentMethod === "Chuyển khoản VNPAY"
                    ? "border-[#dd5c36] bg-[#fff5f0] shadow-md"
                    : "border-gray-300 bg-white hover:border-[#dd5c36] hover:bg-[#fff5f0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
                    alt="VNPay"
                    className="w-10 h-8 object-contain"
                  />
                  <div>
                    <span className="text-[#777777] font-semibold block">
                      Thanh toán VNPAY
                    </span>
                    <span className="text-xs text-gray-500">
                      Visa, MasterCard, ATM, QR Code
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Chuyển khoản VNPAY"
                  checked={paymentMethod === "Chuyển khoản VNPAY"}
                  disabled={loading}
                  readOnly
                  className="cursor-pointer"
                />
              </div>
              {/* Thanh toán paypal */}
              <div
                onClick={() => !loading && setPaymentMethod("Chuyển khoản PAYPAL")}
                className={`cursor-pointer flex items-center justify-between px-4 py-3 border rounded-lg transition-all ${
                  loading 
                    ? 'cursor-not-allowed opacity-50' 
                    : paymentMethod === "Chuyển khoản PAYPAL"
                    ? "border-[#dd5c36] bg-[#fff5f0] shadow-md"
                    : "border-gray-300 bg-white hover:border-[#dd5c36] hover:bg-[#fff5f0]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.ctfassets.net/drk57q8lctrm/21FLkQ2lbOCWynXsDZvXO5/485a163f199ef7749b914e54d4dc3335/paypal-logo.webp"
                    alt="VNPay"
                    className="w-10 h-8 object-contain"
                  />
                  <div>
                    <span className="text-[#777777] font-semibold block">
                      Thanh toán PAYPAL
                    </span>
                    <span className="text-xs text-gray-500">
                      Visa, MasterCard, ATM, QR Code
                    </span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Chuyển khoản PAYPAL"
                  checked={paymentMethod === "Chuyển khoản PAYPAL"}
                  disabled={loading}
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