import os
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import warnings
warnings.filterwarnings('ignore', category=FutureWarning)

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.utils import register_keras_serializable


@register_keras_serializable()
def embed(x):
    """
    Example embedding function.
    Replace this logic if your project has a specific implementation.
    """
    return x


def build_model(input_shape=(224, 224, 3)):
    inputs = keras.Input(shape=input_shape)

    x = layers.Conv2D(32, 3, activation="relu")(inputs)
    x = layers.MaxPooling2D()(x)

    x = layers.Conv2D(64, 3, activation="relu")(x)
    x = layers.MaxPooling2D()(x)

    x = layers.Flatten()(x)
    x = layers.Dense(128, activation="relu")(x)

    outputs = layers.Dense(1, activation="sigmoid")(x)

    model = keras.Model(inputs, outputs)
    return model


if __name__ == "__main__":
    model = build_model()
    model.summary()
    print("✅ Model built successfully")
