import tensorflow as tf
import numpy as np
import src.models.model  # Import to register the embed function

class FacialAsymmetryPredictor:
    def __init__(self, model_path="models/facial_asymmetry.keras"):
        # Enable loading of Lambda layers - safe because we trust our own model
        self.model = tf.keras.models.load_model(model_path, safe_mode=False)

    def predict(self, left_face, right_face):
        """
        left_face, right_face: numpy arrays (224,224,3)
        returns: float deviation score
        """
        left = np.expand_dims(left_face, axis=0)
        right = np.expand_dims(right_face, axis=0)

        score = self.model.predict([left, right], verbose=0)
        return float(score[0])
