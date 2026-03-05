# 🎯 Microplastic Detection System - Visual Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                   (React + Three.js Frontend)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────────┐   │
│  │  Upload Section  │              │   3D Digital Twin    │   │
│  │                  │              │                      │   │
│  │  • Drag & Drop   │              │  ┌────────────────┐ │   │
│  │  • File Preview  │              │  │  Rectangular   │ │   │
│  │  • Analyze Btn   │              │  │  Water Tank    │ │   │
│  └──────────────────┘              │  │                │ │   │
│                                     │  │  🔴 🔵 🟡 🟢  │ │   │
│  ┌──────────────────┐              │  │  Floating      │ │   │
│  │ Results Display  │              │  │  Particles     │ │   │
│  │                  │              │  └────────────────┘ │   │
│  │  📊 23.5%        │              │                      │   │
│  │  Contamination   │              │  Interactive:        │   │
│  │                  │              │  • Rotate • Zoom     │   │
│  │  45 Particles    │              │  • Pan              │   │
│  │                  │              └──────────────────────┘   │
│  │  Type Breakdown: │                                          │
│  │  • PET: 12       │                                          │
│  │  • HDPE: 8       │                                          │
│  │  • PVC: 10       │                                          │
│  └──────────────────┘                                          │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTP Request/Response
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API SERVER                         │
│                        (Express.js)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/microplastic/analyze                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. Receive uploaded image                                │ │
│  │ 2. Save to uploads/microplastics/                        │ │
│  │ 3. Spawn Python process                                  │ │
│  │ 4. Call YOLO inference script                            │ │
│  │ 5. Parse results                                         │ │
│  │ 6. Return JSON response                                  │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  GET /api/microplastic/history/:tankId                         │
│  └─ Returns detection history for tank                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ Python subprocess
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   YOLO INFERENCE SERVICE                        │
│                         (Python)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  yolo_inference.py                                             │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 1. Load TorchScript model (best.torchscript.zip)        │ │
│  │ 2. Preprocess image (resize, normalize)                 │ │
│  │ 3. Run inference                                        │ │
│  │ 4. Post-process predictions (NMS, filtering)            │ │
│  │ 5. Generate 3D positions for particles                  │ │
│  │ 6. Output JSON to stdout                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Output Format:                                                │
│  {                                                              │
│    "totalParticles": 45,                                       │
│    "microplasticPercentage": 23.5,                             │
│    "particlesByType": { "PET": 12, "HDPE": 8, ... },          │
│    "particles": [                                              │
│      {                                                         │
│        "type": "PET",                                          │
│        "confidence": 0.92,                                     │
│        "bbox": { x, y, width, height },                        │
│        "position3D": { x, y, z }                               │
│      },                                                        │
│      ...                                                       │
│    ]                                                           │
│  }                                                             │
└─────────────────────────────────────────────────────────────────┘
```

## 3D Digital Twin Visualization

```
                    Top View of Tank
        ┌─────────────────────────────────┐
        │                                 │
        │    🔴 PET    🔵 HDPE           │
        │                                 │
        │         🟡 PVC                 │
        │                                 │
        │    🟢 LDPE        🟣 PP        │
        │                                 │
        │              🟣 PS             │
        └─────────────────────────────────┘
                 4m × 4m (width × depth)

                   Side View of Tank
        ┌─────────────────────────────────┐ ← 3m (height)
        │  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  │
        │    🔴      🔵         🟡       │
        │  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  │
        │         🟢    🟣    🟣         │
        │  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  │
        └─────────────────────────────────┘
                    4m (width)

Features:
• Rectangular tank (not curved) ✅
• Transparent blue water
• Floating particles with physics
• Bounce off walls
• Continuous rotation
• Color-coded by type
```

## Particle Color Legend

```
┌──────────┬──────────┬──────────────────────────────────┐
│   Type   │  Color   │         Description              │
├──────────┼──────────┼──────────────────────────────────┤
│   PET    │   🔴     │ Polyethylene Terephthalate       │
│   HDPE   │   🔵     │ High-Density Polyethylene        │
│   PVC    │   🟡     │ Polyvinyl Chloride               │
│   LDPE   │   🟢     │ Low-Density Polyethylene         │
│   PP     │   🟣     │ Polypropylene                    │
│   PS     │   🟣     │ Polystyrene                      │
│   Other  │   ⚪     │ Unclassified                     │
└──────────┴──────────┴──────────────────────────────────┘
```

## Contamination Status Indicators

```
┌────────────┬──────────┬───────────┬──────────────────┐
│ Percentage │  Status  │   Color   │   Indicator      │
├────────────┼──────────┼───────────┼──────────────────┤
│   0-10%    │ Excellent│   Green   │   ████████░░     │
│  10-25%    │   Good   │   Blue    │   ██████████░░   │
│  25-50%    │ Moderate │  Yellow   │   ████████████░░ │
│  50-75%    │   Poor   │  Orange   │   ██████████████ │
│  75-100%   │ Critical │    Red    │   ████████████████│
└────────────┴──────────┴───────────┴──────────────────┘
```

## Data Flow Timeline

```
Time: 0s
┌─────────────────────┐
│ User uploads image  │
└──────────┬──────────┘
           │
Time: 0.1s │
           ▼
┌─────────────────────┐
│ Image sent to API   │
└──────────┬──────────┘
           │
Time: 0.2s │
           ▼
┌─────────────────────┐
│ Saved to disk       │
└──────────┬──────────┘
           │
Time: 0.3s │
           ▼
┌─────────────────────┐
│ Python process      │
│ spawned             │
└──────────┬──────────┘
           │
Time: 0.5s │
           ▼
┌─────────────────────┐
│ YOLO model loaded   │
└──────────┬──────────┘
           │
Time: 1.0s │
           ▼
┌─────────────────────┐
│ Image preprocessed  │
└──────────┬──────────┘
           │
Time: 1.5s │
           ▼
┌─────────────────────┐
│ Inference running   │
│ (GPU/CPU)           │
└──────────┬──────────┘
           │
Time: 2.0s │
           ▼
┌─────────────────────┐
│ Results processed   │
└──────────┬──────────┘
           │
Time: 2.2s │
           ▼
┌─────────────────────┐
│ JSON returned       │
└──────────┬──────────┘
           │
Time: 2.3s │
           ▼
┌─────────────────────┐
│ Frontend displays:  │
│ • Percentage        │
│ • Particle count    │
│ • Type breakdown    │
│ • 3D visualization  │
└─────────────────────┘

Total Time: ~2-3 seconds
```

## File Structure

```
AI BY HER/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── microplastic.routes.js  ← API endpoints
│   │   ├── services/
│   │   │   └── yolo_inference.py       ← YOLO service
│   │   └── server.js                   ← Main server
│   ├── uploads/
│   │   └── microplastics/              ← Uploaded images
│   ├── requirements.txt                ← Python deps
│   └── best.torchscript.zip            ← YOLO model
│
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── MicroplasticDetection.jsx  ← Main page
│       ├── components/
│       │   └── DigitalTwin3D.jsx          ← 3D viz
│       └── App.jsx                        ← Router
│
├── Documentation/
│   ├── START_HERE.md                   ← Start here!
│   ├── MICROPLASTIC_QUICKSTART.md      ← Quick guide
│   ├── MICROPLASTIC_DETECTION_README.md ← Full docs
│   └── MICROPLASTIC_IMPLEMENTATION_SUMMARY.md
│
└── Utilities/
    ├── verify_system.py                ← Check setup
    ├── prepare_model.py                ← Prepare YOLO
    └── generate_sample_images.py       ← Test images
```

## API Request/Response Example

```
┌─────────────────────────────────────────────────────────────┐
│                         REQUEST                             │
├─────────────────────────────────────────────────────────────┤
│ POST /api/microplastic/analyze                             │
│ Content-Type: multipart/form-data                          │
│                                                             │
│ Body:                                                       │
│   - image: [binary file data]                              │
│   - tankId: "tank-001"                                     │
│   - userId: "user-001"                                     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        RESPONSE                             │
├─────────────────────────────────────────────────────────────┤
│ Status: 200 OK                                             │
│ Content-Type: application/json                             │
│                                                             │
│ {                                                           │
│   "success": true,                                         │
│   "imagePath": "/uploads/microplastics/tank-123.jpg",     │
│   "detections": {                                          │
│     "totalParticles": 45,                                  │
│     "microplasticPercentage": 23.5,                        │
│     "particlesByType": {                                   │
│       "PET": 12,                                           │
│       "HDPE": 8,                                           │
│       "PVC": 10,                                           │
│       "LDPE": 7,                                           │
│       "PP": 5,                                             │
│       "PS": 3                                              │
│     },                                                     │
│     "particles": [                                         │
│       {                                                    │
│         "id": 0,                                           │
│         "type": "PET",                                     │
│         "confidence": 0.92,                                │
│         "bbox": {                                          │
│           "x": 0.45,                                       │
│           "y": 0.32,                                       │
│           "width": 0.08,                                   │
│           "height": 0.06                                   │
│         },                                                 │
│         "position3D": {                                    │
│           "x": -0.8,                                       │
│           "y": 1.5,                                        │
│           "z": 0.3                                         │
│         }                                                  │
│       },                                                   │
│       ...                                                  │
│     ]                                                      │
│   },                                                       │
│   "tankId": "tank-001",                                    │
│   "userId": "user-001",                                    │
│   "timestamp": "2026-02-14T14:39:37.000Z",                │
│   "usingMockData": false                                   │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Hardware Integration Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Detection Results                          │
│                                                             │
│  particles: [                                               │
│    { position3D: { x: -0.8, y: 1.5, z: 0.3 } },           │
│    { position3D: { x: 0.5, y: 2.1, z: -0.4 } },           │
│    ...                                                      │
│  ]                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Hardware Controller                            │
│                                                             │
│  For each particle:                                         │
│    1. Read position3D coordinates                          │
│    2. Map to physical laser system                         │
│    3. Position laser at (x, y, z)                          │
│    4. Apply treatment                                      │
│    5. Move to next particle                                │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 Laser Treatment                             │
│                                                             │
│  Particle 1: (-0.8, 1.5, 0.3)  → Treated ✓                │
│  Particle 2: (0.5, 2.1, -0.4)  → Treated ✓                │
│  Particle 3: (-1.2, 0.8, 0.9)  → Treated ✓                │
│  ...                                                        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Command Reference

```bash
# Verify system setup
python verify_system.py

# Generate test images
python generate_sample_images.py

# Prepare YOLO model
python prepare_model.py

# Start backend (Terminal 1)
cd backend
npm run dev

# Start frontend (Terminal 2)
cd frontend
npm run dev

# Access application
http://localhost:5173/microplastic-detection
```

---

**System Status**: ✅ Ready to Use  
**Last Updated**: February 14, 2026  
**Version**: 1.0.0
