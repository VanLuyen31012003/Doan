import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiKhachHang from "../api/ApiKhachHang";

function Register(props) {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hoTen, setHoTen] = useState("");
    const [soDienThoai, setSoDienThoai] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (nếu có)
    // Logic xử lý đăng nhập
    const user = {
      hoTen: hoTen,
      email: email,
      soDienThoai: soDienThoai,
      matKhau: password,
    };
    // console.log('Form submitted', user);
    try {
        const response = await ApiKhachHang.register(user);
        alert(response.data.message)
        navigate(    "/login"); // Chuyển hướng đến trang chính sau khi đăng nhập thành công
     
    } catch (error) {

    alert( error.response.data.message);
  }
   
  };

  return (
    <>
      <div className="text-[#ffffff] h-[300px] bg-[#555555] flex items-center">
        <div className="w-[70%] items-start flex flex-col gap-5 mt-8 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">ĐĂNG KÝ</h1>
          <p className="text-xs md:text-xl">
            Đăng ký để có tài khoản đặt xe nào!!!
          </p>
        </div>
      </div>

      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md max-w-lg mx-auto -mt-14">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#DD5C36]">
          Đăng Ký
        </h2>

        <form>
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder="Nhập họ tên"
              className="w-full px-4 py-3 border rounded-lg text-[#777777]"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              value={soDienThoai}
              onChange={(e) => setSoDienThoai(e.target.value)}
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-3 border rounded-lg text-[#777777]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="w-full px-4 py-3 border rounded-lg text-[#777777]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full px-4 py-3 border rounded-lg text-[#777777]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#dd5c36] text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 font-bold"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
