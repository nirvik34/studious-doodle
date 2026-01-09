import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    pooling="avg",
    input_shape=(224, 224, 3)
)

base_model.trainable = False  # MVP decision

def embed(image):
    image = tf.convert_to_tensor(image, dtype=tf.float32)
    img = tf.expand_dims(image, axis=0)
    img = preprocess_input(img)
    return base_model(img)
