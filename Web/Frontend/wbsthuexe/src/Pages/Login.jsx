import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function Login(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
      const navigate = useNavigate();

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý đăng nhập
    console.log('Form submitted', { 
      email,
      password,
      rememberMe
    });
    
  };

  return (
    <>
      <div className='text-[#ffffff] h-[300px] bg-[#555555] flex items-center'>
        <div className='w-[70%] items-start flex flex-col gap-5 mt-8 mx-auto'>
          <h1 className='text-2xl md:text-4xl font-bold'>ĐĂNG NHẬP</h1>
          <p className='text-xs md:text-xl'>Đăng nhập để truy cập vào tài khoản của bạn</p>
        </div>
      </div>
      
      <div className="bg-[#f9f9f9] p-6 rounded-lg shadow-md max-w-lg mx-auto -mt-14">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#DD5C36]">
          Đăng Nhập
        </h2>

        <form onSubmit={handleSubmit}>
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

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="rememberMe" className="text-[#777777]">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <Link to="/#" className="text-[#DD5C36] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#dd5c36] text-white py-3 rounded-lg hover:bg-red-600 transition duration-300 font-bold"
          onClick={()=>{navigate('/')}}
                  >
            Đăng Nhập
          </button>
        </form>

        <div className="text-center mt-6 text-[#777777]">
          Chưa có tài khoản? <Link to="#" className="text-[#DD5C36] hover:underline">Đăng ký ngay</Link>
        </div>
      </div>
    </>
  );
}

export default Login;