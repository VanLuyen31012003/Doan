import { useNavigate } from "react-router-dom";
import { IoWarningSharp } from "react-icons/io5";

const TableOrder = ({ orders,name }) => {
  const navigate = useNavigate(); // Hook để điều hướng

  const statusMap = {
    0: "Chờ xác nhận",
    1: "Đã xác nhận",
    2: "Hoàn thành",
    3: "Đã hủy",
    4: "Đang thuê",
  };

  const today = new Date();

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold text-cam mb-4">{ name}</h2>
      
      <table className="w-full border-collapse border border-gray-300 mb-10">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Mã thuê</th>
            <th className="border border-gray-300 px-4 py-2">Tên người thuê</th>
            <th className="border border-gray-300 px-4 py-2">Địa điểm</th>
            <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu</th>
            <th className="border border-gray-300 px-4 py-2">Ngày kết thúc</th>
            <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((car) => {
            const ngayKetThuc = new Date(car.ngayKetThuc);

            return (
              <tr
                key={car.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/chitietdondat/${car.donDatXeId}`)} // Điều hướng khi click
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  ĐDX {car.donDatXeId}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {car.khachHangName}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {car.diaDiemNhanXe}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {car.ngayBatDau.slice(0, 10)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {car.ngayKetThuc.slice(0, 10)}
                </td>
                <td
                  className={`border border-gray-300 px-4 font-bold py-2 text-center ${
                    car.trangThai === 3 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {car.trangThai === 4 && ngayKetThuc < today ? (
                    <p className="text-yellow-500 animate-pulse">
                      <IoWarningSharp
                        className="inline-block mr-1 shake_forever fire"
                        size={32}
                      />
                      <span className="text-red-700 shake_forever">
                        Vui lòng liên hệ trả xe đúng thời hạn!
                      </span>
                    </p>
                  ) : (
                    statusMap[car.trangThai] || "Không xác định"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TableOrder;