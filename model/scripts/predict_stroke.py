import os
import cv2
import numpy as np
import tensorflow as tf

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


@tf.keras.utils.register_keras_serializable()
def embed(x):
    """
    Example embedding function.
    Replace this logic if your project has a specific implementation.
    """
    return x


# --------------------------------
# Facial Asymmetry Predictor
# --------------------------------
class FacialAsymmetryPredictor:
    def __init__(self, model_path="models/facial_asymmetry.h5"):
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.model = tf.keras.models.load_model(
            model_path,
            custom_objects={"AbsDiffLayer": AbsDiffLayer, "embed": embed}
        )

        print("Asymmetry model loaded successfully")

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
# Main Prediction Loop
# --------------------------------
def main():
    # Load the predictor
    predictor = FacialAsymmetryPredictor()

    # Load face detection cascade
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )

    # Start video capture
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera")
        return

    print("Camera opened. Press 'q' to quit.")

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture frame")
            break

        # Convert to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=4)

        for (x, y, w, h) in faces:
            # Extract face
            face = frame[y:y+h, x:x+w]

            # Split face into left and right halves
            mid = w // 2
            left_face = face[:, :mid]
            right_face = face[:, mid:]

            # Predict asymmetry score
            score = predictor.predict(left_face, right_face)
            percentage = score * 100

            # Print to console
            print(f"Asymmetry Score: {percentage:.2f}%")

            # Draw rectangle around face
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

            # Display percentage on frame
            cv2.putText(
                frame,
                f"Asymmetry: {percentage:.2f}%",
                (x, y-10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (255, 0, 0),
                2
            )

        # Show the frame
        cv2.imshow('Facial Asymmetry Detection', frame)

        # Break on 'q' key
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release resources
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()


