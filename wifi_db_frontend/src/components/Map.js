import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, } from 'react-leaflet';
import L from 'leaflet';

const Map = ({ data }) => {
    const [map, setMap] = useState(null);

    useEffect(() => {

        const wifiIcon = new L.Icon({
            iconUrl: 'path/to/icon.png',
            iconSize: [25, 25],
            iconAnchor: [12, 25],
            popupAnchor: [1, -24],
        });
        
        if (map && data && data.length) {
            data.forEach((testResult) => {
                const marker = L.marker([testResult.location.latitude, testResult.location.longitude], {icont: wifiIcon});
                marker.addTo(map).bindPopup(`Download: ${testResult.download_speed} Mbps<br>Upload: ${testResult.upload_speed} Mbps`);
            })
        }
    }, [map, data]);

    return (
        <MapContainer center={[35, -85]} zoom={2} whenCreated={setMap}>
            <TileLayer
                url="https://tile.jawg.io/jawg-matrix/{z}/{x}/{y}{r}.png?access-token=9GoEKZMG5x6KV84c7NLNq88Vwv5YkOUHXOTtvQUfIWxK45VY2bB61cbF0Qi2sy1o" 
                attribution= '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
        </MapContainer>
    );
};

export default Map;