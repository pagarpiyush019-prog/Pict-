"""Test if all imports work"""
try:
    print("Testing Flask...")
    from flask import Flask, request, jsonify
    print("✅ Flask OK")
    
    print("Testing Flask-CORS...")
    from flask_cors import CORS
    print("✅ Flask-CORS OK")
    
    print("Testing Google Generative AI...")
    import google.generativeai as genai
    print("✅ Google Generative AI OK")
    
    print("Testing Sentiment Analyzer...")
    from sentiment_analyzer import SentimentAnalyzer
    print("✅ Sentiment Analyzer OK")
    
    print("\n🎉 All imports successful!")
    
    # Try to configure Gemini
    print("\nTesting Gemini configuration...")
    GEMINI_API_KEY = "AIzaSyC16tmGL6qBCTMf4Oozv21zfqPXEvCk3DQ"
    genai.configure(api_key=GEMINI_API_KEY)
    print("✅ Gemini configured")
    
    # Try to create model
    print("\nTesting Gemini model creation...")
    model = genai.GenerativeModel('gemini-pro')
    print("✅ Model created")
    
    print("\n✅ Everything works!")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    import traceback
    traceback.print_exc()
