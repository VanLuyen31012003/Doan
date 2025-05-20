import React, { useEffect, useState } from "react";
import { FaInfoCircle, FaCog, FaGasPump, FaWeight, FaRuler } from "react-icons/fa";

const AboutProduct = (props) => {
  const { data } = props;
  const [thongTinHienThi, setThongTinHienThi] = useState({});

  useEffect(() => {
    if (data?.thongTinKyThuat) {
      // Tạo object mới với các thông tin đã được lọc và định dạng
      const filteredInfo = {
        "Động cơ": data.thongTinKyThuat.dongCo || "Chưa cập nhật",
        "Dung tích xi-lanh": data.thongTinKyThuat.dungTich ? `${data.thongTinKyThuat.dungTich} cc` : "Chưa cập nhật",
        "Nhiên liệu": data.thongTinKyThuat.nhienLieu || "Chưa cập nhật",
        "Tiêu thụ nhiên liệu": data.thongTinKyThuat.tieuThuNhienLieu || "Chưa cập nhật",
        "Dung tích bình xăng": data.thongTinKyThuat.dungTichBinhXang ? `${data.thongTinKyThuat.dungTichBinhXang} lít` : "Chưa cập nhật",
        "Loại hộp số": data.thongTinKyThuat.loaiHopSo || "Chưa cập nhật",
        "Hệ thống phanh": data.thongTinKyThuat.heThongPhanh || "Chưa cập nhật",
        "Phuộc trước": data.thongTinKyThuat.phuocTruoc || "Chưa cập nhật",
        "Phuộc sau": data.thongTinKyThuat.phuocSau || "Chưa cập nhật",
        "Kích thước": data.thongTinKyThuat.kichThuoc || "Chưa cập nhật",
        "Trọng lượng": data.thongTinKyThuat.trongLuong ? `${data.thongTinKyThuat.trongLuong} kg` : "Chưa cập nhật",
        "Loại lốp": data.thongTinKyThuat.loaiLop || "Chưa cập nhật",
        "Kích thước lốp trước": data.thongTinKyThuat.kichThuocLopTruoc || "Chưa cập nhật",
        "Kích thước lốp sau": data.thongTinKyThuat.kichThuocLopSau || "Chưa cập nhật",
        "Loại đèn": data.thongTinKyThuat.loaiDen || "Chưa cập nhật"
      };
      setThongTinHienThi(filteredInfo);
    } else {
      setThongTinHienThi({});
    }
  }, [data]);

  // Kiểm tra xem có thông tin kỹ thuật không
  const hasData = Object.values(thongTinHienThi).some(value => value !== "Chưa cập nhật");

  // Chia các trường thành hai mảng để hiển thị thành hai cột
  const entries = Object.entries(thongTinHienThi);
  const leftColumn = entries.slice(0, Math.ceil(entries.length / 2));
  const rightColumn = entries.slice(Math.ceil(entries.length / 2));

  // Hiển thị icon tương ứng cho từng loại thông số
  const getIcon = (key) => {
    if (key.includes("Động cơ") || key.includes("Hộp số")) return <FaCog className="text-orange-600" />;
    if (key.includes("Nhiên liệu") || key.includes("Bình xăng")) return <FaGasPump className="text-blue-500" />;
    if (key.includes("Trọng lượng")) return <FaWeight className="text-green-600" />;
    if (key.includes("Kích thước")) return <FaRuler className="text-purple-600" />;
    return <FaInfoCircle className="text-gray-500" />;
  };

  return (
    <div className="mx-auto py-8 bg-gray-50 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Thông số kỹ thuật</h2>
      <div className="bg-white w-[90%] max-w-5xl mx-auto shadow-lg rounded-xl overflow-hidden border border-gray-200">
        {hasData ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Cột trái */}
            <div>
              {leftColumn.map(([key, value], index) => (
                <div key={index} className={`flex items-start p-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} rounded-lg mb-2`}>
                  <div className="mt-1 mr-3">
                    {getIcon(key)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                    <p className="text-base font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cột phải */}
            <div>
              {rightColumn.map(([key, value], index) => (
                <div key={index} className={`flex items-start p-3 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"} rounded-lg mb-2`}>
                  <div className="mt-1 mr-3">
                    {getIcon(key)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{key}</h3>
                    <p className="text-base font-semibold text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-gray-500 text-lg">Không có thông tin kỹ thuật chi tiết</p>
            <p className="text-gray-400 text-sm mt-2">Thông tin đang được cập nhật</p>
          </div>
        )}
      </div>

     
    </div>
  );
};

export default AboutProduct;