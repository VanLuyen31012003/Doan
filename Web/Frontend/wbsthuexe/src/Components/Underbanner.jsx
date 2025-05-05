import React from 'react';
import { TiTick } from "react-icons/ti";
import { SiTicktick } from "react-icons/si";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { FaShieldAlt } from "react-icons/fa";
import { useState } from "react";

const tabs = [
    {
        id: 1,
        nameTabs: "Thuê xe máy tại Hà Nội",
        img: 'https://himoto.vn/wp-content/uploads/2024/01/thue-xe-may-ha-noi.jpg',
        bt:"Đặt xe tại Hà Nội"
    },
    {
        id: 2,
        nameTabs: "Thuê xe máy tại Sài Gòn",
        img: 'https://himoto.vn/wp-content/uploads/2024/02/thue-xe-may-sai-gon.jpg',
         bt:"Đặt xe tại Sài Gòn"

    },
    {
        id: 3,
        nameTabs: "Thuê xe máy tại Đà Nẵng",
        img: 'https://himoto.vn/wp-content/uploads/2024/02/thue-xe-may-da-nang.jpg',
        bt:"Open Soon"

    },
]
function Underbanner(props) {
      const [activeTab, setActiveTab] = useState(1);

    return (
        <div className=' md:relative  flex flex-col items-center  mb-[40%]   '>
            <div className=' md:absolute md:top-[-10vh]  w-full md:w-[75%]   ' >
                <div className='  items-center rounded-t-md  w-full gap-2 md:gap-0 md:max-w-[100%] lg:max-w-[75%] xl:max-w-[60%] h-[15%] flex flex-col md:flex-row '>
                    {
                        tabs.map((item, index) => (
                            <div
                                key={index}
                                className={`${activeTab === item.id ?"bg-[#f9f9f9] text-[#DD5C36] duration-600 py-6  ":"bg-[#555555] text-white py-5 " }  w-full  
                                font-medium h-full py-5  justify-center items-center flex rounded-t-lg flex-1`}
                                onClick={() => { setActiveTab(item.id) }}
                            >{item.nameTabs}</div>
                        ))
                    }
            </div>
            <div className='flex flex-col md:flex-row  w-full gap-6   h-[85%] rounded-b-md justify-between rounded-r-md  bg-[#f9f9f9] shadow-xl   p-12 '>
                    <div className='w-full md:w-[50%] gap-4 flex-col flex'>
                    <h1 className='font-semibold text-xl '>Tại sao chọn MOTOVIP</h1>
                    <ul className='gap-2 flex-col  flex items-start text-[#2c2a29]'>
                        <li className='flex gap-2 items-center'><TiTick className='text-[#DD5C36]' /> Ngày đầu thuê tròn 24H </li>
                        <li className='flex gap-2 items-center'><TiTick className='text-[#DD5C36]'/> Tiền đặt cọc chỉ từ 500.000VND</li>
                        <li className='flex gap-2 items-center'><TiTick className='text-[#DD5C36]'/> Xe đời mới cao cấp, đa chủng loại</li>
                        <li className='flex gap-2 items-center'><TiTick className='text-[#DD5C36]'/>Có cơ sở ở các quận, huyện</li> 
                        <button className='bg-[#DD5C36] px-4 py-3 rounded-md text-white'>{tabs.find((item)=>item.id===activeTab).bt}</button>
                    </ul>
                </div>
                <div className=' flex w-full md:w-[50%] h-full   items-center justify-center '>
                    <img src={tabs.find((item)=>item.id===activeTab).img}
                            alt=""                         
                        className='hover:scale-105 duration-300 w-[100%] aspect-[16/9] object-cover rounded-md'
                    />
                </div>
                </div>
                
                <div className='flex flex-col md:flex-row items-center  gap-3   justify-between md:mt-[8%] mb-4 '>
                    <div className=' w-[75%] md:w-[32%] h-[10vh] border-solid border-[2px]  flex justify-around items-center rounded-md '>
                        <SiTicktick size={38} className='text-[#DD5C36]'/>
                        <div className='w-[70%]'>
                            <h1>Thủ tục cực nhanh</h1>
                            <p>15 phút là có xe vi vu</p>
                        </div>
                    </div>
                    <div className=' w-[75%] md:w-[32%] h-[10vh] border-solid border-[2px]  flex justify-around items-center rounded-md '>
                        <RiMoneyDollarCircleFill size={46} className='text-[#DD5C36]'/>
                        <div className='w-[70%]'>
                             <h1>Thủ tục cực nhanh</h1>
                            <p>15 phút là có xe vi vu</p>
                        </div>
                    </div>
                    <div className=' w-[75%] md:w-[32%] h-[10vh] border-solid border-[2px]  flex justify-around items-center rounded-md '>
                        <FaShieldAlt size={38} className='text-[#DD5C36]' />
                        <div className='w-[70%]'>
                             <h1>Thủ tục cực nhanh</h1>
                            <p>15 phút là có xe vi vu</p>
                        </div>
                    </div>


                </div>
        </div>       
        </div>
    );
}

export default Underbanner;