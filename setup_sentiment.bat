@echo off
echo ========================================
echo Sentiment-Aware Chatbot Setup
echo ========================================
echo.

echo [1/3] Installing Python dependencies...
pip install textblob vaderSentiment --quiet

echo.
echo [2/3] Downloading TextBlob corpora...
python -m textblob.download_corpora

echo.
echo [3/3] Testing sentiment analyzer...
python sentiment_analyzer.py

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the AI server with sentiment analysis:
echo   python finance_ai_server.py
echo.
echo Then start your React app:
echo   npm run dev
echo.
echo Enable AI Mode in the chat to see sentiment detection!
echo.
pause
