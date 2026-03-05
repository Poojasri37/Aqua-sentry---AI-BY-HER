"""
Generate sample tank images with simulated microplastics for testing
"""

import cv2
import numpy as np
import random
import os

def create_sample_tank_image(width=800, height=600, num_particles=50, output_path='sample_tank.jpg'):
    """
    Create a sample tank image with simulated microplastic particles
    
    Args:
        width: Image width in pixels
        height: Image height in pixels
        num_particles: Number of microplastic particles to generate
        output_path: Path to save the generated image
    """
    
    # Create base image (water background)
    img = np.ones((height, width, 3), dtype=np.uint8)
    
    # Create water-like gradient background
    for y in range(height):
        # Blue gradient from light to dark
        blue_value = int(200 - (y / height) * 80)  # 200 to 120
        green_value = int(180 - (y / height) * 60)  # 180 to 120
        img[y, :] = [blue_value, green_value, 255]
    
    # Add some noise for texture
    noise = np.random.randint(-20, 20, (height, width, 3), dtype=np.int16)
    img = np.clip(img.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    # Particle types and colors
    particle_types = {
        'PET': (60, 60, 200),      # Red-ish
        'HDPE': (180, 200, 100),   # Teal-ish
        'PVC': (80, 200, 200),     # Yellow-ish
        'LDPE': (100, 180, 100),   # Green-ish
        'PP': (140, 100, 200),     # Pink-ish
        'PS': (200, 120, 180),     # Purple-ish
    }
    
    particles_info = []
    
    # Generate random particles
    for i in range(num_particles):
        # Random position
        x = random.randint(50, width - 50)
        y = random.randint(50, height - 50)
        
        # Random size
        size = random.randint(5, 20)
        
        # Random type
        particle_type = random.choice(list(particle_types.keys()))
        color = particle_types[particle_type]
        
        # Random shape
        shape = random.choice(['circle', 'rectangle', 'ellipse'])
        
        if shape == 'circle':
            cv2.circle(img, (x, y), size, color, -1)
            # Add highlight
            cv2.circle(img, (x - size//3, y - size//3), size//3, 
                      tuple(min(c + 50, 255) for c in color), -1)
        
        elif shape == 'rectangle':
            angle = random.randint(0, 180)
            rect = ((x, y), (size * 2, size), angle)
            box = cv2.boxPoints(rect)
            box = np.int0(box)
            cv2.drawContours(img, [box], 0, color, -1)
        
        else:  # ellipse
            angle = random.randint(0, 180)
            axes = (size * 2, size)
            cv2.ellipse(img, (x, y), axes, angle, 0, 360, color, -1)
        
        # Add slight shadow/depth
        shadow_offset = 2
        if shape == 'circle':
            cv2.circle(img, (x + shadow_offset, y + shadow_offset), size, 
                      tuple(max(c - 30, 0) for c in color), 1)
        
        particles_info.append({
            'type': particle_type,
            'position': (x, y),
            'size': size,
            'shape': shape
        })
    
    # Add some water effects (bubbles, light rays)
    for _ in range(10):
        bx = random.randint(0, width)
        by = random.randint(0, height)
        br = random.randint(3, 8)
        cv2.circle(img, (bx, by), br, (255, 255, 255), 1)
    
    # Save image
    cv2.imwrite(output_path, img)
    print(f"✅ Generated sample image: {output_path}")
    print(f"   Dimensions: {width}x{height}")
    print(f"   Particles: {num_particles}")
    print(f"   Breakdown:")
    
    # Count particles by type
    type_counts = {}
    for p in particles_info:
        type_counts[p['type']] = type_counts.get(p['type'], 0) + 1
    
    for ptype, count in sorted(type_counts.items()):
        print(f"     - {ptype}: {count}")
    
    return img, particles_info

def create_multiple_samples():
    """Create multiple sample images with varying contamination levels"""
    
    output_dir = 'sample_images'
    os.makedirs(output_dir, exist_ok=True)
    
    samples = [
        ('low_contamination.jpg', 15, 'Low contamination'),
        ('medium_contamination.jpg', 40, 'Medium contamination'),
        ('high_contamination.jpg', 80, 'High contamination'),
        ('very_high_contamination.jpg', 120, 'Very high contamination'),
    ]
    
    print("=" * 60)
    print("Generating Sample Tank Images")
    print("=" * 60)
    
    for filename, num_particles, description in samples:
        output_path = os.path.join(output_dir, filename)
        print(f"\n📸 {description}")
        create_sample_tank_image(
            width=800,
            height=600,
            num_particles=num_particles,
            output_path=output_path
        )
    
    print("\n" + "=" * 60)
    print(f"✅ All samples created in '{output_dir}/' directory")
    print("=" * 60)
    print("\nYou can now use these images to test the microplastic detection system!")

if __name__ == '__main__':
    # Check if OpenCV is installed
    try:
        import cv2
    except ImportError:
        print("❌ Error: OpenCV not installed")
        print("   Install with: pip install opencv-python")
        exit(1)
    
    # Create sample images
    create_multiple_samples()
