import React, {  useEffect, useState } from "react";
import ApiMauXe from "../api/ApiMauXe";
import { useNavigate } from "react-router-dom";

function RelateProduct(props) {
  const { data } = props;
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();
  const fetchdata = async () => {
    try {
      console.log(
        "data.loaiXeReponse.loaixeXeid",
        data.loaiXeReponse.loaixeXeid
      );
      const response = await ApiMauXe.getMauXeByloaixe(
        data.loaiXeReponse.loaixeXeid
      ); // Gọi API để lấy dữ liệu sản phẩm theo id
      setProduct(response.data.data.content); // Cập nhật state với dữ liệu sản phẩm
      console.log("day là relate ", response.data.data); // In dữ liệu sản phẩm ra console để kiểm tra
    } catch (error) {
      console.error("Error fetching product data:", error); // Xử lý lỗi nếu có
    }
  };
   const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  useEffect(() => {
    fetchdata();
  }, [data]);

  return (
    <div className="w-full bg-gray-100 py-6">
      <div className="w-[80%] mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Sản phẩm liên quan
        </h2>

        {/* Vùng cuộn ngang */}
        <div className="overflow-x-auto scrollbar-hide scroll-container ">
          {console.log("day là id loai xe", data.loaiXeReponse?.loaixeXeid)}

          <div className="flex gap-6">
            {product?.map((item, index) => (
              <div
                key={index}
                    className="min-w-[250px] snap-start flex flex-col gap-3 bg-white text-[#555555] shadow-lg rounded-lg py-4"
                onClick={() => {
                  navigate(`/chitietsp/${item.mauXeId}`)
                }}
                

                
              >
                <img
                  className="w-full h-[150px] object-cover rounded-t-lg"
                  src={item.anhDefault}
                        alt={item.tenMau}
                        
                />
                <div className="flex justify-around ">
                  <h1 className="px-2 font-semibold text-black">{item.tenMau}</h1>
                <h1 className="px-2 font-bold fire "> {formatPrice(item.giaThueNgay)}</h1>
                </div>
                
                <ul className="px-4">
                  {/* <li className="flex gap-1 items-center"><TiTick /> 2 mũ bảo hiểm</li>
                    <li className="flex gap-1 items-center"><TiTick /> 2 áo mưa dùng 1 lần</li>
                    <li className="flex gap-1 items-center"><TiTick /> Bảo hiểm + Đăng kí photo</li> */}
                </ul>
                <button className="ml-3 w-[40%] p-2 rounded bg-[#DD5C36] font-medium text-white">
                  Đặt xe 
                  
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RelateProduct;
