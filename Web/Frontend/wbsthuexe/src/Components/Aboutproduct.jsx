import { HelpCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const AboutProduct = (props) => {
  const { data } = props;
  const [thontin, setThongtin] = useState({});

 useEffect(() => {
  if (data?.thongTinKyThuat) {
    setThongtin(data.thongTinKyThuat);
  } else {
    setThongtin({}); // Đặt lại state nếu không có thông tin kỹ thuật
  }
}, [data]);

  return (
    <div className="mx-auto py-8 bg-gray-100 w-full">
      <div className="bg-white w-[60%] mx-auto shadow-xl rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-ghi to-cam text-white">
            <tr>
              <th className="py-2 px-6 text-left uppercase">Thông số</th>
              <th className="py-2 px-6 text-left uppercase">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {thontin && Object.keys(thontin).length > 0 ? (
              Object.entries(thontin).map(([key, value], index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="py-3 px-6 text-gray-800">{key}</td>
                  <td className="py-3 px-6 text-gray-700">{value}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-3 px-6 text-center text-gray-500">
                  Không có thông tin kỹ thuật
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AboutProduct;