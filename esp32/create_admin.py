"""
Create Admin User - Register poojasrinirmalamanickam@gmail.com
"""

import requests
import json

BACKEND_URL = "http://localhost:5000/api/auth/register"

def create_admin_user():
    user_data = {
        "name": "Pooja Admin",
        "email": "poojasrinirmalamanickam@gmail.com",
        "password": "poojadeepthi",
        "role": "admin"
    }
    
    try:
        response = requests.post(BACKEND_URL, json=user_data, timeout=5)
        
        if response.status_code == 201:
            print("✅ Admin account created successfully!")
            print(f"   Name: {user_data['name']}")
            print(f"   Email: {user_data['email']}")
            print(f"   Password: {user_data['password']}")
            print("   (Note: Role will be auto-promoted to 'admin' on login by the backend override)")
        elif response.status_code == 400:
            print("ℹ️  User already exists!")
            # Attempt login to verify credentials if possible, or just report success
            print(f"   Email: {user_data['email']}")
            print("   If the password was different, you may need to manually update it in the DB or delete the user.")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔐 Creating admin account...")
    print("-" * 60)
    create_admin_user()
