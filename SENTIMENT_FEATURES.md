# Sentiment-Aware Finance Chatbot

Your chatbot now has **sentiment analysis** capabilities! It can detect user emotions and respond empathetically.

## 🎭 What's New

### Sentiment Detection
The chatbot now detects:
- **Overall Sentiment**: Positive 😊, Negative 😟, or Neutral 😐
- **Specific Emotions**: 
  - Stressed/Anxious
  - Frustrated
  - Confused
  - Hopeful
  - Grateful

### Empathetic Responses
Based on detected sentiment, the AI provides:
- Supportive messages for stressed users
- Calming guidance for anxious users
- Clear explanations for confused users
- Encouraging responses for positive emotions

## 🚀 Setup

### 1. Install New Dependencies
```bash
pip install textblob vaderSentiment
python -m textblob.download_corpora
```

### 2. Test Sentiment Analyzer
```bash
python sentiment_analyzer.py
```

You should see sentiment analysis results for test messages.

### 3. Restart AI Server
```bash
python finance_ai_server.py
```

The server will now include sentiment analysis in all chat responses.

### 4. Start React App
```bash
npm run dev
```

## 📊 Features

### In Fast Mode (Default)
- Instant responses with rule-based logic
- No sentiment detection (for speed)

### In AI Mode
- Sentiment analysis on every message
- Empathetic response prefixes
- Emotion detection
- Sentiment indicators displayed in chat

### Sentiment Display
When AI Mode is enabled, each bot response shows:
- Detected sentiment emoji (😊/😟/😐)
- Sentiment type (positive/negative/neutral)
- Detected emotions (stressed, confused, etc.)

## 🧪 Testing Sentiment Analysis

Try these messages in AI Mode:

**Stressed/Anxious:**
- "I'm so worried about my debt"
- "I'm stressed about money"

**Frustrated:**
- "This is so frustrating, I can't save anything!"
- "I'm angry about these fees"

**Confused:**
- "I don't understand how to budget"
- "Can you help me? I'm lost"

**Positive:**
- "Thank you so much!"
- "I'm excited to start investing!"

## 📈 Sentiment Tracking

The server tracks sentiment history across the conversation and provides:
- Total message count
- Positive/negative/neutral distribution
- Average sentiment score
- Overall mood assessment

Access sentiment summary:
```bash
GET http://localhost:5000/sentiment/summary
```

## 🎯 How It Works

1. **User sends message** → Frontend sends to backend
2. **Backend analyzes sentiment** → Uses VADER + TextBlob
3. **Detects emotions** → Checks for keywords (worried, stressed, etc.)
4. **Generates empathetic prefix** → Adds supportive intro
5. **AI generates response** → Context includes sentiment data
6. **Returns combined response** → Prefix + AI response
7. **Frontend displays** → Shows sentiment indicators

## 💡 Usage Tips

- **Enable AI Mode** for sentiment-aware responses (slower but smarter)
- **Use Fast Mode** for quick answers without sentiment analysis
- The chatbot learns sentiment patterns over the conversation
- Sentiment data helps the AI provide more personalized advice

## 🔧 Customization

### Add New Emotions
Edit `sentiment_analyzer.py` → `_detect_emotions()` method

### Modify Empathetic Responses
Edit `sentiment_analyzer.py` → `get_empathetic_response_prefix()` method

### Adjust Sentiment Thresholds
Modify compound score thresholds in `analyze_sentiment()` method

## 📝 Example Interaction

**User (worried):** "I'm stressed about my credit card debt"

**Chatbot detects:**
- Sentiment: Negative 😟
- Emotions: stressed
- Compound: -0.52

**Chatbot responds:**
"I understand this is stressful. Let's work through this together. [AI financial advice follows...]"

**Sentiment indicator shows:**
"Detected: 😟 negative • stressed"

---

## 🎉 Your chatbot is now emotion-aware!

Restart the servers and try it in AI Mode to see empathetic responses in action!
