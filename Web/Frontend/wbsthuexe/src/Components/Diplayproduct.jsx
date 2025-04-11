import React, { useState } from "react";

function Diplayproduct(props) {
    const [activeimg, setActiveimg] = useState("https://image.plo.vn/w1000/Uploaded/2025/lcemdurlq/2022_08_24/bentley-mulliner-batur-5149.jpg.webp");

  const img = [
    {
      id: 1,
      img: "https://image.plo.vn/w1000/Uploaded/2025/lcemdurlq/2022_08_24/bugatti-w16-mistral-3843.jpg.webp",
    },
    {
      id: 2,
      img: "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2024/03/1030017.jpg",
    },
    {
      id: 3,
      img: "https://www.motortrend.com/uploads/2023/06/003-2024-bentley-batur-first-drive-e1687197320308.jpg",
    },
    {
      id: 4,
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO26lPABjLEG4fBLNp2wp8ld1ehP_JoUphuw0RQ2oTR-J9oLr9_v7GJBygUZ9TqcwPAIM&usqp=CAUhttps://www.ccarprice.com/products/Bentley_Batur_2024_1.jpg",
    },
  ];
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
            {img.map((item, index) => (
              <>
                <div
                  className="w-10 h-10 bg-white hover:scale-110 rounded-md duration-300"
                  style={{
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: "cover",
                        }}
                        onClick={()=>{setActiveimg(item.img)}}
                ></div>{" "}
              </>
            ))}
          </div>
        </div>

        <div className="p-5 w-[50%] flex flex-col items-start gap-3  ">
          <h1 className="text-cam text-3xl font-bold">SH 150i Honda </h1>
          <h1 className=" text-xl font-semibold">Hãng: Honda</h1>
          <h1 className="text-xl font-semibold">
            Giá thuê: <span className="fire text-2xl">200.000 VND</span>
          </h1>{" "}
          <div>
            <p className="font-normal">Thiết kế cùng kiểu dáng hiện đại</p>
            <p className="font-normal">Thiết kế cùng kiểu dáng hiện đại</p>
            <p className="font-normal">Thiết kế cùng kiểu dáng hiện đại</p>
          </div>
          <button className=" bg-gradient-to-r from-ghi to-cam py-3 px-4 hover:scale-110 duration-300 rounded-md text-white font-bold">
            Đặt xe ngay
          </button>
        </div>
      </div>
      <div></div>
    </div>
  );
}

export default Diplayproduct;
