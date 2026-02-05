import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polygon, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertTriangle, WifiOff, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix for default Leaflet markers not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons could be created here using L.divIcon to support colors
const createStatusIcon = (status) => {
    let color = '#22c55e'; // green
    if (status === 'warning') color = '#eab308'; // yellow
    if (status === 'critical') color = '#ef4444'; // red
    if (status === 'offline') color = '#9ca3af'; // gray

    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
        iconSize: [15, 15],
        iconAnchor: [7, 7]
    });
};

// Salem District - 5 Wards (Corrected)
const salemWards = [
    {
        id: 'ward1',
        name: 'Ward 1 - Suramangalam',
        center: [11.6743, 78.1260],
        bounds: [
            [11.6843, 78.1160],
            [11.6843, 78.1360],
            [11.6643, 78.1360],
            [11.6643, 78.1160]
        ],
        color: '#3b82f6'
    },
    {
        id: 'ward2',
        name: 'Ward 2 - Fairlands',
        center: [11.6743, 78.1460],
        bounds: [
            [11.6843, 78.1360],
            [11.6843, 78.1560],
            [11.6643, 78.1560],
            [11.6643, 78.1360]
        ],
        color: '#8b5cf6'
    },
    {
        id: 'ward3',
        name: 'Ward 3 - Ammapet',
        center: [11.6743, 78.1660],
        bounds: [
            [11.6843, 78.1560],
            [11.6843, 78.1760],
            [11.6643, 78.1760],
            [11.6643, 78.1560]
        ],
        color: '#ec4899'
    },
    {
        id: 'ward4',
        name: 'Ward 4 - Hastampatti',
        center: [11.6543, 78.1360],
        bounds: [
            [11.6643, 78.1260],
            [11.6643, 78.1460],
            [11.6443, 78.1460],
            [11.6443, 78.1260]
        ],
        color: '#10b981'
    },
    {
        id: 'ward5',
        name: 'Ward 5 - Anna Nagar',
        center: [11.6543, 78.1560],
        bounds: [
            [11.6643, 78.1460],
            [11.6643, 78.1660],
            [11.6443, 78.1660],
            [11.6443, 78.1460]
        ],
        color: '#f59e0b'
    }
];

const TankMap = ({ tanks }) => {
    const navigate = useNavigate();
    // Default center (Salem, Tamil Nadu)
    const center = [11.6643, 78.1460];

    const handleWardClick = (ward) => {
        // Extract ward number from ward.id (e.g., 'ward1' -> '1')
        const wardNumber = ward.id.replace('ward', '');

        // Filter tanks in this ward by matching ward property
        const wardTanks = tanks.filter(tank =>
            tank.ward === `Ward ${wardNumber}` ||
            tank.name.includes(`Ward ${wardNumber}`)
        );

        console.log('Ward clicked:', ward.name);
        console.log('Filtered tanks:', wardTanks);

        // Navigate to ward analysis page with ward data
        navigate('/ward-analysis', {
            state: {
                ward: ward,
                tanks: wardTanks.length > 0 ? wardTanks : []
            }
        });
    };

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-md relative z-0">
            <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Ward Boundaries */}
                {salemWards.map((ward) => (
                    <React.Fragment key={ward.id}>
                        {/* Ward Polygon - Clickable */}
                        <Polygon
                            positions={ward.bounds}
                            pathOptions={{
                                color: ward.color,
                                fillColor: ward.color,
                                fillOpacity: 0.15,
                                weight: 3,
                                dashArray: '5, 5'
                            }}
                            eventHandlers={{
                                click: () => handleWardClick(ward)
                            }}
                        >
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-gray-900 mb-2">{ward.name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">Administrative Ward - Salem District</p>
                                    <button
                                        onClick={() => handleWardClick(ward)}
                                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        View Ward Analysis
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </Popup>
                        </Polygon>

                        {/* Ward Center Marker with Label */}
                        <CircleMarker
                            center={ward.center}
                            radius={10}
                            pathOptions={{
                                color: ward.color,
                                fillColor: ward.color,
                                fillOpacity: 0.8,
                                weight: 3
                            }}
                            eventHandlers={{
                                click: () => handleWardClick(ward)
                            }}
                        >
                            <Tooltip permanent direction="center" className="ward-label" opacity={0.95}>
                                <span className="font-black text-[11px] uppercase tracking-wider" style={{ color: ward.color }}>
                                    {ward.name.split(' - ')[0]}
                                </span>
                            </Tooltip>
                            <Popup>
                                <div className="p-2 min-w-[200px]">
                                    <h3 className="font-bold text-gray-900 mb-2">{ward.name}</h3>
                                    <p className="text-xs text-gray-500 mb-3">Ward Center Point</p>
                                    <button
                                        onClick={() => handleWardClick(ward)}
                                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                    >
                                        View Ward Analysis
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </Popup>
                        </CircleMarker>
                    </React.Fragment>
                ))}

                {/* Tank Markers */}
                {tanks.map((tank) => (
                    <Marker
                        key={tank.id}
                        position={[tank.location.lat, tank.location.lng]}
                        icon={createStatusIcon(tank.status)}
                    >
                        <Tooltip permanent direction="top" offset={[0, -10]} opacity={0.9}>
                            <span className="font-black text-[10px] uppercase tracking-tighter text-slate-700">{tank.name.split('-')[1]}</span>
                        </Tooltip>
                        <Popup>
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-bold text-gray-900">{tank.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`w-2 h-2 rounded-full ${tank.status === 'online' ? 'bg-green-500' :
                                        tank.status === 'warning' ? 'bg-yellow-500' :
                                            tank.status === 'critical' ? 'bg-red-500' : 'bg-gray-500'
                                        }`} />
                                    <span className="text-sm capitalize text-gray-600">{tank.status}</span>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p className="flex justify-between"><span>Level:</span> <span className="font-medium">{tank.waterLevel}%</span></p>
                                    <p className="text-xs text-gray-400 mt-1">Last update: {new Date(tank.lastUpdate).toLocaleTimeString()}</p>
                                </div>
                                <button
                                    onClick={() => navigate(`/tanks/${tank.id}`)}
                                    className="mt-3 w-full py-1 bg-gov-green-100 text-gov-green-700 text-xs font-semibold rounded hover:bg-gov-green-600 hover:text-white transition-all shadow-sm"
                                >
                                    Detailed Analytics
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default TankMap;
