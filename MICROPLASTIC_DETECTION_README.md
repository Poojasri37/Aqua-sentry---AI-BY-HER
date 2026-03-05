# Microplastic Detection System

## Overview
This system uses a trained YOLO model to detect and classify microplastic particles in water tank images. It provides:
- Real-time microplastic detection and classification
- Percentage contamination calculation
- 3D Digital Twin visualization with floating particles
- Particle type breakdown (PET, HDPE, PVC, LDPE, PP, PS, etc.)

## Architecture

### Backend (Node.js + Python)
- **Express API**: Handles image uploads and coordinates detection
- **Python YOLO Service**: Runs inference on uploaded images
- **Model**: TorchScript YOLO model (`best.torchscript.zip`)

### Frontend (React + Three.js)
- **Upload Interface**: Drag-and-drop image upload
- **Results Dashboard**: Shows detection percentage and particle breakdown
- **3D Digital Twin**: Interactive visualization of microplastics in rectangular tank

## Setup Instructions

### 1. Backend Setup

#### Install Node.js Dependencies
```bash
cd backend
npm install
```

#### Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### Prepare YOLO Model
1. Ensure your trained YOLO model is saved as `best.torchscript.zip` in the backend root directory
2. If you have a `.pt` file instead, convert it:
```python
import torch
model = torch.load('best.pt')
scripted_model = torch.jit.script(model)
scripted_model.save('best.torchscript.zip')
```

#### Start Backend Server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start Development Server
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

## Usage

### 1. Access the Microplastic Detection Page
Navigate to: `http://localhost:5173/microplastic-detection`

### 2. Upload Tank Image
- Click the upload area or drag and drop an image
- Supported formats: PNG, JPG, JPEG (max 10MB)

### 3. Analyze Image
- Click "Analyze Image" button
- The system will:
  - Upload the image to the backend
  - Run YOLO inference
  - Return detection results

### 4. View Results
- **Contamination Percentage**: Overall microplastic contamination level
- **Particle Count**: Total number of detected particles
- **Type Breakdown**: Count by particle type (PET, HDPE, etc.)
- **3D Visualization**: Interactive digital twin showing particles floating in tank

### 5. Interact with 3D View
- **Rotate**: Left-click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag

## API Endpoints

### POST `/api/microplastic/analyze`
Upload and analyze tank image

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `image`: Image file (required)
  - `tankId`: Tank identifier (optional)
  - `userId`: User identifier (optional)

**Response:**
```json
{
  "success": true,
  "imagePath": "/uploads/microplastics/tank-123456.jpg",
  "detections": {
    "totalParticles": 45,
    "microplasticPercentage": 23.5,
    "particlesByType": {
      "PET": 12,
      "HDPE": 8,
      "PVC": 10,
      "LDPE": 7,
      "PP": 5,
      "PS": 3
    },
    "particles": [
      {
        "id": 0,
        "type": "PET",
        "confidence": 0.92,
        "bbox": {
          "x": 0.45,
          "y": 0.32,
          "width": 0.08,
          "height": 0.06
        },
        "position3D": {
          "x": -0.8,
          "y": 1.5,
          "z": 0.3
        }
      }
      // ... more particles
    ]
  },
  "tankId": "tank-001",
  "userId": "user-001",
  "timestamp": "2026-02-14T14:39:37.000Z",
  "usingMockData": false
}
```

### GET `/api/microplastic/history/:tankId`
Get detection history for a specific tank

**Response:**
```json
{
  "success": true,
  "tankId": "tank-001",
  "history": [
    {
      "id": 1,
      "timestamp": "2026-02-13T14:39:37.000Z",
      "microplasticPercentage": 12.5,
      "particleCount": 45,
      "imagePath": "/uploads/microplastics/sample1.jpg"
    }
  ]
}
```

## YOLO Model Integration

### Model Format
The system expects a TorchScript model file (`best.torchscript.zip`). This format:
- Loads faster than regular PyTorch models
- Works without the original model definition
- Is optimized for inference

### Class Names
Update the class names in `backend/src/services/yolo_inference.py` to match your training:
```python
self.class_names = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other']
```

### Confidence Threshold
Adjust detection sensitivity in the inference script:
```python
def detect(self, image_path, conf_threshold=0.25, iou_threshold=0.45):
```

## 3D Visualization Details

### Tank Dimensions
Default rectangular tank: 4m × 3m × 4m (width × height × depth)

Customize in `MicroplasticDetection.jsx`:
```jsx
<DigitalTwin3D 
  microplasticData={detectionResults}
  tankDimensions={{ width: 4, height: 3, depth: 4 }}
/>
```

### Particle Animation
- Particles float with realistic physics
- Bounce off tank boundaries
- Rotate continuously
- Color-coded by type

### Color Legend
- **PET**: Red (#ff6b6b)
- **HDPE**: Teal (#4ecdc4)
- **PVC**: Yellow (#ffe66d)
- **LDPE**: Green (#95e1d3)
- **PP**: Pink (#f38181)
- **PS**: Purple (#aa96da)
- **Other**: Light Pink (#fcbad3)

## Troubleshooting

### Python Not Found
If you get "python not found" error:
- Windows: Install Python from python.org
- Ensure Python is in PATH
- Try using `python3` instead of `python` in `microplastic.routes.js`

### YOLO Model Not Loading
- Check file path: `backend/best.torchscript.zip`
- Verify model format (should be TorchScript)
- Check Python console for error messages

### Mock Data Fallback
The system automatically falls back to mock data if:
- YOLO model file not found
- Python inference fails
- Model loading errors occur

Check `usingMockData` field in API response to see if real or mock data is being used.

### 3D Visualization Not Showing
- Check browser console for errors
- Ensure Three.js is installed: `npm install three`
- Verify WebGL support in browser

## Hardware Integration

For laser treatment integration:
1. Detection results include particle positions
2. Use `particles[].position3D` coordinates for laser targeting
3. Implement hardware controller to read API responses
4. Map 3D coordinates to physical laser positioning system

## Future Enhancements

- [ ] Real-time video stream analysis
- [ ] Historical trend analysis
- [ ] Automated alerts for high contamination
- [ ] Export detection reports (PDF/CSV)
- [ ] Multi-tank comparison view
- [ ] Integration with water quality sensors
- [ ] Machine learning model retraining pipeline

## License
MIT

## Support
For issues or questions, contact: support@aquasentry.com
