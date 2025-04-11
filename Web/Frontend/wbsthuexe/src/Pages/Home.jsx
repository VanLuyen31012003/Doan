import React from 'react';
import Banner from '../Components/Banner';
import Underbanner from '../Components/Underbanner';
import Featureditem from '../Components/Featureditem';
import Licenses from '../Components/Licenses';
import Static from '../Components/Static';

function Home(props) {
    return (
        <div className=''>

            <Banner state={1}/> 
            <Underbanner  />
            <Featureditem />
            <Licenses />
            <Static />

        </div>
    );
}

export default Home;