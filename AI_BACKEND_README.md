# Finance AI Backend

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the AI server:
```bash
python finance_ai_server.py
```

The server will start on `http://localhost:5000`

## Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### Chat (with context)
```bash
POST http://localhost:5000/chat
Content-Type: application/json

{
  "message": "How can I save more money?",
  "context": {
    "income": 60000,
    "balance": 125420,
    "budgets": [
      { "category": "Food", "limit": 10000, "spent": 8500 }
    ],
    "recent_transactions": [
      { "amount": 450, "merchant": "Swiggy", "category": "Food" }
    ]
  }
}
```

### Generate (simple prompt)
```bash
POST http://localhost:5000/generate
Content-Type: application/json

{
  "prompt": "You are a finance advisor...",
  "max_tokens": 200
}
```

## Running Both Apps

Terminal 1 - AI Backend:
```bash
python finance_ai_server.py
```

Terminal 2 - React Frontend:
```bash
npm run dev
```

The chatbot will automatically connect to the AI backend when you send messages!
