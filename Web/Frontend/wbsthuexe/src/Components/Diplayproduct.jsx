import React, { useEffect, useState } from "react";
import { IoMdHeart } from "react-icons/io";

function Diplayproduct(props) {
  const { data } = props;
  const [activeimg, setActiveimg] = useState(data.anhDefault);
  const [listimg,setLis] =useState([])
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

  return (
    <div className="  mt-[10vw] bg-trangxam text-ghi ">
      <div className="  max-w-[80%] mx-auto flex pl-20 ">
        <div className="w-[50%] p-5">
          <img
            src={activeimg}
            alt=""
            className="w-[100%] max-h-[300px] p-5 rounded-xl"
          />
          <div className="m-auto w-[50%] gap-2 flex  ">
            {/* {console.log("đây là ảnh xe list",data.anhXeList)} */}
            {listimg?.map((item, index) => (
              <>
                <div
                  className="w-10 h-10 bg-white hover:scale-110 rounded-md bg-center duration-300"
                  style={{
                    backgroundImage: `url(${item})`,
                    backgroundSize: "cover",
                        }}
                        onClick={()=>{setActiveimg(item)}}
                ></div>{" "}
              </>
            ))}
          </div>
        </div>

        <div className="p-5 w-[50%] flex flex-col items-start gap-3  ">
          <h1 className="text-cam text-3xl font-bold">{data?.tenMau} </h1>
          <h1 className=" text-xl font-semibold">Hãng: { data?.tenHangXe}</h1>
          <h1 className="text-xl font-semibold">
            Giá thuê: <span className="fire text-2xl">{data?.giaThueNgay} VND</span>
          </h1>{" "}
          <div>
            <p className="font-normal">{data?.moTa}</p>
                        <p className="font-normal">{data?.moTa }</p>

                        <p className="font-normal">{data?.moTa }</p>

            {/* <p className="font-normal">Thiết kế cùng kiểu dáng hiện đại</p>
            <p className="font-normal">Thiết kế cùng kiểu dáng hiện đại</p> */}
          </div>
          <div className="flex justify-around gap-10 items-center ">
            <button className=" bg-gradient-to-r from-ghi to-cam py-3 px-4 hover:scale-110 duration-300 rounded-md text-white font-bold">
            Đặt xe ngay
            </button>
            <IoMdHeart size={36} className='text-cam  hover:scale-125  duration-300 ' />
            
          </div>
          
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Diplayproduct;
