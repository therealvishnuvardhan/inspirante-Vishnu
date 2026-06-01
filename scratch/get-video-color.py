import cv2
import numpy as np

# Read the video file
cap = cv2.VideoCapture('14684159_3840_2160_30fps.mp4')
ret, frame = cap.read()
if ret:
    # Resize to speed up
    small_frame = cv2.resize(frame, (100, 100))
    # Calculate average color
    avg_color = small_frame.mean(axis=(0, 1))
    # BGR format to RGB
    avg_color_rgb = [int(avg_color[2]), int(avg_color[1]), int(avg_color[0])]
    print("AVERAGE_COLOR_RGB:", avg_color_rgb)
    
    # Let's get dominant colors using simple clustering or min/max
    pixels = small_frame.reshape(-1, 3)
    # Get 3 most common colors roughly
    unique, counts = np.unique(pixels, axis=0, return_counts=True)
    sorted_indices = np.argsort(-counts)
    dominant_colors = []
    for idx in sorted_indices[:5]:
        color = unique[idx]
        dominant_colors.append([int(color[2]), int(color[1]), int(color[0])])
    print("DOMINANT_COLORS_RGB:", dominant_colors)
else:
    print("Could not read frame")
cap.release()
