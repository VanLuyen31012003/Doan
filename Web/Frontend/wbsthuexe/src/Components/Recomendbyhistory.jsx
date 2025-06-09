import React, {  useEffect, useState } from "react";
import ApiMauXe from "../api/ApiMauXe";
import { useNavigate } from "react-router-dom";

function Recomendbyhistory(props) {
  const { data } = props;
    const [product, setProduct] = useState([]);
    const navigate = useNavigate();
  const fetchdata = async () => {
    try {
      const response = await ApiMauXe.getrecomendbyhistory(
        data
      ); // Gọi API để lấy dữ liệu sản phẩm theo id
      setProduct(response.data.data); // Cập nhật state với dữ liệu sản phẩm
    } catch (error) {
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
          Sản phẩm gợi ý cho bạn
        </h2>

        {/* Vùng cuộn ngang */}
        <div className="overflow-x-auto scrollbar-hide scroll-container ">
          <div className="flex gap-6">
            {product?.map((item, index) => (
              <div
                key={index}
                    className="min-w-[250px] snap-start flex flex-col gap-3 bg-white text-[#555555] shadow-lg rounded-lg py-4"
                onClick={() => {
                  navigate(`/chitietsp/${item.mau_xe_id}`)
                }}             
              >
                <img
                  className="w-full h-[150px] object-cover rounded-t-lg"
                  src={item.anhdefault}
                        alt={item.ten_mau}
                        
                />
                <div className="flex justify-around ">
                  <h1 className="px-2 font-semibold text-black">{item.ten_mau}</h1>
                <h1 className="px-2 font-bold fire "> {formatPrice(item.gia_thue_ngay)}</h1>
                </div>
                
                <ul className="px-4">
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

export default Recomendbyhistory;
