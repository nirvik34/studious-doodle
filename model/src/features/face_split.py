import cv2

def split_face(face_img, size=224):
    h, w, _ = face_img.shape
    mid = w // 2

    left = face_img[:, :mid]
    right = face_img[:, mid:]

    left = cv2.cvtColor(left, cv2.COLOR_BGR2RGB)
    right = cv2.cvtColor(right, cv2.COLOR_BGR2RGB)

    left = cv2.resize(left, (size, size))
    right = cv2.resize(right, (size, size))

    return left, right
