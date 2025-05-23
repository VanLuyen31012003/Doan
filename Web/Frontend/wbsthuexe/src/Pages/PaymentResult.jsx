import { useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { FaReceipt, FaCalendarAlt, FaMoneyBillWave, FaUser } from 'react-icons/fa';

dayjs.extend(customParseFormat);

function PaymentResult() {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [txnRef, setTxnRef] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [username, setUsername] = useState('');

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStatus(params.get('status') || 'unknown');
    setMessage(decodeURIComponent(params.get('message') || 'Không có thông tin'));
    setTxnRef(params.get('txnRef') || '');

    const rawAmount = params.get('amount');
    if (rawAmount) {
      setAmount(Number(rawAmount).toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }));
    }

    const rawDate = params.get('transactionDate');
    if (rawDate) {
      const parsedDate = dayjs(rawDate, 'YYYYMMDDHHmmss');
      const formattedDate = parsedDate.isValid()
        ? parsedDate.format('DD/MM/YYYY HH:mm:ss')
        : 'Không xác định';
      setTransactionDate(formattedDate);
    }

    setUsername(params.get('username') || '');
  }, [location]);

  const iconVariants = {
    hidden: { scale: 0 },
    visible: { 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10 
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 1,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen mt-24 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden"
      >
        {/* Status Header */}
        <motion.div 
          className={`rounded-xl p-6 mb-6 text-center ${
            status === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
          variants={itemVariants}
        >
          <motion.div 
            className="flex justify-center mb-4"
            variants={iconVariants}
          >
            {status === 'success' ? (
              <IoCheckmarkCircle className="text-green-500 text-5xl" />
            ) : (
              <IoCloseCircle className="text-red-500 text-7xl" />
            )}
          </motion.div>
          
          <h1 className="text-3xl text-ghi font-bold">
            {status === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </h1>
          <p className="text-ghi mt-2 max-w-md font-medium mx-auto">{message}</p>
        </motion.div>

        {/* Logo and Transaction Details in same row */}
        <motion.div 
          className="flex flex-col md:flex-row gap-8 mb-8"
          variants={itemVariants}
        >
          {/* VNPay Logo */}
          <motion.div 
            className="flex flex-col justify-center items-center md:w-1/2 py-4"
            variants={itemVariants}
          >
            <img 
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" 
              alt="VNPay Logo" 
              className="h-20 md:h-28 object-contain mb-4"
            />
            <div className="mt-4 bg-orange-50 p-3 rounded-lg border border-orange-100 hidden md:block">
              <p className="text-center text-md font-bold text-gray-600">
                Thanh toán an toàn và bảo mật
              </p>
            </div>
          </motion.div>

          {/* Transaction Details */}
          <motion.div 
            className="space-y-4 bg-gray-50 p-6 rounded-xl md:w-2/3"
            variants={itemVariants}
          >
            <h2 className="text-lg font-bold text-ghi mb-4 border-b pb-2">
              Chi tiết giao dịch
            </h2>
            
            {txnRef && (
              <motion.div 
                className="flex items-center" 
                variants={itemVariants}
              >
                <FaReceipt className="text-ghi mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Mã giao dịch</p>
                  <p className="font-medium text-ghi">{txnRef}</p>
                </div>
              </motion.div>
            )}
            
            {amount && (
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <FaMoneyBillWave className="text-ghi mr-3 text-xl" />
                <div>
                  <p className="text-sm text-ghi">Số tiền</p>
                  <p className="font-medium text-ghi">
                    {(parseInt(amount)*10000).toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>
              </motion.div>
            )}
            
            {transactionDate && (
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <FaCalendarAlt className="text-ghi mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Thời gian giao dịch</p>
                  <p className="font-medium text-ghi">{transactionDate}</p>
                </div>
              </motion.div>
            )}
            
            {status==='success'? (
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <FaUser className="text-ghi mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Lời nhắn</p>
                  <p className="font-medium text-ghi">Cảm ơn sự ủng hộ của quý khách</p>
                </div>
              </motion.div>
            ) : <>
            <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <FaUser className="text-ghi mr-3 text-xl" />
                <div>
                  <p className="text-sm text-gray-500">Có lỗi xảy ra:</p>
                  <p className="font-medium text-ghi">Quý khách vui lòng đặt và thanh toán lại </p>
                </div>
              </motion.div>
            </>}
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:w-1/2 mx-auto justify-center"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 text-center font-semibold shadow-md hover:shadow-lg flex-1"
          >
            Quay lại trang chủ
          </Link>
          {status === 'success' && (
            <Link
            to ={`/chitietdondat/${txnRef}`}
            className="bg-white border  border-blue-600 text-ghi py-3 px-6 rounded-lg hover:bg-blue-200 transition duration-300 text-center font-semibold flex-1"
          >
            Xem đơn đặt
          </Link>
          )}
          
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PaymentResult;