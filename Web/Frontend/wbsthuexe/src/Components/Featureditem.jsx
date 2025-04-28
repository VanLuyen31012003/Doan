import React, { use, useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { Link } from "react-router-dom";
import ApiMauXe from "../api/ApiMauXe";
function Featureditem(props) {

  const [products, setProducts] = React.useState([]);
  const fetchProducts = async () => {
    try {
      const response = await ApiMauXe.gettop10MauXe(); // Replace with your API endpoint
      const data = await response.data.data; // Adjust based on your API response structure
      setProducts(data);
      console.log(data); // Log the fetched data to the console
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <div className="  ">
      <div className=" w-full  mt-[10%] bg-[#f9f9f9] md:mt-[0%] ">
        <div className="  py-8 px-2 text-black gap-4  m-auto flex flex-col items-center justify-center  w-full md:w-[75%]">
          <h1 className="text-[#DD5C36] text-4xl text-center font-bold">
            Top các xe được đặt nhiều nhất{" "}
          </h1>
          <div className="w-[90%]  text-center">
            <p>
              Xe sau khi kết thúc hợp đồng với khách sẽ được kiểm tra, bảo
              dưỡng, thay thế các bộ phận hỏng hóc và phải đạt chuẩn an toàn xe
              trước khi giao cho khách hàng mới.
            </p>
          </div>
          <div className="mt-[30px] flex md:flex-row flex-col w-full   gap-4 overflow-x-auto scroll-container ">
            {products?.map((item, index) => (
              <Link 
  to={`/chitietsp/${item.mauXeId}`}
                className="hover:scale-105  duration-300 min-w-[250px]  md:min-w-[300px] snap-start flex flex-col gap-3  text-[#555555] shadow-lg rounded py-4"
              >
                <div
                  key={index}
                  className=" flex flex-col gap-3 bg-white  text-[#555555] shadow-lg rounded py-4"
                >
                  <img
                    src={
                      item.anhDefault || item.anhDefault !== ""
                        ? item.anhDefault
                        : "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg"
                    }
                    alt=""
                    className="w-full h-[200px] object-cover rounded-t-lg"
                  />
                  <div className="w-full flex justify-around">
                    <h1 className="px-2 font-[600] text-black">{item.tenMau}</h1>
                   <h1 className="px-2 font-[600] text-black"> {item.soluotdat} lượt đặt</h1>

                    
                  </div>
                  <ul className="px-4">
                    <li className="flex gap-1 items-center">
                      <TiTick /> 2 mũ bảo hiểm{" "}
                    </li>
                    <li className="flex gap-1 items-center">
                      <TiTick />2 áo mưa dùng 1 lần
                    </li>
                    <li className="flex gap-1 items-center">
                      <TiTick /> Bảo hiểm + Đăng kí photo
                    </li>
                  </ul>
                  <button className=" ml-3 w-[40%] p-2 rounded bg-[#DD5C36] font-medium text-[white]">
                    Đặt xe
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Featureditem;
