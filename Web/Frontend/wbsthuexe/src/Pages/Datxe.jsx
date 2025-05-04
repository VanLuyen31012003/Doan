import React, { useState } from "react";

const RentalForm = () => {
  const [rentalLocation, setRentalLocation] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý form sẽ được thêm vào sau
    console.log("Form submitted", {
      rentalLocation,
      rentalDate,
      returnDate,
      phoneNumber,
      fullName,
    });
  };

  return (
    <>
      <div className=" text-[#ffffff] h-[400px] bg-[#555555] flex items-center">
        <div className=" w-[70%] items-start flex flex-col  gap-5 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">
            {" "}
            ĐẶT THUÊ XE MÁY TẠI HÀ NỘI
          </h1>
          <p className="text-xs md:text-xl">
            Chọn loại xe và địa điểm, thời gian nhận xe.
          </p>
        </div>
      </div>
      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#DD5C36]">
          Nhập thông tin thuê xe
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Địa điểm nhận xe <span className="text-red-500">*</span>
            </label>
            <select
              value={rentalLocation}
              onChange={(e) => setRentalLocation(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-[#777777]"
              required
            >
              <option value="">Chọn địa điểm nhận xe</option>
              <option value="hanoi1">Hà Nội - Chi nhánh 1</option>
              <option value="hanoi2">Hà Nội - Chi nhánh 2</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Ngày nhận xe <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={rentalDate}
                onChange={(e) => setRentalDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-[#777777]"
                required
              />
            </div>
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Ngày trả xe <span className="text-red-500 ">*</span>
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-[#777777]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[#777777] font-bold mb-2">
                Chọn loại xe thuê <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border rounded-lg text-[#777777] "
                required
              >
                <option value="">Chọn hãng xe và phân khối</option>
                <option value="honda1">Honda - 125cc</option>
                <option value="yamaha1">Yamaha - 155cc</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ và tên"
              className="w-full px-3 py-2 border rounded-lg text-[#777777]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#dd5c36] text-white py-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Đặt Xe Ngay
          </button>
        </form>

        <div className="text-center mt-4 text-[#777777] text-sm">
          * Các trường bắt buộc
        </div>
      </div>
      
    </>
  );
};

export default RentalForm;
