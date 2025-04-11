import React from "react";
import { TiTick } from "react-icons/ti";
import { Link } from "react-router-dom";

const a = [
  {
    id: 1,
    img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
    name: "Xe số - chỉ từ 60k/ngày",
  },
  {
    id: 2,
    img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
    name: "Xe số - chỉ từ 60k/ngày",
  },
  {
    id: 3,
    img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
    name: "Xe số - chỉ từ 60k/ngày",
    },
  {
    id: 4,
    img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
    name: "Xe số - chỉ từ 60k/ngày",
    },
  
];
function Featureditem(props) {
  return (
    <div className="  ">
      <div className=" w-full  mt-[10%] bg-[#f9f9f9] md:mt-[40%] ">
         <div className="  py-8 px-2 text-black gap-4  m-auto flex flex-col items-center justify-center  w-full md:w-[75%]">
        <h1 className="text-[#DD5C36] text-4xl text-center font-bold">Danh mục xe thông dụng</h1>
        <div className="w-[90%]  text-center">
          <p>
            Xe sau khi kết thúc hợp đồng với khách sẽ được kiểm tra, bảo dưỡng,
            thay thế các bộ phận hỏng hóc và phải đạt chuẩn an toàn xe trước khi
            giao cho khách hàng mới.
          </p>
        </div>
        <div className="mt-[30px] flex md:flex-row flex-col  gap-4">
            {a.map((item, index) => (
              <Link to="/chitietsp">
                   <div key={index} className=" flex flex-col gap-3 bg-white text-[#555555] shadow-lg rounded py-4">
              <img src={item.img} alt=""/>
                <h1 className="px-2 font-[600] text-black">{ item.name}</h1>
              <ul className="px-4">
                <li className="flex gap-1 items-center"><TiTick/> 2 mũ bảo hiểm </li>
                <li className="flex gap-1 items-center"><TiTick/>2 áo mưa dùng 1 lần</li>
                <li className="flex gap-1 items-center"><TiTick/> Bảo hiểm + Đăng kí photo</li>
              </ul>
              <button  className=" ml-3 w-[40%] p-2 rounded bg-[#DD5C36] font-medium text-[white]">Đặt xe</button>
            </div>
            </Link>
         
                  ))
          }
        </div>
      </div>
      </div>
     
    </div>
  );
}

export default Featureditem;
