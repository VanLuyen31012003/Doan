import React from 'react';
import { Phone, Mail, MapPin, Facebook } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Thêm Link từ react-router-dom

const Footer = () => {
  return (
    <footer className="bg-[#222222] text-white ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-colse-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">VỀ HIMOTO VIỆT NAM</h3>
            <p className="text-sm mb-4">
              Giấy phép kinh doanh 0108211373 cấp ngày 02/04/2018 bởi sở kế hoạch và đầu tư thành phố Hà Nội.
            </p>
            <p className="text-sm">
              Chúng tôi cam kết sẽ nỗ lực hết sức mình vì công việc và trung thành với quyền lợi của khách hàng.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">LIÊN KẾT</h3>
            <ul>
              <li className="mb-2">
                <Link to="/dat-xe" className="text-sm flex items-center">
                  <span className="mr-2">›</span> Đặt Xe
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/bang-gia" className="text-sm flex items-center">
                  <span className="mr-2">›</span> Bảng Giá
                </Link>
              </li>
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h3 className="text-lg font-semibold mb-4">TRỤ SỞ CHÍNH</h3>
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-1" />
              <p className="text-sm">30 Ngõ 66 Nguyễn Hoàng, Mỹ Đình, Hà Nội</p>
            </div>
            <div className="flex items-center mb-3">
              <Phone className="h-5 w-5 mr-2" />
              <p className="text-sm">0886184116</p>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <p className="text-sm">hello@himoto.vn</p>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">THỜI GIAN LÀM VIỆC</h3>
            <p className="text-sm mb-4">
              Đội ngũ hỗ trợ làm việc 24/7, trực cửa hàng và giao xe từ 8h sáng tới 9h tối cùng ngày.
            </p>
            <div className="grid grid-cols-2 ">
              <div className=" px-2 py-1">
                <p className="text-sm">Thứ 2 - Thứ 7:</p>
              </div>
              <div className=" px-2 py-1">
                <p className="text-sm">8AM to 9PM</p>
              </div>
              <div className=" px-2 py-1">
                <p className="text-sm">Chủ nhật:</p>
              </div>
              <div className=" px-2 py-1">
                <p className="text-sm">10AM to 9PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-4 md:mb-0">
            Copyright © 2025 Website thuộc bản quyền của HIMOTO Việt Nam
          </p>
          <div className="flex space-x-4">
            <Link to="/gioi-thieu" className="text-sm hover:underline">Giới thiệu HIMOTO</Link>
            <Link to="/lien-he" className="text-sm hover:underline">Liên hệ</Link>
            <Link to="/chinh-sach-rieng-tu" className="text-sm hover:underline">Chính sách riêng tư</Link>
            <Link to="/bao-mat" className="text-sm hover:underline">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>

      {/* Floating buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
        <motion.a 
          href="https://facebook.com/himoto.vn" 
          className="bg-blue-500 text-white p-3 rounded-full"
          animate={{ rotate: [0, 360, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Facebook className="h-6 w-6" />
        </motion.a>

        <motion.a 
          href="tel:0886184116" 
          className="bg-green-500 text-white p-3 hover:scale-150 rounded-full"
          animate={{ rotate: [360, 0, 0] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 1 }}
        >
          <Phone className="h-6 w-6" />
        </motion.a>
      </div>
    </footer>
  );
};

export default Footer;
