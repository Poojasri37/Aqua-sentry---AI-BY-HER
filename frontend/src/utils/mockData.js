// Generate time series data for the last 24 hours
export const generateSensorHistory = (hours = 24) => {
    const data = [];
    const now = new Date();

    for (let i = 0; i < hours * 12; i++) { // Every 5 minutes
        const time = new Date(now.getTime() - (hours * 60 * 60 * 1000) + (i * 5 * 60 * 1000));

        // Base values + random noise + sine wave for trend
        const timeFactor = i / (hours * 12);

        data.push({
            timestamp: time.toISOString(),
            timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ph: Number((7.0 + Math.sin(timeFactor * Math.PI) * 0.5 + (Math.random() - 0.5) * 0.2).toFixed(2)),
            turbidity: Number((1.5 + Math.cos(timeFactor * Math.PI * 2) * 0.5 + Math.random() * 0.5).toFixed(2)),
            temperature: Number((25 + Math.sin(timeFactor * Math.PI) * 2 + (Math.random() - 0.5)).toFixed(1)),
            waterLevel: Number((80 - (i % 50) + Math.random() * 2).toFixed(1)), // Draining and filling cycle
            o2_level: Number((8 + Math.random()).toFixed(1)),
            chlorine: Number((1.5 + Math.random() * 0.3).toFixed(2))
        });
    }
    return data;
};

// Tamil Nadu Locations with specific emphasis on Salem
const TAMIL_NADU_LOCATIONS = [
    { city: 'Salem', district: 'Salem', lat: 11.6643, lng: 78.1460, ward: 'Ward 1' },
    { city: 'Salem', district: 'Salem', lat: 11.6700, lng: 78.1500, ward: 'Ward 2' },
    { city: 'Salem', district: 'Salem', lat: 11.6600, lng: 78.1400, ward: 'Ward 3' },
    { city: 'Salem', district: 'Salem', lat: 11.6800, lng: 78.1300, ward: 'Ward 4' },
    { city: 'Salem', district: 'Salem', lat: 11.6500, lng: 78.1600, ward: 'Ward 5' },
    { city: 'Chennai', district: 'Chennai', lat: 13.0827, lng: 80.2707, ward: 'Zone 1' },
    { city: 'Coimbatore', district: 'Coimbatore', lat: 11.0168, lng: 76.9558, ward: 'South' },
    { city: 'Madurai', district: 'Madurai', lat: 9.9252, lng: 78.1198, ward: 'East' },
];

// Generate multiple tanks
export const generateTanksList = (count = 5, filterDistrict = 'Salem') => {
    const tanks = [];
    const localLocations = filterDistrict
        ? TAMIL_NADU_LOCATIONS.filter(l => l.district === filterDistrict)
        : TAMIL_NADU_LOCATIONS;

    for (let i = 0; i < count; i++) {
        const loc = localLocations[i % localLocations.length];

        // Detailed health logic
        const ph = Number((6.5 + Math.random() * 3).toFixed(2));
        const chlorine = Number((0.5 + Math.random() * 2).toFixed(2));
        const turbidity = Number((0.5 + Math.random() * 8).toFixed(2));

        let status = 'online'; // Healthy
        if (ph < 6.5 || ph > 8.5 || turbidity > 5 || chlorine > 2.0) status = 'critical';
        else if (ph < 6.8 || ph > 8.2 || turbidity > 3 || chlorine > 1.5) status = 'warning';

        const jitter = 0.01;

        tanks.push({
            id: `TN-${filterDistrict.substring(0, 2).toUpperCase()}-${1000 + i}`,
            name: `${loc.city} - ${loc.ward || 'Sector ' + i}`,
            location: {
                lat: loc.lat + (Math.random() - 0.5) * jitter,
                lng: loc.lng + (Math.random() - 0.5) * jitter,
                address: `${loc.city}, ${loc.district} District, Tamil Nadu`
            },
            status: status,
            waterLevel: Math.floor(Math.random() * 100),
            lastUpdate: new Date().toISOString(),
            lastCleaned: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            metrics: {
                ph,
                turbidity,
                chlorine,
                temperature: (26 + Math.random() * 4).toFixed(1)
            }
        });
    }
    return tanks;
};

export const getTankDetails = (id) => {
    // Extract region from tank ID (e.g., TN-SA-1001 -> Salem, TN-CB-2001 -> Coimbatore)
    let region = 'Salem';
    let regionName = 'Salem';
    let district = 'Salem';
    let baseCoords = { lat: 11.6643, lng: 78.1460 };

    if (id.startsWith('TN-SA-')) {
        region = 'Salem';
        regionName = 'Salem';
        district = 'Salem';
        baseCoords = { lat: 11.6643, lng: 78.1460 };
    } else if (id.startsWith('TN-CB-')) {
        region = 'Coimbatore';
        regionName = 'Coimbatore';
        district = 'Coimbatore';
        baseCoords = { lat: 11.0168, lng: 76.9558 };
    } else if (id.startsWith('TN-CH-')) {
        region = 'Chennai';
        regionName = 'Chennai';
        district = 'Chennai';
        baseCoords = { lat: 13.0827, lng: 80.2707 };
    } else if (id.startsWith('TN-MD-')) {
        region = 'Madurai';
        regionName = 'Madurai';
        district = 'Madurai';
        baseCoords = { lat: 9.9252, lng: 78.1198 };
    }

    // Extract ward number from ID (e.g., TN-SA-1001 -> 1, TN-SA-1005 -> 5)
    const tankNumber = parseInt(id.split('-')[2]);
    const wardNumber = ((tankNumber - 1) % 5) + 1;

    // Generate realistic metrics
    const ph = Number((6.5 + Math.random() * 2).toFixed(2));
    const chlorine = Number((1.0 + Math.random() * 1.5).toFixed(2));
    const turbidity = Number((Math.random() * 5).toFixed(2));

    // Determine status based on metrics
    let status = 'online';
    if (ph < 6.5 || ph > 8.5 || turbidity > 5 || chlorine > 2.5) status = 'critical';
    else if (ph < 6.8 || ph > 8.2 || turbidity > 3 || chlorine > 2.0) status = 'warning';

    return {
        id: id,
        name: `${regionName} Ward ${wardNumber} Tank`,
        location: {
            lat: baseCoords.lat + (wardNumber * 0.01),
            lng: baseCoords.lng + (wardNumber * 0.01),
            address: `Ward ${wardNumber}, ${regionName}, ${district} District, Tamil Nadu`
        },
        status: status,
        waterLevel: Math.floor(60 + Math.random() * 40),
        lastUpdate: new Date().toISOString(),
        lastCleaned: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metrics: {
            ph,
            turbidity,
            chlorine,
            temperature: (20 + Math.random() * 10).toFixed(1)
        }
    };
};

export const generatePendingRequests = () => {
    return [
        { id: 'req_1', user: 'Arun Kumar', partner: 'Arun Kumar', location: 'Salem North sector', capacity: 10000, purpose: 'Irrigation', date: '2026-02-01', status: 'pending' },
        { id: 'req_2', user: 'Priya Mani', partner: 'Priya Mani', location: 'Hosur Industrial Zone', capacity: 25000, purpose: 'Industrial Use', date: '2026-02-03', status: 'pending' },
    ];
};

export const generateReportedIssues = () => {
    return [
        { id: 'iss_1', tank: 'Salem - Ward 1', user: 'Suresh R', partner: 'Suresh R', issue: 'Unusual pH spike detected', date: '2026-02-04 09:30', aiSummary: 'Suspected chemical runoff due to nearby construction.', severity: 'critical' },
        { id: 'iss_2', tank: 'Salem - Ward 2', user: 'Meena K', partner: 'Meena K', issue: 'Tank lid sealant leaking', date: '2026-02-04 10:15', aiSummary: 'Physical structural damage requiring onsite visit.', severity: 'warning' },
    ];
};

export const generateAlerts = () => {
    return [
        { id: 'alt_1', tankId: 'TN-SA-1001', type: 'pH Spike', severity: 'critical', message: 'pH level reached 9.2 in Salem Ward 2', time: '10 mins ago' },
        { id: 'alt_2', tankId: 'TN-SA-1003', type: 'Low Level', severity: 'warning', message: 'Water level below 15% in Salem Ward 4', time: '1 hour ago' },
    ];
};
