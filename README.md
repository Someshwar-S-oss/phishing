# Phishing Awareness Quiz

An interactive educational quiz application built with React to help users identify phishing attempts across various communication channels including emails, SMS, phone calls, and messaging apps.

## Features

- 10 realistic phishing and legitimate communication scenarios
- Multiple phishing types covered:
  - Email Phishing
  - Spear Phishing
  - SMS Phishing (Smishing)
  - Voice Phishing (Vishing)
  - Whaling Attacks
  - UPI Scams
  - Job Scams
- Immediate feedback with detailed explanations
- Progress tracking and final score
- Beautiful, responsive UI with Tailwind CSS
- Educational takeaways and security tips

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
phishing/
├── src/
│   ├── components/
│   │   └── PhishingQuiz.jsx    # Main quiz component
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles with Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Quiz Content

The quiz includes 10 carefully crafted scenarios based on real-world phishing attempts common in India:

1. Paytm KYC verification scam
2. Form 16 executable file phishing
3. IRCTC ticket SMS scam
4. Legitimate Amazon delivery notification
5. Aadhaar verification phone scam
6. CEO fraud/whaling attack
7. UPI reversal scam on WhatsApp
8. Legitimate Google security alert
9. Fake job offer scam
10. Legitimate bank transaction SMS

Each scenario includes:
- Realistic message content
- Correct answer (Phishing or Legitimate)
- Detailed explanation of red flags or legitimate indicators

## Educational Value

This quiz helps users learn to:
- Identify suspicious sender addresses and domains
- Recognize urgency and fear-based tactics
- Spot fake attachments and malicious links
- Understand proper verification procedures
- Distinguish between legitimate and fraudulent communications

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to contribute additional phishing scenarios or improvements to the quiz interface!
