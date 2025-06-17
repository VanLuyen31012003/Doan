import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Allpoducts from "./Pages/Allpoducts";
import RentalForm from "./Pages/Datxe";
import Detailproduct from "./Pages/Detailproduct";
import ChChiTietPost from "./Pages/Bangia";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { MotoProvider } from "./Context/MotoContext";
import Infouser from "./Pages/Infouser";
import Cart from "./Pages/Cart";
import { ToastContainer } from "react-toastify";
import Detailorder from "./Pages/Detailorder";
import PaymentResult from "./Pages/PaymentResult";
import ConTact from "./Pages/Contact";
import EditProfile from "./Pages/EditProfile";
import Allposts from "./Pages/Allposts";
import Instruct from "./Pages/Instruct";
import PaypalResult from "./Pages/PaypalResult";
import PayPalSuccess from "./Pages/PaypalResult";

function App() {
  return (
    <MotoProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/postwordpress" element={<Allposts />} />
        <Route path="/chitietposts/:id" element={<ChChiTietPost/>} />
        <Route path="/datxe" element={<RentalForm />} />
        <Route path="/lienhe" element={<ConTact />} />
        <Route path="/chitietsp/:id" element={<Detailproduct />} />
        <Route path="/allsanpham" element={<Allpoducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/infouser" element={<Infouser />} />
        <Route path="/yeuthich" element={<Cart />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/paypal-result" element={<PayPalSuccess />} />
        <Route path="/edit-profile" element={<EditProfile/>} />
        <Route path="/chitietdondat/:id" element={<Detailorder />} />
        <Route path="/huongdan" element={<Instruct />} />
        

      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Footer />
    </MotoProvider>
  );
}

export default App;
