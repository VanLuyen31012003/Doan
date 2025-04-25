import React from 'react';
import Diplayproduct from '../Components/Diplayproduct';
import Aboutproduct from '../Components/Aboutproduct';
import Relateproduct from '../Components/Relateproduct';

// const motorcycles = [
//   {
//     id: 1,
//     name: 'HONDA SH',
//     price: 180000,
//     images: [
//       '/api/placeholder/500/400',
//       '/api/placeholder/100/100',
//       '/api/placeholder/100/100',
//       '/api/placeholder/100/100'
//     ]
//   },
//   {
//     id: 2,
//     name: 'HONDA VISION',
//     price: 80000,
//     images: [
//       '/api/placeholder/500/400',
//       '/api/placeholder/100/100',
//       '/api/placeholder/100/100',
//       '/api/placeholder/100/100'
//     ]
//   }
// ];

const Detailproduct = () => {
  // const [selectedMotorcycle, setSelectedMotorcycle] = useState(motorcycles[0]);
  // const [mainImage, setMainImage] = useState(selectedMotorcycle.images[0]);

  // const handleRentNow = () => {
  //   alert(`Bạn đã chọn thuê xe ${selectedMotorcycle.name}`);
  // };

  return (
    <>
      <Diplayproduct />
      <Aboutproduct />
      <Relateproduct/>
     </>
  );
};

export default Detailproduct;