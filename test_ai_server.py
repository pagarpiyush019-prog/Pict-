import requests
import json

# Test the AI server
BASE_URL = "http://localhost:5000"

print("Testing Finance AI Server...\n")

# Test 1: Health Check
print("1. Health Check:")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 2: Chat with context
print("2. Chat Test:")
try:
    payload = {
        "message": "How can I save more money on food?",
        "context": {
            "income": 60000,
            "balance": 125420,
            "budgets": [
                {"category": "Food", "limit": 10000, "spent": 12500},
                {"category": "Transport", "limit": 4000, "spent": 3800}
            ],
            "recent_transactions": [
                {"amount": 450, "merchant": "Swiggy", "category": "Food"},
                {"amount": 1200, "merchant": "Amazon", "category": "Shopping"},
                {"amount": 500, "merchant": "Netflix", "category": "Entertainment"}
            ]
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/chat",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   AI Response: {data['response']}\n")
    else:
        print(f"   Error: {response.text}\n")
except Exception as e:
    print(f"   Error: {e}\n")

# Test 3: Simple question
print("3. Simple Question Test:")
try:
    payload = {
        "message": "What's the best way to start investing?",
        "context": {
            "income": 60000,
            "balance": 125420
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/chat",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    print(f"   Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"   AI Response: {data['response']}\n")
    else:
        print(f"   Error: {response.text}\n")
except Exception as e:
    print(f"   Error: {e}\n")

print("✅ All tests completed!")
