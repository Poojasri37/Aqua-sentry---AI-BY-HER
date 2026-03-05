"""
System Verification Script for Microplastic Detection
Checks if all components are properly installed and configured
"""

import os
import sys
import json

def check_mark(condition):
    return "✅" if condition else "❌"

def print_header(text):
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)

def check_python_dependencies():
    """Check if required Python packages are installed"""
    print_header("Python Dependencies")
    
    dependencies = {
        'torch': 'PyTorch',
        'cv2': 'OpenCV',
        'numpy': 'NumPy',
    }
    
    all_installed = True
    for module, name in dependencies.items():
        try:
            __import__(module)
            print(f"{check_mark(True)} {name} installed")
        except ImportError:
            print(f"{check_mark(False)} {name} NOT installed")
            all_installed = False
    
    return all_installed

def check_yolo_model():
    """Check if YOLO model exists"""
    print_header("YOLO Model")
    
    model_paths = [
        'best.torchscript.zip',
        'backend/best.torchscript.zip',
        'backend/best.torchscript',
    ]
    
    found = False
    for path in model_paths:
        if os.path.exists(path):
            size_mb = os.path.getsize(path) / (1024 * 1024)
            print(f"{check_mark(True)} Found: {path} ({size_mb:.2f} MB)")
            found = True
            break
    
    if not found:
        print(f"{check_mark(False)} YOLO model not found")
        print("   Expected locations:")
        for path in model_paths:
            print(f"     - {path}")
    
    return found

def check_backend_files():
    """Check if backend files exist"""
    print_header("Backend Files")
    
    files = {
        'backend/src/routes/microplastic.routes.js': 'API Routes',
        'backend/src/services/yolo_inference.py': 'YOLO Service',
        'backend/requirements.txt': 'Python Requirements',
        'backend/src/server.js': 'Server Configuration',
    }
    
    all_exist = True
    for path, description in files.items():
        exists = os.path.exists(path)
        print(f"{check_mark(exists)} {description}: {path}")
        if not exists:
            all_exist = False
    
    return all_exist

def check_frontend_files():
    """Check if frontend files exist"""
    print_header("Frontend Files")
    
    files = {
        'frontend/src/pages/MicroplasticDetection.jsx': 'Detection Page',
        'frontend/src/components/DigitalTwin3D.jsx': '3D Visualization',
        'frontend/src/App.jsx': 'App Router',
    }
    
    all_exist = True
    for path, description in files.items():
        exists = os.path.exists(path)
        print(f"{check_mark(exists)} {description}: {path}")
        if not exists:
            all_exist = False
    
    return all_exist

def check_node_modules():
    """Check if Node.js dependencies are installed"""
    print_header("Node.js Dependencies")
    
    # Check backend
    backend_exists = os.path.exists('backend/node_modules')
    print(f"{check_mark(backend_exists)} Backend node_modules")
    
    # Check frontend
    frontend_exists = os.path.exists('frontend/node_modules')
    print(f"{check_mark(frontend_exists)} Frontend node_modules")
    
    # Check for Three.js specifically
    threejs_exists = os.path.exists('frontend/node_modules/three')
    print(f"{check_mark(threejs_exists)} Three.js (3D library)")
    
    return backend_exists and frontend_exists and threejs_exists

def check_upload_directory():
    """Check if upload directory exists"""
    print_header("Upload Directory")
    
    upload_dir = 'backend/uploads/microplastics'
    exists = os.path.exists(upload_dir)
    
    if not exists:
        print(f"{check_mark(False)} Upload directory not found")
        print(f"   Creating: {upload_dir}")
        try:
            os.makedirs(upload_dir, exist_ok=True)
            print(f"{check_mark(True)} Directory created successfully")
            exists = True
        except Exception as e:
            print(f"{check_mark(False)} Failed to create directory: {e}")
    else:
        print(f"{check_mark(True)} Upload directory exists: {upload_dir}")
    
    return exists

def check_sample_images():
    """Check if sample images exist"""
    print_header("Sample Images (Optional)")
    
    sample_dir = 'sample_images'
    exists = os.path.exists(sample_dir)
    
    if exists:
        files = [f for f in os.listdir(sample_dir) if f.endswith(('.jpg', '.png'))]
        print(f"{check_mark(True)} Sample images directory exists")
        print(f"   Found {len(files)} sample images")
    else:
        print(f"{check_mark(False)} No sample images found")
        print("   Run 'python generate_sample_images.py' to create test images")
    
    return True  # Optional, so always return True

def generate_report():
    """Generate overall system status report"""
    print_header("System Status Report")
    
    checks = {
        'Python Dependencies': check_python_dependencies(),
        'YOLO Model': check_yolo_model(),
        'Backend Files': check_backend_files(),
        'Frontend Files': check_frontend_files(),
        'Node.js Dependencies': check_node_modules(),
        'Upload Directory': check_upload_directory(),
        'Sample Images': check_sample_images(),
    }
    
    print_header("Summary")
    
    passed = sum(1 for v in checks.values() if v)
    total = len(checks)
    
    for check_name, status in checks.items():
        print(f"{check_mark(status)} {check_name}")
    
    print(f"\nOverall: {passed}/{total} checks passed")
    
    if passed == total:
        print("\n🎉 All systems ready! You can start using the microplastic detection system.")
        print("\nNext steps:")
        print("1. Start backend: cd backend && npm run dev")
        print("2. Start frontend: cd frontend && npm run dev")
        print("3. Navigate to: http://localhost:5173/microplastic-detection")
    else:
        print("\n⚠️ Some components are missing. Please review the failed checks above.")
        print("\nRecommended actions:")
        if not checks['Python Dependencies']:
            print("- Install Python dependencies: pip install -r backend/requirements.txt")
        if not checks['YOLO Model']:
            print("- Run: python prepare_model.py")
        if not checks['Node.js Dependencies']:
            print("- Install backend deps: cd backend && npm install")
            print("- Install frontend deps: cd frontend && npm install")

def main():
    print("=" * 60)
    print("  Microplastic Detection System - Verification")
    print("=" * 60)
    print("\nChecking system components...\n")
    
    generate_report()

if __name__ == '__main__':
    main()
