import numpy as np
import tensorflow as tf
import cv2
import os


# --------------------------------
# Custom layer (must match save.py)
# --------------------------------
@tf.keras.utils.register_keras_serializable()
class AbsDiffLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        left, right = inputs
        return tf.abs(left - right)

    def get_config(self):
        return super().get_config()


# --------------------------------
# Predictor (DEFINED HERE, NO IMPORT)
# --------------------------------
class FacialAsymmetryPredictor:
    def __init__(self, model_path="models/facial_asymmetry.h5"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={"AbsDiffLayer": AbsDiffLayer}
        )

        print("✅ Asymmetry model loaded successfully")

    def preprocess(self, img):
        img = cv2.resize(img, (224, 224))
        img = img.astype(np.float32) / 255.0
        return np.expand_dims(img, axis=0)

    def predict(self, left_face, right_face):
        left = self.preprocess(left_face)
        right = self.preprocess(right_face)
        score = self.model.predict([left, right], verbose=0)
        return float(score[0][0])


# --------------------------------
# CONSISTENCY TEST
# --------------------------------
def test_consistency():
    predictor = FacialAsymmetryPredictor()

    dummy_face = np.ones((224, 224, 3), dtype=np.uint8) * 128

    score1 = predictor.predict(dummy_face, dummy_face)
    score2 = predictor.predict(dummy_face, dummy_face)

    print("Score 1:", score1)
    print("Score 2:", score2)

    diff = abs(score1 - score2)
    print("Difference:", diff)

    assert diff < 1e-5, "❌ Consistency test FAILED"
    print("✅ Consistency test PASSED")


if __name__ == "__main__":
    test_consistency()
