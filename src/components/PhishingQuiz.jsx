import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle, XCircle, Mail, MessageSquare, Phone, Globe, Award, User, Building2, Calendar, Clock, MapPin, Smartphone, Play, Pause, Volume2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';

// Email scenario component
const EmailScenario = ({ scenario }) => {
  const lines = scenario.split('\n');
  const from = lines.find(l => l.startsWith('From:'))?.replace('From:', '').trim();
  const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim();
  const body = lines.slice(2).join('\n').trim();

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3 bg-blue-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">From: {from}</span>
            </div>
            <div className="text-xs font-semibold text-blue-700 mt-1">Subject: {subject}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-white rounded-lg p-4 border border-blue-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {body}
        </div>
      </CardContent>
    </Card>
  );
};

// SMS scenario component
const SMSScenario = ({ scenario }) => {
  const lines = scenario.split('\n').filter(l => l.trim());
  const sender = lines[0].replace('Text Message from:', '').trim();
  const message = lines.slice(1).join('\n').trim().replace(/^'|'$/g, '');

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white max-w-md">
      <CardHeader className="pb-3 bg-green-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500 rounded-lg">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-green-900">{sender}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Smartphone className="w-3 h-3" />
              <span>SMS Message</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-green-500 text-white rounded-2xl rounded-tl-sm p-4 shadow-md">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          <div className="text-xs mt-2 opacity-75 text-right">Just now</div>
        </div>
      </CardContent>
    </Card>
  );
};

// Phone call scenario component
const PhoneScenario = ({ scenario, audioFile }) => {
  const lines = scenario.split('\n').filter(l => l.trim());
  const content = lines.slice(1).join('\n').trim().replace(/^'|'$/g, '');
  
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
      <CardHeader className="pb-3 bg-purple-100/50">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500 rounded-full animate-pulse">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-purple-900">Incoming Call</div>
            <div className="flex items-center gap-2 text-sm text-purple-600">
              <Clock className="w-4 h-4" />
              <span>Call in progress...</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Audio Player */}
        {audioFile && (
          <div className="bg-purple-100 rounded-lg p-4 space-y-3">
            <audio ref={audioRef} src={audioFile} preload="metadata" />
            
            <div className="flex items-center gap-3">
              <Button
                onClick={togglePlay}
                size="icon"
                className="bg-purple-600 hover:bg-purple-700 rounded-full h-12 w-12 flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </Button>
              
              <div className="flex-1 space-y-1">
                <div className="relative h-2 bg-purple-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute h-full bg-purple-600 transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-purple-700">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <Volume2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            </div>
            
            <div className="flex items-center gap-2 text-xs text-purple-700">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span>Listen to the caller's voice</span>
            </div>
          </div>
        )}
        
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-start gap-2 mb-2">
            <User className="w-5 h-5 text-purple-600 mt-1" />
            <div className="text-sm font-semibold text-purple-900">Caller says:</div>
          </div>
          <p className="text-sm text-gray-700 italic leading-relaxed pl-7 whitespace-pre-wrap">"{content}"</p>
        </div>
      </CardContent>
    </Card>
  );
};

// WhatsApp/Messaging scenario component
const WhatsAppScenario = ({ scenario }) => {
  const lines = scenario.split('\n').filter(l => l.trim());
  const sender = lines[0].replace('WhatsApp Message from unknown number:', '').trim();
  const message = lines.slice(1).join('\n').trim().replace(/^'|'$/g, '');

  return (
    <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
      <CardHeader className="pb-3 bg-emerald-500">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-white" />
          <div className="text-sm font-semibold text-white">WhatsApp</div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 bg-[#e5ddd5] min-h-[200px]">
        <div className="mb-2">
          <div className="inline-block bg-white rounded-lg rounded-tl-none p-3 shadow max-w-[85%]">
            <div className="text-xs font-semibold text-emerald-700 mb-1">Unknown Number</div>
            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{message}</p>
            <div className="text-xs text-gray-500 mt-1 text-right">10:23 AM</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Generic/Web scenario component
const WebScenario = ({ scenario }) => {
  const lines = scenario.split('\n');
  const from = lines.find(l => l.startsWith('From:'))?.replace('From:', '').trim();
  const subject = lines.find(l => l.startsWith('Subject:'))?.replace('Subject:', '').trim();
  const body = lines.slice(2).join('\n').trim();

  return (
    <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
      <CardHeader className="pb-3 bg-indigo-100/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-900">From: {from}</span>
            </div>
            <div className="text-xs font-semibold text-indigo-700 mt-1">Subject: {subject}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="bg-white rounded-lg p-4 border border-indigo-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
          {body}
        </div>
      </CardContent>
    </Card>
  );
};

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
      component: EmailScenario,
      scenario: "From: security@paytm-verify.in\nSubject: KYC Verification Required - Account Will Be Blocked\n\nDear Paytm User,\n\nAs per RBI guidelines, your Paytm wallet will be blocked within 24 hours if you don't complete KYC verification immediately.\n\nYour wallet balance: ₹8,450\n\nClick here to verify now: http://paytm-kyc-update.com/verify\n\nFailure to verify will result in permanent account suspension.\n\nRegards,\nPaytm Support Team",
      isPhishing: true,
      explanation: "This is PHISHING. Red flags: (1) Domain is 'paytm-verify.in' not 'paytm.com', (2) Suspicious external URL, (3) Creates urgency with threats of blocking, (4) Legitimate KYC is done through official Paytm app, not email links, (5) Shows wallet balance to create fear. Always verify KYC requests through the official app only."
    },
    {
      id: 2,
      type: "Spear Phishing",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: hr@yourcompany.co.in\nSubject: Updated Form 16 - FY 2024-25\n\nHi [Your Name],\n\nPlease find attached your updated Form 16 for the financial year 2024-25. There were some corrections made to your TDS calculations.\n\nDownload Form 16: Form16_FY2024-25.pdf.exe\n\nIf you have any queries regarding your tax deductions, please let me know.\n\nThanks,\nPreeti Sharma\nHR Department",
      isPhishing: true,
      explanation: "This is PHISHING (Spear Phishing). Red flags: (1) File has double extension '.pdf.exe' - it's an executable disguised as PDF, (2) Form 16 is usually provided through official HR portals or legitimate email attachments, (3) Real PDFs don't need .exe extension, (4) Always verify with HR department directly through phone or internal communication system before downloading tax documents."
    },
    {
      id: 3,
      type: "SMS Phishing (Smishing)",
      icon: MessageSquare,
      component: SMSScenario,
      scenario: "Text Message from: VD-INDIANRAILWAY\n\n'Your PNR 8234567890 booking is confirmed. Download e-ticket:\nhttp://irctc-eticket.in/pnr/8234567890\n\nTrain: 12345 Rajdhani Express\nDate: 28-Oct-2025\n\nIRCTC'\n\n[You recently booked a train ticket]",
      isPhishing: true,
      explanation: "This is PHISHING (Smishing). Red flags: (1) Sender ID looks official but URL is suspicious 'irctc-eticket.in' not 'irctc.co.in', (2) IRCTC sends tickets to your registered email, not SMS links, (3) Legitimate tickets are downloaded from official IRCTC app/website only. Even if you booked a ticket, always download e-tickets from irctc.co.in or the official app."
    },
    {
      id: 4,
      type: "Legitimate Email",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: no-reply@amazon.in\nSubject: Your Amazon.in order is arriving today\n\nNamaste,\n\nYour order #407-3456789-1234567 is out for delivery today!\n\nExpected delivery: By 9:00 PM today\n\nItems in this shipment:\n- boAt Rockerz 450 Bluetooth Headphone - ₹1,299\n\nTrack your order in the Amazon app or website.\n\nNote: Our delivery partner will NOT ask for OTP for regular deliveries.\n\nAmazon.in",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From actual amazon.in domain, (2) Contains specific order number in Amazon's format, (3) Doesn't request personal information or payment, (4) Correctly mentions OTP policy, (5) Professional formatting. You can verify by logging into amazon.in directly (not clicking links) to check your orders."
    },
    {
      id: 5,
      type: "Voice Phishing (Vishing)",
      icon: Phone,
      component: PhoneScenario,
      audioFile: "/src/context/aadhar-scam.mp3",
      scenario: "Phone Call:\n\n'Hello, I am calling from Aadhaar Verification Center, Bangalore. Your Aadhaar card has been used for suspicious activities in multiple states. We need to verify your details immediately.\n\nPlease share your 12-digit Aadhaar number and OTP that you will receive shortly to avoid legal action. Your Aadhaar will be deactivated in 2 hours.'\n\n[Caller sounds official]",
      isPhishing: true,
      explanation: "This is PHISHING (Vishing). Red flags: (1) UIDAI never calls asking for Aadhaar details, (2) Aadhaar cannot be 'deactivated' over phone, (3) Never share Aadhaar number or OTP with anyone, (4) Creates fear with threats of legal action, (5) Government agencies don't make such calls. UIDAI only communicates through official website or registered email/post."
    },
    {
      id: 6,
      type: "Whaling Attack",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: md@company-group.in\nTo: finance@yourcompany.in\nSubject: Urgent Payment - Supplier Invoice\n\nDear Accounts Team,\n\nI'm in a meeting with the board right now. Please process this urgent vendor payment immediately for our Diwali bonus procurement.\n\nAmount: ₹12,50,000\nAccount Name: Sharma Enterprises\nIFSC: SBIN0012345\nAccount: 1234567890\n\nThis is confidential. Process immediately and confirm. Don't discuss with anyone as negotiations are ongoing.\n\nThanks,\nRajesh Kumar\nManaging Director",
      isPhishing: true,
      explanation: "This is PHISHING (Whaling/CEO Fraud). Red flags: (1) Domain is 'company-group.in' instead of actual company domain, (2) Large financial transaction requested via email, (3) Creates urgency with board meeting excuse, (4) Demands secrecy, (5) Uses common Indian name to sound authentic. Always verify large payments through known phone numbers and proper approval workflow, never just email."
    },
    {
      id: 7,
      type: "UPI Scam",
      icon: MessageSquare,
      component: WhatsAppScenario,
      scenario: "WhatsApp Message from unknown number:\n\n'Hello sir, I am sending you ₹500 by mistake. Please return the money. I will send you a payment request, please accept it to return my money.\n\nMy UPI ID: scammer@paytm\n\nPlease help sir, it's my salary money 🙏'\n\n[Shows screenshot of a pending transaction]",
      isPhishing: true,
      explanation: "This is PHISHING (UPI Scam). Red flags: (1) Classic UPI reversal scam - they want YOU to accept a payment REQUEST (which means YOU pay THEM), (2) Strangers messaging on WhatsApp about money, (3) Payment requests are NOT reversals, (4) Creates emotional pressure with 'salary money', (5) Shows fake screenshots. Never accept payment requests from unknown numbers. If someone sends you money by mistake, they should request it back through proper bank channels."
    },
    {
      id: 8,
      type: "Legitimate Security Alert",
      icon: Globe,
      component: WebScenario,
      scenario: "From: no-reply@accounts.google.com\nSubject: Security alert\n\nHello [Your Name],\n\nWe noticed a new sign-in to your Google Account on an Android device.\n\nDate: 24 October 2025, 2:30 PM IST\nLocation: Mumbai, Maharashtra\nDevice: Android 13, Chrome\n\nIf this was you, you don't need to do anything.\n\nIf this wasn't you, secure your account immediately by visiting google.com/account\n\nThis email was sent to help keep your account secure.",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From actual accounts.google.com domain, (2) Provides specific details (time in IST, location, device), (3) Doesn't include clickable links demanding action, (4) Tells you to visit google.com manually, (5) Matches Google's actual security alert format. Always verify by going directly to google.com (typing in browser) to check your account activity."
    },
    {
      id: 9,
      type: "Job Scam",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: hr@infosys-careers.com\nSubject: Job Offer - Software Engineer\n\nDear Candidate,\n\nCongratulations! You have been selected for Software Engineer position at Infosys Limited.\n\nSalary: ₹8 LPA\nLocation: Bangalore\n\nTo confirm your joining, please pay registration fee of ₹5,000 for background verification and laptop security deposit.\n\nAccount Details:\nName: HR Services\nUPI: hrservices@paytm\n\nSend payment screenshot to confirm your position.\n\nRegards,\nInfosys HR Team",
      isPhishing: true,
      explanation: "This is PHISHING (Job Scam). Red flags: (1) Domain is 'infosys-careers.com' not official Infosys domain, (2) Legitimate companies NEVER ask for payment for job offers, (3) No interview process mentioned, (4) Requests UPI payment to personal account, (5) No official offer letter or joining details. Real companies bear all costs. Never pay money to get a job!"
    },
    {
      id: 10,
      type: "Legitimate Bank SMS",
      icon: MessageSquare,
      component: SMSScenario,
      scenario: "Text Message from: AX-HDFCBK\n\n'Dear Customer, Rs.2,500.00 debited from A/c XX1234 on 24-OCT-25 to Swiggy (UPI). Avl Bal: Rs.15,678.50. \n\nNot you? Call on number mentioned at back of your Debit Card. HDFC Bank'\n\n[You just ordered food on Swiggy]",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From official HDFC Bank sender ID format, (2) Shows partial account number (XX1234) not full number, (3) Mentions legitimate transaction you just made, (4) Asks you to call number on YOUR card (not providing a number), (5) Standard bank SMS format. If suspicious, call the bank number on your card or visit the bank, never call numbers provided in messages."
    },
    {
      id: 11,
      type: "Delivery Scam",
      icon: MessageSquare,
      component: SMSScenario,
      scenario: "Text Message from: +91-DTDC-DLV\n\n'Your parcel delivery failed. Redelivery charges Rs.50 required. Pay immediately to avoid return:\nhttp://dtdc-redelivery.co/pay/AB1234\n\nDTDC Courier'\n\n[You're not expecting any package]",
      isPhishing: true,
      explanation: "This is PHISHING (Delivery Scam). Red flags: (1) Sender ID looks suspicious with '+91-DTDC-DLV' format, (2) Fake domain 'dtdc-redelivery.co' not official dtdc.in, (3) Delivery companies don't charge for failed delivery via SMS links, (4) Creates urgency to make immediate payment, (5) You weren't expecting a package. Always verify delivery notifications through official courier apps or customer care numbers."
    },
    {
      id: 12,
      type: "Income Tax Refund Scam",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: refunds@incometax-india.org\nSubject: ITR Refund Processing - Claim Your ₹28,450 Refund\n\nDear Taxpayer,\n\nYour Income Tax Return for AY 2024-25 has been processed. You are eligible for a refund of ₹28,450.\n\nTo claim your refund, verify your bank details:\nClick here: http://itrefund-claim.in/verify\n\nRefund will be processed within 24 hours of verification.\n\nThis is an automated message from Income Tax Department.\n\nRegards,\nCentral Processing Centre, Bengaluru",
      isPhishing: true,
      explanation: "This is PHISHING (Tax Refund Scam). Red flags: (1) Domain is 'incometax-india.org' not official 'incometaxindia.gov.in', (2) Income Tax Department never asks to verify bank details via email links, (3) Refunds are auto-credited to registered bank account, no action needed, (4) Creates urgency with 24-hour timeline, (5) Suspicious external URL. Check refund status only on official incometaxindia.gov.in portal using your PAN login."
    },
    {
      id: 13,
      type: "LPG Subsidy Scam",
      icon: MessageSquare,
      component: SMSScenario,
      scenario: "Text Message from: HP-GAS\n\n'Dear Customer, Your LPG subsidy of Rs.1,200 is pending. Update Aadhaar to release subsidy:\nhttp://hpgas-subsidy.in/update\n\nConsumer No: 12345678\nHPGAS'\n\n[You use HP Gas cylinder]",
      isPhishing: true,
      explanation: "This is PHISHING (LPG Subsidy Scam). Red flags: (1) Fake URL 'hpgas-subsidy.in' instead of official hp.indianoil.in, (2) LPG companies never ask to update Aadhaar via SMS links, (3) Subsidies are auto-credited to bank accounts, (4) Genuine notifications come from HPCL official channels only, (5) Scammers use consumer numbers to appear legitimate. Update Aadhaar only through official distributor or IndianOil website."
    },
    {
      id: 14,
      type: "Legitimate OTP",
      icon: MessageSquare,
      component: SMSScenario,
      scenario: "Text Message from: VM-FLIPKART\n\n'123456 is your OTP to login to Flipkart. DO NOT share this OTP with anyone including Flipkart employees. Valid for 3 minutes. - Flipkart'\n\n[You just tried to login to Flipkart app]",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From official Flipkart sender ID 'VM-FLIPKART', (2) You just requested this OTP by trying to login, (3) Clearly warns not to share OTP with anyone, (4) Time-limited validity (3 minutes), (5) Standard OTP format. However, NEVER share OTPs with anyone. If you receive unexpected OTPs, someone may be trying to access your account - change your password immediately."
    },
    {
      id: 15,
      type: "Fake Prize/Lottery Scam",
      icon: Phone,
      component: PhoneScenario,
      audioFile: "/src/context/kbc-scam.mp3",
      scenario: "Phone Call:\n\n'Congratulations! This is calling from KBC head office, Mumbai. Your mobile number has won ₹25 lakh in Kaun Banega Crorepati lucky draw. To claim your prize, you need to pay processing fee of ₹5,000 and GST charges of ₹3,500.\n\nWe will guide you to make UPI payment now. Please note down our account details...'\n\n[You never participated in any KBC contest]",
      isPhishing: true,
      explanation: "This is PHISHING (Prize/Lottery Scam). Red flags: (1) You never participated in any KBC contest, (2) Legitimate prizes NEVER require payment of fees or taxes upfront, (3) KBC winners are selected on-air during show, not via random lucky draw, (4) Real prize money is paid after TDS deduction, not by asking you to pay first, (5) Demanding immediate UPI payment. Never pay money to claim a prize. It's always a scam!"
    },
    {
      id: 16,
      type: "Digital Arrest Scam",
      icon: Phone,
      component: PhoneScenario,
      audioFile: "/src/context/police-scam.mp3",
      scenario: "Phone Call:\n\n'This is Inspector Rajesh Kumar from Mumbai Cyber Crime. Your Aadhaar card is linked to a money laundering case. A parcel containing drugs has been sent from your name to Thailand.\n\nYou are under digital arrest. Do not disconnect this call or inform anyone. Keep your phone camera on for video investigation. If you disconnect, police team will come to arrest you within 2 hours.\n\nTo clear your name, you need to transfer all money from your accounts to a secure government RBI account for verification.'\n\n[Caller has official-sounding background noise]",
      isPhishing: true,
      explanation: "This is PHISHING (Digital Arrest Scam - very dangerous). Red flags: (1) 'Digital arrest' is NOT a real legal concept, (2) Police never conduct investigations over phone calls, (3) No law enforcement asks you to transfer money to 'clear your name', (4) Threats to not disconnect or inform anyone, (5) Creating panic with arrest threats, (6) Background noise can be fake. Immediately hang up! Real police issue formal summons in person or via registered post. This is a trending scam in India causing huge financial losses."
    },
    {
      id: 17,
      type: "Electricity Bill Scam",
      icon: MessageSquare,
      component: WhatsAppScenario,
      scenario: "WhatsApp Message from unknown number:\n\n'⚡ URGENT: Your electricity connection will be disconnected in 3 hours due to unpaid bill of ₹8,750.\n\nConsumer ID: 123456789\nDue Date: 20-Oct-2025\n\nPay now to avoid disconnection:\nhttp://pay-adani-electricity.com/bill\n\n- Adani Electricity Mumbai'\n\n[You pay bills regularly]",
      isPhishing: true,
      explanation: "This is PHISHING (Utility Bill Scam). Red flags: (1) Electricity companies don't send payment links via WhatsApp from unknown numbers, (2) Fake domain 'pay-adani-electricity.com', not official website, (3) Creates panic with 3-hour disconnection threat, (4) Genuine disconnection notices are sent via SMS from registered sender IDs or physical notices, (5) You regularly pay bills on time. Verify bills only through official apps (like Adani Electricity app) or customer care numbers, never through WhatsApp links."
    },
    {
      id: 18,
      type: "Legitimate Flight Booking",
      icon: Mail,
      component: EmailScenario,
      scenario: "From: booking@indigo.in\nSubject: Flight Booking Confirmation - PNR: ABC123\n\nDear Passenger,\n\nYour flight booking is confirmed!\n\nPNR: ABC123\nFlight: 6E-2345\nRoute: Mumbai → Delhi\nDate: 28 October 2025\nDeparture: 10:30 AM\n\nPassenger: KUMAR RAJESH\nSeat: 12A\nBooking Amount: ₹4,850\n\nWeb Check-in opens 48 hours before departure at goindigo.in\n\nHave a pleasant journey!\nIndiGo Airlines",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) From official IndiGo email domain 'booking@indigo.in', (2) You just booked this flight, (3) Contains valid booking details - PNR, flight number, passenger name, (4) Directs to official website goindigo.in for check-in, doesn't ask for payment or personal info, (5) Professional format matching IndiGo's style. You can verify booking on IndiGo website using PNR number. Save this email for travel reference."
    },
    {
      id: 19,
      type: "SIM Card Blocking Scam",
      icon: Phone,
      component: PhoneScenario,
      audioFile: "/src/context/airtel-scam.mp3",
      scenario: "Phone Call:\n\n'Hello, this is calling from Airtel customer care. Your SIM card is showing suspicious activity and will be blocked in 1 hour for security reasons.\n\nTo keep your number active, press 1 to connect with our verification department. You need to verify your Aadhaar number and provide OTP that will be sent to your number.\n\nPress 1 now or your number will be permanently disconnected.'\n\n[Automated voice message]",
      isPhishing: true,
      explanation: "This is PHISHING (SIM Blocking Scam). Red flags: (1) Telecom companies never call threatening to block SIM, (2) Automated message asking to 'press 1' is classic scam tactic, (3) Legitimate operators don't ask for Aadhaar or OTP over phone, (4) Creates urgency with 1-hour deadline, (5) SIM deactivation requires formal process with warnings. Real customer care never makes such calls. Hang up and call official Airtel customer care (121 from Airtel number) if concerned."
    },
    {
      id: 20,
      type: "Legitimate Bank Call",
      icon: Phone,
      component: PhoneScenario,
      audioFile: "/src/context/hdfc-legitimate.mp3",
      scenario: "Phone Call:\n\n'Hello, I am calling from HDFC Bank regarding your credit card application submitted last week. This is just a verification call.\n\nCan you please confirm your full name and date of birth for verification? We will NOT ask for your card number, PIN, CVV, or OTP.\n\nIf this is not a convenient time, you can also call us back on our official customer care number 1800-266-4332 which is printed on the back of your debit card.\n\nThank you.'\n\n[You did apply for a credit card last week]",
      isPhishing: false,
      explanation: "This is LEGITIMATE. Indicators: (1) You actually applied for a credit card recently, (2) Caller only asks for basic verification info (name, DOB), (3) Explicitly states they will NOT ask for sensitive info like PIN, CVV, OTP, (4) Provides official customer care number you can verify, (5) Offers option to call back on official number, (6) Professional and not pushy. However, always verify by calling the bank's official number yourself if you have any doubts. Never share OTP, PIN, or CVV even on calls you think are legitimate."
    },
    {
      id: 21,
      type: "Social Media Account Hack",
      icon: MessageSquare,
      component: WhatsAppScenario,
      scenario: "WhatsApp Message from unknown number:\n\n'Hi, this is Meta Security Team. Your Instagram account has been reported for violating community guidelines. Your account will be deleted in 24 hours.\n\nTo appeal and save your account, verify your identity:\n1. Click: http://instagram-appeal-verify.com\n2. Enter your username and password\n3. Enter OTP sent to your phone\n\nIf you don't verify, your account and all photos/videos will be permanently deleted.\n\n- Meta Platforms Inc.'\n\n[You haven't violated any rules]",
      isPhishing: true,
      explanation: "This is PHISHING (Social Media Account Scam). Red flags: (1) Meta/Instagram NEVER contacts via WhatsApp from unknown numbers, (2) Fake URL 'instagram-appeal-verify.com' designed to steal credentials, (3) Asking for password - Instagram never asks for your password, (4) Creates panic with account deletion threat, (5) Real Instagram notifications come through the app or from verified email (@instagram.com or @support.instagram.com). This scam steals your username, password, and OTP to hijack your account. Never enter credentials on external links. Check account status only within the Instagram app."
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-2">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <Award className="w-16 h-16 text-yellow-500" />
                </div>
              </div>
              <CardTitle className="text-4xl mb-2">Quiz Complete!</CardTitle>
              <CardDescription className="text-lg">Here's how you performed</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 border-0 text-white">
                <CardContent className="pt-6 text-center">
                  <div className="text-7xl font-bold mb-2">{percentage}%</div>
                  <div className="text-xl opacity-90">You scored {score} out of {questions.length}</div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-800">{getScoreMessage()}</p>
              </div>
              
              <Card className="bg-yellow-50 border-yellow-200 border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    Key Takeaways
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Always verify sender email addresses carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Hover over links before clicking to check destinations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Be suspicious of urgency, threats, or fear tactics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Verify requests through alternative channels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Never share sensitive information via email or text</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>When in doubt, contact the company directly using official channels</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
            
            <CardFooter className="justify-center pb-6">
              <Button onClick={resetQuiz} size="lg" className="px-8">
                Take Quiz Again
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const Icon = question.icon;
  const ScenarioComponent = question.component;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-2">
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl">Phishing Awareness Quiz</CardTitle>
              <Badge variant="secondary" className="text-base px-4 py-1">
                Question {currentQuestion + 1}/{questions.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2 bg-blue-400" />
          </CardHeader>

          {/* Content */}
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{question.type}</h2>
                <p className="text-sm text-gray-600">Analyze the scenario carefully</p>
              </div>
            </div>

            <ScenarioComponent scenario={question.scenario} audioFile={question.audioFile} />

            {!showResult ? (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  Is this phishing or legitimate?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    variant="destructive"
                    size="lg"
                    className="h-auto py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <AlertCircle className="w-5 h-5 mr-2" />
                    This is Phishing
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    size="lg"
                    className="h-auto py-6 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    This is Legitimate
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                {selectedAnswer === question.isPhishing ? (
                  <Card className="border-2 border-green-500 bg-green-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-full">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-green-800">Correct!</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-2 border-red-500 bg-red-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-500 rounded-full">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-red-800">Incorrect</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                    </CardContent>
                  </Card>
                )}

                <Button
                  onClick={handleNext}
                  size="lg"
                  className="w-full text-base font-semibold"
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
                </Button>
              </div>
            )}

            {/* Score Display */}
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">Current Score:</span> {score}/{currentQuestion + (showResult ? 1 : 0)}
                  </div>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {Math.round((score / (currentQuestion + (showResult ? 1 : 0)) || 0) * 100)}% Correct
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhishingQuiz;
