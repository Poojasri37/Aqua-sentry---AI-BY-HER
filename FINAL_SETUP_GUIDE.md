# 🎯 FINAL SETUP - Real ESP32 Data Integration

## ✅ What's Ready

1. **User Account Created**
   - Email: `pooja@gmail.com`
   - Password: `pooja`
   - Role: Business Partner

2. **Backend Running**
   - Port: 5000
   - MongoDB Atlas connected
   - API endpoint: `/api/sensor/data`

3. **Frontend Running**
   - Port: 5173
   - Real-time dashboard ready
   - Socket.IO connected

4. **ESP32 Script Updated**
   - Reads from COM3 serial port
   - Saves to `water_quality_data.json`
   - Sends to backend automatically

## 🚀 How to Run Everything

### Step 1: Start ESP32 Data Collection

Open a terminal and run:
```bash
cd "d:\AI BY HER\esp32"
python send_data.py
```

**What it does:**
- ✅ Connects to ESP32 on COM3
- ✅ Reads sensor data (pH, turbidity, voltages)
- ✅ Gets location from IP
- ✅ Saves to `water_quality_data.json`
- ✅ **Automatically sends to backend in real-time**
- ✅ Data appears on dashboard instantly!

**Output you'll see:**
```
📡 Connected to ESP32 on COM3
💾 Saving to: water_quality_data.json
🌐 Sending to: http://localhost:5000/api/sensor/data
🔄 Listening for sensor data...
------------------------------------------------------------
📊 15:35:10 | pH: 10.53 | Turbidity: 2982.7
   ✅ Sent to backend - Tank ID: 6985ba50c5d6bdf41ac2a749
------------------------------------------------------------
📊 15:35:12 | pH: 10.51 | Turbidity: 2984.0
   ✅ Sent to backend - Tank ID: 6985ba50c5d6bdf41ac2a749
------------------------------------------------------------
```

### Step 2: Login to Dashboard

1. **Open browser**: http://localhost:5173
2. **Click "Login"**
3. **Enter credentials**:
   - Email: `pooja@gmail.com`
   - Password: `pooja`
4. **Click "Sign In"**

### Step 3: Watch Real-Time Data! 🎉

Once logged in, you'll see:

**✨ Live Sensor Data Card (Large Blue Card)**
- 📍 Location: City, Region, GPS coordinates
- 💧 pH Level: Real-time value with voltage
- 🌊 Turbidity: Real-time value with voltage
- 🌡️ Temperature: Current reading
- 💦 Water Level: Percentage

**📊 Stats Section**
- Total Readings: Increases with each new data point
- Connection Status: Online (green) / Offline (red)
- System Status: NORMAL / WARNING (based on pH/turbidity)

**📜 Recent Readings**
- Shows last 10 sensor readings
- Each card displays: pH, turbidity, location, time
- Color-coded status (green = normal, yellow = warning)

## 🔄 Data Flow

```
ESP32 → Serial (COM3) → send_data.py → Backend API → MongoDB Atlas
                            ↓                           ↓
                    water_quality_data.json      Socket.IO Broadcast
                                                        ↓
                                                  Dashboard Updates
                                                  (Real-time!)
```

## 📋 What Each Component Does

### `send_data.py` (Main Script)
- Reads from ESP32 via serial port
- Parses JSON sensor data
- Gets location from IP
- Saves to local JSON file
- **Sends to backend immediately**
- Runs continuously until Ctrl+C

### Backend (`/api/sensor/data`)
- Receives sensor data
- Creates/finds tank based on location
- Saves reading to MongoDB
- Broadcasts via Socket.IO to all connected users

### Frontend Dashboard
- Connects via Socket.IO
- Listens for `global_sensor_update` events
- Updates UI in real-time
- Shows data for logged-in user

## 🎯 User-Specific Data

**Important**: Currently, all users see all sensor data because:
- Data is broadcasted globally via `global_sensor_update`
- Tanks are created based on location, not user

**If you want user-specific tanks:**
1. Modify the backend to associate tanks with user ID
2. Filter data based on logged-in user
3. Only show tanks owned by that user

## ⚠️ Troubleshooting

### ESP32 Not Connecting
```
❌ Cannot open serial port COM3
```
**Solution:**
- Check if ESP32 is plugged in
- Verify COM port in Device Manager
- Update `PORT = "COM3"` in send_data.py if different

### Backend Not Receiving Data
```
⚠️ Backend not reachable
```
**Solution:**
- Make sure backend is running: `npm run dev` in backend folder
- Check if port 5000 is available
- Verify MongoDB connection in backend terminal

### Dashboard Not Updating
**Solution:**
- Check green/red connection indicator
- Refresh the page
- Check browser console (F12) for errors
- Make sure you're logged in

### Data Not Appearing for User
**Solution:**
- Make sure you're logged in as pooja@gmail.com
- Check that backend is receiving data (terminal logs)
- Verify Socket.IO connection (green dot on dashboard)

## 📊 Sample Data Format

**ESP32 sends (via serial):**
```json
{
  "pH": 10.53,
  "ph_voltage": 1.015,
  "turbidity_voltage": 2.422,
  "turbidity": 2982.7
}
```

**Script creates:**
```json
{
  "timestamp": "2026-02-06T15:35:10.123456",
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

**Backend saves to MongoDB and broadcasts to dashboard!**

## ✅ Quick Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] User account created (pooja@gmail.com)
- [ ] ESP32 connected to COM3
- [ ] Run `python send_data.py`
- [ ] Login to dashboard
- [ ] See real-time data updates!

## 🎉 Success Indicators

When everything works, you'll see:
1. ✅ Terminal shows "Sent to backend" for each reading
2. ✅ Green connection dot on dashboard
3. ✅ Large blue card updates every 2 seconds
4. ✅ Stats increase (Total Readings)
5. ✅ Recent readings section fills up
6. ✅ Data matches what ESP32 is sending

---

**🎯 TL;DR:**
```bash
# Terminal 1: Backend (already running)
cd "d:\AI BY HER\backend"
npm run dev

# Terminal 2: Frontend (already running)
cd "d:\AI BY HER\frontend"
npm run dev

# Terminal 3: ESP32 Data
cd "d:\AI BY HER\esp32"
python send_data.py

# Browser: Login and watch!
http://localhost:5173
Email: pooja@gmail.com
Password: pooja
```

**Everything is automated - data flows from ESP32 to dashboard in real-time!** ✨
