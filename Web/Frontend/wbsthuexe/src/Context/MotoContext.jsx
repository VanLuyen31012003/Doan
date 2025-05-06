import React, { createContext, useState } from "react";

export const MotoContext = createContext();

export function MotoProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    // Lấy dữ liệu từ localStorage khi ứng dụng khởi động
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem.mauXeId === item.mauXeId);
      let updatedCart;
      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        updatedCart = prevItems.map((cartItem) =>
          cartItem.mauXeId === item.mauXeId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm mới
        updatedCart = [...prevItems, { ...item, quantity: 1 }];
      }
      // Lưu giỏ hàng vào localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      // alert("Bạn đã thêm xe vào mục yêu thích"); // Thông báo thêm vào yêu thích thành công
      return updatedCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.mauXeId !== itemId);
      // Lưu giỏ hàng vào localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };
  const clearCart = () => {
  setCartItems([]);
  localStorage.removeItem("cartItems"); // Xóa giỏ hàng khỏi localStorage
};
  

  const valuecontext = {
    isLogin,
    setIsLogin,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    clearCart,
   
  };

  return (
    <MotoContext.Provider value={valuecontext}>
      {children}
    </MotoContext.Provider>
  );
}