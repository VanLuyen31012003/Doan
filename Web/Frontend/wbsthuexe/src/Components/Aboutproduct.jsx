import React from "react";

const AboutProduct = () => {
  const productSpecs = [
    { name: "Khối lượng bản thân", value: "110 kg" },
    { name: "Dài x Rộng x Cao", value: "1.881mm x 687mm x 1.111mm" },
    { name: "Khoảng cách trục bánh xe", value: "1.288 mm" },
    { name: "Độ cao yên", value: "777 mm" },
    { name: "Khoảng cách gầm xe", value: "131 mm" },
    { name: "Dung tích bình xăng (danh định lớn nhất)", value: "4,4 lít" },
    { name: "Kích cỡ lốp trước/sau", value: "Trước: 80/90 - 14 M/C 40P / Sau: 90/90 - 14 M/C 46P" },
    { name: "Phuộc trước", value: "Ống lồng, giảm chấn thủy lực" },
    { name: "Phuộc sau", value: "Lò xo trụ, giảm chấn thủy lực" },
    { name: "Loại động cơ", value: "PGM-FI, xăng, 4 kỳ, 1 xy-lanh, làm mát bằng dung dịch" },
    { name: "Dung tích xy-lanh", value: "124,9 cm³" },
    { name: "Đường kính x Khoảng chạy pít-tông", value: "52,4mm x 57,9mm" },
    { name: "Tỉ số nén", value: "11:1" },
    { name: "Công suất tối đa", value: "8,4kW/8.500 vòng/phút" },
    { name: "Mô-men cực đại", value: "11,2N.m/5.000 vòng/phút" },
    { name: "Dung tích nhớt máy", value: "0,9 lít khi rã máy / 0,8 lít khi thay nhớt" },
    { name: "Loại truyền động", value: "Dây đai, biến thiên vô cấp" },
    { name: "Hệ thống khởi động", value: "Điện" }
  ];

  return (
    <div className="mx-auto py-8 bg-gray-100 w-full">
      <div className="bg-white w-[80%] mx-auto shadow-xl rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-ghi to-cam text-white">
            <tr>
              <th className="py-2 px-6 text-left uppercase">Thông số</th>
              <th className="py-2 px-6 text-left uppercase">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {productSpecs.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-gray-300 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-3 px-6 text-gray-800">{item.name}</td>
                <td className="py-3 px-6 text-gray-700">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AboutProduct;
