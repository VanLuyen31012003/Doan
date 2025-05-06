import React, {  useEffect, useState } from 'react';
import Diplayproduct from '../Components/Diplayproduct';
import Aboutproduct from '../Components/Aboutproduct';
import Relateproduct from '../Components/Relateproduct';
import {  useParams } from 'react-router-dom';
import ApiMauXe from '../api/ApiMauXe';
import Evaluate from '../Components/Evaluate';


const Detailproduct = () => {

  const { id } = useParams();  // Lấy giá trị của 'id' từ URL
  const [data, setData] = useState([]); // Khởi tạo state để lưu trữ dữ liệu sản phẩm

  const fetchdata = async () => {
    try {
      const response = await ApiMauXe.getMauXeById(id); // Gọi API để lấy dữ liệu sản phẩm theo id
      setData(response.data.data); // Cập nhật state với dữ liệu sản phẩm
      console.log(response.data.data); // In dữ liệu sản phẩm ra console để kiểm tra
     } catch (error) {
      console.error("Error fetching product data:", error); // Xử lý lỗi nếu có
    }
  }
  useEffect(() => {
    fetchdata(); // Gọi hàm fetchdata khi component được mount
    
  }
  , [id]);
  return (
    <>
      <Diplayproduct data={data} />
      <Aboutproduct data={data} />
      <Evaluate data={data} />
      <Relateproduct data={data}/>
     </>
  );
};

export default Detailproduct;