import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';

const InvestmentQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = [
    {
      id: 1,
      question: 'What is the primary purpose of diversification in an investment portfolio?',
      options: [
        'To maximize returns',
        'To minimize risk by spreading investments across different assets',
        'To avoid paying taxes',
        'To invest only in stocks'
      ],
      correctAnswer: 1,
      explanation: 'Diversification helps reduce risk by spreading investments across different asset classes, sectors, and geographic regions. This way, if one investment performs poorly, others may offset the losses.',
      category: 'Portfolio Management',
      difficulty: 'Easy'
    },
    {
      id: 2,
      question: 'What does SIP stand for in mutual funds?',
      options: [
        'Systematic Investment Plan',
        'Single Investment Portfolio',
        'Stock Investment Program',
        'Savings Investment Plan'
      ],
      correctAnswer: 0,
      explanation: 'SIP (Systematic Investment Plan) allows investors to invest a fixed amount regularly in mutual funds, helping in rupee cost averaging and disciplined investing.',
      category: 'Mutual Funds',
      difficulty: 'Easy'
    },
    {
      id: 3,
      question: 'What is the difference between stocks and bonds?',
      options: [
        'Stocks represent ownership, bonds represent debt',
        'Bonds are riskier than stocks',
        'Stocks always provide fixed returns',
        'There is no difference'
      ],
      correctAnswer: 0,
      explanation: 'Stocks represent ownership in a company (equity), while bonds represent a loan to a company or government (debt). Stocks generally have higher risk and potential returns than bonds.',
      category: 'Investment Basics',
      difficulty: 'Medium'
    },
    {
      id: 4,
      question: 'What is the 80C deduction limit for tax-saving investments in India?',
      options: [
        '₹50,000',
        '₹1,00,000',
        '₹1,50,000',
        '₹2,00,000'
      ],
      correctAnswer: 2,
      explanation: 'Section 80C of the Income Tax Act allows deductions up to ₹1,50,000 for various investments including ELSS, PPF, NSC, tax-saving FDs, and life insurance premiums.',
      category: 'Tax Planning',
      difficulty: 'Medium'
    },
    {
      id: 5,
      question: 'What is rupee cost averaging?',
      options: [
        'Buying stocks at the highest price',
        'Investing a fixed amount regularly regardless of market conditions',
        'Selling all investments at once',
        'Investing only when markets are high'
      ],
      correctAnswer: 1,
      explanation: 'Rupee cost averaging is an investment strategy where you invest a fixed amount regularly. This helps buy more units when prices are low and fewer when prices are high, averaging out the cost over time.',
      category: 'Investment Strategy',
      difficulty: 'Medium'
    },
    {
      id: 6,
      question: 'What is the difference between ELSS and regular mutual funds?',
      options: [
        'ELSS has a lock-in period of 3 years and offers tax deduction',
        'ELSS has no lock-in period',
        'Regular mutual funds offer tax deduction',
        'There is no difference'
      ],
      correctAnswer: 0,
      explanation: 'ELSS (Equity Linked Savings Scheme) has a mandatory lock-in period of 3 years and offers tax deduction under Section 80C up to ₹1.5 lakh, while regular mutual funds have no lock-in period.',
      category: 'Tax Planning',
      difficulty: 'Medium'
    },
    {
      id: 7,
      question: 'What does P/E ratio indicate?',
      options: [
        'Price to Earnings ratio - shows if a stock is overvalued or undervalued',
        'Profit to Expense ratio',
        'Price to Equity ratio',
        'Performance to Earnings ratio'
      ],
      correctAnswer: 0,
      explanation: 'P/E (Price-to-Earnings) ratio compares a company\'s stock price to its earnings per share. A lower P/E may indicate undervaluation, while a higher P/E may suggest overvaluation, though context matters.',
      category: 'Stock Analysis',
      difficulty: 'Hard'
    },
    {
      id: 8,
      question: 'What is the rule of 72?',
      options: [
        'A rule for calculating retirement age',
        'A formula to estimate how long it takes for an investment to double',
        'A tax calculation method',
        'A rule for portfolio allocation'
      ],
      correctAnswer: 1,
      explanation: 'The Rule of 72 is a simple formula: divide 72 by your annual interest rate to estimate how many years it will take for your investment to double. For example, at 8% return, it takes approximately 9 years (72/8) to double.',
      category: 'Financial Planning',
      difficulty: 'Hard'
    },
    {
      id: 9,
      question: 'What is an emergency fund?',
      options: [
        'Money invested in stocks',
        '3-6 months of expenses kept in liquid assets for unexpected situations',
        'Money for vacation',
        'Investment in mutual funds'
      ],
      correctAnswer: 1,
      explanation: 'An emergency fund is 3-6 months of living expenses kept in easily accessible, liquid accounts (like savings accounts) to cover unexpected expenses like medical emergencies, job loss, or major repairs.',
      category: 'Financial Planning',
      difficulty: 'Easy'
    },
    {
      id: 10,
      question: 'What is SEBI and what is its role?',
      options: [
        'SEBI (Securities and Exchange Board of India) regulates the securities market and protects investor interests',
        'SEBI is a stock exchange',
        'SEBI is a mutual fund company',
        'SEBI is a tax authority'
      ],
      correctAnswer: 0,
      explanation: 'SEBI (Securities and Exchange Board of India) is the regulatory body for the securities market in India. It protects investor interests, regulates stock exchanges, brokers, and mutual funds, and ensures fair practices in the market.',
      category: 'Regulatory',
      difficulty: 'Medium'
    },
    {
      id: 11,
      question: 'What is the difference between active and passive investing?',
      options: [
        'Active investing involves frequent trading, passive investing follows market indices',
        'Passive investing is riskier',
        'Active investing always beats the market',
        'There is no difference'
      ],
      correctAnswer: 0,
      explanation: 'Active investing involves fund managers making frequent trades to beat the market, while passive investing (like index funds) simply tracks market indices with lower fees and often similar or better long-term returns.',
      category: 'Investment Strategy',
      difficulty: 'Hard'
    }
  ];

  useEffect(() => {
    if (quizStarted && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleNext();
    }
  }, [timeLeft, quizStarted, showResult]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setShowResult(false);
    setAnsweredQuestions([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, {
      questionId: currentQuestion.id,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }]);

    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    handleStartQuiz();
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent! You\'re an investment expert!';
    if (percentage >= 60) return 'Good job! You have solid investment knowledge!';
    if (percentage >= 40) return 'Not bad! Keep learning to improve!';
    return 'Keep practicing! Investment knowledge comes with time!';
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl p-6 border-2 border-purple-100 dark:border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-4 lg:mb-0">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg">
            <Icon name="Brain" size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Investment Quiz</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Test your investment knowledge and learn as you go</p>
          </div>
        </div>
        {!quizStarted && (
          <button
            onClick={handleStartQuiz}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md"
          >
            <Icon name="Play" size={18} />
            <span>Start Quiz</span>
          </button>
        )}
      </div>

      {!quizStarted ? (
        /* Quiz Introduction */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Brain" size={48} className="text-violet-600 dark:text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Ready to Test Your Investment Knowledge?</h2>
              <p className="text-gray-600 dark:text-gray-400">Challenge yourself with {questions.length} questions covering various investment topics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="FileText" size={24} className="text-blue-600 dark:text-blue-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">{questions.length} Questions</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Covering investment basics, tax planning, portfolio management, and SEBI regulations</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Clock" size={24} className="text-emerald-600 dark:text-emerald-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">30 Seconds</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Per question to keep you focused and test quick thinking</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Trophy" size={24} className="text-amber-600 dark:text-amber-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Learn & Improve</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detailed explanations for each answer to enhance your knowledge</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-violet-200 dark:border-violet-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Topics Covered:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Portfolio Management', 'Mutual Funds', 'Tax Planning', 'Investment Basics', 'Stock Analysis', 'Financial Planning', 'Investment Strategy', 'SEBI & Regulatory'].map((topic, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Icon name="CheckCircle" size={16} className="text-violet-600 dark:text-violet-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : showResult ? (
        /* Results Screen */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 ${
                (score / questions.length) * 100 >= 80 ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                (score / questions.length) * 100 >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <Icon 
                  name={(score / questions.length) * 100 >= 80 ? "Trophy" : "Target"} 
                  size={64} 
                  className={
                    (score / questions.length) * 100 >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                    (score / questions.length) * 100 >= 60 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  }
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h2>
              <p className={`text-xl font-bold mb-2 ${getScoreColor()}`}>
                {score} / {questions.length} Correct
              </p>
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                {getScoreMessage()}
              </p>
              <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Score: {Math.round((score / questions.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Question Review</h3>
              {questions.map((q, index) => {
                const answer = answeredQuestions.find(a => a.questionId === q.id);
                const isCorrect = answer?.isCorrect;
                return (
                  <div 
                    key={q.id} 
                    className={`p-4 rounded-xl border-2 ${
                      isCorrect 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 dark:text-white">Q{index + 1}:</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{q.question}</span>
                      </div>
                      {isCorrect ? (
                        <Icon name="CheckCircle" size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Icon name="XCircle" size={20} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="ml-6 space-y-1">
                      <p className={`text-sm ${
                        answer?.selectedAnswer === q.correctAnswer 
                          ? 'text-emerald-700 dark:text-emerald-400 font-semibold' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        ✓ Your answer: {q.options[answer?.selectedAnswer]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold">
                          ✓ Correct answer: {q.options[q.correctAnswer]}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                        💡 {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleRestart}
                className="flex-1 px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Icon name="RotateCcw" size={18} />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Quiz Question Screen */
        <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 py-4 border-b-2 border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md">
                  <Icon name="Brain" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{currentQuestion.category} • {currentQuestion.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Icon name="Clock" size={16} className="text-amber-600" />
                    <span className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      {timeLeft}s
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Score: </span>
                  <span className="text-sm font-bold text-emerald-600">{score}</span>
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="p-8">
            {/* Question */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = showExplanation && isCorrect;
                  const showIncorrect = showExplanation && isSelected && !isCorrect;

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        showCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-600'
                          : showIncorrect
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-600'
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      } ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:shadow-md'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                            showCorrect
                              ? 'bg-emerald-600 text-white'
                              : showIncorrect
                              ? 'bg-red-600 text-white'
                              : isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                        </div>
                        {showCorrect && (
                          <Icon name="CheckCircle" size={24} className="text-emerald-600 dark:text-emerald-400" />
                        )}
                        {showIncorrect && (
                          <Icon name="XCircle" size={24} className="text-red-600 dark:text-red-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Icon name="Lightbulb" size={24} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Explanation</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                className="w-full px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    <span>Next Question</span>
                    <Icon name="ArrowRight" size={18} />
                  </>
                ) : (
                  <>
                    <span>View Results</span>
                    <Icon name="Trophy" size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentQuiz;

