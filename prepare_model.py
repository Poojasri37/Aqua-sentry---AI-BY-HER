"""
Script to prepare YOLO model for microplastic detection
Extracts the TorchScript model from the zip file if needed
"""

import zipfile
import os
import sys

def extract_model():
    """Extract TorchScript model from zip file"""
    zip_path = 'best.torchscript.zip'
    extract_dir = 'backend'
    
    if not os.path.exists(zip_path):
        print(f"❌ Error: {zip_path} not found!")
        print("Please ensure your trained YOLO model is in the project root directory.")
        return False
    
    print(f"📦 Found {zip_path}")
    print(f"📂 Extracting to {extract_dir}...")
    
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            # List contents
            file_list = zip_ref.namelist()
            print(f"   Files in archive: {', '.join(file_list)}")
            
            # Extract all
            zip_ref.extractall(extract_dir)
            
        print("✅ Model extracted successfully!")
        print(f"   Location: {os.path.join(extract_dir, 'best.torchscript')}")
        return True
        
    except Exception as e:
        print(f"❌ Error extracting model: {e}")
        return False

def convert_pt_to_torchscript():
    """Convert .pt model to TorchScript format"""
    print("\n🔄 Converting .pt model to TorchScript...")
    
    try:
        import torch
        from ultralytics import YOLO
        
        # Look for .pt file
        pt_files = [f for f in os.listdir('.') if f.endswith('.pt')]
        
        if not pt_files:
            print("❌ No .pt model files found in current directory")
            return False
        
        print(f"📁 Found models: {', '.join(pt_files)}")
        model_path = pt_files[0]  # Use first one found
        
        print(f"🔧 Loading {model_path}...")
        model = YOLO(model_path)
        
        # Export to TorchScript
        print("📤 Exporting to TorchScript format...")
        model.export(format='torchscript')
        
        print("✅ Conversion successful!")
        print(f"   Output: best.torchscript")
        
        # Create zip file
        print("📦 Creating zip archive...")
        with zipfile.ZipFile('best.torchscript.zip', 'w') as zipf:
            zipf.write('best.torchscript')
        
        print("✅ Created best.torchscript.zip")
        return True
        
    except ImportError:
        print("❌ Error: ultralytics package not installed")
        print("   Install with: pip install ultralytics")
        return False
    except Exception as e:
        print(f"❌ Error converting model: {e}")
        return False

def main():
    print("=" * 60)
    print("YOLO Model Preparation for Microplastic Detection")
    print("=" * 60)
    
    # Check if zip already exists and is in the right place
    if os.path.exists('backend/best.torchscript.zip'):
        print("✅ Model already prepared in backend directory!")
        return
    
    # Check if zip exists in root
    if os.path.exists('best.torchscript.zip'):
        print("📦 Found best.torchscript.zip in root directory")
        choice = input("Extract to backend directory? (y/n): ").lower()
        if choice == 'y':
            extract_model()
        return
    
    # Check for .pt files
    pt_files = [f for f in os.listdir('.') if f.endswith('.pt')]
    if pt_files:
        print(f"\n📁 Found .pt model files: {', '.join(pt_files)}")
        choice = input("Convert to TorchScript format? (y/n): ").lower()
        if choice == 'y':
            if convert_pt_to_torchscript():
                extract_model()
        return
    
    print("\n❌ No YOLO model found!")
    print("\nPlease do one of the following:")
    print("1. Place your trained model (best.pt) in the project root directory")
    print("2. Place best.torchscript.zip in the project root directory")
    print("\nThen run this script again.")

if __name__ == '__main__':
    main()
