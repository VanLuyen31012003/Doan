import React, { useContext, useEffect, useState } from "react";
import { IoMdHeart } from "react-icons/io";
import { MotoContext } from "../Context/MotoContext";
import { toast } from "react-toastify";
import RentalModal from "./RentalModal";
import "react-toastify/dist/ReactToastify.css";
import { Tag } from "antd";
import { getToken } from "../lib/authenticate";

function Diplayproduct(props) {
  const { data } = props;
  const [activeimg, setActiveimg] = useState(data.anhDefault);
  const [listimg, setLis] = useState([]);
  const { addToCart } = useContext(MotoContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);


  useEffect(() => {
    if (data?.anhXeList) {
      const updatedList = data.anhDefault
        ? [data.anhDefault, ...data.anhXeList]
        : data.listimg;
      setLis(updatedList);
    }
    if (data?.anhDefault) {
      setActiveimg(data.anhDefault);
    }
  }, [data]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleFavoriteClick = () => {
    if (getToken() === null) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
      return; 
    }
    addToCart(data);
    setIsFavorite(true);
    setIsShaking(true);
    toast(`Đã thêm "${data.tenMau}" vào yêu thích!`, {
      bodyClassName: "text-lg font-semibold",
      className: "bg-black text-white font-bold p-4 rounded-xl",
      position: "top-center",
      autoClose: 500,
    });
    setTimeout(() => setIsShaking(false), 300);
  };
  const handleOrderClick = () => {
    if(getToken()===null){
      toast.error("Vui lòng đăng nhập để đặt xe!")
      return;
    }
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
   
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="mt-[10vw] bg-trangxam text-ghi">
      <div className="max-w-[80%] mx-auto flex pl-20">
        <div className="w-[50%] p-5">
          <img
            src={activeimg}
            alt=""
            className="w-[100%] max-h-[300px] p-5 rounded-xl object-contain"
          />
          <div className="m-auto w-[50%] gap-2 flex">
            {listimg?.map((item, index) => (
              <div
                key={index}
                className="w-10 h-10 bg-white hover:scale-110 rounded-md bg-center duration-300"
                style={{
                  backgroundImage: `url(${item})`,
                  backgroundSize: "cover",
                }}
                onClick={() => {  
                  setActiveimg(item);
                }}
              ></div>
            ))}
          </div>
        </div>

        <div className="p-5 w-[50%] flex flex-col items-start gap-3">
          <h1 className="text-cam text-3xl font-bold">{data?.tenMau}</h1>
          <h1 className="text-xl font-semibold">Hãng: {data?.tenHangXe}</h1>
          <h1 className="text-xl font-semibold">
            Giá thuê:{" "}
            <span className="fire text-2xl">{formatPrice(data?.giaThueNgay)}</span>
          </h1>
          <div>
            <p className="font-normal">{data?.moTa}</p>
          </div>
            <Tag
                        color={data?.soLuongxeconlai > 0 ? "green" : "red"}
                        className="self-start mb-2"
                      >
                        {data?.soLuongxeconlai > 0 ? "Còn hàng" : "Hết hàng"}
                      </Tag>
          <div className="flex justify-around gap-10 items-center">
            <button
              onClick={handleOrderClick}
              className="bg-gradient-to-r from-ghi to-cam py-3 px-4 hover:scale-110 duration-300 rounded-md text-white font-bold"
            >
              Đặt xe ngay
            </button>
            <IoMdHeart
              size={36}
              onClick={handleFavoriteClick}
              className={`duration-300 cursor-pointer hover:scale-125 ${
                isFavorite ? "text-cam scale-125" : "text-ghi"
              } ${isShaking ? "shake" : ""}`}
            />
          </div>
        </div>
      </div>

      {/* Sử dụng RentalModal */}
      <RentalModal
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        pricePerDay1={data?.giaThueNgay}
       data={data}
      />
    </div>
  );
}

export default Diplayproduct;