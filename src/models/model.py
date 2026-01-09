import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.layers import Input, Lambda
from tensorflow.keras.models import Model
import keras

# Global backbone for embedding
backbone = MobileNetV2(
    weights="imagenet",
    include_top=False,
    pooling="avg",
    input_shape=(224, 224, 3)
)
backbone.trainable = False

@keras.saving.register_keras_serializable()
def embed(x):
    x = tf.cast(x, tf.float32)
    x = preprocess_input(x)
    x = backbone(x)
    x = tf.math.l2_normalize(x, axis=1)
    return x

def build_facial_asymmetry_model():
    """
    Outputs a single deviation score representing
    left-right facial asymmetry magnitude.
    """

    # Inputs
    left_face = Input(shape=(224, 224, 3), name="left_face")
    right_face = Input(shape=(224, 224, 3), name="right_face")

    # Embeddings
    emb_left = Lambda(embed, output_shape=(1280,), name="left_embedding")(left_face)
    emb_right = Lambda(embed, output_shape=(1280,), name="right_embedding")(right_face)

    # Deviation score
    deviation = Lambda(
        lambda tensors: tf.norm(tensors[0] - tensors[1], axis=1),
        output_shape=(1,),
        name="deviation_score"
    )([emb_left, emb_right])

    return Model(
        inputs=[left_face, right_face],
        outputs=deviation,
        name="facial_asymmetry_model"
    )
