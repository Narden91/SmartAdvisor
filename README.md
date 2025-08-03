# 💰 Smart Advisor 🤖

Your personal financial suite for making smart money moves in Italy! This app combines an AI-powered loan advisor with a detailed net salary calculator to give you clear, actionable insights.

**🌐 Live Demo**: [https://Narden91.github.io/SmartAdvisor](https://Narden91.github.io/SmartAdvisor)

---

## ✨ Key Features

### 🤖 Consulente Finanziario AI (AI Financial Advisor)
- **Get Smart Advice:** Should you take out a loan or use your savings? Our AI advisor analyzes your financial situation to give you a clear recommendation.
- **In-depth Analysis:** Powered by Google's Gemini API, the analysis considers your investment portfolio, opportunity costs, and inflation.
- **Supports Multiple Products:** Get advice on personal loans (`Prestito`), financing (`Finanziaria`), and mortgages (`Mutuo`).

### 🇮🇹 Calcolatore Stipendio Netto (Net Salary Calculator)
- **From Gross to Net:** Easily calculate your monthly net salary based on your Gross Annual Salary (RAL).
- **Updated for 2025:** Uses the latest Italian tax regulations for accurate calculations.
- **Detailed Breakdown:** See exactly where your money goes, including INPS contributions, IRPEF, and regional/communal taxes.

### 📈 Analisi Comparativa (Comparative Analysis)
- **Visualize Your Decision:** Interactive charts help you compare the total cost of a loan against the potential earnings from your investments.
- **Clear Financial Picture:** Understand the true cost and opportunity of your financial choices at a glance.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI Model:** Google Gemini API (`gemini-2.5-flash`)
- **Charting:** Recharts
- **Deployment:** GitHub Pages with GitHub Actions

---

## 🚀 Getting Started

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Narden91/SmartAdvisor.git
   cd SmartAdvisor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and add your Gemini API key:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Deployment

This project is configured for automatic deployment to GitHub Pages.

---

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - Deploy to GitHub Pages (manual)

---

## 📁 Project Structure

```
SmartAdvisor/
├── components/          # React components
├── services/           # API services (Gemini AI, calculations)
├── .github/workflows/  # GitHub Actions for deployment
├── App.tsx            # Main application component
└── types.ts           # TypeScript type definitions
```

---

## 🔐 Security

- API keys are securely stored as GitHub Secrets
- Environment variables are properly handled for both development and production
- No sensitive data is committed to the repository

---

## 📄 License

This project is private and proprietary.

---

## 🤝 Contributing

This is a personal project. For suggestions or issues, please open an issue on GitHub.
