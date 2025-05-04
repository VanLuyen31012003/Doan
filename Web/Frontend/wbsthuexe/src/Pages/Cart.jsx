import React, { useContext } from "react";
import { MotoContext } from "../Context/MotoContext";

function Cart() {
  const { cartItems = [], clearCart, removeFromCart } = useContext(MotoContext); // Lấy hàm clearCart và removeFromCart từ context

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.giaThueNgay * item.quantity,
      0
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded mt-[160px] text-ghi">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng</h2>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Ảnh</th>
                <th className="border border-gray-300 px-4 py-2">Tên sản phẩm</th>
                <th className="border border-gray-300 px-4 py-2">Giá</th>
                <th className="border border-gray-300 px-4 py-2">Số lượng</th>
                <th className="border border-gray-300 px-4 py-2">Thành tiền</th>
                <th className="border border-gray-300 px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.mauXeId}>
                  <td className="border border-gray-300 px-4 py-2 text-center mx-auto">
                    <img
                      src={item.anhDefault}
                      alt={item.tenMau}
                      className="w-16 h-16 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.tenMau}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.giaThueNgay.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {(item.giaThueNgay * item.quantity).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 justify-center items-center flex">
                    <button
                      onClick={() => removeFromCart(item.mauXeId)} // Xóa sản phẩm
                      className="px-4 py-2 bg-gradient-to-r from-ghi to-cam items-center text-white rounded hover:bg-cam-500"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center">
            <button
              onClick={clearCart} // Xóa toàn bộ giỏ hàng
              className="px-6 py-2 bg-gradient-to-r font-bold from-ghi to-cam  text-white rounded hover:bg-cam"
            >
              Xóa toàn bộ giỏ hàng
            </button>
            <h3 className="text-xl font-bold">
              Tổng tiền:{" "}
              {calculateTotal().toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;  