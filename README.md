# 🌿 EcoPulse AI

> Small habits. Big climate impact.

EcoPulse AI is a premium, AI-powered carbon footprint awareness platform built for Hackathon Challenge 3. It helps users understand their personal climate impact, track daily eco-habits, receive personalized recommendations, and stay motivated through a gamified experience.

## 🌟 Key Features

- **Smart Carbon Score:** A science-backed calculator utilizing DEFRA/IPCC emission factors to estimate your annual CO₂ footprint based on transport, energy, food, shopping, and waste habits.
- **AI Recommendations:** Curated, high-impact actions tailored to your specific lifestyle to help you reduce your footprint most efficiently.
- **Daily Habit Tracker:** Log eco-friendly actions (e.g., taking public transit, eating plant-based) and watch your carbon savings grow in real time.
- **Gamified Progress:** Earn Green Points, build streaks, level up from "Seedling" to "Earth Guardian", and unlock achievement badges to stay motivated.
- **Insights & Analytics:** Visualize your progress over time with interactive charts tracking your monthly CO₂ savings and category breakdowns.

## 🚀 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Framer Motion (for fluid micro-animations)
- **State Management:** Zustand (with localStorage persistence)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Testing:** Vitest

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecopulse-ai.git
   cd ecopulse-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Production Build

To build the app for production:
```bash
npm run build
```
To preview the production build:
```bash
npm run preview
```

## 🧪 Testing

Run the test suite (utility and calculation tests):
```bash
npm test
```

## 🔒 Security & Accessibility
- **Accessibility (a11y):** Full keyboard navigation, ARIA roles, semantic HTML, and strict adherence to WCAG AA color contrast guidelines.
- **Security:** Strict Content Security Policy (CSP) headers, secure local storage practices, and XSS protection built into the framework.

## 🏆 Hackathon Alignment
This project directly addresses **Challenge 3: Carbon Footprint Awareness** by providing an intuitive, polished, and real-world applicable tool that turns complex climate data into actionable, everyday steps for the user.

## 📄 License
This project is licensed under the MIT License.
