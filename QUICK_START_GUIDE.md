# 🚀 Quick Start Guide - Get Real-Time ESP32 Data

## Current Status
✅ Backend configured with MongoDB Atlas  
✅ Frontend ready with real-time dashboard  
✅ Socket.IO configured for live updates  
✅ API endpoint ready to receive ESP32 data  

## Step-by-Step Instructions

### Step 1: Verify Backend is Running ✅

Your backend should already be running. Check the terminal for:
```
✅ MongoDB Connected
✅ Server running on port 5000
```

If not running, open a terminal and run:
```bash
cd "d:\AI BY HER\backend"
npm run dev
```

### Step 2: Verify Frontend is Running ✅

Your frontend is already running on port 5173. Keep it running!

If you need to restart it:
```bash
cd "d:\AI BY HER\frontend"
npm run dev
```

### Step 3: Login to Dashboard

1. Open browser: http://localhost:5173
2. Login with your credentials
3. You should see the dashboard with:
   - Connection status indicator (green dot = connected)
   - "Waiting for ESP32 sensor data..." message

### Step 4: Send Test Data from ESP32

You have **3 options** to send data:

#### **Option A: Use Python Script (Easiest for Testing)**

Open a **NEW terminal** and run:
```bash
cd "d:\AI BY HER\esp32"
python send_data.py
```

You should see:
```
✅ Data sent successfully
```

**To send data continuously** (every 5 seconds), edit `send_data.py`:
- Uncomment lines 61-63 at the bottom of the file
- Run the script again

#### **Option B: Use PowerShell/cURL**

Open a **NEW terminal** and run:
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
      "city": "Singānallūr",
      "region": "Tamil Nadu",
      "country": "IN"
    }
  }'
```

#### **Option C: From Your Actual ESP32 Device**

Configure your ESP32 to send HTTP POST requests to:
```
http://YOUR_COMPUTER_IP:5000/api/sensor/data
```

**Payload format:**
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

### Step 5: Watch Real-Time Updates! ✨

Once you send data, you'll see **INSTANT updates** on the dashboard:

1. **Large Blue Card** appears showing:
   - 📍 Location (City, Region, Country, GPS coordinates)
   - 💧 pH Level with voltage
   - 🌊 Turbidity with voltage
   - 🌡️ Temperature
   - 💦 Water Level

2. **Stats Update**:
   - Total Readings count increases
   - Connection Status shows "Online"
   - System Status shows "NORMAL" or "WARNING"

3. **Recent Readings Section**:
   - Shows last 10 readings
   - Each card shows pH, turbidity, location, time
   - Color-coded status (green = normal, yellow = warning)

## What You'll See in Each Terminal

### Terminal 1: Backend
```
Connecting to MongoDB...
✅ MongoDB Connected
Server running on port 5000
📡 Received ESP32 Data: { timestamp: ..., sensor_data: ... }
✅ Created new tank: Singānallūr Tank
✅ Saved and broadcasted sensor data
```

### Terminal 2: Frontend
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### Terminal 3: Python Script (when sending data)
```
🚀 Starting ESP32 Data Sender...
📡 Sending data to: http://localhost:5000/api/sensor/data
✅ Data sent successfully: {...}
```

### Browser Console (F12)
```
📡 New sensor reading: { id: ..., metrics: ..., location: ... }
Socket Connected to Backend
```

## Troubleshooting

### ❌ "Disconnected" status on dashboard
**Solution:** Make sure backend is running on port 5000

### ❌ Python script error: "Connection refused"
**Solution:** Backend is not running. Start it with `npm run dev`

### ❌ Data not appearing on dashboard
**Solutions:**
1. Make sure you're logged in
2. Check browser console (F12) for errors
3. Verify Socket.IO connection (should see green dot)
4. Refresh the page

### ❌ "ModuleNotFoundError: No module named 'requests'"
**Solution:**
```bash
pip install requests
```

## Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged into dashboard
- [ ] Green connection indicator visible
- [ ] Sent test data using Python script or cURL
- [ ] Large blue card appeared with sensor data
- [ ] Stats updated (Total Readings increased)
- [ ] Recent readings section shows the data

## Next Steps

Once you confirm everything works:

1. **Modify Python script** to read from your actual ESP32 serial port
2. **Configure ESP32** to send data directly to your backend
3. **Set up continuous monitoring** (data every 5-30 seconds)
4. **Add more sensors** if needed (temperature, dissolved oxygen, etc.)

## Need Help?

Check these files for more details:
- `ESP32_INTEGRATION.md` - Complete technical documentation
- `backend/src/routes/sensorRoutes.js` - API endpoint code
- `frontend/src/pages/Dashboard.jsx` - Dashboard display code
- `esp32/send_data.py` - Python sender script

---

**🎯 TL;DR - Quick Test:**
```bash
# Terminal 1: Backend should already be running
# Terminal 2: Frontend should already be running
# Terminal 3: Send test data
cd "d:\AI BY HER\esp32"
python send_data.py
```

Then check your dashboard at http://localhost:5173 - you should see the data appear instantly! ✨
