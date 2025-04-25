import React from 'react';

function RelateProduct() {
    const products = [
        {
            id: 1,
            img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
            name: "Xe số - chỉ từ 60k/ngày",
        },
        {
            id: 2,
            img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
            name: "Xe tay ga - chỉ từ 100k/ngày",
        },
        {
            id: 3,
            img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
            name: "Xe côn tay - chỉ từ 150k/ngày",
        },
        {
            id: 4,
            img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
            name: "Xe tay ga cao cấp - chỉ từ 200k/ngày",
        },
        {
            id: 5,
            img: "https://phuongxe.vn/wp-content/uploads/2020/06/wave-thai-trang.jpg",
            name: "Xe phân khối lớn - chỉ từ 300k/ngày",
        },
    ];

    return (
        <div className="w-full bg-gray-100 py-6">
            <div className="w-[80%] mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Sản phẩm liên quan</h2>

                {/* Vùng cuộn ngang */}
              <div className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory">
    <div className="flex gap-6">
        {products.map((item, index) => (
            <div key={index} className="min-w-[250px] snap-start flex flex-col gap-3 bg-white text-[#555555] shadow-lg rounded-lg py-4">
                <img className="w-full h-[150px] object-cover rounded-t-lg" src={item.img} alt={item.name} />
                <h1 className="px-2 font-semibold text-black">{item.name}</h1>
                <ul className="px-4">
                    {/* <li className="flex gap-1 items-center"><TiTick /> 2 mũ bảo hiểm</li>
                    <li className="flex gap-1 items-center"><TiTick /> 2 áo mưa dùng 1 lần</li>
                    <li className="flex gap-1 items-center"><TiTick /> Bảo hiểm + Đăng kí photo</li> */}
                </ul>
                <button className="ml-3 w-[40%] p-2 rounded bg-[#DD5C36] font-medium text-white">
                    Đặt xe
                </button>
            </div>
        ))}
    </div>
</div>
            </div>
        </div>
    );
}

export default RelateProduct;
