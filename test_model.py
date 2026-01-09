"""
Test script to verify the model API is working correctly
"""
import requests
import base64
import json

# Test the health endpoint
print("Testing model health endpoint...")
try:
    response = requests.get("http://localhost:5000/health", timeout=5)
    print(f"Health check: {response.json()}")
except Exception as e:
    print(f"❌ Health check failed: {e}")
    print("Make sure the model server is running: python model/api.py")
    exit(1)

# Create a simple test image (you can replace this with a real face image)
print("\nTo test with a real image:")
print("1. Take a photo of your face")
print("2. Convert it to base64")
print("3. Or use the scan page in the web app")

print("\n✅ Model server is running!")
print("Now test the web app:")
print("1. Go to http://localhost:3000/scan")
print("2. Enable camera and scan a face")
print("3. Check the results page")
print("\nThe model returns:")
print("- 'score': A single asymmetry value (0.0 to 1.0)")
print("- 'detected': Whether a face was found")
print("\nNote: Your model does NOT provide individual feature scores.")
print("The detailed breakdowns (chin, eyes, etc.) are calculated estimates.")
