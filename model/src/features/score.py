import tensorflow as tf

def deviation_score(emb_left, emb_right):
    # Normalize
    emb_left = tf.math.l2_normalize(emb_left, axis=1)
    emb_right = tf.math.l2_normalize(emb_right, axis=1)

    # Distance
    dist = tf.norm(emb_left - emb_right, axis=1)

    # Return scalar float
    return float(dist.numpy()[0])
