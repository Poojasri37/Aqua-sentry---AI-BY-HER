# ESP32 Real-Time Sensor Data Integration

## Overview
This system integrates ESP32 sensor data (pH, turbidity, location) with your AquaSentry application, displaying real-time updates on the dashboard.

## Architecture

```
ESP32 Device → Python Script → Backend API → MongoDB + Socket.IO → Frontend Dashboard
```

## Setup Instructions

### 1. Install MongoDB (REQUIRED)

**Download and Install:**
1. Go to: https://www.mongodb.com/try/download/community
2. Download the Windows x64 MSI installer
3. Run the installer:
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Keep "Run service as Network Service user" selected
   - Click Install

**Verify Installation:**
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# If not running, start it
Start-Service MongoDB
```

### 2. Backend Setup

The backend has been updated with:
- ✅ New route: `/api/sensor/data` to receive ESP32 data
- ✅ Socket.IO integration for real-time broadcasting
- ✅ Automatic tank creation based on location
- ✅ Sensor reading storage in MongoDB

**Start the backend:**
```bash
cd backend
npm run dev
```

### 3. Frontend Setup

The Dashboard has been updated to:
- ✅ Display live sensor data from ESP32
- ✅ Show pH, turbidity, temperature, water level
- ✅ Display location information
- ✅ Show connection status
- ✅ Keep history of last 10 readings

**Frontend is already running** (you have it running in your terminal)

### 4. Send ESP32 Data

**Option A: Using the Python Script**

```bash
cd esp32
python send_data.py
```

**Option B: From Your ESP32 Device**

Configure your ESP32 to send POST requests to:
```
http://localhost:5000/api/sensor/data
```

**Payload Format:**
```json
{
  "timestamp": "2026-02-06T12:17:25.360557",
  "sensor_data": {
    "pH": 10.53,
    "ph_voltage": 1.015,
    "turbidity_voltage": 2.422,
    "turbidity": 2982.7
  },
  "location": {
    "latitude": 10.999,
    "longitude": 77.0324,
    "city": "Singānallūr",
    "region": "Tamil Nadu",
    "country": "IN"
  }
}
```

## How It Works

### 1. Data Reception
- ESP32 sends sensor data to `/api/sensor/data`
- Backend receives and validates the data
- Creates or finds tank based on location

### 2. Data Storage
- Sensor reading is saved to MongoDB
- Tank information is created/updated

### 3. Real-Time Broadcasting
- Socket.IO emits `sensor_update` to specific tank room
- Socket.IO emits `global_sensor_update` to all connected clients

### 4. Frontend Display
- Dashboard receives updates via Socket.IO
- Updates the live sensor data display
- Adds to reading history
- Shows connection status

## API Endpoints

### POST /api/sensor/data
Receive sensor data from ESP32

**Request Body:**
```json
{
  "sensor_data": {
    "pH": 7.5,
    "turbidity": 1500,
    "ph_voltage": 1.2,
    "turbidity_voltage": 2.5
  },
  "location": {
    "latitude": 10.999,
    "longitude": 77.0324,
    "city": "City Name",
    "region": "State",
    "country": "Country Code"
  },
  "timestamp": "ISO 8601 timestamp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Sensor data received and saved",
  "tank": {
    "id": "tank_id",
    "name": "Tank Name",
    "location": {...}
  },
  "reading": {
    "id": "reading_id",
    "ph": 7.5,
    "turbidity": 1500
  }
}
```

### GET /api/sensor/latest/:tankId
Get the latest reading for a specific tank

### GET /api/sensor/history/:tankId
Get historical readings for a tank

**Query Parameters:**
- `limit`: Number of readings (default: 100)
- `hours`: Time range in hours (default: 24)

## Testing

### 1. Test with Python Script

```bash
cd esp32
python send_data.py
```

You should see:
- ✅ Console log in backend showing received data
- ✅ Data saved to MongoDB
- ✅ Frontend dashboard updates in real-time

### 2. Test with cURL

```powershell
curl -X POST http://localhost:5000/api/sensor/data `
  -H "Content-Type: application/json" `
  -d '{
    "sensor_data": {
      "pH": 7.5,
      "turbidity": 1500,
      "ph_voltage": 1.2,
      "turbidity_voltage": 2.5
    },
    "location": {
      "latitude": 10.999,
      "longitude": 77.0324,
      "city": "Test City",
      "region": "Test State",
      "country": "IN"
    }
  }'
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED ::1:27017
```
**Solution:** Install and start MongoDB (see Step 1)

### Backend Not Receiving Data
- Check if backend is running on port 5000
- Verify the endpoint URL is correct
- Check firewall settings

### Frontend Not Updating
- Check browser console for Socket.IO connection
- Verify you're logged in
- Check network tab for WebSocket connection

### Python Script Error
```
ModuleNotFoundError: No module named 'requests'
```
**Solution:**
```bash
pip install requests
```

## Status Indicators

The dashboard shows:
- **Green dot**: Connected to backend via Socket.IO
- **Red dot**: Disconnected from backend
- **Normal status**: pH between 6.5-8.5, turbidity < 1000
- **Warning status**: pH outside range or turbidity > 1000

## Next Steps

1. ✅ Install MongoDB
2. ✅ Start backend server
3. ✅ Login to dashboard
4. ✅ Send test data using Python script
5. ✅ Watch real-time updates on dashboard
6. Configure ESP32 to send data automatically

## Files Created/Modified

### New Files:
- `backend/src/routes/sensorRoutes.js` - ESP32 data receiver
- `esp32/send_data.py` - Python script to send data
- `ESP32_INTEGRATION.md` - This file

### Modified Files:
- `backend/src/server.js` - Added sensor routes
- `frontend/src/pages/Dashboard.jsx` - Real-time sensor display

## Support

If you encounter any issues:
1. Check MongoDB is running
2. Verify backend is running on port 5000
3. Check browser console for errors
4. Verify Socket.IO connection status
