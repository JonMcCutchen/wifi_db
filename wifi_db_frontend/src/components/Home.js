import React from 'react';
import Map from './Map';

function Home() {
    return(
        <div className='home'>
            <h1>Welcome to Wifi DB</h1>
            <p>Check the map for wifi speeds. Click Submit to submit speed tests.</p>
            <Map />
        </div>
    )
}

export default Home;