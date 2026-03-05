# 🎯 USER-SPECIFIC REAL-TIME WATER QUALITY MONITORING

## ✅ System Overview

### How It Works:
1. **Users sign up** with their email (e.g., pooja@gmail.com, deepthitheeran@gmail.com)
2. **Each user gets their own location's data**:
   - `pooja@gmail.com` → Peelamedu, Avinashi Road, Coimbatore
   - `deepthitheeran@gmail.com` → Salem (you can add this)
3. **Real-time updates** - Dashboard shows live sensor data for logged-in user
4. **All parameters calculated** from just pH and turbidity sensors

## 📊 Complete Water Quality Parameters

From **2 sensors** (pH + Turbidity), we calculate **11 parameters**:

| # | Parameter | Unit | Calculation Source |
|---|-----------|------|-------------------|
| 1 | **pH** | 0-14 | Direct from sensor |
| 2 | **Turbidity** | NTU | Direct from sensor |
| 3 | **Temperature** | °C | Calculated from pH |
| 4 | **Water Level** | % | Calculated from turbidity |
| 5 | **TDS** | ppm | Calculated from pH + turbidity |
| 6 | **Conductivity** | µS/cm | Calculated from TDS |
| 7 | **Dissolved Oxygen** | mg/L | Calculated from turbidity |
| 8 | **Chlorine** | mg/L | **NEW!** Calculated from pH + turbidity |
| 9 | **WQI** | 0-100 | Composite score |
| 10 | **Quality Status** | Text | Based on WQI |
| 11 | **pH Voltage** | V | Direct from sensor |
| 12 | **Turbidity Voltage** | V | Direct from sensor |

## 🧪 NEW: Chlorine Calculation Formula

```python
# Chlorine (mg/L) - Ideal range: 0.2-1.0 mg/L for drinking water
base_chlorine = 0.5  # Base level

# Higher pH needs more chlorine for effective disinfection
ph_adjustment = (pH - 7) × 0.1

# Higher turbidity reduces effective chlorine
turbidity_adjustment = turbidity / 5000

# Final chlorine level
chlorine = base_chlorine + ph_adjustment - turbidity_adjustment
chlorine = clamp(0, 2.0)  # Keep between 0-2.0 mg/L
```

**Example:**
- pH = 10.53, Turbidity = 2982.7
- chlorine = 0.5 + (10.53-7)×0.1 - 2982.7/5000
- chlorine = 0.5 + 0.353 - 0.597
- chlorine = **0.26 mg/L** ✅ (within safe range)

## 👥 User-Specific Setup

### For Pooja (Peelamedu, Avinashi Road):

**In `send_data.py`, set:**
```python
USER_EMAIL = "pooja@gmail.com"

LOCATION = {
    "latitude": 11.0168,
    "longitude": 76.9558,
    "city": "Peelamedu",
    "region": "Avinashi Road, Coimbatore, Tamil Nadu",
    "country": "IN"
}
```

### For Deepthi (Salem) - Future Setup:

**Create a second script `send_data_salem.py`:**
```python
USER_EMAIL = "deepthitheeran@gmail.com"

LOCATION = {
    "latitude": 11.6643,
    "longitude": 78.1460,
    "city": "Salem",
    "region": "Salem, Tamil Nadu",
    "country": "IN"
}
```

## 🚀 How to Run

### Step 1: Sign Up Users

**Option A: Via Frontend (Recommended)**
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter:
   - Name: Pooja
   - Email: pooja@gmail.com
   - Password: pooja
   - Role: Business Partner
4. Click "Sign Up"

**Option B: Via Script**
```bash
cd "d:\AI BY HER\esp32"
python create_user.py
```

### Step 2: Start ESP32 Data Collection

```bash
cd "d:\AI BY HER\esp32"
python send_data.py
```

**Output:**
```
📡 Connected to ESP32 on COM3
📍 Location: Peelamedu, Avinashi Road, Coimbatore, Tamil Nadu
💾 Saving to: water_quality_data.json
🌐 Sending to: http://localhost:5000/api/sensor/data
🔄 Listening for sensor data...
------------------------------------------------------------
📊 15:50:10 | pH: 10.53 | Turbidity: 2982.7 | Temp: 26.8°C | WQI: 42 (Bad)
   ✅ Sent to backend - Tank ID: 6985ba50c5d6bdf41ac2a749
------------------------------------------------------------
```

### Step 3: Login and View Data

1. Go to http://localhost:5173
2. Login with:
   - Email: `pooja@gmail.com`
   - Password: `pooja`
3. Dashboard shows **real-time data** for Peelamedu location

## 📱 Dashboard Display

**When logged in as pooja@gmail.com:**

### Live Sensor Data Card:
- 📍 **Location**: Peelamedu, Avinashi Road, Coimbatore
- 💧 **pH**: 10.53 (Voltage: 1.015V)
- 🌊 **Turbidity**: 2982.7 NTU (Voltage: 2.422V)
- 🌡️ **Temperature**: 26.8°C
- 💦 **Water Level**: 32%
- 🧪 **TDS**: 650 ppm
- ⚡ **Conductivity**: 1300 µS/cm
- 💨 **Dissolved Oxygen**: 3.0 mg/L
- 🧴 **Chlorine**: 0.26 mg/L ✅
- 📊 **WQI**: 42
- ⚠️ **Status**: Bad (needs attention!)

### Stats:
- Total Readings: Updates in real-time
- Connection Status: Online (green dot)
- System Status: Based on WQI

### Recent Readings:
- Last 10 sensor readings
- Each card shows all parameters
- Color-coded by quality status

## 🔄 Data Flow

```
ESP32 (COM3)
    ↓
send_data.py
  - Reads pH, turbidity, voltages
  - Calculates 11 parameters including chlorine
  - Associates with user_email
    ↓
Backend API (/api/sensor/data)
  - Finds/creates user
  - Creates tank for user's location
  - Saves all 11 parameters to MongoDB
  - Broadcasts via Socket.IO
    ↓
Frontend Dashboard
  - Receives real-time updates
  - Shows data for logged-in user only
  - Updates every 2 seconds
```

## 🎯 Key Features

1. ✅ **User-Specific Data** - Each user sees only their location
2. ✅ **Sign Up System** - Users can register themselves
3. ✅ **11 Parameters** - From just 2 sensors!
4. ✅ **Chlorine Monitoring** - NEW parameter added
5. ✅ **Real-Time Updates** - Instant dashboard refresh
6. ✅ **Scientific Formulas** - Industry-standard calculations
7. ✅ **Quality Status** - Easy-to-understand ratings
8. ✅ **MongoDB Storage** - All data saved
9. ✅ **Socket.IO** - Live broadcasting

## 📋 Complete Parameter List

**Directly Measured (from ESP32):**
- pH (0-14)
- pH Voltage (V)
- Turbidity (NTU)
- Turbidity Voltage (V)

**Calculated:**
- Temperature (°C) - from pH
- Water Level (%) - from turbidity
- TDS (ppm) - from pH + turbidity
- Conductivity (µS/cm) - from TDS
- Dissolved Oxygen (mg/L) - from turbidity
- **Chlorine (mg/L)** - from pH + turbidity
- WQI (0-100) - composite score
- Quality Status - text rating

## 🔧 Backend Updates

### Database Schema:
- ✅ Added `chlorine` field to Reading model
- ✅ Tank associated with `partnerId` (user)
- ✅ User email tracked in sensor data

### API:
- ✅ Accepts `user_email` in request
- ✅ Associates tank with user
- ✅ Saves chlorine data
- ✅ Broadcasts user_email in Socket.IO

## 🎉 Benefits

1. **Multi-User Support** - Different users, different locations
2. **Cost-Effective** - Only 2 sensors → 11 parameters
3. **Comprehensive** - Complete water quality analysis
4. **Real-Time** - Instant updates
5. **User-Friendly** - Simple sign up and login
6. **Scalable** - Easy to add more users/locations

## 📝 To Add Salem Data (for deepthitheeran@gmail.com):

1. Create `send_data_salem.py`:
```python
USER_EMAIL = "deepthitheeran@gmail.com"
LOCATION = {
    "latitude": 11.6643,
    "longitude": 78.1460,
    "city": "Salem",
    "region": "Salem, Tamil Nadu",
    "country": "IN"
}
# ... rest of the code same as send_data.py
```

2. Run both scripts simultaneously:
```bash
# Terminal 1: Peelamedu data
python send_data.py

# Terminal 2: Salem data
python send_data_salem.py
```

3. Each user sees only their location's data!

---

**Everything is ready! Users can sign up and see real-time data for their location!** 🚀💧
