import React from 'react';
import { motion } from "framer-motion";
import { 
  FaUserCircle, 
  FaSearch, 
  FaMotorcycle, 
  FaShoppingCart, 
  FaCreditCard,
  FaCheckCircle,
  FaQuestionCircle,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function Instruct() {
  const steps = [
    {
      id: 1,
      icon: <FaUserCircle className="text-4xl text-[#dd5c36]" />,
      title: "Đăng ký/Đăng nhập",
      description: "Tạo tài khoản hoặc đăng nhập để bắt đầu trải nghiệm thuê xe",
      details: ["Nhập thông tin cá nhân", "Xác minh email", "Thiết lập mật khẩu an toàn"]
    },
    {
      id: 2,
      icon: <FaSearch className="text-4xl text-[#dd5c36]" />,
      title: "Tìm kiếm xe phù hợp",
      description: "Sử dụng bộ lọc thông minh để tìm xe phù hợp với nhu cầu",
      details: ["Chọn loại xe (tay ga, số sàn)", "Lọc theo hãng xe", "Chọn khoảng giá phù hợp"]
    },
    {
      id: 3,
      icon: <FaMotorcycle className="text-4xl text-[#dd5c36]" />,
      title: "Xem chi tiết sản phẩm",
      description: "Khám phá thông tin chi tiết về xe và xem đánh giá",
      details: ["Xem ảnh chi tiết", "Đọc thông số kỹ thuật", "Kiểm tra tình trạng xe"]
    },
    {
      id: 4,
      icon: <FaShoppingCart className="text-4xl text-[#dd5c36]" />,
      title: "Thêm vào giỏ hàng",
      description: "Chọn thời gian thuê và thêm xe vào giỏ hàng yêu thích",
      details: ["Chọn ngày bắt đầu thuê", "Chọn thời gian thuê", "Thêm vào giỏ hàng"]
    },
    {
      id: 5,
      icon: <FaCreditCard className="text-4xl text-[#dd5c36]" />,
      title: "Thanh toán",
      description: "Chọn phương thức thanh toán và hoàn tất đặt xe",
      details: ["Thanh toán online qua VNPay", "Thanh toán tiền mặt", "Xác nhận đơn hàng"]
    },
    {
      id: 6,
      icon: <FaCheckCircle className="text-4xl text-[#dd5c36]" />,
      title: "Nhận xe & Trải nghiệm",
      description: "Nhận xe tại địa điểm đã chọn và bắt đầu hành trình",
      details: ["Kiểm tra xe trước khi nhận", "Ký hợp đồng thuê xe", "Bắt đầu hành trình"]
    }
  ];

  const faqs = [
    {
      question: "Tôi có cần giấy phép lái xe để thuê không?",
      answer: "Có, bạn cần có giấy phép lái xe hợp lệ và chụp ảnh CCCD/CMND để xác minh."
    },
    {
      question: "Xe có được bảo hiểm không?",
      answer: "Tất cả xe đều được mua bảo hiểm bắt buộc. Bạn có thể mua thêm bảo hiểm mở rộng."
    },
    {
      question: "Tôi có thể hủy đơn hàng không?",
      answer: "Có thể hủy đơn hàng trước 24h. Phí hủy sẽ được tính theo quy định."
    },
    {
      question: "Xe hỏng giữa đường thì sao?",
      answer: "Chúng tôi có đội ngũ hỗ trợ 24/7. Liên hệ hotline để được hỗ trợ ngay lập tức."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#dd5c36] to-[#ff7b54] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Hướng dẫn sử dụng
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Làm theo 6 bước đơn giản để thuê xe máy nhanh chóng và an toàn
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{duration: 1} }
              key={step.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl  duration-300 p-6 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#fff7f3] rounded-full mb-4 mx-auto">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Bước {step.id}: {step.title}
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                {step.description}
              </p>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#dd5c36] rounded-full mt-2 flex-shrink-0"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-r from-[#fff7f3] to-[#ffeee6] py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dd5c36] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Xe chất lượng cao</h3>
              <p className="text-gray-600">Tất cả xe đều được bảo dưỡng định kỳ và kiểm tra kỹ lưỡng</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dd5c36] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCreditCard className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thanh toán linh hoạt</h3>
              <p className="text-gray-600">Hỗ trợ nhiều hình thức thanh toán an toàn và tiện lợi</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#dd5c36] rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="text-2xl text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Hỗ trợ 24/7</h3>
              <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ mọi lúc</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Câu hỏi thường gặp
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <FaQuestionCircle className="text-[#dd5c36] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Cần hỗ trợ thêm?</h2>
          <p className="text-lg mb-8 opacity-90">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl text-[#dd5c36] mb-3" />
              <h3 className="font-semibold mb-2">Hotline</h3>
              <p>1900 1234</p>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl text-[#dd5c36] mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p>support@thuexe.com</p>
            </div>
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-3xl text-[#dd5c36] mb-3" />
              <h3 className="font-semibold mb-2">Địa chỉ</h3>
              <p>123 Đường ABC, TP.Hà Nội</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}