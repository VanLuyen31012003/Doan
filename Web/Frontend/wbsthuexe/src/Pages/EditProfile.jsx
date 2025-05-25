import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiKhachHang from "../api/ApiKhachHang";
import { FaUserEdit, FaSave, FaArrowLeft } from "react-icons/fa";

function EditProfile() {
  const [userInfo, setUserInfo] = useState({
    hoTen: "",
    email: "",
    soDienThoai: "",
    diaChi: "",
    soCccd: "",
    matKhau: "",
    xacNhanMatKhau: ""
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin người dùng hiện tại
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await ApiKhachHang.getinfo();
        if (response.data.success) {
          const userData = response.data.data;
          setUserInfo({
            hoTen: userData.hoTen || "",
            email: userData.email || "",
            soDienThoai: userData.soDienThoai || "",
            diaChi: userData.diaChi || "",
            soCccd: userData.soCccd || "",
            matKhau: "",
            xacNhanMatKhau: ""
          });
        }
      } catch (error) {
        toast.error("Không thể lấy thông tin người dùng");
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate dữ liệu
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate họ tên
    if (!userInfo.hoTen.trim()) {
      newErrors.hoTen = "Họ tên không được để trống";
      isValid = false;
    } else if (userInfo.hoTen.trim().length < 2) {
      newErrors.hoTen = "Họ tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Validate số điện thoại
    if (!userInfo.soDienThoai.trim()) {
      newErrors.soDienThoai = "Số điện thoại không được để trống";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(userInfo.soDienThoai)) {
      newErrors.soDienThoai = "Số điện thoại phải có 10 chữ số";
      isValid = false;
    }

    // Validate email (không cho phép thay đổi email, chỉ hiển thị)
    if (!userInfo.email.trim()) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate địa chỉ
    if (!userInfo.diaChi.trim()) {
      newErrors.diaChi = "Địa chỉ không được để trống";
      isValid = false;
    } else if (userInfo.diaChi.trim().length < 5) {
      newErrors.diaChi = "Địa chỉ quá ngắn";
      isValid = false;
    }

    // Validate CCCD
    if (!userInfo.soCccd.trim()) {
      newErrors.soCccd = "Số CCCD không được để trống";
      isValid = false;
    } else if (!/^[0-9]{12}$/.test(userInfo.soCccd)) {
      newErrors.soCccd = "Số CCCD phải có 12 chữ số";
      isValid = false;
    }

    // Validate mật khẩu nếu người dùng chọn đổi mật khẩu
    if (isChangingPassword) {
      if (!userInfo.matKhau) {
        newErrors.matKhau = "Mật khẩu không được để trống";
        isValid = false;
      } else if (userInfo.matKhau.length < 6) {
        newErrors.matKhau = "Mật khẩu phải có ít nhất 6 ký tự";
        isValid = false;
      }

      if (userInfo.matKhau !== userInfo.xacNhanMatKhau) {
        newErrors.xacNhanMatKhau = "Xác nhận mật khẩu không khớp";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setLoading(true);
      
      // Xây dựng object dữ liệu cập nhật (không bao gồm mật khẩu nếu không đổi)
      const updateData = {
        hoTen: userInfo.hoTen,
        email: userInfo.email,
        soDienThoai: userInfo.soDienThoai,
        diaChi: userInfo.diaChi,
        soCccd: userInfo.soCccd,
      };
      
      // Thêm mật khẩu nếu người dùng muốn đổi
      if (isChangingPassword && userInfo.matKhau) {
        updateData.matKhau = userInfo.matKhau;
      }
      
      // Gọi API cập nhật thông tin
      const response = await ApiKhachHang.updateInfo(updateData);
      
      if (response.data.success) {
        toast.success("Cập nhật thông tin thành công!");
        setTimeout(() => {
          navigate("/infouser");
        }, 1500);
      } else {
        toast.error(response.data.message || "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error(error.response?.data?.message || "Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-[#ffffff] h-[300px] bg-[#555555] flex items-center">
        <div className="w-[70%] items-start flex flex-col gap-5 mt-8 mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold">Chỉnh sửa thông tin</h1>
          <p className="text-xs md:text-xl">
            Cập nhật thông tin cá nhân của bạn
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto -mt-14 mb-20">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dd5c36] mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <FaUserEdit className="text-[#dd5c36] text-3xl" />
                  <h2 className="text-xl font-bold text-[#dd5c36]">Cập nhật thông tin tài khoản</h2>
                </div>
                <button 
                  type="button" 
                  onClick={() => navigate('/profile')}
                  className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
                >
                  <FaArrowLeft size={14} /> Quay lại
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {/* Họ tên */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hoTen"
                    value={userInfo.hoTen}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                      errors.hoTen ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.hoTen && <p className="text-red-500 text-sm mt-1">{errors.hoTen}</p>}
                </div>

                {/* Email - Disabled (không cho sửa email) */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email <span className="text-gray-500">(Không thể thay đổi)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="soDienThoai"
                    value={userInfo.soDienThoai}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                      errors.soDienThoai ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.soDienThoai && <p className="text-red-500 text-sm mt-1">{errors.soDienThoai}</p>}
                </div>

                {/* Số CCCD */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Số CCCD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="soCccd"
                    value={userInfo.soCccd}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                      errors.soCccd ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.soCccd && <p className="text-red-500 text-sm mt-1">{errors.soCccd}</p>}
                </div>

                {/* Địa chỉ - Full width */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="diaChi"
                    value={userInfo.diaChi}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                      errors.diaChi ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.diaChi && <p className="text-red-500 text-sm mt-1">{errors.diaChi}</p>}
                </div>

                {/* Checkbox thay đổi mật khẩu */}
                <div className="md:col-span-2 mt-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="changePassword"
                      checked={isChangingPassword}
                      onChange={() => setIsChangingPassword(!isChangingPassword)}
                      className="mr-2 h-4 w-4 text-[#dd5c36]"
                    />
                    <label htmlFor="changePassword" className="text-gray-700">
                      Thay đổi mật khẩu
                    </label>
                  </div>
                </div>

                {/* Phần đổi mật khẩu, hiện khi checkbox được chọn */}
                {isChangingPassword && (
                  <>
                    {/* Mật khẩu mới */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Mật khẩu mới <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="matKhau"
                        value={userInfo.matKhau}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                          errors.matKhau ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.matKhau && <p className="text-red-500 text-sm mt-1">{errors.matKhau}</p>}
                    </div>

                    {/* Xác nhận mật khẩu mới */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Xác nhận mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        name="xacNhanMatKhau"
                        value={userInfo.xacNhanMatKhau}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#dd5c36] ${
                          errors.xacNhanMatKhau ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.xacNhanMatKhau && (
                        <p className="text-red-500 text-sm mt-1">{errors.xacNhanMatKhau}</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Nút lưu */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#dd5c36] text-white px-6 py-3 rounded-md hover:bg-[#c14021] transition-colors flex items-center gap-2 font-medium"
                >
                  <FaSave /> Lưu thay đổi
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
}

export default EditProfile;