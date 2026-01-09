from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
import cv2
import numpy as np
import base64
import tensorflow as tf

# Get the directory of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Add src to path
sys.path.insert(0, os.path.join(BASE_DIR, 'src'))

# Import modules
from video.face_crop import extract_face
from features.face_split import split_face

app = Flask(__name__)
CORS(app)

# Load model at startup
print("Loading TensorFlow model...")
model = None

try:
    # Import model building function
    from models.model import build_facial_asymmetry_model, embed
    
    # Try to load the saved model
    model_path = os.path.join(BASE_DIR, "models", "facial_asymmetry.h5")
    
    if os.path.exists(model_path):
        try:
            model = tf.keras.models.load_model(
                model_path,
                custom_objects={'embed': embed},
                compile=False
            )
            print(f"Model loaded successfully from {model_path}")
        except Exception as e:
            print(f"Could not load model from file: {e}")
            print("Building model from scratch (weights not loaded)...")
            model = build_facial_asymmetry_model()
    else:
        print("Model file not found, building from scratch...")
        model = build_facial_asymmetry_model()
        
except Exception as e:
    print(f"Error loading model: {e}")
    import traceback
    traceback.print_exc()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'ok': True,
        'model_loaded': model is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_str = data['image']
        if ',' in image_str:
            image_str = image_str.split(',')[1]
        
        image_data = base64.b64decode(image_str)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if frame is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        # Extract face
        face = extract_face(frame)
        if face is None:
            return jsonify({'error': 'No face detected in image'}), 400
        
        # Split face
        left, right = split_face(face)
        
        # Predict
        left_input = np.expand_dims(left, axis=0)
        right_input = np.expand_dims(right, axis=0)
        
        score = model.predict([left_input, right_input], verbose=0)
        asymmetry_score = float(score[0])
        
        return jsonify({
            'score': asymmetry_score,
            'detected': True
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"\nStarting Flask server on port {port}...")
    print(f"Base directory: {BASE_DIR}")
    app.run(host='0.0.0.0', port=port, debug=True)
