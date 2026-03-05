"""
Create User Account - Register pooja@gmail.com
"""

import requests
import json

BACKEND_URL = "http://localhost:5000/api/auth/register"

def create_user():
    user_data = {
        "name": "Pooja",
        "email": "pooja@gmail.com",
        "password": "pooja",
        "role": "business_partner"
    }
    
    try:
        response = requests.post(BACKEND_URL, json=user_data, timeout=5)
        
        if response.status_code == 201:
            print("✅ User account created successfully!")
            print(f"   Name: {user_data['name']}")
            print(f"   Email: {user_data['email']}")
            print(f"   Password: {user_data['password']}")
            print(f"   Role: {user_data['role']}")
            print("\n🎉 You can now login at http://localhost:5173")
        elif response.status_code == 400:
            print("ℹ️  User already exists!")
            print(f"   Email: {user_data['email']}")
            print(f"   Password: {user_data['password']}")
            print("\n✅ You can login at http://localhost:5173")
        else:
            print(f"❌ Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the backend server is running on port 5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔐 Creating user account...")
    print("-" * 60)
    create_user()
