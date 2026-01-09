# Stroke Detection Web App - Setup Guide

## Architecture

This application consists of three parts:
1. **Python Flask API** (`model/api.py`) - Runs the facial asymmetry detection model
2. **Node.js Express Server** (`server/`) - Backend API that communicates with the Python model
3. **React Client** (`client/`) - Frontend web application

## Setup Instructions

### 1. Install Python Dependencies

```powershell
cd model
.\env\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Install Node.js Dependencies

From the root directory:
```powershell
npm install
```

## Running the Application

### Option 1: Run All Servers at Once (Recommended)

From the root directory:
```powershell
.\start-all.ps1
```

This will start:
- Python Model API on http://localhost:5000
- Node.js Server on http://localhost:8081
- React Client on http://localhost:5173 (or next available port)

### Option 2: Run Each Server Manually

**Terminal 1 - Python Model:**
```powershell
cd model
.\env\Scripts\Activate.ps1
python api.py
```

**Terminal 2 - Node.js Server:**
```powershell
cd server
npm start
```

**Terminal 3 - React Client:**
```powershell
cd client
npm run dev
```

## API Endpoints

### Python Model API (Port 5000)

- `GET /health` - Check if model API is running
- `POST /predict` - Predict facial asymmetry from image
  - Request body: `{ "image": "base64-encoded-image" }`
  - Response: `{ "score": 0.5, "detected": true }`

### Node.js Server (Port 8081)

- `GET /api/health` - Check server and model connection status
- `POST /api/scan` - Process image and get stroke risk assessment
  - Request body: `{ "image": "base64-encoded-image" }`
  - Response: `{ "asymmetryScore": 0.5, "risk": "low", "riskLevel": 1, "detected": true }`

## How It Works

1. Client sends an image to Node.js server (`/api/scan`)
2. Node.js server forwards the image to Python Flask API (`/predict`)
3. Python API:
   - Extracts face from image using OpenCV
   - Splits face into left and right halves
   - Uses TensorFlow model to calculate asymmetry score
   - Returns score to Node.js server
4. Node.js server calculates risk level based on asymmetry score:
   - Low risk: score < 0.4
   - Medium risk: 0.4 <= score <= 0.7
   - High risk: score > 0.7
5. Response is sent back to the client

## Troubleshooting

- **Python API won't start**: Make sure the virtual environment is activated and all dependencies are installed
- **Node.js server can't connect to Python**: Ensure Python API is running on port 5000
- **Face not detected**: Make sure the image contains a clear, front-facing face
- **Model file not found**: Ensure `models/facial_asymmetry.keras` exists in the model directory
