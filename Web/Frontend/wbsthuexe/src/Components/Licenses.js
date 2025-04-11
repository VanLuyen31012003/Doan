import React from 'react';
import { BsFillHouseHeartFill } from "react-icons/bs";
import { FaPeopleLine } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa";

function Licenses(props) {
    return (
        <div className='w-full flex justify-center items-center mt-[5%] text-[#2c2a29]'>
            <div className=' w-[75%] flex '>
                <img src="https://himoto.vn/wp-content/uploads/2024/02/HIMOTO-Thue-Xe-May-Vector.png"
                     className='w-[50%]'
                     alt="" />
                <div className='flex flex-col gap-5 text-[14px] '>
                    <h1 className='text-[#DD5C36] text-4xl font-bold'>Thủ tục thuê xe. </h1>
                    <h2 className='text-xl '>Đơn giản với khách ở Hà Nội và khác du lịch</h2>
                    <ul className=' flex flex-col gap-8'>
                        <l1 className="flex gap-4 justify-center items-center">
                            <BsFillHouseHeartFill size={50} className='text-[#3adf74]' />    
                            <div>
                                <h1 className='text-[#3E4F44] text-xl font-bold'>Khách sống tại Hà Nội</h1>
                                <p className='font-semibold'>1 trong các loại giấy tờ sau: Thẻ căn cước công dân, chứng minh thư, hộ chiếu hoặc sổ hộ khẩu gốc.</p>
                            </div>
                        </l1>
                        <l1 className="flex gap-4 justify-center items-center">
                            <FaPeopleLine size={50} className='text-[#3adf74]' />
                            <div>
                                <h1 className='text-[#3E4F44] text-xl font-bold'>Khách sống tại Hà Nội</h1>
                                <p  className='font-semibold '>1 trong các loại giấy tờ sau: Thẻ căn cước công dân, chứng minh thư, hộ chiếu hoặc sổ hộ khẩu gốc.</p>
                            </div>
                        </l1>
                        <l1 className="flex gap-4 justify-center items-center">
                            <FaWallet size={50} className='text-[#3adf74]'/>
                            <div>
                                <h1 className='text-[#3E4F44] text-xl font-bold'>Khách sống tại Hà Nội</h1>
                                <p  className='font-semibold'>1 trong các loại giấy tờ sau: Thẻ căn cước công dân, chứng minh thư, hộ chiếu hoặc sổ hộ khẩu gốc.</p>
                            </div>
                        </l1>
                    </ul>
                </div>
        </div>
        </div>
        
    );
}

export default Licenses;
