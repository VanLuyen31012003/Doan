import React from 'react';
import Banner from '../Components/Banner';
import Underbanner from '../Components/Underbanner';
import Featureditem from '../Components/Featureditem';
import Licenses from '../Components/Licenses';
import Static from '../Components/Static';
import TopProduct from '../Components/TopProduct';

const topxe = [
    {
        id: 1,
        name: "xe ga",
        des: "Xe ga là loại xe máy có thiết kế thân xe liền khối, không có cần số và thường được sử dụng để di chuyển trong đô thị.",
    },
    {
        id: 2,
        name: "xe số",
        des: "Xe số là loại xe máy có thiết kế thân xe rời, có cần số và thường được sử dụng để di chuyển trên đường trường.",
    },
    // {
    //     id: 3,
    //     name: "Xe tay côn",
    //     des: "Xe tay côn là loại xe máy có thiết kế thân xe liền khối, có cần số và thường được sử dụng để di chuyển trên đường trường.",
    // },
  
]
function Home(props) {
    return (
        <div className=''>

            <Banner state={1}/> 
            <Underbanner  />
            <Featureditem />
            {
                topxe.map((item, index) => (
                    <TopProduct key={index} item={item} />
                ))
            }

            <Licenses />
            <Static />

        </div>
    );
}

export default Home;