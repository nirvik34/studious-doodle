import sys
import os

# Ensure src is in the python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.test_pipeline import main

if __name__ == "__main__":
    main()
