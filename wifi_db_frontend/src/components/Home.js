import React from 'react';
import Map from './Map';

// Dummy data for illustration
const testData = [
    { location: { latitude: 51.505, longitude: -0.09 }, download_speed: 50, upload_speed: 10 },
    // Add more test data here
];

function Home() {
    return(
        <div class='home'>
            <h1>Welcome to the Wifi DB</h1>
            <p>This is a simple web application that allows you to view and submit wifi speed test results.</p>
            <Map  data={testData}/>
        </div>
    )
}

export default Home;