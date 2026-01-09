import os
import cv2
import numpy as np
import tensorflow as tf

print("=== test_sensitivity.py STARTED ===")


# --------------------------------
# Custom layer (MUST match save.py)
# --------------------------------
@tf.keras.utils.register_keras_serializable()
class AbsDiffLayer(tf.keras.layers.Layer):
    def call(self, inputs):
        left, right = inputs
        return tf.abs(left - right)

    def get_config(self):
        return super().get_config()


# --------------------------------
# Facial Asymmetry Predictor
# --------------------------------
class FacialAsymmetryPredictor:
    def __init__(self, model_path=None):
        if model_path is None:
            model_path = "models/facial_asymmetry.h5"

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at: {model_path}")

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
# SENSITIVITY TEST
# --------------------------------
def test_sensitivity():
    predictor = FacialAsymmetryPredictor()

    # base face
    base_face = np.ones((224, 224, 3), dtype=np.uint8) * 128

    # slightly modified face
    modified_face = base_face.copy()
    modified_face[100:120, 100:120] += 10  # small perturbation

    score_base = predictor.predict(base_face, base_face)
    score_modified = predictor.predict(base_face, modified_face)

    print("Base score     :", score_base)
    print("Modified score :", score_modified)

    delta = abs(score_base - score_modified)
    print("Score delta    :", delta)

    assert delta > 0, "❌ Sensitivity test FAILED (model not reacting)"
    print("✅ Sensitivity test PASSED")


if __name__ == "__main__":
    test_sensitivity()
