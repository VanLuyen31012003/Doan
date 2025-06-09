import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiKhachHang from "../api/ApiKhachHang";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [soDienThoai, setSoDienThoai] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [soCccd, setSoCccd] = useState("");
  
  // Thêm state để quản lý lỗi
  const [errors, setErrors] = useState({
    hoTen: "",
    soDienThoai: "",
    soCccd: "",
    diaChi: "",
    email: "",
    password: ""
  });
  
  const navigate = useNavigate();

  // Validate từng trường
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "hoTen":
        if (!value) {
          error = "Họ tên không được để trống";
        } else if (value.length < 2) {
          error = "Họ tên phải có ít nhất 2 ký tự";
        }
        break;
        
      case "soDienThoai":
        if (!value) {
          error = "Số điện thoại không được để trống";
        } else if (!/^[0-9]{10}$/.test(value)) {
          error = "Số điện thoại phải có 10 chữ số";
        }
        break;
        
      case "soCccd":
        if (!value) {
          error = "Số CCCD không được để trống";
        } else if (!/^[0-9]{12}$/.test(value)) {
          error = "Số CCCD phải có 12 chữ số";
        }
        break;
        
      case "diaChi":
        if (!value) {
          error = "Địa chỉ không được để trống";
        } else if (value.length < 5) {
          error = "Địa chỉ quá ngắn";
        }
        break;
        
      case "email":
        if (!value) {
          error = "Email không được để trống";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Mật khẩu không được để trống";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };
  
  // Xử lý thay đổi input và validate
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật state
    switch (name) {
      case "hoTen":
        setHoTen(value);
        break;
      case "soDienThoai":
        setSoDienThoai(value);
        break;
      case "soCccd":
        setSoCccd(value);
        break;
      case "diaChi":
        setDiaChi(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
    
    // Validate và cập nhật lỗi
    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };
  
  // Validate toàn bộ form
  const validateForm = () => {
    let formIsValid = true;
    const newErrors = {
      hoTen: validateField("hoTen", hoTen),
      soDienThoai: validateField("soDienThoai", soDienThoai),
      soCccd: validateField("soCccd", soCccd),
      diaChi: validateField("diaChi", diaChi),
      email: validateField("email", email),
      password: validateField("password", password)
    };
    
    // Kiểm tra xem có lỗi nào không
    Object.values(newErrors).forEach(error => {
      if (error) formIsValid = false;
    });
    
    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }
    
    const user = {
      hoTen: hoTen,
      email: email,
      soDienThoai: soDienThoai,
      matKhau: password,
      diaChi: diaChi,
      soCccd: soCccd,
    };
    
    try {
       await ApiKhachHang.register(user);
      toast.success("Đăng ký thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "Đăng ký thất bại!");
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
      }
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

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              name="hoTen"
              value={hoTen}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.hoTen ? 'border-red-500' : ''}`}
              required
            />
            {errors.hoTen && <p className="text-red-500 text-xs mt-1">{errors.hoTen}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              name="soDienThoai"
              value={soDienThoai}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.soDienThoai ? 'border-red-500' : ''}`}
              required
            />
            {errors.soDienThoai && <p className="text-red-500 text-xs mt-1">{errors.soDienThoai}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Số CCCD <span className="text-red-500">*</span>
            </label>
            <input
              name="soCccd"
              value={soCccd}
              onChange={handleChange}
              placeholder="Nhập số căn cước công dân"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.soCccd ? 'border-red-500' : ''}`}
              required
            />
            {errors.soCccd && <p className="text-red-500 text-xs mt-1">{errors.soCccd}</p>}
          </div>
          
          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              name="diaChi"
              value={diaChi}
              onChange={handleChange}
              placeholder="Nhập địa chỉ của bạn"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.diaChi ? 'border-red-500' : ''}`}
              required
            />
            {errors.diaChi && <p className="text-red-500 text-xs mt-1">{errors.diaChi}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-[#777777] font-bold mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.email ? 'border-red-500' : ''}`}
              required
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-[#777777] font-bold mb-2">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              className={`w-full px-4 py-3 border rounded-lg text-[#777777] ${errors.password ? 'border-red-500' : ''}`}
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#dd5c36] text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 font-bold"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
}

export default Register;