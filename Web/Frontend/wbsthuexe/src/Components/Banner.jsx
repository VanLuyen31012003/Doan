import React from 'react';

function Banner(props) {
    const { state } = props;
    return (
        <div className='relative   bg-cover bg-[center_80%]  bg-no-repeat w-full h-[40vh]  md:h-[80vh] bg-banner'>
            <div className='absolute inset-0 bg-black bg-opacity-60 text-white flex flex-col justify-center items-center'>
                <div className=' p-5 w-full md:w-[80%]    '>
                    {
                        state===1? ( <div className=' flex flex-col gap-4 justify-stretch w-full h-auto items-start text-xs '>
                           <h1 className='md:text-xl  font-light'> Chúng tôi là <span className="font-bold">HIMOTO®</span></h1>
                            <h1 className='md:text-5xl  font-extrabold  leading-tight'> Đơn vị cho thuê xe máy  <br/> uy tín tại Việt Nam</h1>
                            <h1 className='mt-4  py-2  text-white  md:text-lg'>HIMOTO cam kết mang đến dịch vụ cho thuê xe máy chuyên nghiệp, đáng tin cậy cho khách hàng.</h1>
                            <button className='mt-6 px-2 py-1  w-[15%] min-w-[180px] border-white text-white text-lg font-semibold rounded-sm   border-[3px]  hover:bg-white hover:text-black transition'> ĐẶT XE NGAY</button>
                    </div>):""
                    }
                   
                </div>
                   
            </div>
        </div>
    );
}

export default Banner;