import './App.css';

import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
    
    </Routes>
    <ToastContainer />
    </>
    

  );
}

export default App;
