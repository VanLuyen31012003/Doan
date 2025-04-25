import React, { useState } from "react";
import { CiFacebook } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import { getToken, removeToken } from "../lib/authenticate";
import { IoMdLogOut } from "react-icons/io";
import { useContext } from "react";
import { MotoContext } from "../Context/MotoContext";

const tabs = [
  {
    id: 1,
    name: " Trang chủ",
    link:"/"
    
  },
  {
    id: 2,
    name: "Bảng giá",
    link:"/banggia"

  },
  {
    id: 3,
    name: "Đặt xe",
    link:"/datxe"
  },
  {
    id: 4,
    name: "Liên hệ ",
    link:"/lienhe"

  },
  {
    id: 5,
    name: "Sản phẩm ",
    link:"/allsanpham"

  },
  
]
function Navbar(props) {
  const { pathname } = useLocation();
  const [active, setActive] = useState(1);
  const {isLogin, setIsLogin} = useContext(MotoContext);
  

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundTab = tabs.find((tab) => tab.link === pathname);
    if (foundTab) {
      setActive(foundTab.id);
    }
    
  }, [pathname]);
  useEffect(() => { 
    if (getToken())
    {
      setIsLogin(true);
      
    }
    
      

  },[])

  
  return (
    <div className=" w-full md:fixed md:top-0 md:left-0 md:z-10  flex-col-reverse md:flex-row   bg-white text-[#777777] h-[110px] flex items-center justify-around">
        <img
          src="https://himoto.vn/wp-content/uploads/2024/10/himoto_black.png"
        className=" w-[25%] md:w-[15%]  p-4 "
        style={{ boxSizing: "content-box" }}
          alt="himonoto"
        />
      <div className="md:ml-[25%]  flex flex-col gap-3">
        <div className="flex gap-1 justify-end  items-center ">
          <h1 className="flex gap-1 text-sm   font-semibold ">Liên Hệ <p className="text-[#dd5c36] font-bold">0886184116</p> </h1>
          {
            isLogin===true ?
              <IoMdLogOut size={28} color="#777777 " className="ml-3 hover:scale-150 duration-300 "
              
                onClick={() => { setIsLogin(false);removeToken(); alert("Bạn đã đăng xuất") }}
              />
               : <Link to='/login'><IoPersonCircleOutline size={28} color="#777777 " className="ml-3 hover:scale-150 duration-300" /></Link>
          }
           <CiFacebook size={28} color="#777777 " className="ml-1 hover:scale-150 duration-300" />        </div>
        <ul className="hidden md:flex gap-5 text-[16px] ">
          {
            tabs.map((item, index) => (
              <Link to={`${item.link}`}
                key={item.id}
                className={` hover:underline cursor-pointer duration-300 font-bold ${active === item.id ? "text-[#dd5c36]" : ""} `

                }
                onClick={() => { setActive(item.id) }}

              >{item.name}</Link>
            ))
          }
          {/* <li className=" hover:underline cursor-pointer font-bold  text-[#dd5c36]">Trang chủ</li>
          <li className=" hover:underline cursor-pointer font-bold ">Bảng giá</li>
          <li className=" hover:underline cursor-pointer font-bold ">Đặt xe</li>
          <li className=" hover:underline cursor-pointer font-bold ">Liên hệ</li> */}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
