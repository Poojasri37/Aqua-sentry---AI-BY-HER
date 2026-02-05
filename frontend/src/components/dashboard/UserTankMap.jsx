import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icons based on tank status
const createStatusIcon = (status) => {
    let color = '#22c55e'; // green - online
    if (status === 'warning') color = '#eab308'; // yellow
    if (status === 'critical') color = '#ef4444'; // red
    if (status === 'offline') color = '#9ca3af'; // gray

    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

const UserTankMap = ({ tanks }) => {
    const navigate = useNavigate();

    // Filter only Salem tanks for user dashboard
    const salemTanks = tanks.filter(tank => tank.region === 'Salem' || tank.id?.startsWith('TN-SA-'));

    // Center on Salem
    const center = [11.6643, 78.1460];

    return (
        <div className="w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-md relative z-0">
            <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Tank Markers - Only Salem */}
                {salemTanks.map((tank) => (
                    <Marker
                        key={tank.id}
                        position={[tank.location.lat, tank.location.lng]}
                        icon={createStatusIcon(tank.status)}
                    >
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <h3 className="font-bold text-gray-900 mb-2">{tank.name}</h3>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`w-3 h-3 rounded-full ${tank.status === 'online' ? 'bg-green-500' :
                                            tank.status === 'warning' ? 'bg-yellow-500' :
                                                tank.status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
                                        }`} />
                                    <span className="text-sm capitalize text-gray-600 font-medium">{tank.status}</span>
                                </div>
                                <div className="space-y-1 mb-3 text-sm">
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Water Level:</span>
                                        <span className="font-bold text-gray-900">{tank.waterLevel}%</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">pH:</span>
                                        <span className="font-bold text-gray-900">{tank.metrics?.ph || 'N/A'}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="text-gray-500">Turbidity:</span>
                                        <span className="font-bold text-gray-900">{tank.metrics?.turbidity || 'N/A'} NTU</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate(`/tanks/${tank.id}`)}
                                    className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all"
                                >
                                    View Tank Details →
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default UserTankMap;
