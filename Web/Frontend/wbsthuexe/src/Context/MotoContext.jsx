// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// 1. Khởi tạo Context
export const MotoContext = createContext();

// 2. Định nghĩa luôn Provider
export function MotoProvider({ children }) {
  const [isLogin, setIsLogin] = useState(false);

  
    const valuecontext = {
    isLogin,
    setIsLogin,
        
    }

  return (
      <MotoContext.Provider value={valuecontext}>
      {children}
    </MotoContext.Provider>
  );
}
