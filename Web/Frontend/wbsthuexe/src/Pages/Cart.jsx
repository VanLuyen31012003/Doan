import React, { useContext, useState, useEffect } from "react";
import { MotoContext } from "../Context/MotoContext";
import { Modal, Spin } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import ApiPayment from "../api/ApiPayment";

function Cart() {
  const { cartItems = [], removeFromCart } = useContext(MotoContext);

  // Single item modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Multiple items modal states
  const [isMultiModalVisible, setIsMultiModalVisible] = useState(false);
  
  // Shared states
  const [rentalDate, setRentalDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [rentalLocation, setRentalLocation] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch user info
  const fetchUserInfo = async () => {
    try {
      const response = await ApiKhachHang.getinfo();
      setUser(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  // Calculate total price for selected item
  const calculateItemTotal = () => {
    if (rentalDate && returnDate && selectedItem) {
      const startDate = new Date(rentalDate);
      const endDate = new Date(returnDate);
      let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (days <= 0) days = 1; // Minimum 1 day
      return days * selectedItem.giaThueNgay * selectedItem.quantity;
    }
    return 0;
  };
  
  // Calculate total price for all items
  const calculateMultiItemsTotal = () => {
    if (!rentalDate || !returnDate || !cartItems.length) return 0;
    
    const startDate = new Date(rentalDate);
    const endDate = new Date(returnDate);
    let days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (days <= 0) days = 1;
    
    return cartItems.reduce(
      (total, item) => total + (item.giaThueNgay * days * item.quantity),
      0
    );
  };

  // Show modal for a specific item
  const showModal = (item) => {
    setSelectedItem(item);
    
    // Set default dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setRentalDate(today);
    setReturnDate(tomorrow);
    setRentalLocation("");
    setPaymentMethod("Tiền mặt");
    setLoading(false);
    
    fetchUserInfo();
    setIsModalVisible(true);
  };
  
  // Show modal for all items
  const showMultiModal = () => {
    // Set default dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setRentalDate(today);
    setReturnDate(tomorrow);
    setRentalLocation("");
    setPaymentMethod("Tiền mặt");
    setLoading(false);
    
    fetchUserInfo();
    setIsMultiModalVisible(true);
  };

  // Handle single item rental
  const handleOk = async () => {
    // Prevent double click
    if (loading) {
      toast.warning("Đang xử lý đơn hàng, vui lòng chờ...", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    if (!rentalDate || !returnDate || !rentalLocation) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (rentalDate >= returnDate) {
      toast.error("Ngày trả xe phải lớn hơn ngày nhận xe!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    
    const startDate = new Date(rentalDate);
    const endDate = new Date(returnDate);
    const days = Math.max(Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)), 1);
    const finalPrice = calculateItemTotal();

    // Tạo danh sách chi tiết dựa trên số lượng xe đã chọn
    const detailItems = [];
    for (let i = 0; i < selectedItem.quantity; i++) {
      detailItems.push({
        mauXeId: selectedItem.mauXeId,
        soNgayThue: days,
        thanhTien: selectedItem.giaThueNgay * days,
      });
    }

    const orderData = {
      nguoiDungId: user?.nguoiDungId || 1,
      ngayBatDau: format(rentalDate, "yyyy-MM-dd") + "T08:00:00",
      ngayKetThuc: format(returnDate, "yyyy-MM-dd") + "T18:00:00",
      tongTien: finalPrice,
      trangThai: 0,
      diaDiemNhanXe: rentalLocation,
      phuongThucThanhToan: paymentMethod,
      chiTiet: detailItems,
    };

    try {
      const response = await ApiDonDat.addDonDatByToken(orderData);
      
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
          
          toast.success(paymentMethod === "Chuyển khoản PAYPAL" ? "Đang chuyển hướng đến trang thanh toán PayPal..." : "Đang chuyển hướng đến trang thanh toán VNPAY...", {
            position: "top-center",
            autoClose: 2000,
          });
          
          setTimeout(() => {
            window.location.href = response1.data.paymentUrl;
          }, 1000);
          
        } catch (error) {
          console.error("Lỗi khi tạo đường dẫn thanh toán:", error);
          toast.error(`Không thể tạo đường dẫn thanh toán ${paymentMethod === "Chuyển khoản PAYPAL" ? "PayPal" : "VNPAY"}`, {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
          return;
        }
      } else {
        toast.success("Đã đặt đơn thành công", {
          position: "top-center",
          autoClose: 2000,
        });
        setIsModalVisible(false);
        
        // Xóa xe đã đặt khỏi giỏ hàng
        removeFromCart(selectedItem.mauXeId);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error.response?.data?.message || "Đặt đơn thất bại!", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      if (paymentMethod === "Tiền mặt") {
        setLoading(false);
      }
    }
  };
  
  // Handle multi-items rental
  const handleMultiOk = async () => {
    // Prevent double click
    if (loading) {
      toast.warning("Đang xử lý đơn hàng, vui lòng chờ...", {
        position: "top-center",
        autoClose: 1500,
      });
      return;
    }

    if (!rentalDate || !returnDate || !rentalLocation) {
      toast.error("Vui lòng nhập đầy đủ thông tin!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    if (rentalDate >= returnDate) {
      toast.error("Ngày trả xe phải lớn hơn ngày nhận xe!", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    setLoading(true);
    
    const startDate = new Date(rentalDate);
    const endDate = new Date(returnDate);
    const days = Math.max(Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)), 1);
    const finalPrice = calculateMultiItemsTotal();

    // Tạo danh sách chi tiết với số lượng xe chính xác
    const detailItems = [];
    cartItems.forEach(item => {
      // Thêm xe vào danh sách chi tiết theo đúng số lượng
      for (let i = 0; i < item.quantity; i++) {
        detailItems.push({
          mauXeId: item.mauXeId,
          soNgayThue: days,
          thanhTien: item.giaThueNgay * days,
        });
      }
    });

    const orderData = {
      nguoiDungId: user?.nguoiDungId || 1,
      ngayBatDau: format(rentalDate, "yyyy-MM-dd") + "T08:00:00",
      ngayKetThuc: format(returnDate, "yyyy-MM-dd") + "T18:00:00",
      tongTien: finalPrice,
      trangThai: 0,
      diaDiemNhanXe: rentalLocation,
      phuongThucThanhToan: paymentMethod,
      chiTiet: detailItems,
    };

    try {
      const response = await ApiDonDat.addDonDatByToken(orderData);
      
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
          
          toast.success(paymentMethod === "Chuyển khoản PAYPAL" ? "Đang chuyển hướng đến trang thanh toán PayPal..." : "Đang chuyển hướng đến trang thanh toán VNPAY...", {
            position: "top-center",
            autoClose: 2000,
          });
          
          setTimeout(() => {
            window.location.href = response1.data.paymentUrl;
          }, 1000);
          
        } catch (error) {
          console.error("Lỗi khi tạo đường dẫn thanh toán:", error);
          toast.error(`Không thể tạo đường dẫn thanh toán ${paymentMethod === "Chuyển khoản PAYPAL" ? "PayPal" : "VNPAY"}`, {
            position: "top-center",
            autoClose: 2000,
          });
          setLoading(false);
          return;
        }
      } else {
        toast.success("Đã đặt tất cả xe thành công", {
          position: "top-center",
          autoClose: 2000,
        });
        setIsMultiModalVisible(false);
        
        // Xóa tất cả xe đã đặt khỏi giỏ hàng
        cartItems.forEach(item => removeFromCart(item.mauXeId));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      toast.error(error.response?.data?.message || "Đặt đơn thất bại!", {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      if (paymentMethod === "Tiền mặt") {
        setLoading(false);
      }
    }
  };

  // Handle modal cancel button
  const handleCancel = () => {
    if (!loading) {
      setIsModalVisible(false);
    }
  };
  
  // Handle multi-modal cancel button
  const handleMultiCancel = () => {
    if (!loading) {
      setIsMultiModalVisible(false);
    }
  };

  // Calculate total price for all items in cart
  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.giaThueNgay * item.quantity,
      0
    );
  };

  // Update total price when dates change
  useEffect(() => {
    if (rentalDate && returnDate && selectedItem && isModalVisible) {
      setTotalPrice(calculateItemTotal());
    } else if (rentalDate && returnDate && isMultiModalVisible) {
      setTotalPrice(calculateMultiItemsTotal());
    }
  }, [rentalDate, returnDate, selectedItem, isModalVisible, isMultiModalVisible]);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded mt-[160px] text-ghi">
      <h2 className="text-2xl font-bold mb-6">Các xe yêu thích</h2>

      {cartItems.length === 0 ? (
        <p>Chưa có xe yêu thích nào.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Ảnh</th>
                <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
                <th className="border border-gray-300 px-4 py-2">Giá/Ngày</th>
                <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
                <th className="border border-gray-300 px-4 py-2" colSpan="2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.mauXeId}>
                  <td className="border border-gray-300 px-4 py-2 text-center mx-auto">
                    <img
                      src={item.anhDefault}
                      alt={item.tenMau}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.tenMau}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.giaThueNgay.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {(item.giaThueNgay * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 justify-center items-center flex">
                    <button
                      onClick={() => showModal(item)} 
                      disabled={loading}
                      className={`px-4 py-2 text-white rounded transition duration-300 mr-2 ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-[#dd5c36] hover:bg-[#c04d2e]'
                      }`}
                    >
                      Đặt xe
                    </button>
                    <button
                      onClick={() => removeFromCart(item.mauXeId)}
                      disabled={loading}
                      className={`px-4 py-2 text-white rounded transition duration-300 ${
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gray-500 hover:bg-gray-600'
                      }`}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <div>
              <h3 className="text-xl font-bold mb-2">
                Tổng tiền:{" "}
                {calculateTotal().toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </h3>
              <p className="text-sm text-gray-600">
                (Chọn đặt từng xe hoặc đặt tất cả cùng lúc)
              </p>
            </div>
            <button 
              onClick={showMultiModal}
              disabled={loading}
              className={`px-6 py-3 text-white rounded transition duration-300 font-semibold ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#dd5c36] hover:bg-[#c04d2e]'
              }`}
            >
              {loading ? "Đang xử lý..." : "Đặt tất cả xe"}
            </button>
          </div>
        </>
      )}

      {/* Modal đặt một xe */}
      <Modal
        title={<h2 className="text-xl font-bold text-[#DD5C36]">Đặt xe {selectedItem?.tenMau}</h2>}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={!loading}
        maskClosable={!loading}
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
            onClick={handleOk}
            disabled={loading}
            className={`px-4 py-2 rounded transition-all ml-6 text-white font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#dd5c36] hover:bg-[#c04d2e] hover:scale-105'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Spin size="small" className="mr-2" />
                {paymentMethod === "Chuyển khoản PAYPAL" ? "Đang xử lý PayPal..." : 
                 paymentMethod === "Chuyển khoản VNPAY" ? "Đang xử lý VNPAY..." : "Đang xử lý..."}
              </span>
            ) : (
              "Xác nhận"
            )}
          </button>,
        ]}
        width={700}
      >
        <div className="p-4 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-lg">
              <Spin size="large" />
              <p className="mt-4 text-lg font-semibold text-gray-700">
                {paymentMethod === "Chuyển khoản PAYPAL" 
                  ? "Đang tạo liên kết thanh toán PayPal..." 
                  : paymentMethod === "Chuyển khoản VNPAY"
                  ? "Đang tạo liên kết thanh toán VNPAY..."
                  : "Đang xử lý đơn hàng..."}
              </p>
            </div>
          )}

          <div className="flex mb-6">
            <div className="w-1/3 pr-4">
              <img
                src={selectedItem?.anhDefault}
                alt={selectedItem?.tenMau}
                className="w-full h-auto object-cover rounded"
              />
            </div>
            <div className="w-2/3">
              <h3 className="text-lg font-bold">{selectedItem?.tenMau}</h3>
              <p className="text-[#DD5C36] font-bold mt-2">
                {selectedItem?.giaThueNgay?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })} / ngày
              </p>
              <p className="text-gray-600 mt-1">
                Số lượng: {selectedItem?.quantity || 1}
              </p>
            </div>
          </div>

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
                  minDate={rentalDate || new Date()}
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
                Họ tên người thuê
              </label>
              <input
                type="text"
                value={user?.hoTen || ""}
                disabled
                className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#777777] font-bold mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={user?.soDienThoai || ""}
                disabled
                className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              />
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <label className="block text-[#777777] font-bold mb-2">
                  Tổng tiền thuê
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

                {/* Tùy chọn VNPAY */}
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

                {/* Tùy chọn PayPal */}
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
                      alt="PayPal"
                      className="w-10 h-8 object-contain"
                    />
                    <div>
                      <span className="text-[#777777] font-semibold block">
                        Thanh toán PayPal
                      </span>
                      <span className="text-xs text-gray-500">
                        Thanh toán quốc tế, bảo mật cao
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

      {/* Modal đặt nhiều xe */}
      <Modal
        title={<h2 className="text-xl font-bold text-[#DD5C36]">Đặt tất cả xe</h2>}
        visible={isMultiModalVisible}
        onOk={handleMultiOk}
        onCancel={handleMultiCancel}
        closable={!loading}
        maskClosable={!loading}
        footer={[
          <button
            key="cancel"
            onClick={handleMultiCancel}
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
            onClick={handleMultiOk}
            disabled={loading}
            className={`px-4 py-2 rounded transition-all ml-6 text-white font-semibold ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#dd5c36] hover:bg-[#c04d2e] hover:scale-105'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Spin size="small" className="mr-2" />
                {paymentMethod === "Chuyển khoản PAYPAL" ? "Đang xử lý PayPal..." : 
                 paymentMethod === "Chuyển khoản VNPAY" ? "Đang xử lý VNPAY..." : "Đang xử lý..."}
              </span>
            ) : (
              "Xác nhận"
            )}
          </button>,
        ]}
        width={800}
      >
        <div className="p-4 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-lg">
              <Spin size="large" />
              <p className="mt-4 text-lg font-semibold text-gray-700">
                {paymentMethod === "Chuyển khoản PAYPAL" 
                  ? "Đang tạo liên kết thanh toán PayPal..." 
                  : paymentMethod === "Chuyển khoản VNPAY"
                  ? "Đang tạo liên kết thanh toán VNPAY..."
                  : "Đang xử lý đơn hàng..."}
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-bold mb-4 border-b pb-2">Danh sách xe được chọn</h3>
            
            <div className="max-h-64 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.mauXeId} className="flex items-center border-b pb-3 mb-3">
                  <div className="w-16 h-16 mr-4">
                    <img
                      src={item.anhDefault}
                      alt={item.tenMau}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold">{item.tenMau}</h4>
                    <p className="text-[#DD5C36]">
                      {item.giaThueNgay.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })} / ngày
                    </p>
                    <p className="text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                  minDate={rentalDate || new Date()}
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
                Họ tên người thuê
              </label>
              <input
                type="text"
                value={user?.hoTen || ""}
                disabled
                className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[#777777] font-bold mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={user?.soDienThoai || ""}
                disabled
                className="w-full px-3 py-2 border rounded-lg text-[#777777] bg-gray-100"
              />
            </div>

            <div className="flex justify-between mb-4">
              <div>
                <label className="block text-[#777777] font-bold mb-2">
                  Tổng tiền thuê
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

                {/* Tùy chọn VNPAY */}
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

                {/* Tùy chọn PayPal */}
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
                      alt="PayPal"
                      className="w-10 h-8 object-contain"
                    />
                    <div>
                      <span className="text-[#777777] font-semibold block">
                        Thanh toán PayPal
                      </span>
                      <span className="text-xs text-gray-500">
                        Thanh toán quốc tế, bảo mật cao
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
    </div>
  );
}

export default Cart;