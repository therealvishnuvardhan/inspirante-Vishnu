import sys
try:
    import cv2
    print("cv2 is available")
except ImportError:
    print("cv2 is NOT available")

try:
    from PIL import Image
    print("PIL is available")
except ImportError:
    print("PIL is NOT available")
