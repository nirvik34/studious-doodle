import cv2
import numpy as np

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def extract_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    if len(faces) == 0:
        return None

    # take largest face
    x, y, w, h = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
    return frame[y:y+h, x:x+w]
