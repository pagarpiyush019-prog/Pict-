"""
Sentiment Analysis Module for Finance Chatbot
Detects user emotions and provides empathetic responses
"""
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
import json
from datetime import datetime

class SentimentAnalyzer:
    def __init__(self):
        self.vader = SentimentIntensityAnalyzer()
        self.sentiment_history = []
        
    def analyze_sentiment(self, text):
        """
        Analyze sentiment using VADER (better for social media/chat text)
        Returns: dict with sentiment scores and classification
        """
        # VADER analysis
        vader_scores = self.vader.polarity_scores(text)
        
        # TextBlob for additional context
        blob = TextBlob(text)
        textblob_polarity = blob.sentiment.polarity
        textblob_subjectivity = blob.sentiment.subjectivity
        
        # Classify sentiment
        compound = vader_scores['compound']
        if compound >= 0.05:
            sentiment = 'positive'
            emoji = '😊'
        elif compound <= -0.05:
            sentiment = 'negative'
            emoji = '😟'
        else:
            sentiment = 'neutral'
            emoji = '😐'
        
        # Detect specific emotions based on keywords
        emotions = self._detect_emotions(text.lower())
        
        result = {
            'sentiment': sentiment,
            'emoji': emoji,
            'compound': compound,
            'positive': vader_scores['pos'],
            'negative': vader_scores['neg'],
            'neutral': vader_scores['neu'],
            'polarity': textblob_polarity,
            'subjectivity': textblob_subjectivity,
            'emotions': emotions,
            'timestamp': datetime.now().isoformat()
        }
        
        # Track sentiment history
        self.sentiment_history.append({
            'text': text[:50] + '...' if len(text) > 50 else text,
            'sentiment': sentiment,
            'compound': compound,
            'timestamp': result['timestamp']
        })
        
        return result
    
    def _detect_emotions(self, text):
        """Detect specific emotions from text"""
        emotions = []
        
        # Stress/Anxiety indicators
        stress_words = ['worried', 'stress', 'anxious', 'concern', 'scared', 'panic', 'overwhelm']
        if any(word in text for word in stress_words):
            emotions.append('stressed')
        
        # Frustration indicators
        frustration_words = ['frustrated', 'annoyed', 'angry', 'upset', 'hate', 'can\'t']
        if any(word in text for word in frustration_words):
            emotions.append('frustrated')
        
        # Confusion indicators
        confusion_words = ['confused', 'don\'t understand', 'unclear', 'lost', 'help']
        if any(word in text for word in confusion_words):
            emotions.append('confused')
        
        # Hope/Optimism indicators
        hope_words = ['hope', 'better', 'improve', 'excited', 'looking forward', 'can do']
        if any(word in text for word in hope_words):
            emotions.append('hopeful')
        
        # Gratitude indicators
        gratitude_words = ['thank', 'appreciate', 'grateful', 'thanks']
        if any(word in text for word in gratitude_words):
            emotions.append('grateful')
        
        return emotions
    
    def get_empathetic_response_prefix(self, sentiment_data):
        """Generate an empathetic response prefix based on sentiment"""
        sentiment = sentiment_data['sentiment']
        emotions = sentiment_data['emotions']
        
        # Stressed/Anxious response
        if 'stressed' in emotions:
            return "I understand this is stressful. Let's work through this together. "
        
        # Frustrated response
        if 'frustrated' in emotions:
            return "I can sense your frustration. Let me help you find a solution. "
        
        # Confused response
        if 'confused' in emotions:
            return "Let me clarify this for you in a simple way. "
        
        # Grateful response
        if 'grateful' in emotions:
            return "You're welcome! I'm happy to help. "
        
        # General sentiment-based responses
        if sentiment == 'negative':
            return "I hear you, and I'm here to help. "
        elif sentiment == 'positive':
            return "Great! I'm glad to hear that. "
        else:
            return ""
    
    def get_sentiment_summary(self):
        """Get summary of sentiment history"""
        if not self.sentiment_history:
            return "No conversation history yet."
        
        sentiments = [s['sentiment'] for s in self.sentiment_history]
        avg_compound = sum(s['compound'] for s in self.sentiment_history) / len(self.sentiment_history)
        
        positive_count = sentiments.count('positive')
        negative_count = sentiments.count('negative')
        neutral_count = sentiments.count('neutral')
        
        return {
            'total_messages': len(self.sentiment_history),
            'positive': positive_count,
            'negative': negative_count,
            'neutral': neutral_count,
            'average_sentiment': avg_compound,
            'overall_mood': 'positive' if avg_compound > 0.1 else 'negative' if avg_compound < -0.1 else 'neutral'
        }
    
    def save_sentiment_history(self, filename='sentiment_history.json'):
        """Save sentiment history to file"""
        with open(filename, 'w') as f:
            json.dump(self.sentiment_history, f, indent=2)
    
    def load_sentiment_history(self, filename='sentiment_history.json'):
        """Load sentiment history from file"""
        try:
            with open(filename, 'r') as f:
                self.sentiment_history = json.load(f)
        except FileNotFoundError:
            self.sentiment_history = []


# Test the sentiment analyzer
if __name__ == '__main__':
    analyzer = SentimentAnalyzer()
    
    test_messages = [
        "I'm so worried about my debt",
        "Thank you so much for your help!",
        "I don't understand how to budget",
        "This is really frustrating, I can't save any money",
        "I'm excited to start investing!",
        "I think I need to check my balance"
    ]
    
    print("=== Sentiment Analysis Test ===\n")
    for msg in test_messages:
        result = analyzer.analyze_sentiment(msg)
        prefix = analyzer.get_empathetic_response_prefix(result)
        
        print(f"Message: {msg}")
        print(f"Sentiment: {result['sentiment']} {result['emoji']} (compound: {result['compound']:.2f})")
        print(f"Emotions: {', '.join(result['emotions']) if result['emotions'] else 'None detected'}")
        print(f"Response Prefix: {prefix}")
        print()
    
    print("=== Conversation Summary ===")
    summary = analyzer.get_sentiment_summary()
    print(json.dumps(summary, indent=2))
