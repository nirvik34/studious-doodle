from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import cv2
import numpy as np
import base64

# Get the directory of this script
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure src is in the python path
sys.path.insert(0, os.path.join(MODEL_DIR, 'src'))
sys.path.insert(0, MODEL_DIR)

# Import model registration first
import src.models.model  # This registers the embed function

from src.video.face_crop import extract_face
from src.features.face_split import split_face
from src.models.asymmetry_predictor import FacialAsymmetryPredictor

app = Flask(__name__)
CORS(app)

# Load the model once when the server starts with absolute path
model_path = os.path.join(MODEL_DIR, "models", "facial_asymmetry.h5")
predictor = FacialAsymmetryPredictor(model_path=model_path)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'ok': True})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Expect base64 encoded image
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(data['image'].split(',')[1] if ',' in data['image'] else data['image'])
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        # Extract face from the image
        face = extract_face(frame)
        if face is None:
            return jsonify({'error': 'No face detected in image'}), 400
        
        # Split face into left and right
        left, right = split_face(face)
        
        # Get asymmetry score
        score = predictor.predict(left, right)
        
        return jsonify({
            'score': float(score),
            'detected': True
        })
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
