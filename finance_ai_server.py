from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment_analyzer import SentimentAnalyzer
import json
from datetime import datetime, timedelta
import random
import requests

app = Flask(__name__)
CORS(app)

analyzer = SentimentAnalyzer()

# --- Mock Data ---
# Using the same structure as the frontend for consistency

mock_portfolio = {
    "1": {
        "totalValue": 85420,
        "dailyChange": {
            "amount": 1250,
            "percentage": 1.48
        },
        "overallReturn": {
            "amount": 12420,
            "percentage": 17.02
        },
        "allocation": [
            { "name": "Index Funds", "percentage": 40, "color": "#4F46E5" },
            { "name": "Mutual Funds", "percentage": 25, "color": "#10B981" },
            { "name": "ETFs", "percentage": 20, "color": "#F59E0B" },
            { "name": "Stocks", "percentage": 10, "color": "#8B5CF6" },
            { "name": "Gold/SGBs", "percentage": 5, "color": "#EC4899" }
        ],
        "assets": [
            { "id": "1", "symbol": "NIFTY50", "name": "UTI Nifty 50 Index Fund", "shares": 245.5, "currentPrice": 142.35, "marketValue": 34950, "gainLoss": 4850, "changePercentage": 1.62, "type": "Index Fund" },
            { "id": "2", "symbol": "PPFAS", "name": "Parag Parikh Flexi Cap Fund", "shares": 312.8, "currentPrice": 68.50, "marketValue": 21420, "gainLoss": 3280, "changePercentage": 0.95, "type": "Mutual Fund" },
            { "id": "3", "symbol": "GOLDBEES", "name": "Nippon India Gold ETF", "shares": 75, "currentPrice": 56.80, "marketValue": 4260, "gainLoss": 520, "changePercentage": 0.42, "type": "ETF" },
            { "id": "4", "symbol": "INFY", "name": "Infosys Ltd.", "shares": 5, "currentPrice": 1485.60, "marketValue": 7428, "gainLoss": -340, "changePercentage": -1.15, "type": "Stock" },
            { "id": "5", "symbol": "HDFC", "name": "HDFC Balanced Advantage Fund", "shares": 425.2, "currentPrice": 40.75, "marketValue": 17330, "gainLoss": 2890, "changePercentage": 1.28, "type": "Mutual Fund" },
            { "id": "6", "symbol": "TATA", "name": "Tata Digital India Fund", "shares": 85.5, "currentPrice": 42.10, "marketValue": 3600, "gainLoss": 720, "changePercentage": 2.35, "type": "Mutual Fund" }
        ]
    }
}

mock_news = [
    { "id": "1", "title": "RBI Holds Repo Rate Steady at 6.5%, Signals Positive Growth", "summary": "Reserve Bank of India maintains accommodative stance amid strong GDP growth projections for FY26, beneficial for equity markets.", "source": "Economic Times", "category": "economy", "sentiment": "positive", "timestamp": (datetime.now() - timedelta(minutes=30)).isoformat(), "image": "https://images.unsplash.com/photo-1633059050703-0f1b50828402", "imageAlt": "Reserve Bank of India building exterior" },
    { "id": "2", "title": "Nifty 50 Hits New All-Time High on IT & Banking Rally", "summary": "Indian benchmark index crosses 25,000 mark as IT giants report strong quarterly results and FII inflows continue.", "source": "Moneycontrol", "category": "stocks", "sentiment": "positive", "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(), "image": "https://images.unsplash.com/photo-1726585554553-23c7d72ef47e", "imageAlt": "Stock market charts showing upward trend" },
    { "id": "3", "title": "Gold Prices Rise as Festival Season Approaches", "summary": "Sovereign Gold Bonds see increased interest from young investors as gold touches ₹75,000/10g ahead of Diwali.", "source": "Mint", "category": "markets", "sentiment": "positive", "timestamp": (datetime.now() - timedelta(hours=1, minutes=30)).isoformat(), "image": "https://images.unsplash.com/photo-1726731782158-fcf6822b6ca4", "imageAlt": "Gold bars and coins representing precious metals investment" },
    { "id": "4", "title": "Mutual Fund SIP Inflows Cross ₹25,000 Crore Monthly", "summary": "Retail investors continue to show strong faith in systematic investment plans, with equity funds seeing highest inflows.", "source": "AMFI India", "category": "markets", "sentiment": "positive", "timestamp": (datetime.now() - timedelta(hours=2)).isoformat(), "image": "https://images.unsplash.com/photo-1643616997533-b2765f43011d", "imageAlt": "Growth chart representing mutual fund investments" }
]

mock_watchlist = {
    "1": [
        { "id": "1", "symbol": "TCS", "name": "Tata Consultancy Services", "currentPrice": 4125.50, "changeAmount": 45.20, "changePercentage": 1.11, "hasAlert": True, "priceTarget": 4500.00, "alertPrice": 4000.00 },
        { "id": "2", "symbol": "RELIANCE", "name": "Reliance Industries Ltd.", "currentPrice": 2485.75, "changeAmount": -18.25, "changePercentage": -0.73, "hasAlert": False, "priceTarget": 2700.00, "alertPrice": None },
        { "id": "3", "symbol": "HDFCBANK", "name": "HDFC Bank Ltd.", "currentPrice": 1685.60, "changeAmount": 22.40, "changePercentage": 1.35, "hasAlert": True, "priceTarget": 1800.00, "alertPrice": 1600.00 }
    ]
}

mock_users = {
    "1": {
        "id": "1",
        "name": "Student Investor",
        "email": "student@example.com",
        "profile": {
            "age": "20-24",
            "riskTolerance": "Moderate-Aggressive",
            "timeHorizon": "8-10 years",
            "investmentGoal": "Education + Early Wealth",
            "experience": "Beginner/Intermediate"
        }
    }
}

mock_recommendations = {
    "1": [
        { "id": "1", "type": "increase_exposure", "title": "Boost Your SIP Amount", "description": "You're saving ₹3,000/month. Increasing to ₹5,000 could grow your corpus by ₹2.5L extra over 8 years with compounding.", "priority": "medium", "status": 'pending', "allocation": { "current": 3000, "recommended": 5000 }, "expectedImpact": { "returnIncrease": 2.5, "riskChange": "Same" }, "lastUpdated": "1 hour ago" },
        { "id": "2", "type": "diversify", "title": "Add International Exposure", "description": "Consider Motilal Oswal Nasdaq 100 ETF for global diversification. Young investors benefit from higher equity allocation.", "priority": "low", "status": 'pending', "allocation": { "current": 0, "recommended": 10 }, "expectedImpact": { "returnIncrease": 1.8, "riskChange": "Slightly Higher" }, "lastUpdated": "1 day ago" },
        { "id": "3", "type": "rebalance", "title": "Lock in Gains from IT Sector", "description": "Your Tata Digital India Fund is up 25%. Consider booking partial profits and moving to index funds for stability.", "priority": "high", "status": 'pending', "allocation": { "current": 15, "recommended": 10 }, "expectedImpact": { "returnIncrease": -0.5, "riskChange": "Lower" }, "lastUpdated": "3 hours ago" }
    ]
}

# --- API Endpoints ---

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message', '')

    if not message:
        return jsonify({'error': 'No message provided'}), 400

    sentiment_data = analyzer.analyze_sentiment(message)
    prefix = analyzer.get_empathetic_response_prefix(sentiment_data)

    response_message = "This is a placeholder response."

    if 'help' in message.lower():
        response_message = "I am here to help you with your finances."
    elif 'balance' in message.lower():
        response_message = "I can help you check your balance."
    elif 'budget' in message.lower():
        response_message = "Let's talk about your budget."

    return jsonify({
        'response': prefix + response_message,
        'sentiment_data': sentiment_data
    })

@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = mock_users.get(user_id)
    if user:
        return jsonify(user)
    return jsonify({'error': 'User not found'}), 404

@app.route('/portfolio/<user_id>', methods=['GET'])
def get_portfolio(user_id):
    portfolio = mock_portfolio.get(user_id)
    if portfolio:
        return jsonify(portfolio)
    return jsonify({'error': 'User not found'}), 404

NEWS_API_KEY = "YOUR_NEWS_API_KEY" # Replace with your News API key

@app.route('/market-news', methods=['GET'])
def get_market_news():
    if NEWS_API_KEY == "YOUR_NEWS_API_KEY":
        return jsonify(mock_news)
    
    try:
        url = f"https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'ok':
            articles = data['articles']
            # Format the articles to match the frontend's data structure
            formatted_articles = [
                {
                    "id": str(i),
                    "title": article['title'],
                    "summary": article['description'],
                    "source": article['source']['name'],
                    "category": "business",
                    "sentiment": "neutral",
                    "timestamp": article['publishedAt'],
                    "image": article['urlToImage'],
                    "imageAlt": article['title']
                } for i, article in enumerate(articles)
            ]
            return jsonify(formatted_articles)
        else:
            return jsonify(mock_news) # Fallback to mock data
            
    except Exception as e:
        print(f"Error fetching news: {e}")
        return jsonify(mock_news) # Fallback to mock data

@app.route('/watchlist/<user_id>', methods=['GET'])
def get_watchlist(user_id):
    watchlist = mock_watchlist.get(user_id)
    if watchlist:
        return jsonify(watchlist)
    return jsonify({'error': 'User not found'}), 404

@app.route('/watchlist/<user_id>', methods=['POST'])
def add_to_watchlist(user_id):
    if user_id not in mock_watchlist:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()
    symbol = data.get('symbol')

    if not symbol:
        return jsonify({'error': 'Stock symbol not provided'}), 400

    # In a real app, you would fetch stock details from an API
    new_stock = {
        "id": str(random.randint(100, 1000)),
        "symbol": symbol.upper(),
        "name": f"{symbol.upper()} Inc.",
        "currentPrice": round(random.uniform(100, 5000), 2),
        "changeAmount": round(random.uniform(-50, 50), 2),
        "changePercentage": round(random.uniform(-5, 5), 2),
        "hasAlert": False,
        "priceTarget": None,
        "alertPrice": None
    }
    
    mock_watchlist[user_id].append(new_stock)
    return jsonify(new_stock), 201

@app.route('/watchlist/<user_id>/<symbol>', methods=['DELETE'])
def remove_from_watchlist(user_id, symbol):
    if user_id not in mock_watchlist:
        return jsonify({'error': 'User not found'}), 404

    initial_len = len(mock_watchlist[user_id])
    mock_watchlist[user_id] = [stock for stock in mock_watchlist[user_id] if stock['symbol'].lower() != symbol.lower()]

    if len(mock_watchlist[user_id]) < initial_len:
        return jsonify({'message': f'Stock {symbol.upper()} removed from watchlist'}), 200
    else:
        return jsonify({'error': f'Stock {symbol.upper()} not found in watchlist'}), 404

@app.route('/recommendations/<user_id>', methods=['GET'])
def get_recommendations(user_id):
    recommendations = mock_recommendations.get(user_id)
    if recommendations:
        return jsonify(recommendations)
    return jsonify({'error': 'User not found'}), 404

@app.route('/rebalance/<user_id>', methods=['POST'])
def rebalance_portfolio(user_id):
    if user_id not in mock_portfolio:
        return jsonify({'error': 'User not found'}), 404
    
    user = mock_users.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    risk_tolerance = user['profile']['riskTolerance']
    
    # Define target allocations based on risk tolerance
    target_allocations = {
        "Conservative": [
            { "name": "Index Funds", "percentage": 20, "color": "#4F46E5" },
            { "name": "Mutual Funds", "percentage": 30, "color": "#10B981" },
            { "name": "ETFs", "percentage": 10, "color": "#F59E0B" },
            { "name": "Stocks", "percentage": 5, "color": "#8B5CF6" },
            { "name": "Gold/SGBs", "percentage": 35, "color": "#EC4899" }
        ],
        "Moderate": [
            { "name": "Index Funds", "percentage": 35, "color": "#4F46E5" },
            { "name": "Mutual Funds", "percentage": 25, "color": "#10B981" },
            { "name": "ETFs", "percentage": 20, "color": "#F59E0B" },
            { "name": "Stocks", "percentage": 10, "color": "#8B5CF6" },
            { "name": "Gold/SGBs", "percentage": 10, "color": "#EC4899" }
        ],
        "Moderate-Aggressive": [
            { "name": "Index Funds", "percentage": 45, "color": "#4F46E5" },
            { "name": "Mutual Funds", "percentage": 22, "color": "#10B981" },
            { "name": "ETFs", "percentage": 18, "color": "#F59E0B" },
            { "name": "Stocks", "percentage": 8, "color": "#8B5CF6" },
            { "name": "Gold/SGBs", "percentage": 7, "color": "#EC4899" }
        ],
        "Aggressive": [
            { "name": "Index Funds", "percentage": 50, "color": "#4F46E5" },
            { "name": "Mutual Funds", "percentage": 20, "color": "#10B981" },
            { "name": "ETFs", "percentage": 15, "color": "#F59E0B" },
            { "name": "Stocks", "percentage": 10, "color": "#8B5CF6" },
            { "name": "Gold/SGBs", "percentage": 5, "color": "#EC4899" }
        ]
    }

    new_allocations = target_allocations.get(risk_tolerance, mock_portfolio[user_id]['allocation'])
    
    mock_portfolio[user_id]['allocation'] = new_allocations
    mock_portfolio[user_id]['totalValue'] = round(mock_portfolio[user_id]['totalValue'] * (1 + random.uniform(-0.01, 0.02)), 2)

    return jsonify({
        "message": "Portfolio rebalanced successfully",
        "new_portfolio": mock_portfolio[user_id]
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)