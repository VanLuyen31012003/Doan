import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiNguoiDung from "../Api/ApiNguoiDung";
import { toast } from "react-toastify";
import { setToken } from "../Lib/authenticate";

const Login = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

  const handleSubmit =async (e) => {
    e.preventDefault();
    // Gửi dữ liệu login lên server hoặc gọi API tại đây
    
    try {
      const user = {
        username: email,
        password: password,
      };
       const response= await ApiNguoiDung.login(user);
       const authenticate= response.data.data.authenticated;
       if (authenticate === true) {
         toast.success('Đăng nhập thành công!');
         setToken(response.data.data.token); // Lưu token vào localStorage
         navigate('/dashboard'); // Chuyển hướng đến trang chính sau khi đăng nhập thành công
       }
       else {
         console.log('Đăng nhập thất bại:', response.data.data);
         alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập của bạn.');
         // Xử lý thông báo lỗi nếu cần
       } 
      
    } catch (error) {
      toast.error("Sai thông tin email hoặc mật khẩu");
      
      
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/vocabtoeic-23b22.appspot.com/o/MOTO_VIP.png?alt=media&token=d62496c8-d589-4545-b172-aa68b972c713"
          alt=""
          className=" top-0 left-0 w-full h-full object-cover "
        />
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            // onClick={handleSubmit}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
