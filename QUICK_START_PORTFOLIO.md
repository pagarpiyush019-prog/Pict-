# 🚀 Quick Start Guide - Portfolio Management

## Step 1: Setup Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Get your API key**: https://makersuite.google.com/app/apikey

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Access Portfolio Management

1. Open browser to `http://localhost:5173`
2. Navigate to **Financial Dashboard**
3. Scroll down to see **Portfolio Management** section

## 🎯 Features You'll See

### Tab 1: Portfolio Overview
- **Overview**: Asset allocation charts + AI insights
- **Investments**: Detailed tables for Bonds, Mutual Funds, SIPs
- **Budget**: Income/Expenses tracking with visualizations

### Tab 2: Diversification
- Diversification score (out of 10)
- Risk assessment metrics
- AI-powered rebalancing recommendations

## 🤖 AI Integration

The dashboard automatically generates insights using Google Gemini AI:
- **3 Key Insights** about your portfolio health
- **3 Smart Tips** for optimization
- **Specific Rebalancing Actions** with exact amounts

If AI is unavailable, intelligent fallback insights are displayed.

## 📊 Mock Data

Currently using sample portfolio data:
- Total Value: ₹28.45L
- Bonds: ₹8.5L (2 items)
- Mutual Funds: ₹12.45L (3 items)
- SIPs: ₹7.5L (3 items)

To connect to real backend, see `PORTFOLIO_MANAGEMENT_DOCUMENTATION.md`

## 🎨 Customization

### Change Colors
Edit gradient classes in `PortfolioManagement.jsx`:
```jsx
className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50"
```

### Modify Charts
Edit chart components at the bottom of `PortfolioManagement.jsx`:
- `SimplePieChart`
- `SimpleRadarChart`
- `InvestmentSection` (bar charts)

### Update Mock Data
Edit `mockPortfolioData` object in `PortfolioManagement.jsx`

## 🐛 Troubleshooting

**AI Insights Not Loading?**
- Check `.env` file has valid API key
- Check browser console for errors
- Fallback insights will display automatically

**Charts Not Showing?**
- Verify `AppIcon` component is available
- Check data structure matches expected format

**Build Errors?**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📱 Responsive Design

Fully responsive across devices:
- **Desktop**: Full 3-column layout
- **Tablet**: 2-column layout
- **Mobile**: Single column, stacked layout

## 🔐 Security Notes

⚠️ **Never commit `.env` file to version control**

Add to `.gitignore`:
```
.env
.env.local
```

## 🚀 Production Deployment

1. Build the project:
```bash
npm run build
```

2. Set environment variables on hosting platform
3. Deploy `dist` folder

## 📖 Full Documentation

See `PORTFOLIO_MANAGEMENT_DOCUMENTATION.md` for:
- Complete feature list
- API integration details
- Advanced customization
- Backend integration guide

---

**Ready to manage your portfolio! 💰📈**
