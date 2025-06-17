import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaExclamationTriangle,
  FaBan,
  FaPaypal,
  FaReceipt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUser,
  FaHome,
  FaEye,
  FaShoppingCart
} from 'react-icons/fa';

const PayPalSuccess = () => {
  const [status, setStatus] = useState('');
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status');
    const idParam = params.get('id');
    const amountParam = params.get('amount');
    const tokenParam = params.get('token');

    setStatus(statusParam || 'unknown');
    setOrderId(idParam || '');
    setAmount(amountParam || '');
    setToken(tokenParam || '');
    
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [location]);

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500 text-6xl animate-bounce" />,
          title: 'Thanh toán thành công!',
          message: 'Đơn hàng của bạn đã được thanh toán qua PayPal thành công.',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'already_processed':
        return {
          icon: <FaExclamationTriangle className="text-yellow-500 text-6xl animate-pulse" />,
          title: 'Đơn hàng đã được xử lý',
          message: 'Đơn hàng này đã được thanh toán trước đó.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800'
        };
      case 'cancel':
        return {
          icon: <FaBan className="text-orange-500 text-6xl animate-pulse" />,
          title: 'Thanh toán đã bị hủy',
          message: 'Bạn đã hủy giao dịch thanh toán PayPal. Đơn hàng đã được xóa khỏi hệ thống.',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800'
        };
      case 'fail':
        return {
          icon: <FaTimesCircle className="text-red-500 text-6xl animate-pulse" />,
          title: 'Thanh toán thất bại',
          message: 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      case 'error':
        return {
          icon: <FaTimesCircle className="text-red-500 text-6xl animate-pulse" />,
          title: 'Lỗi hệ thống',
          message: 'Đã xảy ra lỗi hệ thống. Vui lòng liên hệ với chúng tôi.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      default:
        return {
          icon: <FaExclamationTriangle className="text-gray-500 text-6xl" />,
          title: 'Trạng thái không xác định',
          message: 'Không thể xác định trạng thái thanh toán.',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800'
        };
    }
  };

  const statusConfig = getStatusConfig();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Result Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp">
          {/* Header with PayPal Logo */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <FaPaypal className="text-4xl" />
              <h1 className="text-2xl font-bold">PayPal Payment</h1>
            </div>
            <p className="text-blue-100">Kết quả thanh toán của bạn</p>
          </div>

          {/* Status Section */}
          <div className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4 border-r-4 p-8`}>
            <div className="text-center ">
              <div className="mb-6 mx-auto text-center flex justify-center items-center rounded-full w-24 h-24 shadow-lg">
                {statusConfig.icon}
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${statusConfig.textColor}`}>
                {statusConfig.title}
              </h2>
              <p className={`text-lg ${statusConfig.textColor} opacity-80 max-w-2xl mx-auto`}>
                {statusConfig.message}
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          {(status === 'success' || status === 'already_processed') && (
            <div className="p-8 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Chi tiết giao dịch
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orderId && (
                  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FaReceipt className="text-blue-500 text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Mã đơn hàng</p>
                      <p className="font-semibold text-gray-800">#{orderId}</p>
                    </div>
                  </div>
                )}

                {amount && (
                  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <FaMoneyBillWave className="text-green-500 text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Số tiền thanh toán</p>
                      <p className="font-bold text-lg text-green-600">
                        {parseFloat(amount).toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaCalendarAlt className="text-purple-500 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Thời gian giao dịch</p>
                    <p className="font-semibold text-gray-800">
                      {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <FaPaypal className="text-blue-600 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                    <p className="font-semibold text-gray-800">PayPal</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {status === 'success' && (
                <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded-lg">
                  <div className="flex items-start">
                    <FaUser className="text-green-600 text-lg mr-3 mt-1" />
                    <div>
                      <p className="text-sm text-green-700 font-medium">Thông báo</p>
                      <p className="text-green-800">
                        Email xác nhận đã được gửi đến địa chỉ email của bạn. 
                        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cancel Details */}
          {status === 'cancel' && (
            <div className="p-8 bg-orange-50">
              <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Thông tin hủy giao dịch
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {token && (
                  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                    <FaReceipt className="text-orange-500 text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Token giao dịch</p>
                      <p className="font-semibold text-gray-800 text-sm">{token}</p>
                    </div>
                  </div>
                )}

                {orderId && (
                  <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                    <FaBan className="text-orange-500 text-xl mr-4" />
                    <div>
                      <p className="text-sm text-gray-500">Đơn hàng đã hủy</p>
                      <p className="font-semibold text-gray-800">#{orderId}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                  <FaCalendarAlt className="text-orange-500 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Thời gian hủy</p>
                    <p className="font-semibold text-gray-800">
                      {new Date().toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center bg-white p-4 rounded-lg shadow-sm">
                  <FaPaypal className="text-orange-500 text-xl mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Phương thức</p>
                    <p className="font-semibold text-gray-800">PayPal (Đã hủy)</p>
                  </div>
                </div>
              </div>

              {/* Cancel Message */}
              <div className="mt-6 p-4 bg-orange-100 border border-orange-200 rounded-lg">
                <div className="flex items-start">
                  <FaBan className="text-orange-600 text-lg mr-3 mt-1" />
                  <div>
                    <p className="text-sm text-orange-700 font-medium">Thông báo</p>
                    <p className="text-orange-800">
                      Giao dịch đã được hủy thành công. Đơn hàng đã được xóa khỏi hệ thống. 
                      Bạn có thể đặt lại đơn hàng mới bất kỳ lúc nào.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-8 bg-white border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaHome className="mr-2" />
                Về trang chủ
              </Link>
              
              {status === 'success' && orderId && (
                <Link
                  to={`/chitietdondat/${orderId}`}
                  className="flex items-center justify-center bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  <FaEye className="mr-2" />
                  Xem chi tiết đơn hàng
                </Link>
              )}

              {(status === 'fail' || status === 'error' || status === 'cancel') && (
                <Link
                  to="/allsanpham"
                  className="flex items-center justify-center bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  <FaShoppingCart className="mr-2" />
                  {status === 'cancel' ? 'Đặt hàng lại' : 'Thử lại'}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 animate-fadeInUp delay-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Cần hỗ trợ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <FaPaypal className="text-3xl text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Hỗ trợ PayPal</h4>
              <p className="text-sm text-gray-600">paypal.com/support</p>
            </div>
            <div className="p-4">
              <FaUser className="text-3xl text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Liên hệ</h4>
              <p className="text-sm text-gray-600">support@thuexe.com</p>
            </div>
            <div className="p-4">
              <FaReceipt className="text-3xl text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Hotline</h4>
              <p className="text-sm text-gray-600">1900 1234</p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

export default PayPalSuccess;