import './App.css';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Allpoducts from './Pages/Allpoducts';
import Bangia from './Pages/Bangia';
import ContactPage from './Pages/Contact';
import RentalForm from './Pages/Datxe';
import Detailproduct from './Pages/Detailproduct';
import Home from './Pages/Home';
import {  Routes, Route} from "react-router-dom";
import Login from './Pages/Login';

function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/banggia' element={<Bangia />} />
        <Route path='/datxe' element={<RentalForm />} />
        <Route path='/lienhe' element={<ContactPage />} />
        <Route path='/chitietsp' element={<Detailproduct />} />
        <Route path='/allsanpham' element={<Allpoducts />} />
        <Route path='/login' element={<Login />} />

        
      </Routes>
      <Footer/>
      
    </>
  );
}

export default App;
