# Model Directory README

This directory contains the machine learning model and related code for detecting facial asymmetry as a potential indicator of depression. The model uses video data to analyze facial expressions and compute asymmetry scores.

## Directory Structure

### data/
Contains all datasets and processed data used for training and testing the model.


- **processed/**: Directory for processed data derived from raw videos.
  - **clips/**: Extracted video clips from raw videos, typically 3-second segments at 10 FPS.
  - **features/**: Extracted features from the video data, such as facial landmarks or embeddings.
  - **landmarks/**: Facial landmark data, possibly coordinates of key facial points detected in frames.
- **raw_videos/**: Original video files used as input.
  - **depvidmood/**: Collection of video speech data from multiple actors (Video_Speech_Actor_01 to Video_Speech_Actor_24), each containing subfolders with actor-specific videos.

### models/
Trained machine learning models.

- **facial_asymmetry.keras**: The main Keras model file for predicting facial asymmetry scores. This model takes left and right face images as input and outputs a deviation score representing asymmetry magnitude.

### scripts/
Python scripts for testing and evaluating the model.

- **save.py**: Script for saving the trained model, likely used after training to export the Keras model file.
- **test_consistency.py**: Tests the model's consistency by evaluating predictions on multiple clips from the same actor to check for stable outputs.
- **test_sensitivity.py**: Evaluates the model's sensitivity to changes in input data, assessing how small variations affect predictions.
- **test_separation.py**: Tests the model's ability to distinguish between different classes or conditions, measuring separation in prediction scores.

### src/
Source code for the model pipeline, feature extraction, and utilities.

- **test_pipeline.py**: Main test script demonstrating the end-to-end pipeline: loading a video clip, extracting and splitting the face, and predicting asymmetry score.
- **features/**: Modules for feature extraction and processing.
  - **face_split.py**: Functions to split a detected face image into left and right halves, resize to 224x224 pixels, and convert color space.
  - **score.py**: Computes the deviation score between left and right face embeddings using L2 normalization and Euclidean distance.
- **models/**: Model definitions and predictor classes.
  - **asymmetry_predictor.py**: Class for loading the Keras model and making predictions on left/right face pairs.
  - **mobilenet.py**: (Not shown in structure, but likely contains MobileNet-related code if present).
  - **model.py**: Defines the facial asymmetry model architecture using MobileNetV2 as a backbone for embedding faces and computing asymmetry via L2 norm difference.
- **utils/**: Utility functions.
  - **inspect_dataset.py**: Tools for inspecting and analyzing the dataset, such as checking data distribution or visualizing samples.
- **video/**: Video processing utilities.
  - **extract_clips.py**: Extracts short video clips (3 seconds at 10 FPS) from longer raw videos for processing.
  - **face_crop.py**: Uses Haar cascade classifier to detect and crop faces from video frames.

## Pipeline Overview

1. **Data Preparation**: Raw videos are processed to extract 3-second clips.
2. **Face Detection**: Faces are detected and cropped from frames using OpenCV's Haar cascades.
3. **Face Splitting**: Each face is split into left and right halves.
4. **Feature Extraction**: Left and right halves are embedded using a pre-trained MobileNetV2 model.
5. **Asymmetry Scoring**: The L2 norm of the difference between embeddings gives the asymmetry score.
6. **Prediction**: The trained model predicts deviation scores, which can be correlated with depression indicators.

## Dependencies

- TensorFlow/Keras for model training and inference
- OpenCV for video processing and face detection
- NumPy for numerical operations
- tqdm for progress bars (in clip extraction)

## Usage

### Installation

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### Running the Pipeline

To run the test pipeline:

```bash
python main.py
```

Or run as a module:

```bash
python -m src.test_pipeline
```

For testing scripts, run them from the model directory:
```bash
python scripts/test_consistency.py
```