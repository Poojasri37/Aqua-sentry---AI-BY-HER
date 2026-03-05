"""
ESP32 Real Data Forwarder - Reads real sensor data from water_quality.json
This script monitors the water_quality.json file and sends real ESP32 data to the backend
"""

import requests
import json
import time
import os
from datetime import datetime
from pathlib import Path

# Backend API endpoint
BACKEND_URL = "http://localhost:5000/api/sensor/data"

# Path to the JSON file created by your ESP32 app
JSON_FILE = "water_quality.json"

def send_sensor_data(data):
    """
    Send real sensor data to the backend
    
    Args:
        data: dict containing sensor_data and location from ESP32
    """
    try:
        # Add timestamp if not present
        if 'timestamp' not in data:
            data['timestamp'] = datetime.now().isoformat()
        
        response = requests.post(BACKEND_URL, json=data, timeout=5)
        
        if response.status_code == 201:
            print(f"✅ Data sent successfully at {datetime.now().strftime('%H:%M:%S')}")
            if 'sensor_data' in data:
                sd = data['sensor_data']
                print(f"   pH: {sd.get('pH', 'N/A')} | Turbidity: {sd.get('turbidity', 'N/A')}")
            if 'location' in data:
                loc = data['location']
                print(f"   Location: {loc.get('city', 'N/A')}, {loc.get('region', 'N/A')}")
            print(f"   Response: {response.json()['message']}")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the backend server is running on port 5000")
        return False
    except Exception as e:
        print(f"❌ Error sending data: {e}")
        return False

def read_json_file():
    """
    Read the latest data from water_quality.json
    """
    try:
        if not os.path.exists(JSON_FILE):
            return None
            
        with open(JSON_FILE, 'r') as f:
            data = json.load(f)
            return data
    except json.JSONDecodeError:
        print("⚠️  JSON file is being written, will retry...")
        return None
    except Exception as e:
        print(f"❌ Error reading JSON file: {e}")
        return None

def watch_and_forward():
    """
    Watch the JSON file and forward new data to backend
    """
    print("🚀 ESP32 Real Data Forwarder Started")
    print(f"📡 Backend URL: {BACKEND_URL}")
    print(f"📄 Watching file: {JSON_FILE}")
    print("🔄 Monitoring for new sensor data...")
    print("⏹️  Press Ctrl+C to stop")
    print("-" * 60)
    
    last_data = None
    last_modified = 0
    
    try:
        while True:
            # Check if file exists and has been modified
            if os.path.exists(JSON_FILE):
                current_modified = os.path.getmtime(JSON_FILE)
                
                # File has been updated
                if current_modified > last_modified:
                    data = read_json_file()
                    
                    if data:
                        # Check if data is different from last sent
                        if data != last_data:
                            print(f"\n📥 New data detected at {datetime.now().strftime('%H:%M:%S')}")
                            if send_sensor_data(data):
                                last_data = data
                                last_modified = current_modified
                            print("-" * 60)
                        else:
                            last_modified = current_modified
            else:
                if last_modified != 0:  # Only print once
                    print(f"⏳ Waiting for {JSON_FILE} to be created...")
                    last_modified = 0
            
            time.sleep(1)  # Check every second
            
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopped by user. Goodbye!")

def main():
    """
    Main function
    """
    # Check if JSON file exists
    if os.path.exists(JSON_FILE):
        print(f"✅ Found {JSON_FILE}")
        data = read_json_file()
        if data:
            print("📊 Sample data from file:")
            print(json.dumps(data, indent=2))
            print("-" * 60)
    else:
        print(f"⚠️  {JSON_FILE} not found yet")
        print(f"💡 Run your ESP32 app to create the file")
        print(f"   The script will automatically detect and send data when available")
        print("-" * 60)
    
    # Start watching
    watch_and_forward()

if __name__ == "__main__":
    main()
