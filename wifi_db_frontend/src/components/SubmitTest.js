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

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setSpeedTest({
            ...speedTest,
            [e.target.name]: e.target.value
        })
    }

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if(!speedTest.downloadSpeed) {
            errors.downloadSpeed = "Download Speed is required";
            isValid = false;
        } else if (isNaN(speedTest.downloadSpeed) || speedTest.downloadSpeed <= 0 || speedTest.downloadSpeed > 5000) {
            errors.downloadSpeed = "Download Speed must be a positive number less than 5000";
            isValid = false;
        }

        if(!speedTest.uploadSpeed) {
            errors.uploadSpeed = "Upload Speed is required";
            isValid = false;
        } else if (isNaN(speedTest.uploadSpeed) || speedTest.uploadSpeed <= 0 || speedTest.uploadSpeed > 5000) {
            errors.uploadSpeed = "Upload Speed must be a positive number less than 5000";
            isValid = false;
        } 

        if(!speedTest.ping) {
            errors.ping = "Ping is required";
            isValid = false;
        } else if (isNaN(speedTest.ping) || speedTest.ping <= 0 || speedTest.ping > 1000) {
            errors.ping = "Ping must be a positive number less than 1000";
            isValid = false;
        }

        if(!speedTest.placeName) {
            errors.placeName = "Place Name is required";
            isValid = false;
        }

        if(!speedTest.location) {
            errors.location = "Location is required";
            isValid = false;
        }

        setErrors(errors);
        return isValid;
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
                coordinates: `SRID=4326;POINT (${latitude} ${longitude})`
            });
            return response.data;
        } catch (error) {
            console.error('Error creating the location:', error);
            throw error;
        }
    };

    const parseLocation = async(location) => {
        if (location.startsWith("Lat:")) {
            // Parsing the "Lat: {}, Long: {}" format
            const coords = location.match(/Lat: (.*), Long: (.*)/);
            if (coords && coords.length === 3) {
                const latitude = coords[1];
                const longitude = coords[2];
                return { latitude, longitude };
            }
        } else {
           try {
            const request = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
            const response = await axios.get(request);
            
            if (response.data && response.data.length > 0) {
                const {lat, lon } = response.data[0];
                return { latitude: lat, longitude: lon };
            } else {
                throw new Error('No location found for the given address');
            }
           } catch (error) {
            console.error('Error fetching the location:', error);
           }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const { latitude, longitude } = await parseLocation(speedTest.location);
    
                try {
                    const location = await getMatchingLocation(speedTest.placeName, latitude, longitude);
                    // Use the location ID to submit the speed test
                    await axios.post('http://127.0.0.1:8000/api/speedtests/', {
                        download_speed: speedTest.downloadSpeed,
                        upload_speed: speedTest.uploadSpeed,
                        ping: speedTest.ping,
                        location: location.id  // Use the location ID
                    });
                    console.log('Speed test submitted successfully');
                    // Handle response / notify user of success
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        // Location not found, create a new location
                        const newLocation = await createLocation(speedTest.placeName, latitude, longitude);
                        // Use the new location ID to submit the speed test
                        await axios.post('http://127.0.0.1:8000/api/speedtests/', {
                            download_speed: speedTest.downloadSpeed,
                            upload_speed: speedTest.uploadSpeed,
                            ping: speedTest.ping,
                            location: newLocation.id  // Use the new location ID
                        });
                        console.log('Speed test submitted successfully with a new location');
                        // Handle response / notify user of success
                    } else {
                        console.error('Error submitting the speed test:', error);
                        // Handle error / notify user
                    }
                }
            } catch (error) {
                console.error('Error parsing the location:', error);
                // Handle error / notify user
            }
        }
    };

    return (
        <div className='speedtest'>
            <h1>Submit your Speed Test Results</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="downloadSpeed"
                    placeholder="Download Speed (Mbps)"
                    value={speedTest.downloadSpeed}
                    onChange={handleChange}
                />
                {errors.downloadSpeed && <span className="error">{errors.downloadSpeed}</span>}
                <input
                    type="text"
                    name="uploadSpeed"
                    placeholder="Upload Speed (Mbps)"
                    value={speedTest.uploadSpeed}
                    onChange={handleChange}
                />
                {errors.uploadSpeed && <span className="error">{errors.uploadSpeed}</span>}
                <input
                    type="text"
                    name="ping"
                    placeholder="Ping (ms)"
                    value={speedTest.ping}
                    onChange={handleChange}
                />
                {errors.ping && <span className="error">{errors.ping}</span>}
                <input
                    type="text"
                    name="placeName"
                    placeholder="Place Name"
                    value={speedTest.placeName}
                    onChange={handleChange}
                />
                {errors.placeName && <span className="error">{errors.placeName}</span>}
                <input
                    type="text"
                    name="location"
                    placeholder="Address (or 'Locate Me')"
                    value={speedTest.location}
                    onChange={handleChange}
                />
                {errors.location && <span className="error">{errors.location}</span>}
                <button type="button" onClick={locateUser}>Locate Me</button>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default SubmitTest;