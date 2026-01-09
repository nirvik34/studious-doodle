import tensorflow as tf
import numpy as np
import src.models.model  # Import to register the embed function

class FacialAsymmetryPredictor:
    def __init__(self, model_path="models/facial_asymmetry.keras"):
        # Load with custom objects to handle compatibility
        custom_objects = {'embed': src.models.model.embed}
        
        try:
            # Try loading as keras format first
            self.model = tf.keras.models.load_model(
                model_path, 
                custom_objects=custom_objects,
                safe_mode=False
            )
        except Exception as e:
            print(f"Error loading model: {e}")
            # If loading fails, rebuild the model
            print("Attempting to rebuild model from scratch...")
            from src.models.model import build_facial_asymmetry_model
            self.model = build_facial_asymmetry_model()
            # Note: weights won't be loaded in this case

    def predict(self, left_face, right_face):
        """
        left_face, right_face: numpy arrays (224,224,3)
        returns: float deviation score
        """
        left = np.expand_dims(left_face, axis=0)
        right = np.expand_dims(right_face, axis=0)

        score = self.model.predict([left, right], verbose=0)
        return float(score[0])
