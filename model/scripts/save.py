import tensorflow as tf
from tensorflow.keras import layers, models

# -------- Custom Layer --------
@tf.keras.utils.register_keras_serializable()
class AbsDiffLayer(layers.Layer):
    def call(self, inputs):
        x1, x2 = inputs
        return tf.abs(x1 - x2)

    def get_config(self):
        return super().get_config()


# -------- Model Builder --------
def build_facial_asymmetry_model(input_shape=(224, 224, 3)):
    left_input = layers.Input(shape=input_shape, name="left_face")
    right_input = layers.Input(shape=input_shape, name="right_face")

    base = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights="imagenet"
    )

    left_feat = base(left_input)
    right_feat = base(right_input)

    diff = AbsDiffLayer()([left_feat, right_feat])
    x = layers.GlobalAveragePooling2D()(diff)
    output = layers.Dense(1, activation="sigmoid")(x)

    model = models.Model(
        inputs=[left_input, right_input],
        outputs=output,
        name="facial_asymmetry_model"
    )

    return model


# -------- SAVE MODEL (THIS PART CREATES THE FILE) --------
if __name__ == "__main__":
    model = build_facial_asymmetry_model()
    model.save("models/facial_asymmetry.h5")
    print("✅ Model saved to models/facial_asymmetry.h5")
