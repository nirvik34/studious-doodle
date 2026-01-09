from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import cv2
import numpy as np
import base64
import tensorflow as tf

# Add model paths
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'model')
SRC_DIR = os.path.join(MODEL_DIR, 'src')
sys.path.insert(0, SRC_DIR)

# Import model components directly
from features.face_split import split_face
from video.face_crop import extract_face
from models.model import embed
import models.model  # Import to register the embed function

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://localhost:3000"]}})

# Load the model once when server starts
MODEL_PATH = os.path.join(MODEL_DIR, 'models', 'facial_asymmetry.keras')
print(f"Loading model from: {MODEL_PATH}")

try:
    custom_objects = {'embed': embed}
    model = tf.keras.models.load_model(MODEL_PATH, custom_objects=custom_objects, safe_mode=False)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    import traceback
    traceback.print_exc()
    model = None

def predict_asymmetry(left_face, right_face):
    """Predict facial asymmetry score"""
    if model is None:
        raise Exception("Model not loaded")
    
    left = np.expand_dims(left_face, axis=0)
    right = np.expand_dims(right_face, axis=0)
    
    score = model.predict([left, right], verbose=0)
    return float(score[0])

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'ok': True,
        'modelLoaded': model is not None
    })

@app.route('/api/scan', methods=['POST'])
def scan():
    """Process image and return stroke risk assessment"""
    try:
        data = request.get_json()
        
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = data['image']
        if ',' in image_data:
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        # Extract face
        face = extract_face(frame)
        if face is None:
            return jsonify({'error': 'No face detected in image'}), 400
        
        # Split face into left and right
        left, right = split_face(face)
        
        # Get asymmetry score
        asymmetry_score = predict_asymmetry(left, right)
        
        # Calculate risk level
        if asymmetry_score > 0.7:
            risk = 'high'
            risk_level = 3
        elif asymmetry_score > 0.4:
            risk = 'medium'
            risk_level = 2
        else:
            risk = 'low'
            risk_level = 1
        
        return jsonify({
            'asymmetryScore': asymmetry_score,
            'risk': risk,
            'riskLevel': risk_level,
            'detected': True,
            'ts': None
        })
        
    except Exception as e:
        print(f"Error processing scan: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/profile', methods=['POST'])
def save_profile():
    """Save user profile (stub for now)"""
    return jsonify({'ok': True})

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get scan history (stub for now)"""
    return jsonify({'scans': []})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8081))
    print(f"Starting Flask server on http://localhost:{port}")
    print(f"Model status: {'Loaded' if model else 'Failed to load'}")
    app.run(host='0.0.0.0', port=port, debug=True)
