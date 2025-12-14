@echo off
echo ========================================
echo Finance AI Chatbot - Starting Services
echo ========================================
echo.

echo Installing Python dependencies (if needed)...
pip install -q flask flask-cors requests transformers torch vaderSentiment textblob

echo.
echo ========================================
echo Starting AI Backend Server...
echo ========================================
echo Server will be available at http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python finance_ai_server.py
