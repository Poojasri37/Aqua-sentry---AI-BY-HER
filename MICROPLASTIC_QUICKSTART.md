# Microplastic Detection - Quick Start Guide

## 🎯 What You Need

1. **Trained YOLO Model**: Your `best.torchscript.zip` file (already in project root ✅)
2. **Python Environment**: Python 3.8+ with PyTorch
3. **Node.js Backend**: Already configured
4. **React Frontend**: Already configured

## 🚀 Quick Setup (5 Minutes)

### Step 1: Prepare the YOLO Model
```bash
# Run the model preparation script
python prepare_model.py
```

This will:
- Extract your TorchScript model
- Place it in the correct location for the backend
- Verify the model is ready to use

### Step 2: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Start the Backend
```bash
# In the backend directory
npm run dev
```

Backend will start on `http://localhost:5000`

### Step 4: Start the Frontend
```bash
# In a new terminal, from the frontend directory
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

## 🎨 Using the Microplastic Detection System

### 1. Navigate to the Detection Page
Open your browser and go to:
```
http://localhost:5173/microplastic-detection
```

### 2. Upload a Tank Image
- Click the upload area or drag and drop
- Select an image of your water tank
- Supported formats: PNG, JPG, JPEG

### 3. Analyze the Image
- Click the **"Analyze Image"** button
- Wait a few seconds for YOLO processing
- Results will appear automatically

### 4. View the Results

You'll see:
- **Contamination Percentage**: e.g., "23.5%"
- **Total Particle Count**: e.g., "45 particles"
- **Particle Breakdown by Type**:
  - PET: 12
  - HDPE: 8
  - PVC: 10
  - etc.

### 5. Explore the 3D Digital Twin

The right panel shows a 3D visualization:
- **Rectangular tank** with water
- **Floating microplastics** (color-coded by type)
- **Interactive controls**:
  - Left-click + drag = Rotate
  - Scroll = Zoom
  - Right-click + drag = Pan

## 🎨 Particle Color Legend

- 🔴 **PET** (Red)
- 🔵 **HDPE** (Teal)
- 🟡 **PVC** (Yellow)
- 🟢 **LDPE** (Green)
- 🟣 **PP** (Pink)
- 🟣 **PS** (Purple)
- ⚪ **Other** (Gray)

## 🔧 How It Works

### Backend Flow:
1. Image uploaded via API endpoint
2. Saved to `backend/uploads/microplastics/`
3. Python YOLO script called with image path
4. Model runs inference
5. Results returned as JSON

### Frontend Flow:
1. User uploads image
2. API call to `/api/microplastic/analyze`
3. Results displayed in dashboard
4. 3D particles generated from detection data
5. Particles animated in Three.js scene

## 📊 Understanding the Results

### Microplastic Percentage
- **0-10%**: Excellent (Green)
- **10-25%**: Good (Blue)
- **25-50%**: Moderate (Yellow)
- **50-75%**: Poor (Orange)
- **75-100%**: Critical (Red)

### Particle Types
Based on your YOLO training data:
- **PET**: Polyethylene Terephthalate
- **HDPE**: High-Density Polyethylene
- **PVC**: Polyvinyl Chloride
- **LDPE**: Low-Density Polyethylene
- **PP**: Polypropylene
- **PS**: Polystyrene

## 🐛 Troubleshooting

### "Using Mock Data" Warning
If you see this, it means:
- YOLO model not found, OR
- Python inference failed

**Fix:**
1. Check `backend/best.torchscript.zip` exists
2. Verify Python dependencies installed
3. Check backend console for errors

### 3D View Not Loading
**Fix:**
1. Check browser console (F12)
2. Ensure Three.js installed: `npm install three`
3. Try refreshing the page

### Python Not Found
**Fix:**
1. Install Python from python.org
2. Add Python to PATH
3. Restart terminal/IDE

### Model Loading Errors
**Fix:**
1. Verify model format (should be TorchScript)
2. Check Python version (3.8+)
3. Ensure PyTorch installed: `pip install torch`

## 🔗 API Testing

Test the API directly with curl:

```bash
curl -X POST http://localhost:5000/api/microplastic/analyze \
  -F "image=@/path/to/tank-image.jpg" \
  -F "tankId=tank-001" \
  -F "userId=user-001"
```

## 🎯 Next Steps

### For Hardware Integration:
1. Read particle positions from API response
2. Use `particles[].position3D` for laser targeting
3. Map 3D coordinates to physical system

### For Production:
1. Add authentication to API endpoints
2. Store detection history in database
3. Set up automated alerts
4. Export reports (PDF/CSV)

## 📝 Customization

### Change Tank Dimensions
Edit `frontend/src/pages/MicroplasticDetection.jsx`:
```jsx
<DigitalTwin3D 
  microplasticData={detectionResults}
  tankDimensions={{ width: 5, height: 4, depth: 5 }}
/>
```

### Adjust Detection Sensitivity
Edit `backend/src/services/yolo_inference.py`:
```python
def detect(self, image_path, conf_threshold=0.25):
    # Lower = more sensitive (more detections)
    # Higher = less sensitive (fewer detections)
```

### Update Particle Colors
Edit `frontend/src/components/DigitalTwin3D.jsx`:
```javascript
const colors = {
  'PET': 0xff6b6b,  // Change these hex values
  'HDPE': 0x4ecdc4,
  // ...
};
```

## 📞 Support

If you encounter issues:
1. Check the main README: `MICROPLASTIC_DETECTION_README.md`
2. Review backend logs in terminal
3. Check browser console (F12)
4. Verify all dependencies installed

## ✅ Success Checklist

- [ ] YOLO model extracted to backend directory
- [ ] Python dependencies installed
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 5173)
- [ ] Can access `/microplastic-detection` page
- [ ] Can upload images
- [ ] Can see detection results
- [ ] 3D visualization working

---

**You're all set! 🎉**

Upload a tank image and watch the microplastics appear in the 3D digital twin!
