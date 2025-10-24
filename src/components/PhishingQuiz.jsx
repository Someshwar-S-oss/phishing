import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Mail, MessageSquare, Phone, Globe, Award } from 'lucide-react';

const PhishingQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = [
    {
      id: 1,
      type: "Email Phishing",
      icon: Mail,
      scenario: "From: security@paytm-verify.in\nSubject: KYC Verification Required - Account Will Be Blocked\n\nDear Paytm User,\n\nAs per RBI guidelines, your Paytm wallet will be blocked within 24 hours if you don't complete KYC verification immediately.\n\nYour wallet balance: ₹8,450\n\nClick here to verify now: http://paytm-kyc-update.com/verify\n\nFailure to verify will result in permanent account suspension.\n\nRegards,\nPaytm Support Team",
      isPhishing: true,
      explanation: "This is PHISHING. Red flags: (1) Domain is 'paytm-verify.in' not 'paytm.com', (2) Suspicious external URL, (3) Creates urgency with threats of blocking, (4) Legitimate KYC is done through official Paytm app, not email links, (5) Shows wallet balance to create fear. Always verify KYC requests through the official app only."
    },
    {
      id: 2,
      type: "Spear Phishing",
      icon: Mail,
      scenario: "From: hr@yourcompany.co.in\nSubject: Updated Form 16 - FY 2024-25\n\nHi [Your Name],\n\nPlease find attached your updated Form 16 for the financial year 2024-25. There were some corrections made to your TDS calculations.\n\nDownload Form 16: Form16_FY2024-25.pdf.exe\n\nIf you have any queries regarding your tax deductions, please let me know.\n\nThanks,\nPreeti Sharma\nHR Department",
      isPhishing: true,
      explanation: "This is PHISHING (Spear Phishing). Red flags: (1) File has double extension '.pdf.exe' - it's an executable disguised as PDF, (2) Form 16 is usually provided through official HR portals or legitimate email attachments, (3) Real PDFs don't need .exe extension, (4) Always verify with HR department directly through phone or internal communication system before downloading tax documents."
    },
    {
      id: 3,
      type: "SMS Phishing (Smishing)",
      icon: MessageSquare,
      scenario: "Text Message from: VD-INDIANRAILWAY\n\n'Your PNR 8234567890 booking is confirmed. Download e-ticket:\nhttp://irctc-eticket.in/pnr/8234567890\n\nTrain: 12345 Rajdhani Express\nDate: 28-Oct-2025\n\nIRCTC'\n\n[You recently booked a train ticket]",
      isPhishing: true,
      explanation: "This is PHISHING (Smishing). Red flags: (1) Sender ID looks official but URL is suspicious 'irctc-eticket.in' not 'irctc.co.in', (2) IRCTC sends tickets to your registered email, not SMS links, (3) Legitimate tickets are downloaded from official IRCTC app/website only. Even if you booked a ticket, always download e-tickets from irctc.co.in or the official app."
    },
    {
      id: 4,
      type: "Legitimate Email",
      icon: Mail,
      scenario: "From: no-reply@amazon.in\nSubject: Your Amazon.in order is arriving today\n\nNamaste,\n\nYour order #407-3456789-1234567 is out for delivery today!\n\nExpected delivery: By 9:00 PM today\n\nItems in this shipment:\n- boAt Rockerz 450 Bluetooth Headphone - ₹1,299\n\nTrack your order in the Amazon app or website.\n\nNote: Our delivery partner will NOT ask for OTP for regular deliveries.\n\nAmazon.in",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From actual amazon.in domain, (2) Contains specific order number in Amazon's format, (3) Doesn't request personal information or payment, (4) Correctly mentions OTP policy, (5) Professional formatting. You can verify by logging into amazon.in directly (not clicking links) to check your orders."
    },
    {
      id: 5,
      type: "Voice Phishing (Vishing)",
      icon: Phone,
      scenario: "Phone Call:\n\n'Hello, I am calling from Aadhaar Verification Center, Bangalore. Your Aadhaar card has been used for suspicious activities in multiple states. We need to verify your details immediately.\n\nPlease share your 12-digit Aadhaar number and OTP that you will receive shortly to avoid legal action. Your Aadhaar will be deactivated in 2 hours.'\n\n[Caller sounds official]",
      isPhishing: true,
      explanation: "This is PHISHING (Vishing). Red flags: (1) UIDAI never calls asking for Aadhaar details, (2) Aadhaar cannot be 'deactivated' over phone, (3) Never share Aadhaar number or OTP with anyone, (4) Creates fear with threats of legal action, (5) Government agencies don't make such calls. UIDAI only communicates through official website or registered email/post."
    },
    {
      id: 6,
      type: "Whaling Attack",
      icon: Mail,
      scenario: "From: md@company-group.in\nTo: finance@yourcompany.in\nSubject: Urgent Payment - Supplier Invoice\n\nDear Accounts Team,\n\nI'm in a meeting with the board right now. Please process this urgent vendor payment immediately for our Diwali bonus procurement.\n\nAmount: ₹12,50,000\nAccount Name: Sharma Enterprises\nIFSC: SBIN0012345\nAccount: 1234567890\n\nThis is confidential. Process immediately and confirm. Don't discuss with anyone as negotiations are ongoing.\n\nThanks,\nRajesh Kumar\nManaging Director",
      isPhishing: true,
      explanation: "This is PHISHING (Whaling/CEO Fraud). Red flags: (1) Domain is 'company-group.in' instead of actual company domain, (2) Large financial transaction requested via email, (3) Creates urgency with board meeting excuse, (4) Demands secrecy, (5) Uses common Indian name to sound authentic. Always verify large payments through known phone numbers and proper approval workflow, never just email."
    },
    {
      id: 7,
      type: "UPI Scam",
      icon: MessageSquare,
      scenario: "WhatsApp Message from unknown number:\n\n'Hello sir, I am sending you ₹500 by mistake. Please return the money. I will send you a payment request, please accept it to return my money.\n\nMy UPI ID: scammer@paytm\n\nPlease help sir, it's my salary money 🙏'\n\n[Shows screenshot of a pending transaction]",
      isPhishing: true,
      explanation: "This is PHISHING (UPI Scam). Red flags: (1) Classic UPI reversal scam - they want YOU to accept a payment REQUEST (which means YOU pay THEM), (2) Strangers messaging on WhatsApp about money, (3) Payment requests are NOT reversals, (4) Creates emotional pressure with 'salary money', (5) Shows fake screenshots. Never accept payment requests from unknown numbers. If someone sends you money by mistake, they should request it back through proper bank channels."
    },
    {
      id: 8,
      type: "Legitimate Security Alert",
      icon: Globe,
      scenario: "From: no-reply@accounts.google.com\nSubject: Security alert\n\nHello [Your Name],\n\nWe noticed a new sign-in to your Google Account on an Android device.\n\nDate: 24 October 2025, 2:30 PM IST\nLocation: Mumbai, Maharashtra\nDevice: Android 13, Chrome\n\nIf this was you, you don't need to do anything.\n\nIf this wasn't you, secure your account immediately by visiting google.com/account\n\nThis email was sent to help keep your account secure.",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From actual accounts.google.com domain, (2) Provides specific details (time in IST, location, device), (3) Doesn't include clickable links demanding action, (4) Tells you to visit google.com manually, (5) Matches Google's actual security alert format. Always verify by going directly to google.com (typing in browser) to check your account activity."
    },
    {
      id: 9,
      type: "Job Scam",
      icon: Mail,
      scenario: "From: hr@infosys-careers.com\nSubject: Job Offer - Software Engineer\n\nDear Candidate,\n\nCongratulations! You have been selected for Software Engineer position at Infosys Limited.\n\nSalary: ₹8 LPA\nLocation: Bangalore\n\nTo confirm your joining, please pay registration fee of ₹5,000 for background verification and laptop security deposit.\n\nAccount Details:\nName: HR Services\nUPI: hrservices@paytm\n\nSend payment screenshot to confirm your position.\n\nRegards,\nInfosys HR Team",
      isPhishing: true,
      explanation: "This is PHISHING (Job Scam). Red flags: (1) Domain is 'infosys-careers.com' not official Infosys domain, (2) Legitimate companies NEVER ask for payment for job offers, (3) No interview process mentioned, (4) Requests UPI payment to personal account, (5) No official offer letter or joining details. Real companies bear all costs. Never pay money to get a job!"
    },
    {
      id: 10,
      type: "Legitimate Bank SMS",
      icon: MessageSquare,
      scenario: "Text Message from: AX-HDFCBK\n\n'Dear Customer, Rs.2,500.00 debited from A/c XX1234 on 24-OCT-25 to Swiggy (UPI). Avl Bal: Rs.15,678.50. \n\nNot you? Call on number mentioned at back of your Debit Card. HDFC Bank'\n\n[You just ordered food on Swiggy]",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From official HDFC Bank sender ID format, (2) Shows partial account number (XX1234) not full number, (3) Mentions legitimate transaction you just made, (4) Asks you to call number on YOUR card (not providing a number), (5) Standard bank SMS format. If suspicious, call the bank number on your card or visit the bank, never call numbers provided in messages."
    }
  ];

  const handleAnswer = (answer) => {
    const correct = answer === questions[currentQuestion].isPhishing;
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You're a phishing expert! 🎉";
    if (percentage >= 80) return "Excellent! You can spot most phishing attempts! 👏";
    if (percentage >= 60) return "Good job! Keep practicing to improve! 👍";
    if (percentage >= 40) return "Not bad, but review the warning signs! 📚";
    return "Keep learning! Phishing can be tricky. 💪";
  };

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Award className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
            
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mb-6 text-white">
              <div className="text-6xl font-bold mb-2">{percentage}%</div>
              <div className="text-xl">You scored {score} out of {questions.length}</div>
            </div>
            
            <p className="text-xl text-gray-700 mb-8">{getScoreMessage()}</p>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">Key Takeaways:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Always verify sender email addresses carefully</li>
                <li>• Hover over links before clicking to check destinations</li>
                <li>• Be suspicious of urgency, threats, or fear tactics</li>
                <li>• Verify requests through alternative channels</li>
                <li>• Never share sensitive information via email or text</li>
                <li>• When in doubt, contact the company directly using official channels</li>
              </ul>
            </div>
            
            <button
              onClick={resetQuiz}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Take Quiz Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const Icon = question.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Phishing Awareness Quiz</h1>
              <div className="text-lg font-semibold">
                Question {currentQuestion + 1}/{questions.length}
              </div>
            </div>
            <div className="w-full bg-blue-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{question.type}</h2>
                <p className="text-sm text-gray-600">Analyze the scenario below</p>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
                {question.scenario}
              </pre>
            </div>

            {!showResult ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Is this phishing or legitimate?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-5 h-5" />
                    This is Phishing
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    This is Legitimate
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {selectedAnswer === question.isPhishing ? (
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-bold text-green-800">Correct!</h3>
                    </div>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                ) : (
                  <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-bold text-red-800">Incorrect</h3>
                    </div>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            )}

            {/* Score Display */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Current Score: {score}/{currentQuestion + (showResult ? 1 : 0)}</span>
                <span className="font-semibold">
                  {Math.round((score / (currentQuestion + (showResult ? 1 : 0)) || 0) * 100)}% Correct
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhishingQuiz;
