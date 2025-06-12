import React, { useState, useEffect, useContext } from "react";
import { CiFacebook } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiLoginBoxFill } from "react-icons/ri";
import { MotoContext } from "../Context/MotoContext";
import { getToken, removeToken } from "../lib/authenticate";

const tabs = [
  { id: 1, name: "Trang chủ", link: "/" },
  { id: 2, name: "Tin tức HOT", link: "/postwordpress" },
  // { id: 3, name: "Đặt xe", link: "/datxe" },
  { id: 4, name: "Liên hệ", link: "/lienhe" },
  { id: 5, name: "Sản phẩm", link: "/allsanpham" },
  {id:6, name: "Hướng dẫn", link: "/huongdan"},
];

function Navbar() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(1);
  const { isLogin, setIsLogin } = useContext(MotoContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundTab = tabs.find((tab) => tab.link === pathname);
    if (foundTab) {
      setActive(foundTab.id);
    }
  }, [pathname]);

  useEffect(() => {
    if (getToken()) {
      setIsLogin(true);
    }
  }, []);

  const handleLogout = () => {
    setIsLogin(false);
    removeToken();
    alert("Bạn đã đăng xuất");
  };

  return (
    <div className="w-full   md:top-0 md:left-0 md:z-10 flex flex-col-reverse md:flex-row bg-white text-[#777777] h-[110px] items-center justify-around">
  
      <h1 style={{ fontSize: "48px", fontWeight: "1000", color: "black" }}> MOTOVIP</h1>

      <div className="md:ml-[25%]  flex flex-col gap-3 relative">
        <div className="flex gap-1 font-bold  justify-end items-center">
          {/* <div className="flex flex-col "> */}
            Liên Hệ
          <h8 className="flex gap-1 text-lg font-bold">
            <h8 className="text-[#dd5c36] font-bold">0886184116</h8>
          </h8>
          {/* </div> */}
          

          {isLogin ? (
            <div className="relative group">
              <IoPersonCircleOutline
                size={28}
                color="#777777"
                className="ml-3 hover:scale-150 duration-300 cursor-pointer"
              />
              <div className="absolute top-10 right-0 bg-white shadow-md rounded-md w-40 z-50 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link
                  to="/infouser"
                  className="px-4 py-2 hover:bg-gray-100 border-b text-sm font-medium"
                >
                  Thông tin tài khoản
                </Link>
                <Link
                  to="/yeuthich"
                  className="px-4 py-2 hover:bg-gray-100 border-b text-sm font-medium"
                >
                  Yêu thích
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-100 text-left text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <RiLoginBoxFill
                size={28}
                color="#777777"
                className="ml-3 hover:scale-150 duration-300"
              />
            </Link>
          )}

          <CiFacebook
            size={28}
            color="#777777"
            className="ml-1 hover:scale-150 duration-300"
          />
        </div>

        <ul className="hidden md:flex gap-5 text-[16px]">
          {tabs.map((item) => (
            <Link
              key={item.id}
              to={item.link}
              className={`hover:underline cursor-pointer duration-300 font-bold ${
                active === item.id ? "text-[#dd5c36]" : ""
              }`}
              onClick={() => setActive(item.id)}
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
