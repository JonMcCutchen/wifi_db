import React, { useState } from 'react';

function SubmitTest() {
    const [speedTest, setSpeedTest] = useState({
        downloadSpeed: '',
        uploadSpeed: '',
        ping: '',
        location: ''
    });

    const handleChange = (e) => {
        setSpeedTest({
            ...speedTest,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(speedTest);
        // Add api call to post to django
    }

    const locateUser = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const location = `Lat: ${position.coords.latitude}, Long: ${position.coords.longitude}`;
                setSpeedTest({ ...speedTest, location });
            }, () => {
                console.error("Geolocation is not supported by this browser.");
            });
        }
    };

    return(
        <div class='speedtest'>
            <h1>Submit your Speed Test Results</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="downloadSpeed"
                    placeholder="Download Speed (Mbps)"
                    value={speedTest.downloadSpeed}
                    onChange={handleChange} 
                />
                <input
                    type="text"
                    name="uploadSpeed"
                    placeholder="Upload Speed (Mbps)"
                    value={speedTest.uploadSpeed}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="ping"
                    placeholder="Ping (ms)"
                    value={speedTest.ping}
                    onChange={handleChange}
                />
                <input 
                    type="text"
                    name="place-name"
                    placeholder="Place Name"
                    value={speedTest.placeName}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={speedTest.location}
                    onChange={handleChange}
                />
                <button type="button" onClick={locateUser}>Locate Me</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SubmitTest;