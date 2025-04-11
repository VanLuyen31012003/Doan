import React from "react";

function BoardPrice(props) {
  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-[70%] flex flex-col gap-10 my-11 text-[#777777]">
        <div>
          <div className="text-xl font-medium text-[#333333] mb-4">
            Bảng giá xe số:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    ĐỜI XE
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    TIỀN CỌC
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    GIÁ THUÊ 1-4 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    5-10 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    10-14 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    15 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    25 NGÀY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2012-2016
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    1.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    90.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    80.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    70.000đ/ngày
                    <br />
                    Quá hạn: 15k/h
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    1.500.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2017-2020
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    1.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    130.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    100.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    90.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    80.000đ/ngày
                    <br />
                    Quá hạn: 15k/h
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    1.800.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2021-2024
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    1.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    130.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    100.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    90.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    100.000đ/ngày
                    <br />
                    1.050.000đ/15 ngày
                    <br />
                    Quá hạn: 15k/h
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.100.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="text-xl font-medium text-[#333333] mb-4">
            Bảng giá xe tay ga:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    ĐỜI XE
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    TIỀN CỌC
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    GIÁ THUÊ 1-4 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    5-10 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    10-14 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    15 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    25 NGÀY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2015-2017
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    150.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    100.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    100.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2018-2020
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    180.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    150.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.500.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2021-2024
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    180.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    150.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    3.000.000/tháng
                    <br />
                    Quá hạn: 20k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    Xe SH 2016-2022
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    10.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    350.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    320.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    300.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    270.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    7.500.000đ/tháng
                    <br />
                    Quá hạn: 35k/h
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    Xe SH Moda 2019-2023
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    5.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    300.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    250.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    220.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    200.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    5.000.000đ/tháng
                    <br />
                    Quá hạn: 30k/h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="text-xl font-medium text-[#333333] mb-4">
            Bảng giá xe tay côn:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    ĐỜI XE
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    TIỀN CỌC
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    GIÁ THUÊ 1-4 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    5-10 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    10-14 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    15 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    25 NGÀY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2016-2022
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    250.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    200.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    170.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.100.000đ/15 ngày
                    <br />
                    Quá hạn: 130.000đ/ngày
                    <br />
                    Quá hạn: 25k/h
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    3.000.000đ/tháng
                    <br />
                    Quá hạn: 25k/h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="text-xl font-medium text-[#333333] mb-4">
            Bảng giá xe điện:
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    ĐỜI XE
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    TIỀN CỌC
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    GIÁ THUÊ 1-4 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    5-10 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    10-14 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    15 NGÀY
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-center">
                    25 NGÀY
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2023
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    2.000.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    180.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    150.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    120.000đ
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    3.000.000đ/tháng
                    <br />
                    Quá hạn: 15k/h
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div className="text-xl font-medium text-gray-800 mb-4">
            Các lưu ý:
          </div>
          <ul className="list-disc pl-6 space-y-4">
            <li className="text-gray-700">
              Ngày lễ, cuối tuần(từ T6-CN) tăng giá 10k/ngày đối với xe số và xe
              ga thường.
            </li>
            <li className="text-gray-700">
              KH có thể sinh viên hoặc về máy bay khứ hồi giảm 50% cọc ( ngoại
              trừ SH).
            </li>
            <li className="text-gray-700">
              KH không có giấy tờ tùy thân sẽ cần tăng số tiền cọc.
            </li>
            <li className="text-gray-700">
              KH có thể thay cọc bằng tài sản có giá trị tương đương cọc như:
              Laptop, điện thoại, xe máy...
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default BoardPrice;
