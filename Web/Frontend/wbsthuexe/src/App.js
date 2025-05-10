import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Allpoducts from "./Pages/Allpoducts";
import Bangia from "./Pages/Bangia";
import ContactPage from "./Pages/Contact";
import RentalForm from "./Pages/Datxe";
import Detailproduct from "./Pages/Detailproduct";
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

function App() {
  return (
    <MotoProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/banggia" element={<Bangia />} />
        <Route path="/datxe" element={<RentalForm />} />
        <Route path="/lienhe" element={<ContactPage />} />
        <Route path="/chitietsp/:id" element={<Detailproduct />} />
        <Route path="/allsanpham" element={<Allpoducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/infouser" element={<Infouser />} />
        <Route path="/yeuthich" element={<Cart />} />
        <Route path="/payment-result" element={<PaymentResult />} />
        <Route path="/chitietdondat/:id" element={<Detailorder />} />
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
