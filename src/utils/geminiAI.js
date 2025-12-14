// Google Gemini AI Integration for Portfolio Analysis
// This file handles AI-powered insights generation using Google Gemini API

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

// Try multiple API endpoints - switching to v1 API with available models
const GEMINI_API_ENDPOINTS = [
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
];

/**
 * Generate AI insights for portfolio overview
 * @param {Object} portfolioData - Complete portfolio data
 * @returns {Promise<Object>} AI-generated insights and recommendations
 */
export const generatePortfolioInsights = async (portfolioData) => {
  const prompt = createPortfolioPrompt(portfolioData);
  
  // Try each endpoint until one works
  for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
    try {
      const GEMINI_API_URL = GEMINI_API_ENDPOINTS[i];
      console.log(`Trying Gemini API endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length}:`, GEMINI_API_URL);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Endpoint ${i + 1} failed with status ${response.status}:`, errorText);
        
        // If this is the last endpoint, throw error
        if (i === GEMINI_API_ENDPOINTS.length - 1) {
          throw new Error(`All Gemini API endpoints failed. Last error: ${response.status}`);
        }
        // Otherwise, continue to next endpoint
        continue;
      }

      const data = await response.json();
      console.log('✅ Gemini API success with endpoint:', GEMINI_API_URL);
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the generated text into structured insights
      return parseInsightsResponse(generatedText);
      
    } catch (error) {
      console.warn(`Endpoint ${i + 1} error:`, error.message);
      
      // If this is the last endpoint, return fallback
      if (i === GEMINI_API_ENDPOINTS.length - 1) {
        console.error('All Gemini API endpoints failed. Using fallback insights.');
        return getFallbackInsights(portfolioData);
      }
      // Otherwise, try next endpoint
    }
  }
  
  // Fallback if all attempts fail
  return getFallbackInsights(portfolioData);
};

/**
 * Create a detailed prompt for Gemini AI
 */
const createPortfolioPrompt = (portfolioData) => {
  const { totalValue, bonds, mutualFunds, sips, budget, diversification } = portfolioData;
  
  return `You are a professional financial advisor. Analyze this investment portfolio and provide insights:

Portfolio Summary:
- Total Value: ₹${(totalValue / 100000).toFixed(2)}L
- Bonds: ₹${(bonds.totalValue / 100000).toFixed(2)}L (${bonds.items.length} items)
- Mutual Funds: ₹${(mutualFunds.totalValue / 100000).toFixed(2)}L (${mutualFunds.items.length} items)
- SIPs: ₹${(sips.totalValue / 100000).toFixed(2)}L (${sips.items.length} items)

Bond Details:
${bonds.items.map(b => `- ${b.name}: ₹${(b.amount / 1000).toFixed(0)}K at ${b.interestRate}% (Rating: ${b.rating})`).join('\n')}

Mutual Fund Details:
${mutualFunds.items.map(m => `- ${m.name}: ₹${(m.amount / 1000).toFixed(0)}K with ${m.returns}% returns (${m.riskLevel} risk)`).join('\n')}

SIP Details:
${sips.items.map(s => `- ${s.name}: ₹${(s.monthlyAmount / 1000).toFixed(0)}K/month, ${s.returns}% returns`).join('\n')}

Budget Analysis:
- Monthly Income: ₹${(budget.monthlyIncome / 1000).toFixed(0)}K
- Monthly Expenses: ₹${(budget.monthlyExpenses / 1000).toFixed(0)}K
- Monthly Savings: ₹${(budget.monthlySavings / 1000).toFixed(0)}K

Diversification Score: ${diversification.score}/10

Please provide:
1. Three key insights about portfolio performance and health (each 30-50 words)
2. Three actionable tips for optimization (each 25-40 words)
3. Three specific rebalancing recommendations with exact actions

Format your response as JSON:
{
  "insights": ["insight1", "insight2", "insight3"],
  "tips": ["tip1", "tip2", "tip3"],
  "recommendations": [
    {"action": "Action name", "from": "Current state", "to": "Recommended state", "impact": "Expected impact"},
    ...
  ]
}`;
};

/**
 * Parse AI response into structured format
 */
const parseInsightsResponse = (text) => {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // If no JSON found, parse as plain text
    return parseTextResponse(text);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return parseTextResponse(text);
  }
};

/**
 * Parse plain text response
 */
const parseTextResponse = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  
  const insights = [];
  const tips = [];
  const recommendations = [];
  
  let currentSection = null;
  
  for (const line of lines) {
    if (line.toLowerCase().includes('insight') || line.toLowerCase().includes('key point')) {
      currentSection = 'insights';
    } else if (line.toLowerCase().includes('tip') || line.toLowerCase().includes('recommendation')) {
      currentSection = 'tips';
    } else if (line.toLowerCase().includes('rebalancing') || line.toLowerCase().includes('action')) {
      currentSection = 'recommendations';
    } else if (line.match(/^[\d\-\*\•]/)) {
      const content = line.replace(/^[\d\-\*\•\.\)]\s*/, '').trim();
      if (content && currentSection === 'insights') {
        insights.push(content);
      } else if (content && currentSection === 'tips') {
        tips.push(content);
      }
    }
  }
  
  return {
    insights: insights.slice(0, 3),
    tips: tips.slice(0, 3),
    recommendations: recommendations.slice(0, 3)
  };
};

/**
 * Fallback insights when API is unavailable - Dynamic based on actual portfolio
 */
const getFallbackInsights = (portfolioData) => {
  const { totalValue, bonds, mutualFunds, sips, budget, gold } = portfolioData;
  
  const bondPercentage = ((bonds.totalValue / totalValue) * 100).toFixed(1);
  const mfPercentage = ((mutualFunds.totalValue / totalValue) * 100).toFixed(1);
  const sipPercentage = ((sips.totalValue / totalValue) * 100).toFixed(1);
  const goldPercentage = gold ? ((gold.totalValue / totalValue) * 100).toFixed(1) : 0;
  const savingsRate = ((budget.monthlySavings / budget.monthlyIncome) * 100).toFixed(1);
  
  const avgSipReturns = sips.items.length > 0 ? (sips.items.reduce((sum, s) => sum + (s.returns || 0), 0) / sips.items.length).toFixed(1) : 0;
  const avgMFReturns = mutualFunds.items.length > 0 ? (mutualFunds.items.reduce((sum, m) => sum + (m.returns || 0), 0) / mutualFunds.items.length).toFixed(1) : 0;
  
  // Find best and worst performing investments
  const allInvestments = [...sips.items, ...mutualFunds.items];
  const sortedByReturns = allInvestments.filter(i => i.returns !== undefined).sort((a, b) => b.returns - a.returns);
  const bestPerformer = sortedByReturns[0];
  const worstPerformer = sortedByReturns[sortedByReturns.length - 1];
  
  // Count underperforming investments
  const underperformingCount = allInvestments.filter(i => i.returns < 8).length;
  
  // Analyze portfolio composition
  const isConservative = parseFloat(bondPercentage) > 40;
  const isAggressive = parseFloat(mfPercentage) + parseFloat(sipPercentage) > 75;
  const hasGold = gold && gold.totalValue > 0;
  
  // Generate insights based on actual data
  const insights = [];
  
  // Insight 1: Diversification analysis
  if (isConservative) {
    insights.push(`Your portfolio is heavily weighted towards bonds (${bondPercentage}%) with only ${(parseFloat(mfPercentage) + parseFloat(sipPercentage)).toFixed(1)}% in equities. While this provides stability, consider gradually shifting to growth assets for better long-term returns.`);
  } else if (isAggressive) {
    insights.push(`Your portfolio shows aggressive growth focus with ${(parseFloat(mfPercentage) + parseFloat(sipPercentage)).toFixed(1)}% in equities (MF: ${mfPercentage}%, SIPs: ${sipPercentage}%). ${hasGold ? `Gold allocation (${goldPercentage}%) provides good hedge.` : 'Consider adding 5-10% gold for portfolio stability.'}`);
  } else {
    insights.push(`Well-balanced portfolio with bonds (${bondPercentage}%), mutual funds (${mfPercentage}%), and SIPs (${sipPercentage}%)${hasGold ? `, plus gold (${goldPercentage}%)` : ''}. This diversification spreads risk effectively across ${bonds.items.length + mutualFunds.items.length + sips.items.length}${hasGold ? ` + ${gold.items.length}` : ''} different investments.`);
  }
  
  // Insight 2: Performance analysis
  if (bestPerformer && worstPerformer) {
    insights.push(`Performance variance is significant: ${bestPerformer.name} leads with ${bestPerformer.returns.toFixed(1)}% returns, while ${worstPerformer.name} shows ${worstPerformer.returns.toFixed(1)}%. ${underperformingCount > 0 ? `${underperformingCount} investment(s) are below 8% threshold.` : 'All investments meeting performance targets.'}`);
  } else if (avgSipReturns > 0 || avgMFReturns > 0) {
    insights.push(`Average returns: ${avgMFReturns > 0 ? `Mutual Funds ${avgMFReturns}%` : ''}${avgSipReturns > 0 && avgMFReturns > 0 ? ', ' : ''}${avgSipReturns > 0 ? `SIPs ${avgSipReturns}%` : ''}. ${Math.max(avgSipReturns, avgMFReturns) > 12 ? 'Outperforming market benchmarks.' : Math.max(avgSipReturns, avgMFReturns) > 8 ? 'Meeting market expectations.' : 'Below market average - review needed.'}`);
  } else {
    insights.push(`Your portfolio contains ${bonds.items.length} bonds, ${mutualFunds.items.length} mutual funds, and ${sips.items.length} SIPs totaling ₹${(totalValue / 100000).toFixed(2)}L. Track performance regularly to ensure 10-15% annual growth targets are met.`);
  }
  
  // Insight 3: Savings & cash flow
  const overspentCategories = budget.categories.filter(c => c.spent > c.allocated);
  if (parseFloat(savingsRate) >= 40) {
    insights.push(`Exceptional savings rate of ${savingsRate}% (₹${(budget.monthlySavings / 1000).toFixed(0)}K monthly) enables aggressive wealth building. ${overspentCategories.length > 0 ? `Monitor ${overspentCategories.map(c => c.name).join(', ')} to maintain this rate.` : 'Consider increasing SIP contributions by ₹5-10K/month.'}`);
  } else if (parseFloat(savingsRate) >= 30) {
    insights.push(`Good savings discipline at ${savingsRate}% (₹${(budget.monthlySavings / 1000).toFixed(0)}K/month). ${overspentCategories.length > 0 ? `Cut ${overspentCategories[0].name} by ₹${((overspentCategories[0].spent - overspentCategories[0].allocated) / 1000).toFixed(0)}K to boost savings.` : 'Target 40% savings rate by reducing discretionary spending.'}`);
  } else {
    insights.push(`Savings rate of ${savingsRate}% needs improvement. Current ₹${(budget.monthlySavings / 1000).toFixed(0)}K/month limits wealth accumulation. ${overspentCategories.length > 0 ? `Priority: Reduce ${overspentCategories.map(c => c.name).join(', ')} overspending by ₹${(overspentCategories.reduce((sum, c) => sum + (c.spent - c.allocated), 0) / 1000).toFixed(0)}K.` : 'Aim for 30-40% savings rate.'}`);
  }
  
  // Generate tips based on specific portfolio needs
  const tips = [];
  
  // Tip 1: Rebalancing
  if (parseFloat(bondPercentage) > 35) {
    tips.push(`Your bonds are overweight at ${bondPercentage}% (ideal: 25-30%). Shift ₹${((bonds.totalValue - totalValue * 0.3) / 100000).toFixed(1)}L to equity mutual funds for better growth. Target allocation: Bonds 30%, Equity MF 40%, SIPs 25%, Gold 5%.`);
  } else if (parseFloat(bondPercentage) < 20 && !isAggressive) {
    tips.push(`Bonds at ${bondPercentage}% may not provide adequate stability. Add ₹${((totalValue * 0.25 - bonds.totalValue) / 100000).toFixed(1)}L in government/AAA-rated bonds for portfolio balance and consistent income stream.`);
  } else {
    tips.push(`Asset allocation is near optimal: Bonds ${bondPercentage}%, Equity ${(parseFloat(mfPercentage) + parseFloat(sipPercentage)).toFixed(1)}%. Maintain quarterly rebalancing. ${hasGold ? '' : 'Consider adding 5% gold for inflation hedge.'}`);
  }
  
  // Tip 2: Performance review
  if (underperformingCount > 0) {
    const underperformers = allInvestments.filter(i => i.returns < 8).map(i => i.name.split(' ').slice(0, 3).join(' '));
    tips.push(`${underperformingCount} investment(s) underperforming: ${underperformers[0]}${underperformers.length > 1 ? `, ${underperformers[1]}` : ''}. Review immediately. Consider switching to top-performing funds with 3-5 year track record of 12-15% returns.`);
  } else if (avgMFReturns < 10 || avgSipReturns < 10) {
    tips.push(`Average returns (MF: ${avgMFReturns}%, SIP: ${avgSipReturns}%) are below 10% target. Compare against Nifty 50 (12-13% historical). Focus on large-cap funds for stability and mid-cap for growth.`);
  } else {
    tips.push(`Strong performance with ${bestPerformer ? `${bestPerformer.name} at ${bestPerformer.returns.toFixed(1)}%` : `average returns above 10%`}. Continue current strategy. Review portfolio quarterly and rebalance if any asset class deviates >5% from target allocation.`);
  }
  
  // Tip 3: Budget/SIP optimization
  if (overspentCategories.length > 0) {
    const totalOverspend = overspentCategories.reduce((sum, c) => sum + (c.spent - c.allocated), 0);
    tips.push(`Budget alert: ${overspentCategories.map(c => `${c.name} (₹${((c.spent - c.allocated) / 1000).toFixed(0)}K over)`).join(', ')}. Set spending caps and redirect ₹${(totalOverspend / 1000).toFixed(0)}K to SIPs. Use 50-30-20 rule: 50% needs, 30% wants, 20% savings.`);
  } else if (parseFloat(savingsRate) >= 40) {
    const extraSavings = (budget.monthlySavings - budget.monthlyIncome * 0.35) / 1000;
    if (extraSavings > 5) {
      tips.push(`Surplus savings of ₹${extraSavings.toFixed(0)}K/month available. Start new SIP in Nifty Index Fund (₹5-10K) or increase existing SIPs by 20-25% to compound wealth faster. Target: ₹1Cr in 10-12 years.`);
    } else {
      tips.push(`Maintain excellent ${savingsRate}% savings rate. Set up auto-debit SIPs on salary day to ensure consistency. Consider step-up SIPs that increase 5-10% annually with salary increments.`);
    }
  } else {
    tips.push(`Boost savings from ${savingsRate}% to 35-40% by: 1) Cutting ${budget.categories.sort((a, b) => b.spent - a.spent)[0].name} by 20%, 2) Increasing income streams, 3) Auto-debiting ₹${((budget.monthlyIncome * 0.35 - budget.monthlySavings) / 1000).toFixed(0)}K more to savings on payday.`);
  }
  
  // Generate specific recommendations
  const recommendations = [
    {
      action: parseFloat(bondPercentage) > 35 ? 'Reduce Bond Exposure' : parseFloat(bondPercentage) < 20 ? 'Increase Bond Allocation' : 'Rebalance Bonds',
      from: `₹${(bonds.totalValue / 100000).toFixed(2)}L (${bondPercentage}%)`,
      to: `₹${(totalValue * 0.25 / 100000).toFixed(2)}L (25%)`,
      impact: parseFloat(bondPercentage) > 35 ? `Free up ₹${((bonds.totalValue - totalValue * 0.25) / 100000).toFixed(2)}L for growth assets` : parseFloat(bondPercentage) < 20 ? `Add ₹${((totalValue * 0.25 - bonds.totalValue) / 100000).toFixed(2)}L for stability` : 'Maintain current allocation'
    },
    {
      action: parseFloat(mfPercentage) < 35 ? 'Increase Equity Mutual Funds' : 'Optimize MF Portfolio',
      from: `₹${(mutualFunds.totalValue / 100000).toFixed(2)}L (${mfPercentage}%)`,
      to: `₹${(totalValue * 0.40 / 100000).toFixed(2)}L (40%)`,
      impact: parseFloat(mfPercentage) < 35 ? `Invest ₹${((totalValue * 0.40 - mutualFunds.totalValue) / 100000).toFixed(2)}L in large-cap funds` : `Review holdings, exit underperformers (<8%)`
    },
    {
      action: underperformingCount > 0 ? 'Exit Underperforming Assets' : parseFloat(sipPercentage) < 20 ? 'Increase SIP Contributions' : 'Start Step-Up SIPs',
      from: underperformingCount > 0 ? `${underperformingCount} low-return investment(s)` : `₹${(sips.items.reduce((sum, s) => sum + (s.monthlyAmount || 0), 0) / 1000).toFixed(0)}K/month`,
      to: underperformingCount > 0 ? `Switch to 12-15% return funds` : `₹${(sips.items.reduce((sum, s) => sum + (s.monthlyAmount || 0), 0) * 1.25 / 1000).toFixed(0)}K/month`,
      impact: underperformingCount > 0 ? `Improve returns by 5-7% annually` : `Reach ₹${((sips.items.reduce((sum, s) => sum + (s.monthlyAmount || 0), 0) * 1.25 * 12 * 15) / 100000).toFixed(0)}L in 15 years`
    }
  ];
  
  return {
    insights,
    tips,
    recommendations
  };
};

/**
 * Generate diversification analysis insights
 */
export const generateDiversificationInsights = async (portfolioData) => {
  try {
    const { diversification, totalValue } = portfolioData;
    
    const prompt = `As a financial advisor, analyze this portfolio diversification and provide specific recommendations:

Diversification Score: ${diversification.score}/10

Metrics:
${diversification.metrics.map(m => `- ${m.name}: ${m.score}/10 (${m.status})`).join('\n')}

Current Allocation:
${diversification.currentAllocation.map(a => `- ${a.category}: ${a.percentage.toFixed(1)}%`).join('\n')}

Recommended Allocation:
${diversification.recommendedAllocation.map(a => `- ${a.category}: ${a.percentage.toFixed(1)}%`).join('\n')}

Total Portfolio Value: ₹${(totalValue / 100000).toFixed(2)}L

Provide:
1. Three specific rebalancing actions with exact amounts
2. Two geographic diversification suggestions
3. One tax optimization tip

Format as JSON with keys: rebalancingActions, geographicSuggestions, taxTip`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return parseInsightsResponse(data.candidates[0].content.parts[0].text);
    
  } catch (error) {
    console.error('Error generating diversification insights:', error);
    return null;
  }
};

/**
 * Generate AI-powered budget rebalancing suggestions
 * @param {Array} budgets - Array of budget categories with allocated and spent amounts
 * @param {Object} options - Additional context like income, savings goals
 * @returns {Promise<Object>} AI-generated budget suggestions
 */
export const generateBudgetRebalanceSuggestions = async (budgets, options = {}) => {
  const { monthlyIncome = 21500, savingsGoal = 0.30 } = options;
  
  // Calculate current statistics
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const utilizationRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  
  // Identify problem areas
  const overspending = budgets.filter(b => {
    const pct = (b.spent / b.allocated) * 100;
    return pct > 90;
  });
  
  const underspending = budgets.filter(b => {
    const pct = (b.spent / b.allocated) * 100;
    return pct < 60 && b.allocated > 500;
  });
  
  const prompt = `You are an expert financial advisor for students/young professionals. Analyze this monthly budget and provide smart rebalancing recommendations:

CURRENT BUDGET OVERVIEW:
Monthly Income: ₹${monthlyIncome.toLocaleString('en-IN')}
Total Allocated: ₹${totalAllocated.toLocaleString('en-IN')}
Total Spent: ₹${totalSpent.toLocaleString('en-IN')}
Overall Utilization: ${utilizationRate.toFixed(1)}%
Savings Goal: ${(savingsGoal * 100).toFixed(0)}% of income

CATEGORY BREAKDOWN:
${budgets.map(b => {
  const pct = b.allocated > 0 ? (b.spent / b.allocated) * 100 : 0;
  const status = pct > 100 ? '🔴 OVERSPENT' : pct > 90 ? '🟡 NEAR LIMIT' : pct < 60 ? '🟢 UNDERSPENT' : '✅ ON TRACK';
  return `- ${b.category}: Allocated ₹${b.allocated.toLocaleString('en-IN')}, Spent ₹${b.spent.toLocaleString('en-IN')} (${pct.toFixed(0)}%) ${status}`;
}).join('\n')}

PROBLEM AREAS IDENTIFIED:
${overspending.length > 0 ? `Overspending in: ${overspending.map(b => b.category).join(', ')}` : 'No overspending detected'}
${underspending.length > 0 ? `Underspending in: ${underspending.map(b => b.category).join(', ')}` : 'All budgets being utilized'}

INSTRUCTIONS:
1. Analyze spending patterns and identify optimization opportunities
2. Suggest NEW budget allocations for categories that need adjustment
3. Ensure total budget stays within ₹${monthlyIncome.toLocaleString('en-IN')} (aim for ${(savingsGoal * 100).toFixed(0)}% savings)
4. Provide specific, actionable reasoning for each change
5. Focus on realistic, student-friendly adjustments

OUTPUT FORMAT (MUST BE VALID JSON):
{
  "suggestions": [
    {
      "category": "Category Name",
      "currentAllocated": current_amount_number,
      "suggestedAllocated": new_amount_number,
      "change": change_amount_number,
      "reason": "Brief explanation (30-50 words) of why this change makes financial sense"
    }
  ],
  "insights": {
    "summary": "Overall 2-3 sentence assessment of budget health",
    "topPriority": "Single most important action to take",
    "projectedSavings": estimated_monthly_savings_number
  }
}

IMPORTANT: Only suggest changes for categories that genuinely need adjustment. Return valid JSON only, no markdown formatting.`;

  // Try each endpoint until one works
  for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
    try {
      const GEMINI_API_URL = GEMINI_API_ENDPOINTS[i];
      console.log(`Trying Gemini API for budget analysis (endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length})`);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Budget AI endpoint ${i + 1} failed:`, errorText);
        
        if (i === GEMINI_API_ENDPOINTS.length - 1) {
          throw new Error(`All Gemini API endpoints failed`);
        }
        continue;
      }

      const data = await response.json();
      console.log('✅ Budget AI analysis successful');
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      return parseBudgetSuggestionsResponse(generatedText, budgets);
      
    } catch (error) {
      console.warn(`Budget AI endpoint ${i + 1} error:`, error.message);
      
      if (i === GEMINI_API_ENDPOINTS.length - 1) {
        console.error('All endpoints failed. Using fallback budget suggestions.');
        return getFallbackBudgetSuggestions(budgets, monthlyIncome, savingsGoal);
      }
    }
  }
  
  return getFallbackBudgetSuggestions(budgets, monthlyIncome, savingsGoal);
};

/**
 * Parse AI budget suggestions response
 */
const parseBudgetSuggestionsResponse = (text, originalBudgets) => {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON from the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        return {
          suggestions: parsed.suggestions.map(s => ({
            category: s.category,
            currentAllocated: s.currentAllocated || 0,
            suggestedAllocated: s.suggestedAllocated || 0,
            change: s.change || (s.suggestedAllocated - s.currentAllocated),
            reason: s.reason || 'AI-recommended adjustment'
          })),
          insights: parsed.insights || {
            summary: 'Budget analysis complete',
            topPriority: 'Monitor spending patterns',
            projectedSavings: 0
          }
        };
      }
    }
    
    throw new Error('Invalid JSON structure');
  } catch (error) {
    console.error('Error parsing budget AI response:', error);
    return getFallbackBudgetSuggestions(originalBudgets, 21500, 0.30);
  }
};

/**
 * Fallback budget suggestions when AI is unavailable
 */
const getFallbackBudgetSuggestions = (budgets, monthlyIncome, savingsGoal) => {
  const suggestions = [];
  let totalReallocation = 0;
  
  budgets.forEach(budget => {
    const utilizationPct = budget.allocated > 0 ? (budget.spent / budget.allocated) * 100 : 0;
    
    // Handle overspending categories
    if (utilizationPct > 95) {
      const increase = Math.round(budget.spent * 1.15 - budget.allocated);
      if (increase > 0) {
        suggestions.push({
          category: budget.category,
          currentAllocated: budget.allocated,
          suggestedAllocated: Math.round(budget.spent * 1.15),
          change: increase,
          reason: `Consistently exceeding budget (${utilizationPct.toFixed(0)}% used). Increase by 15% to prevent monthly overspending and reduce financial stress.`
        });
        totalReallocation += increase;
      }
    }
    
    // Handle underspending categories (reallocate savings)
    else if (utilizationPct < 55 && budget.allocated > 800) {
      const decrease = Math.round(budget.allocated * 0.15);
      if (decrease > 0) {
        suggestions.push({
          category: budget.category,
          currentAllocated: budget.allocated,
          suggestedAllocated: budget.allocated - decrease,
          change: -decrease,
          reason: `Only using ${utilizationPct.toFixed(0)}% of allocation. Reduce by 15% and redirect savings to emergency fund or high-priority categories.`
        });
        totalReallocation -= decrease;
      }
    }
    
    // Handle moderate overspending (85-95%)
    else if (utilizationPct >= 85 && utilizationPct <= 95) {
      const smallIncrease = Math.round(budget.allocated * 0.10);
      if (smallIncrease > 0) {
        suggestions.push({
          category: budget.category,
          currentAllocated: budget.allocated,
          suggestedAllocated: budget.allocated + smallIncrease,
          change: smallIncrease,
          reason: `Approaching budget limit (${utilizationPct.toFixed(0)}% used). Small 10% buffer prevents overspending while maintaining discipline.`
        });
        totalReallocation += smallIncrease;
      }
    }
  });
  
  // Calculate projected savings impact
  const currentSavings = monthlyIncome - budgets.reduce((sum, b) => sum + b.spent, 0);
  const projectedSavings = Math.max(0, currentSavings - totalReallocation);
  
  return {
    suggestions: suggestions.slice(0, 6), // Limit to 6 suggestions
    insights: {
      summary: `Budget analysis identified ${suggestions.length} optimization opportunities. Total reallocation: ${totalReallocation > 0 ? '+' : ''}₹${Math.abs(totalReallocation).toLocaleString('en-IN')}.`,
      topPriority: suggestions.length > 0 
        ? `${suggestions[0].change > 0 ? 'Increase' : 'Reduce'} ${suggestions[0].category} budget to match actual spending patterns`
        : 'Continue monitoring spending - budget is well-balanced',
      projectedSavings: projectedSavings
    }
  };
};

/**
 * Generate AI-powered budget distribution from total amount
 * @param {number} totalBudget - Total budget amount to distribute
 * @param {string} userType - User type (student, professional, family)
 * @returns {Promise<Object>} AI-generated budget distribution
 */
export const generateBudgetDistribution = async (totalBudget, userType = 'student') => {
  const prompt = `You are an expert financial advisor. A ${userType} has ₹${totalBudget.toLocaleString('en-IN')} monthly budget and needs help distributing it wisely across expense categories.

USER CONTEXT:
- User Type: ${userType === 'student' ? 'Student/College-goer' : userType === 'professional' ? 'Young Professional' : 'Family/Household'}
- Total Monthly Budget: ₹${totalBudget.toLocaleString('en-IN')}

DISTRIBUTION REQUIREMENTS:
1. Create 6-8 essential spending categories appropriate for ${userType}
2. Allocate specific amounts to each category
3. Follow the 50-30-20 rule: 50% Needs, 30% Wants, 20% Savings
4. Ensure total adds up to exactly ₹${totalBudget.toLocaleString('en-IN')}
5. Provide brief explanation for each allocation

CATEGORY EXAMPLES:
${userType === 'student' ? `
- Hostel/PG Rent (if applicable)
- Food & Dining
- Transportation/Commute
- Study Materials & Books
- Entertainment & Social
- Mobile & Internet
- Personal Care
- Savings/Emergency Fund` : userType === 'professional' ? `
- Rent/Housing
- Food & Groceries
- Transportation
- Utilities (Internet, Phone, etc.)
- Entertainment & Leisure
- Health & Fitness
- Savings & Investments
- Professional Development` : `
- Housing (Rent/EMI)
- Groceries & Food
- Utilities (Electric, Water, Gas)
- Transportation
- Healthcare
- Children's Education
- Entertainment & Family Time
- Savings & Emergency Fund`}

OUTPUT FORMAT (MUST BE VALID JSON):
{
  "totalBudget": ${totalBudget},
  "distribution": [
    {
      "category": "Category Name",
      "allocated": exact_amount_number,
      "percentage": percentage_of_total,
      "reason": "Brief 20-30 word explanation why this amount is allocated"
    }
  ],
  "breakdown": {
    "needs": needs_total_amount,
    "wants": wants_total_amount,
    "savings": savings_total_amount
  },
  "insights": {
    "summary": "2-3 sentence overview of the budget strategy",
    "savingsRate": percentage_allocated_to_savings
  }
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting. Ensure all amounts are whole numbers and sum to exactly ${totalBudget}.`;

  // Try each endpoint until one works
  for (let i = 0; i < GEMINI_API_ENDPOINTS.length; i++) {
    try {
      const GEMINI_API_URL = GEMINI_API_ENDPOINTS[i];
      console.log(`Trying Gemini API for budget distribution (endpoint ${i + 1}/${GEMINI_API_ENDPOINTS.length})`);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1500,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Budget distribution endpoint ${i + 1} failed:`, errorText);
        
        if (i === GEMINI_API_ENDPOINTS.length - 1) {
          throw new Error(`All Gemini API endpoints failed`);
        }
        continue;
      }

      const data = await response.json();
      console.log('✅ Budget distribution AI successful');
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Parse the JSON response
      return parseBudgetDistributionResponse(generatedText, totalBudget, userType);
      
    } catch (error) {
      console.warn(`Budget distribution endpoint ${i + 1} error:`, error.message);
      
      if (i === GEMINI_API_ENDPOINTS.length - 1) {
        console.error('All endpoints failed. Using fallback budget distribution.');
        return getFallbackBudgetDistribution(totalBudget, userType);
      }
    }
  }
  
  return getFallbackBudgetDistribution(totalBudget, userType);
};

/**
 * Parse AI budget distribution response
 */
const parseBudgetDistributionResponse = (text, totalBudget, userType) => {
  try {
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to extract JSON from the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the response
      if (parsed.distribution && Array.isArray(parsed.distribution)) {
        // Ensure total matches exactly
        const actualTotal = parsed.distribution.reduce((sum, d) => sum + (d.allocated || 0), 0);
        if (Math.abs(actualTotal - totalBudget) > 10) {
          console.warn('AI distribution total mismatch, using fallback');
          return getFallbackBudgetDistribution(totalBudget, userType);
        }
        
        return {
          totalBudget: totalBudget,
          distribution: parsed.distribution.map(d => ({
            category: d.category,
            allocated: Math.round(d.allocated || 0),
            percentage: d.percentage || ((d.allocated / totalBudget) * 100).toFixed(1),
            reason: d.reason || 'AI-recommended allocation'
          })),
          breakdown: parsed.breakdown || {
            needs: Math.round(totalBudget * 0.5),
            wants: Math.round(totalBudget * 0.3),
            savings: Math.round(totalBudget * 0.2)
          },
          insights: parsed.insights || {
            summary: 'Balanced budget following 50-30-20 rule',
            savingsRate: 20
          }
        };
      }
    }
    
    throw new Error('Invalid JSON structure');
  } catch (error) {
    console.error('Error parsing budget distribution AI response:', error);
    return getFallbackBudgetDistribution(totalBudget, userType);
  }
};

/**
 * Fallback budget distribution when AI is unavailable
 */
const getFallbackBudgetDistribution = (totalBudget, userType) => {
  const distribution = [];
  
  if (userType === 'student') {
    const allocations = [
      { category: 'Hostel/PG Rent', pct: 0.35, reason: 'Primary fixed expense - housing is essential for students living away from home' },
      { category: 'Food & Dining', pct: 0.20, reason: 'Balanced nutrition is crucial for health and academic performance' },
      { category: 'Transportation', pct: 0.08, reason: 'Covers daily commute to college, library, and essential errands' },
      { category: 'Study Materials', pct: 0.05, reason: 'Books, stationery, and online course subscriptions for learning' },
      { category: 'Entertainment', pct: 0.08, reason: 'Social activities, movies, and hobbies for work-life balance' },
      { category: 'Mobile & Internet', pct: 0.04, reason: 'Essential connectivity for classes, assignments, and communication' },
      { category: 'Personal Care', pct: 0.05, reason: 'Grooming, hygiene products, and occasional clothing needs' },
      { category: 'Savings', pct: 0.15, reason: 'Emergency fund and future investment building habit early' }
    ];
    
    allocations.forEach(a => {
      distribution.push({
        category: a.category,
        allocated: Math.round(totalBudget * a.pct),
        percentage: (a.pct * 100).toFixed(1),
        reason: a.reason
      });
    });
  } else if (userType === 'professional') {
    const allocations = [
      { category: 'Rent/Housing', pct: 0.30, reason: 'Comfortable living space close to workplace reduces stress and commute time' },
      { category: 'Food & Groceries', pct: 0.15, reason: 'Healthy home-cooked meals and occasional dining out for networking' },
      { category: 'Transportation', pct: 0.10, reason: 'Fuel, maintenance, or public transport for daily office commute' },
      { category: 'Utilities & Bills', pct: 0.08, reason: 'Electricity, water, internet, and mobile bills for household operation' },
      { category: 'Health & Fitness', pct: 0.07, reason: 'Gym membership, medical insurance, and wellness activities' },
      { category: 'Entertainment', pct: 0.08, reason: 'Movies, hobbies, weekend outings to maintain work-life balance' },
      { category: 'Professional Dev', pct: 0.05, reason: 'Courses, certifications, and skill upgrades for career growth' },
      { category: 'Savings & Investments', pct: 0.17, reason: 'Building wealth through SIPs, emergency fund, and retirement planning' }
    ];
    
    allocations.forEach(a => {
      distribution.push({
        category: a.category,
        allocated: Math.round(totalBudget * a.pct),
        percentage: (a.pct * 100).toFixed(1),
        reason: a.reason
      });
    });
  } else {
    const allocations = [
      { category: 'Housing (Rent/EMI)', pct: 0.30, reason: 'Stable home for family security and comfort' },
      { category: 'Groceries & Food', pct: 0.20, reason: 'Nutritious meals for entire family health and growth' },
      { category: 'Utilities', pct: 0.10, reason: 'Essential services - electricity, water, gas, internet for household' },
      { category: 'Transportation', pct: 0.08, reason: 'Family vehicle maintenance, fuel, or public transport costs' },
      { category: 'Healthcare', pct: 0.08, reason: 'Medical insurance, doctor visits, medicines for family wellness' },
      { category: 'Education', pct: 0.10, reason: 'School fees, tuition, books, and educational activities for children' },
      { category: 'Entertainment', pct: 0.06, reason: 'Family outings, vacations, and recreational activities for bonding' },
      { category: 'Savings', pct: 0.08, reason: 'Emergency fund, retirement, and children\'s future education corpus' }
    ];
    
    allocations.forEach(a => {
      distribution.push({
        category: a.category,
        allocated: Math.round(totalBudget * a.pct),
        percentage: (a.pct * 100).toFixed(1),
        reason: a.reason
      });
    });
  }
  
  // Adjust last item to ensure exact total
  const currentTotal = distribution.reduce((sum, d) => sum + d.allocated, 0);
  const diff = totalBudget - currentTotal;
  if (diff !== 0) {
    distribution[distribution.length - 1].allocated += diff;
  }
  
  const needs = distribution.slice(0, 4).reduce((sum, d) => sum + d.allocated, 0);
  const wants = distribution.slice(4, 6).reduce((sum, d) => sum + d.allocated, 0);
  const savings = distribution.slice(6).reduce((sum, d) => sum + d.allocated, 0);
  
  return {
    totalBudget,
    distribution,
    breakdown: { needs, wants, savings },
    insights: {
      summary: `Smart ${userType} budget following proven 50-30-20 financial rule. Prioritizes essentials while building savings habit.`,
      savingsRate: ((savings / totalBudget) * 100).toFixed(1)
    }
  };
};

export default {
  generatePortfolioInsights,
  generateDiversificationInsights,
  generateBudgetRebalanceSuggestions,
  generateBudgetDistribution
};
