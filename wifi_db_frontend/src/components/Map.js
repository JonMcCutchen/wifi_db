import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import axios from 'axios';

const Map = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/locations/')
            .then(response => {
                setLocations(response.data);  // Directly set the locations with the included speed test data
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    const parseCoordinates = (wkt) => {
        const regex = /POINT \(([^ ]+) ([^ ]+)\)/;
        const match = wkt.match(regex);
        return {
            latitude: parseFloat(match[1]),
            longitude: parseFloat(match[2]),
        };
    };

    return (
        <MapContainer center={[35, -85]} zoom={2}>
            <TileLayer
                url="https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=9GoEKZMG5x6KV84c7NLNq88Vwv5YkOUHXOTtvQUfIWxK45VY2bB61cbF0Qi2sy1o"
                attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location, index) => {
                const { latitude, longitude } = parseCoordinates(location.coordinates);
                return (
                    <Marker key={index} position={[latitude, longitude]}>
                        <Popup>
                            Place: {location.place_name} <br />
                            {location.most_recent_speedtest ? (
                                <>
                                    Download: {location.most_recent_speedtest.download_speed} Mbps<br />
                                    Upload: {location.most_recent_speedtest.upload_speed} Mbps<br />
                                    Ping: {location.most_recent_speedtest.ping} ms
                                </>
                            ) : (
                                <span>No speed tests available for this location.</span>
                            )}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;