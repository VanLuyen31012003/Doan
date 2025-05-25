import React, { useEffect, useState } from "react";
import { FaFaceSmileWink } from "react-icons/fa6";
import ApiKhachHang from "../api/ApiKhachHang";
import ApiDonDat from "../api/ApiDonDat";
import { useParams, useNavigate } from "react-router-dom";
import { IoWarningSharp } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";

function Detailorder() {
  const [userInfo, setUserInfo] = useState(null);
  const [order, setOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false); // Modal xác nhận hủy đơn
  const [newEndDate, setNewEndDate] = useState(null);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const { id } = useParams();
  const navigate = useNavigate();
  const ngayKetThuc = order ? new Date(order.ngayKetThuc) : null;
  const today = new Date();
  const statusMap = {
    0: "Chờ xác nhận",
    1: "Đã xác nhận",
    2: "Hoàn thành",
    3: "Đã hủy",
    4: "Đang thuê",
  };

  const paymentStatusMap = {
    0: "Chưa thanh toán",
    1: "Đã thanh toán",
  };

  // Tính số ngày gia hạn và số tiền gia hạn
  const calculateExtension = () => {
    if (!newEndDate || !order || !ngayKetThuc) {
      return { days: 0, cost: 0 };
    }

    // Tính số ngày gia hạn
    const diffTime = newEndDate - ngayKetThuc;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Chuyển đổi từ milliseconds sang ngày

    // Tính tổng giá thuê ngày của tất cả xe
    const totalDailyPrice = order.chiTiet.reduce((sum, detail) => {
      return sum + (detail.xe.mauXe.giaThueNgay || 0);
    }, 0);

    // Tính số tiền gia hạn
    const cost = days * totalDailyPrice;

    return { days: days > 0 ? days : 0, cost: cost > 0 ? cost : 0 };
  };

  const { days, cost } = calculateExtension();

  const fetchOrder = async (id) => {
    try {
      const response = await ApiDonDat.getDonDatById(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Không thể lấy thông tin đơn hàng!");
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

  const handleExtendOrder = async () => {
    if (!newEndDate) {
      toast.error("Vui lòng chọn ngày gia hạn!", {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
      return;
    }
    try {
      const adjustedDate = new Date(newEndDate);
      adjustedDate.setHours(23, 59, 59, 0); // Đặt giờ, phút, giây, và mili giây

      // Chuyển đổi sang định dạng YYYY-MM-DDTHH:mm:ss
      const formattedDate = adjustedDate.toISOString().slice(0, 19); // Lấy định dạng YYYY-MM-DDTHH:mm:ss

      const datasend = {
        newEndDate: formattedDate,
        // Nếu backend cần số tiền gia hạn, bạn có thể thêm vào đây
        // extensionCost: cost,
      };
      console.log("Sending payload:", datasend); // Debug
      const response = await ApiDonDat.giaHanDonDat(id, datasend);
      toast.success("Gia hạn đơn đặt xe thành công!", {
        bodyClassName: "text-lg font-semibold",
        className: "bg-green-600 text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
      setIsModalOpen(false);
      setNewEndDate(null); // Reset ngày sau khi gia hạn
      fetchOrder(id); // Làm mới dữ liệu
    } catch (error) {
      console.error("Error extending order:", error.response?.data);
      toast.error(`${error.response?.data?.message || "Có lỗi xảy ra khi gia hạn đơn đặt xe!"}`, {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 1000,
      });
    }
  };

  // Xử lý hủy đơn hàng
  const handleCancelOrder = async () => {
    if (!id) {
      toast.error("Không tìm thấy ID đơn hàng!");
      return;
    }

    try {
      setLoading(true);
      const response = await ApiDonDat.huydondat(id);
      
      if (response.data.success) {
        toast.success("Hủy đơn đặt xe thành công!", {
          bodyClassName: "text-lg font-semibold",
          className: "bg-green-600 text-white font-bold p-4 rounded-xl",
          position: "top-center",
          autoClose: 2000,
        });
        
        // Đóng modal xác nhận
        setIsConfirmCancelOpen(false);
        
        // Delay để hiện toast thành công trước khi refresh dữ liệu
        setTimeout(() => {
          fetchOrder(id);
        }, 1000);
      } else {
        toast.error(response.data.message || "Hủy đơn thất bại!", {
          bodyClassName: "text-lg font-semibold",
          className: "bg-black text-white font-bold p-4 rounded-xl",
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi hủy đơn!", {
        bodyClassName: "text-lg font-semibold",
        className: "bg-black text-white font-bold p-4 rounded-xl",
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchOrder(id);
  }, [id]);

  return (
    <>
      <div className="text-[#ffffff] h-[400px] bg-[#555555] flex items-center">
        <div className="w-[70%] items-start flex flex-col gap-5 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">
            Thông tin đơn đặt xe
          </h1>
          <p className="text-xs md:text-xl flex gap-4 items-center font-semibold">
            Hello {userInfo?.hoTen}!!! <FaFaceSmileWink size={42} />
          </p>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto shadow-lg mb-10 bg-white -mt-20 rounded text-ghi">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-cam font-bold">
            Chi tiết đơn đặt xe
          </h2>
          
          {/* Hiển thị nút hủy đơn chỉ khi trạng thái là "Chờ xác nhận" */}
          {order?.trangThai === 0 && (
            <button
              onClick={() => setIsConfirmCancelOpen(true)}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FaTrash /> Hủy đơn
            </button>
          )}
        </div>

        <div className="mb-6 text-ghi">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <strong>Mã đơn đặt:</strong> {order?.donDatXeId}
            </div>
            <div className="mb-4">
              <strong>Khách hàng:</strong> {order?.khachHangName}
            </div>
            <div className="mb-4">
              <strong>Người xử lý:</strong> {order?.nguoiDungName || "Chưa có"}
            </div>
            <div className="mb-4">
              <strong>Ngày bắt đầu:</strong> {order?.ngayBatDau?.slice(0, 10)}
            </div>
            <div className="mb-4">
              <strong>Ngày kết thúc:</strong> {order?.ngayKetThuc?.slice(0, 10)}
            </div>
            <div className="mb-4">
              <strong>Địa điểm nhận xe:</strong> {order?.diaDiemNhanXe}
            </div>
            <div className="mb-4">
              <strong>Phương thức thanh toán:</strong>{" "}
              {order?.phuongThucThanhToan}
            </div>
            <div className="mb-4">
              <strong>Tiền đặt đơn:</strong>{" "}
              {order?.tongTienLandau?.toLocaleString()} VNĐ
            </div>
            <div className="mb-4">
              <strong>Trạng thái thanh toán:</strong>{" "}
              {paymentStatusMap[order?.trangThaiThanhToan] || "Không xác định"}
            </div>
          </div>

          <div className="mb-4">
            <strong>Trạng thái đơn:</strong>{" "}
            {order?.trangThai === 4 && ngayKetThuc < today ? (
              <>
                <span className="font-bold text-red-700">
                  {statusMap[order?.trangThai] || "Không xác định"}
                </span>
                <p className="text-yellow-500 animate-pulse">
                  <IoWarningSharp
                    className="inline-block mr-1 shake_forever fire"
                    size={32}
                  />
                  <span className="text-red-700 shake_forever font-bold">
                    Vui lòng liên hệ trả xe đúng thời hạn!
                  </span>
                </p>
              </>
            ) : (
              <span className={`font-bold ${order?.trangThai === 3 ? 'text-red-600' : 'text-green-600'}`}>
                {statusMap[order?.trangThai] || "Không xác định"}
              </span>
            )}
          </div>
        </div>

        <h2 className="text-2xl text-cam font-bold mb-6">Chi tiết xe</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-10">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Hình ảnh</th>
                <th className="border border-gray-300 px-4 py-2">Biển số</th>
                <th className="border border-gray-300 px-4 py-2">Tên xe</th>
                <th className="border border-gray-300 px-4 py-2">
                  Giá thuê ngày
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Số ngày thuê
                </th>
                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order?.chiTiet?.map((detail) => (
                <tr key={detail.chiTietId}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <img
                      src={detail.xe.mauXe?.anhdefault}
                      alt=""
                      className="w-20 h-20 object-contain mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.xe.bienSo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.xe.mauXe.tenMau}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.xe.mauXe.giaThueNgay?.toLocaleString()} VNĐ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail.soNgayThue} ngày
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {detail?.thanhTien?.toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> 
        {order?.hoaDonGiaHan?.length > 0 && (<>
          <h2 className="text-2xl text-cam font-bold mb-6">Hóa đơn gia hạn</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-10">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">
                  Ngày bắt đầu
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Ngày kết thúc
                </th>
                <th className="border border-gray-300 px-4 py-2">Tổng tiền</th>
                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {order?.hoaDonGiaHan?.map((hoaDon) => (
                <tr key={hoaDon.hoaDonGiaHanId}>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hoaDon.ngayBatDauGiaHan.slice(0, 10)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hoaDon.ngayKetThucGiaHan.slice(0, 10)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {hoaDon.tongTienGiaHan.toLocaleString()} VNĐ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {paymentStatusMap[hoaDon.trangThaiThanhToan] ||
                      "Không xác định"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>)}

        <div className="flex justify-end flex-col text-right">
          <div className="mb-4">
            <strong>Tổng tiền:</strong>
            <span className="font-bold text-green-600">
              {" "}
              {order?.tongTien?.toLocaleString()} VNĐ
            </span>
          </div>
          <div className="mb-4">
            <strong>Số tiền còn phải thanh toán:</strong>{" "}
            <span className="text-red-600 font-bold">
              {order?.soTienCanThanhToan?.toLocaleString()} VNĐ
            </span>
          </div>
          
          {/* Chỉ hiển thị nút gia hạn nếu đơn đang ở trạng thái đã xác nhận hoặc đang thuê */}
          {(order?.trangThai === 1 || order?.trangThai === 4) && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-cam text-white font-bold py-2 px-4 rounded hover:bg-orange-600 md:w-1/5"
            >
              Gia hạn đơn đặt xe
            </button>
          )}
        </div>
      </div>

      {/* Modal gia hạn */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-cam">
              Chọn ngày gia hạn
            </h3>
            <div className="mb-4">
              <label className="block text-ghi mb-2">
                Ngày kết thúc mới:
              </label>
              <DatePicker
                selected={newEndDate}
                onChange={(date) => setNewEndDate(date)}
                minDate={ngayKetThuc}
                dateFormat="yyyy-MM-dd"
                className="w-full p-2 border border-gray-300 rounded"
                placeholderText="Chọn ngày"
              />
            </div>
            <div className="mb-4">
              <label className="block text-ghi mb-2">
                Số ngày gia hạn:
              </label>
              <p className="text-ghi">{days} ngày</p>
            </div>
            <div className="mb-4">
              <label className="block text-ghi mb-2">
                Số tiền gia hạn:
              </label>
              <p className="text-ghi font-bold ">
                {cost.toLocaleString()} VNĐ
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewEndDate(null); // Reset ngày khi hủy
                }}
                className="bg-gray-300 text-ghi font-bold py-2 px-4 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleExtendOrder}
                className="bg-cam text-white font-bold py-2 px-4 rounded hover:bg-orange-600"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal xác nhận hủy đơn */}
      {isConfirmCancelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
              <IoWarningSharp /> Xác nhận hủy đơn
            </h3>
            <p className="text-ghi mb-6">
              Bạn có chắc chắn muốn hủy đơn đặt xe này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmCancelOpen(false)}
                disabled={loading}
                className="bg-gray-300 text-ghi font-bold py-2 px-4 rounded hover:bg-gray-400"
              >
                Không
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={loading}
                className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <FaTrash /> Xác nhận hủy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* <ToastContainer /> */}
    </>
  );
}

export default Detailorder;