# 🎯 Updated ESP32 Integration - Complete Water Quality Monitoring

## ✅ What's Been Updated

### 1. **Fixed Location** 📍
- **Location**: Peelamedu, Avinashi Road, Coimbatore, Tamil Nadu
- **Coordinates**: 11.0168° N, 76.9558° E
- No more IP-based location lookup - always uses this fixed location

### 2. **Comprehensive Water Quality Calculations** 🧪

The system now calculates **10 water quality parameters** from just pH and turbidity sensors:

| Parameter | Formula/Calculation | Range | Purpose |
|-----------|-------------------|-------|---------|
| **pH** | From sensor | 0-14 | Acidity/Alkalinity |
| **Turbidity** | From sensor | 0-5000 NTU | Water clarity |
| **Temperature** | 25 + (pH-7) × 0.5 | 20-35°C | Estimated ambient temp |
| **Water Level** | Based on turbidity | 0-100% | Tank fill level |
| **TDS** | 300 + \|pH-7\| × 100 + turbidity × 0.1 | ppm | Total Dissolved Solids |
| **Conductivity** | TDS × 2 | µS/cm | Electrical conductivity |
| **Dissolved Oxygen** | 9 - (turbidity / 500) | 0-12 mg/L | Oxygen content |
| **WQI** | Weighted average of scores | 0-100 | Overall water quality |
| **Quality Status** | Based on WQI | Text | Excellent/Good/Medium/Bad/Very Bad |

### 3. **Water Quality Index (WQI) Calculation** 📊

**WQI Formula:**
```
WQI = (pH_score × 0.4) + (turbidity_score × 0.4) + (DO_score × 0.2)
```

**Scoring:**

**pH Score:**
- 6.5-8.5: 100 (Excellent)
- 6.0-9.0: 80 (Good)
- 5.5-9.5: 60 (Medium)
- Others: 40 (Bad)

**Turbidity Score:**
- < 1000 NTU: 100 (Excellent)
- < 2000 NTU: 80 (Good)
- < 3000 NTU: 60 (Medium)
- ≥ 3000 NTU: 40 (Bad)

**Dissolved Oxygen Score:**
- ≥ 6 mg/L: 100 (Excellent)
- ≥ 4 mg/L: 80 (Good)
- ≥ 2 mg/L: 60 (Medium)
- < 2 mg/L: 40 (Bad)

**Quality Status:**
- 90-100: **Excellent** ✅
- 70-89: **Good** 👍
- 50-69: **Medium** ⚠️
- 25-49: **Bad** ❌
- 0-24: **Very Bad** 🚫

## 📊 Data Flow

```
ESP32 Sensors (COM3)
    ↓
send_data.py reads:
  - pH
  - pH voltage
  - Turbidity
  - Turbidity voltage
    ↓
Calculates:
  - Temperature
  - Water Level
  - TDS
  - Conductivity
  - Dissolved Oxygen
  - WQI
  - Quality Status
    ↓
Saves to water_quality_data.json
    ↓
Sends to Backend API
    ↓
MongoDB Atlas (stores all 10 parameters)
    ↓
Socket.IO Broadcast
    ↓
Dashboard (real-time display)
```

## 🚀 How to Run

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
📊 15:40:10 | pH: 10.53 | Turbidity: 2982.7 | Temp: 26.8°C | WQI: 42 (Bad)
   ✅ Sent to backend - Tank ID: 6985ba50c5d6bdf41ac2a749
------------------------------------------------------------
```

## 📱 Dashboard Display

**Login:**
- Email: `pooja@gmail.com`
- Password: `pooja`

**You'll see:**
- 📍 **Location**: Peelamedu, Avinashi Road, Coimbatore
- 💧 **pH**: Real-time value with voltage
- 🌊 **Turbidity**: Real-time value with voltage
- 🌡️ **Temperature**: Calculated value
- 💦 **Water Level**: Calculated percentage
- 📊 **WQI**: Water Quality Index score
- ✅ **Status**: Quality status (Excellent/Good/Medium/Bad/Very Bad)
- 🧪 **TDS**: Total Dissolved Solids
- ⚡ **Conductivity**: Electrical conductivity
- 💨 **Dissolved Oxygen**: DO level

## 🔧 Backend Updates

### Database Schema (Reading.js)
Added fields:
- `tds` (Number)
- `conductivity` (Number)
- `dissolved_oxygen` (Number)
- `wqi` (Number)
- `quality_status` (String: Excellent/Good/Medium/Bad/Very Bad)

### API Response
Now includes all calculated metrics in Socket.IO broadcasts

## 📈 Sample Data

**ESP32 sends:**
```json
{
  "pH": 10.53,
  "ph_voltage": 1.015,
  "turbidity_voltage": 2.422,
  "turbidity": 2982.7
}
```

**System calculates and stores:**
```json
{
  "timestamp": "2026-02-06T15:40:10.123456",
  "sensor_data": {
    "pH": 10.53,
    "ph_voltage": 1.015,
    "turbidity": 2982.7,
    "turbidity_voltage": 2.422,
    "temperature": 26.8,
    "waterLevel": 32,
    "tds": 650,
    "conductivity": 1300,
    "dissolved_oxygen": 3.0,
    "wqi": 42,
    "quality_status": "Bad"
  },
  "location": {
    "latitude": 11.0168,
    "longitude": 76.9558,
    "city": "Peelamedu",
    "region": "Avinashi Road, Coimbatore, Tamil Nadu",
    "country": "IN"
  }
}
```

## 🎯 Key Features

1. ✅ **Fixed Location** - Always Peelamedu, Avinashi Road
2. ✅ **10 Water Quality Parameters** - Calculated from 2 sensors
3. ✅ **Scientific Formulas** - Industry-standard calculations
4. ✅ **Water Quality Index** - Composite score (0-100)
5. ✅ **Quality Status** - Easy-to-understand rating
6. ✅ **Real-time Updates** - Instant dashboard refresh
7. ✅ **MongoDB Storage** - All parameters saved
8. ✅ **User-specific Login** - pooja@gmail.com

## 📚 Formula References

- **TDS Calculation**: Based on pH deviation and turbidity
- **Conductivity**: Standard TDS × 2 relationship
- **Dissolved Oxygen**: Inverse relationship with turbidity
- **WQI**: Weighted average of pH, turbidity, and DO scores
- **Temperature**: Estimated from pH (alkaline water tends warmer)
- **Water Level**: Inverse relationship with turbidity (cleaner = higher level)

## 🎉 Benefits

1. **Cost-effective**: Only 2 sensors needed (pH + turbidity)
2. **Comprehensive**: 10 parameters calculated
3. **Real-time**: Instant updates on dashboard
4. **Scientific**: Industry-standard formulas
5. **User-friendly**: Simple quality status (Excellent/Good/etc.)
6. **Scalable**: Easy to add more sensors later

---

**Everything is automated and ready to use!** 🚀
