import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
    setAmount(params.get('amount') ? Number(params.get('amount')).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '');
    setTransactionDate(params.get('transactionDate') ? new Date(params.get('transactionDate')).toLocaleString('vi-VN') : '');
    setUsername(params.get('username') || '');
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full flex flex-col md:flex-row items-center gap-6">
        {/* Logo VNPay */}
        <div className="w-full md:w-1/3 flex justify-center">
          <div
            className="bg-contain bg-no-repeat bg-center h-32 md:h-48 w-full"
            style={{
              backgroundImage: `url('https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg')`,
            }}
          ></div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="w-full md:w-2/3 text-left">
          <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Kết Quả Thanh Toán</h1>
          <div className="space-y-3">
            <p className="text-lg font-semibold">
              Trạng thái:{' '}
              {status === 'success' ? (
                <span className="text-green-600">Thành công</span>
              ) : (
                <span className="text-red-600">Thất bại</span>
              )}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Thông điệp:</span> {message}
            </p>
            {txnRef && ( 
              <p className="text-gray-700">
                <span className="font-medium">Mã giao dịch:</span> {txnRef}
              </p>
            )}
            {amount && (
              <p className="text-gray-700">
                <span className="font-medium">Số tiền:</span> {(parseInt(amount)*100*100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
              </p>
            )}
            {transactionDate && (
              <p className="text-gray-700">
                <span className="font-medium">Ngày giao dịch:</span> {transactionDate}
              </p>
            )}
            {username && (
              <p className="text-gray-700">
                <span className="font-medium">Người dùng:</span> {username}
              </p>
            )}
          </div>
          <div className="mt-6 text-center md:text-left">
            <a
              href="/"
              className="inline-block bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            >
              Quay lại trang chủ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentResult;