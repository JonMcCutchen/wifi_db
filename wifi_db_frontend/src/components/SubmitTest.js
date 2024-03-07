import React, { useState } from 'react';
import axios from 'axios';

function SubmitTest() {
    const [speedTest, setSpeedTest] = useState({
        downloadSpeed: '',
        uploadSpeed: '',
        ping: '',
        placeName: '',
        location: ''
    });

    const handleChange = (e) => {
        setSpeedTest({
            ...speedTest,
            [e.target.name]: e.target.value
        })
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

    const getMatchingLocation = (placeName, latitude, longitude) => {
        return axios.get(`http://localhost:8000/api/locations/get_matching_location/?place_name=${encodeURIComponent(placeName)}&latitude=${latitude}&longitude=${longitude}`)
            .then(response => {
                // If a location is found, return its details
                return response.data;
            })
            .catch(error => {
                // If no location is found, create a new one and return its details
                if (error.response && error.response.status === 404) {
                    return createLocation(placeName, latitude, longitude);
                } else {
                    console.error('Error fetching the location:', error);
                    throw error;
                }
            });
    };

    const createLocation = async (placeName, latitude, longitude) => {
        try {
            const response = await axios.post('http://localhost:8000/api/locations/', {
                place_name: placeName,
                coordinates: `SRID=4326;POINT (${longitude} ${latitude})`
            });
            return response.data;
        } catch (error) {
            console.error('Error creating the location:', error);
            throw error;
        }
    };

    const parseLocation = (location) => {
        if (location.startsWith("Lat:")) {
            // Parsing the "Lat: {}, Long: {}" format
            const coords = location.match(/Lat: (.*), Long: (.*)/);
            if (coords && coords.length === 3) {
                const latitude = coords[1];
                const longitude = coords[2];
                return { latitude, longitude };
            }
        } else {
            // Handle the placeName (address) scenario
            // Since you can't directly convert an address to a PointField without a geocoding service,
            // you would typically call an external API here to convert the address to coordinates.
            // For this example, let's assume we return a placeholder.
            return { latitude: '0', longitude: '0' };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { latitude, longitude } = parseLocation(speedTest.location);

        getMatchingLocation(speedTest.placeName, latitude, longitude).then(location => {
            // Use the location ID to submit the speed test
            axios.post('http://127.0.0.1:8000/api/speedtests/', {
                download_speed: speedTest.downloadSpeed,
                upload_speed: speedTest.uploadSpeed,
                ping: speedTest.ping,
                location: location.id  // Use the location ID
            })
                .then(response => {
                    console.log(response);
                    // Handle response / notify user of success
                })
                .catch(error => {
                    console.error('There was an error!', error);
                    // Handle error / notify user
                });
        });
    }

    return (
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
                    name="placeName"
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