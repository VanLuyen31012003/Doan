import React, { useEffect, useState } from "react";
import ApiMauXe from "../api/ApiMauXe";
import { useNavigate } from "react-router-dom";

function RelateProduct(props) {
  const { data } = props;
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const fetchdata = async () => {
    try {
      console.log("Fetching recommended products for mauXeId:", data.mauXeId);
      const response = await ApiMauXe.getrecommendedMauXe(data.mauXeId);
      
      // Sử dụng similar_mau_xe từ response mới
      setProduct(response.data.data.similar_mau_xe || []);
      console.log("Similar products:", response.data.data.similar_mau_xe);
    } catch (error) {
      console.error("Error fetching product data:", error);
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
        <div className="overflow-x-auto scrollbar-hide scroll-container">
          <div className="flex gap-6">
            {product?.map((item, index) => (
              <div
                key={item.mau_xe_id} // Sử dụng mau_xe_id thay vì index
                className="min-w-[250px] snap-start flex flex-col gap-3 bg-white text-[#555555] shadow-lg rounded-lg py-4 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => {
                  navigate(`/chitietsp/${item.mau_xe_id}`);
                }}
              >
                <img
                  className="w-full h-[150px] object-cover rounded-t-lg"
                  src={item.anhdefault}
                  alt={item.ten_mau}
                />
                <div className="flex justify-between items-center px-2">
                  <h1 className="font-semibold text-black">{item.ten_mau}</h1>
                  <h1 className="font-bold text-[#DD5C36]">
                    {formatPrice(item.gia_thue_ngay)}
                  </h1>
                </div>

                {/* Hiển thị độ tương đồng nếu có */}
                {item.similarity && (
                  <div className="px-2">
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                      Tương đồng: {(item.similarity * 100).toFixed(1)}%
                    </span>
                  </div>
                )}

                <div className="px-2">
                  <button className="w-full p-2 rounded bg-[#DD5C36] font-medium text-white hover:bg-[#bb4a2e] transition-colors">
                    Đặt xe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hiển thị thông báo nếu không có sản phẩm liên quan */}
        {product.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Không có sản phẩm liên quan nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default RelateProduct;