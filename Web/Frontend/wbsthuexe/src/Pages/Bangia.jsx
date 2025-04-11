import React from 'react';
import Banner from '../Components/Banner';
import BoardPrice from '../Components/BoardPrice';

function Bangia(props) {
    return (
        <div>
            <Banner state={0} />
            <BoardPrice/>
        </div>
    );
}

export default Bangia;
