import serial
import json
import time
import requests
from datetime import datetime

# ===================== CONFIG =====================
PORT = "COM3"          # change if needed
BAUD = 115200
FILE_NAME = "water_quality_data.json"
BACKEND_URL = "http://localhost:5000/api/sensor/data"

# User email - change this to associate data with different users
USER_EMAIL = "pooja@gmail.com"  # Change to "deepthitheeran@gmail.com" for Salem data

# Fixed location - Pragati Maidan, New Delhi (for pooja@gmail.com)
LOCATION = {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "city": "Pragati Maidan",
    "region": "Pragati Maidan, New Delhi, Delhi",
    "country": "IN"
}
# ==================================================

def calculate_water_quality_metrics(sensor_data):
    """
    Calculate additional water quality parameters from sensor data
    
    Formulas:
    - Temperature: Estimated from ambient (25-30°C range in Tamil Nadu)
    - Water Level: Based on turbidity (lower turbidity = cleaner = higher level)
    - TDS (Total Dissolved Solids): Estimated from pH
    - Conductivity: Related to TDS
    - Water Quality Index (WQI): Composite score
    """
    
    ph = sensor_data.get('pH', 7.0)
    turbidity = sensor_data.get('turbidity', 0)
    ph_voltage = sensor_data.get('ph_voltage', 0)
    turbidity_voltage = sensor_data.get('turbidity_voltage', 0)
    
    # Temperature estimation (25-30°C typical for Tamil Nadu)
    # Slight variation based on pH (more alkaline = slightly warmer)
    temperature = round(25 + (ph - 7) * 0.5, 1)
    temperature = max(20, min(35, temperature))  # Clamp between 20-35°C
    
    # Water Level calculation (0-100%)
    # Lower turbidity = cleaner water = assume higher level
    # Turbidity range: 0-5000 NTU (lower is better)
    if turbidity < 1000:
        water_level = 85 + (1000 - turbidity) / 100
    elif turbidity < 2000:
        water_level = 70 + (2000 - turbidity) / 100
    elif turbidity < 3000:
        water_level = 50 + (3000 - turbidity) / 100
    else:
        water_level = 30 + (5000 - turbidity) / 200
    
    water_level = round(max(0, min(100, water_level)))  # Clamp 0-100%
    
    # TDS (Total Dissolved Solids) in ppm
    # Estimated from pH: neutral pH = lower TDS, extreme pH = higher TDS
    ph_deviation = abs(ph - 7.0)
    tds = round(300 + (ph_deviation * 100) + (turbidity * 0.1))
    
    # Conductivity (µS/cm) - related to TDS
    # Formula: Conductivity ≈ TDS * 2
    conductivity = round(tds * 2)
    
    # Dissolved Oxygen (DO) in mg/L
    # Higher turbidity = lower DO
    # Normal range: 5-9 mg/L
    do = round(9 - (turbidity / 500), 1)
    do = max(0, min(12, do))
    
    # Water Quality Index (WQI) - 0-100 scale
    # 90-100: Excellent, 70-90: Good, 50-70: Medium, 25-50: Bad, 0-25: Very Bad
    
    # pH score (ideal: 6.5-8.5)
    if 6.5 <= ph <= 8.5:
        ph_score = 100
    elif 6.0 <= ph <= 9.0:
        ph_score = 80
    elif 5.5 <= ph <= 9.5:
        ph_score = 60
    else:
        ph_score = 40
    
    # Turbidity score (ideal: < 1000 NTU)
    if turbidity < 1000:
        turbidity_score = 100
    elif turbidity < 2000:
        turbidity_score = 80
    elif turbidity < 3000:
        turbidity_score = 60
    else:
        turbidity_score = 40
    
    # DO score (ideal: > 6 mg/L)
    if do >= 6:
        do_score = 100
    elif do >= 4:
        do_score = 80
    elif do >= 2:
        do_score = 60
    else:
        do_score = 40
    
    # Calculate WQI (weighted average)
    wqi = round((ph_score * 0.4 + turbidity_score * 0.4 + do_score * 0.2))
    
    # Determine water quality status
    if wqi >= 90:
        quality_status = "Excellent"
    elif wqi >= 70:
        quality_status = "Good"
    elif wqi >= 50:
        quality_status = "Medium"
    elif wqi >= 25:
        quality_status = "Bad"
    else:
        quality_status = "Very Bad"
    
    # Chlorine calculation (mg/L)
    # Ideal chlorine: 0.2-1.0 mg/L for drinking water
    # Higher pH = more chlorine needed for disinfection
    # Lower turbidity = less chlorine needed
    # Formula: Base chlorine + pH adjustment - turbidity adjustment
    base_chlorine = 0.5  # Base level
    ph_adjustment = (ph - 7) * 0.1  # Higher pH needs more chlorine
    turbidity_adjustment = turbidity / 5000  # Higher turbidity reduces effective chlorine
    
    chlorine = round(base_chlorine + ph_adjustment - turbidity_adjustment, 2)
    chlorine = max(0, min(2.0, chlorine))  # Clamp between 0-2.0 mg/L
    
    return {
        "pH": ph,
        "ph_voltage": ph_voltage,
        "turbidity": turbidity,
        "turbidity_voltage": turbidity_voltage,
        "temperature": temperature,
        "waterLevel": water_level,
        "tds": tds,
        "conductivity": conductivity,
        "dissolved_oxygen": do,
        "chlorine": chlorine,
        "wqi": wqi,
        "quality_status": quality_status
    }

# ---------- Send data to backend ----------
def send_to_backend(record):
    """Send sensor data to backend API"""
    try:
        response = requests.post(BACKEND_URL, json=record, timeout=5)
        
        if response.status_code == 201:
            print(f"   ✅ Sent to backend - Tank ID: {response.json()['tank']['id']}")
            return True
        else:
            print(f"   ❌ Backend error: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("   ⚠️ Backend not reachable (is it running on port 5000?)")
        return False
    except Exception as e:
        print(f"   ❌ Error sending to backend: {e}")
        return False

# ---------- Open serial ----------
try:
    ser = serial.Serial(PORT, BAUD, timeout=1)
    time.sleep(2)
    print(f"📡 Connected to ESP32 on {PORT}")
    print(f"📍 Location: {LOCATION['city']}, {LOCATION['region']}")
    print(f"💾 Saving to: {FILE_NAME}")
    print(f"🌐 Sending to: {BACKEND_URL}")
    print("🔄 Listening for sensor data...")
    print("-" * 60)
except Exception as e:
    print(f"❌ Cannot open serial port {PORT}: {e}")
    print("💡 Make sure ESP32 is connected and COM port is correct")
    exit(1)

# ---------- Main loop ----------
while True:
    try:
        line = ser.readline().decode("utf-8").strip()

        if not line:
            continue

        # ESP32 must send valid JSON with pH, turbidity, voltages
        esp32_data = json.loads(line)
        
        # Calculate all water quality metrics
        calculated_metrics = calculate_water_quality_metrics(esp32_data)

        record = {
            "timestamp": datetime.now().isoformat(),
            "sensor_data": calculated_metrics,
            "location": LOCATION,
            "user_email": USER_EMAIL  # Associate data with specific user
        }

        # Append data to file
        try:
            with open(FILE_NAME, "r") as f:
                data = json.load(f)
        except:
            data = []

        data.append(record)

        with open(FILE_NAME, "w") as f:
            json.dump(data, f, indent=4)

        # Print sensor values
        ph = calculated_metrics['pH']
        turbidity = calculated_metrics['turbidity']
        temp = calculated_metrics['temperature']
        wqi = calculated_metrics['wqi']
        status = calculated_metrics['quality_status']
        
        print(f"📊 {datetime.now().strftime('%H:%M:%S')} | pH: {ph:.2f} | Turbidity: {turbidity:.1f} | Temp: {temp}°C | WQI: {wqi} ({status})")
        
        # Send to backend
        send_to_backend(record)
        print("-" * 60)

    except json.JSONDecodeError:
        print("⚠️ Invalid JSON received:", line)

    except KeyboardInterrupt:
        print("\n🛑 Stopped by user")
        ser.close()
        break

    except Exception as e:
        print("❌ Error:", e)
