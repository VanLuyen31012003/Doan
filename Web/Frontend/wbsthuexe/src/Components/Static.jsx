import React, { useEffect, useRef } from "react";
import { FaMotorcycle } from "react-icons/fa";
import { FaHandshakeSimple } from "react-icons/fa6";
import { PiSealPercentFill } from "react-icons/pi";
import { LuClock } from "react-icons/lu";
import { PiCertificate } from "react-icons/pi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";

const partner = [
  {
    id: 1,
    img: "https://cdn.brvn.vn/editor/2019/06/1540460966309Momo_1560238288.png"
  },
  {
    id: 2,
    img: "https://canhme.com/wp-content/uploads/2016/01/Paypal.png"
  },
  {
    id: 3,
    img: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png"
  }
];

const star = [
  {
    id: 1,
    comment: "Mình có thuê xe máy ở đây, xe đi tốt, không lỗi gì, thủ tục thuê xe đơn giản, chỉ cần cọc lại ít tiền giá lại hợp lý. Chủ và nhân viên nhẹ nhàng, có dịp sẽ quay lại.",
    img: "https://himoto.vn/wp-content/uploads/2023/09/terminal3.jpeg",
    name: "Thảo Lê",
    job: "Sinh Viên"
  },
  {
    id: 2,
    comment: "HIMOTO thực sự là một công ty tuyệt vời trong lĩnh vực thuê xe máy. Từ trải nghiệm của bản thân, tôi có thể chắc chắn bạn sẽ cảm thấy hài lòng với dịch vụ của họ.",
    img: "https://himoto.vn/wp-content/uploads/2023/09/terminal2.jpeg",
    name: "Diệu Bình",
    job: "Khách du lịch"
  },
  {
    id: 3,
    comment: "Dịch vụ tốt, mở cửa thuê xe tới 21PM. Nhưng tốt nhất các bạn nên đặt trước để có thể chuẩn bị đủ xe do sẽ có nhiều chi nhánh, mình thuê ở chi nhánh 66B Thuốc Bắc",
    img: "https://himoto.vn/wp-content/uploads/2023/09/terminal1.jpeg",
    name: "Hà Nguyễn",
    job: "Nhân viên văn phòng"
  }
];

function Static() {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    function animateCounter(id, target, duration, word) {
      let counter = document.getElementById(id);
      if (!counter) return;
      let start = 0;
      let increment = target / (duration / 16);

      function updateCounter() {
        start += increment;
        if (start >= target) {
          counter.innerText = target + " " + word;
        } else {
          counter.innerText = Math.floor(start);
          requestAnimationFrame(updateCounter);
        }
      }
      updateCounter();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter("counter1", 6085, 2000, "+");
            animateCounter("counter2", 386, 2000, "Xe");
            animateCounter("counter3", 98, 2000, "%");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  }, []);

  return (
    <div>
      {/* First Section - Stats */}
      <div ref={sectionRef} className="w-full bg-[#DD5C36] flex justify-center items-center mt-[5vh] py-8 md:py-12">
        <div className="text-white w-[90%] md:w-[80%] lg:w-[75%] flex flex-col justify-start">
          <div className="w-full flex flex-col gap-4 items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center">Những con số biết nói</h1>
            <p className="text-lg md:text-xl text-center">Hãy tham khảo một vài thống kê của HIMOTO</p>
            <div className="w-full flex flex-col md:flex-row justify-around mt-8 md:mt-[10vh] gap-8 md:gap-4">
              <div className="w-full md:w-[30%] flex flex-col items-center justify-center gap-4">
                <FaHandshakeSimple size={40} className="md:text-[60px]" />
                <div className="items-center justify-center">
                  <h1 id="counter1" className="text-center text-4xl md:text-5xl lg:text-7xl font-semibold">0</h1>
                  <p className="text-xl md:text-2xl text-center">Đơn thuê xe thành công</p>
                </div>
              </div>
              <div className="w-full md:w-[30%] flex flex-col items-center justify-center gap-4 mt-6 md:mt-0">
                <FaMotorcycle size={40} className="md:text-[60px]" />
                <div className="items-center justify-center">
                  <h1 id="counter2" className="text-center text-4xl md:text-5xl lg:text-7xl font-semibold">0</h1>
                  <p className="text-xl md:text-2xl text-center">Tổng xe đang vận hành</p>
                </div>
              </div>
              <div className="w-full md:w-[30%] flex flex-col items-center justify-center gap-4 mt-6 md:mt-0">
                <PiSealPercentFill size={40} className="md:text-[60px]" />
                <div className="items-center justify-center">
                  <h1 id="counter3" className="text-center text-4xl md:text-5xl lg:text-7xl font-semibold">0</h1>
                  <p className="text-xl md:text-2xl text-center">Khách hàng đang hài lòng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Second Section - Features */}
      <div className="w-full bg-[#f9f9f9] flex justify-center items-center py-12 md:pt-36">
        <div className="text-[#DD5C36] w-[90%] md:w-[80%] lg:w-[75%] flex flex-col justify-start">
          <div className="w-full flex flex-col gap-4 items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">HIMOTO - Giải pháp thuê xe đáng tin cậy</h1>
            <p className="text-xl md:text-2xl text-[#2c2a29] text-center">Trải nghiệm dịch vụ thuê xe máy hoàn toàn mới</p>
            <div className="w-full flex flex-wrap justify-around mt-8 md:mt-[10vh] gap-6">
              <div className="w-[45%] md:w-[22%] flex flex-col items-center justify-center gap-4 mb-6">
                <LuClock size={40} className="md:text-[60px] text-[#54595f]" />
                <div className="items-center justify-center">
                  <p className="text-lg md:text-xl font-medium text-center">15 phút là có xe đi</p>
                </div>
              </div>
              <div className="w-[45%] md:w-[22%] flex flex-col items-center justify-center gap-4 mb-6">
                <PiCertificate size={40} className="md:text-[60px] text-[#54595f]" />
                <div className="items-center justify-center">
                  <p className="text-lg md:text-xl font-medium text-center">Hợp đồng minh bạch</p>
                </div>
              </div>
              <div className="w-[45%] md:w-[22%] flex flex-col items-center justify-center gap-4 mb-6">
                <MdOutlineSupportAgent size={40} className="md:text-[60px] text-[#54595f]" />
                <div className="items-center justify-center">
                  <p className="text-lg md:text-xl font-medium text-center">Tư vấn tận tâm</p>
                </div>
              </div>
              <div className="w-[45%] md:w-[22%] flex flex-col items-center justify-center gap-4 mb-6">
                <FaShieldAlt size={40} className="md:text-[60px] text-[#54595f]" />
                <div className="items-center justify-center">
                  <p className="text-lg md:text-xl font-medium text-center">Bảo mật thông tin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Third Section - Testimonials */}
      <div className="w-full flex justify-center items-center py-12">
        <div className="text-[#DD5C36] w-[90%] md:w-[80%] lg:w-[75%] flex flex-col justify-start">
          <div className="w-full flex flex-col items-center justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">Phản hồi từ khách hàng</h1>
            <div className="w-full flex flex-col md:flex-row justify-around mt-8 md:mt-[10vh] gap-6">
              {star.map((item, index) => (
                <div
                  key={index}
                  className="w-full md:w-[30%] p-3 flex flex-col gap-4 items-center justify-center shadow-2xl rounded-lg mb-6 md:mb-0">
                  <p className="text-[#2c2a29] text-center text-sm md:text-base">{item.comment}</p>
                  <div className="items-center mt-6 md:mt-10 justify-center flex flex-col gap-1">
                    <img alt="" width={50} height={50} className="rounded-full object-cover w-[50px] h-[50px] md:w-[60px] md:h-[60px]" src={item.img} />
                    <h1 className="text-base md:text-lg text-[#54595f] font-medium">{item.name}</h1>
                    <p className="text-base md:text-lg font-semibold">{item.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Fourth Section - Partners */}
      <div className="w-full bg-[#f9f9f9] flex justify-center items-center py-12">
        <div className="text-[#DD5C36] items-start w-[90%] md:w-[80%] lg:w-[75%] flex flex-col justify-center">
          <div className="w-full flex flex-col items-start justify-between">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Đối tác chiến lược</h1>
            <div className="w-full flex flex-wrap justify-start gap-6 md:gap-10">
              {partner.map((item, index) => (
                <img 
                  key={index}
                  src={item.img} 
                  alt="Partner logo" 
                  className="w-[45%] md:w-[30%] lg:w-[26%] object-contain h-auto"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Static;