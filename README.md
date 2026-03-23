# JobFit AI 🎯

An AI-powered job application tracker that analyzes how well your resume matches a job description — giving you an instant fit score, keyword gaps, resume tweaks, and a tailored cover letter opener.

**Built with:** React · Vite · Groq AI (Llama 3.3) · CSS Modules

🔗 **Live Demo:** [jobfit-ai.vercel.app](https://jobfit-ai-dev.vercel.app/)

---

## Features

- **Fit Score (0–100)** — animated ring showing how well you match the job
- **Keyword Analysis** — matched vs missing keywords from the job description
- **Strengths & Gaps** — clear breakdown of what works and what doesn't
- **AI Resume Tweaks** — before/after rewrites to strengthen your resume
- **Cover Letter Opener** — one powerful tailored sentence, copy with one click
- **Save Applications** — stores up to 10 analyzed jobs locally in the browser

---

## Screenshots

> Paste a job description + your resume → get results in seconds

<img width="1919" height="909" alt="Screenshot 2026-03-23 091218" src="https://github.com/user-attachments/assets/d6fbac2e-a01e-49c7-a87b-1be9c640d145" />


---

## Tech Stack

| Tech | Purpose |
|------|---------|
| React 18 | UI components and state management |
| Vite | Fast build tool and dev server |
| Groq API (Llama 3.3-70b) | AI-powered job fit analysis |
| CSS Modules | Component-scoped styling |
| localStorage | Save analyzed applications |
| Google Fonts (Syne + DM Mono) | Typography |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/RAJASEKAR-01/jobfit_ai.git
cd jobfit_ai

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Add your Groq API key to .env
VITE_GROQ_API=your_groq_key_here

# 5. Start dev server
npm run dev

# 6. Open http://localhost:5173
```

---

## How to Use

1. Paste a **job description** into the first field
2. Paste your **resume or skills** into the second field
3. Enter the **target role** and optionally the company name
4. Click **"Analyze job fit →"**
5. Get your score, keyword gaps, and resume tweaks instantly
6. Hit **Save** to store the analysis for later comparison

---

## Deployment

This project is deployed on **Vercel**. To deploy your own:

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add environment variable:
   - `VITE_GROQ_API` = your Groq API key
4. Deploy → get a live URL

---

## Project Structure

```
jobfit-final/
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # All component styles
│   ├── ScoreRing.jsx    # Animated SVG score ring
│   ├── api.js           # Groq API integration
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles + animations
├── index.html
├── vite.config.js
└── package.json
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GROQ_API` | Your Groq API key from console.groq.com |

> Never commit your `.env` file — it is already in `.gitignore`

---

## What I Learned Building This

- Integrating AI APIs (Groq/Llama) into a React frontend
- Handling CORS and environment variables securely with Vite
- Building a real product UI with pure CSS (no Tailwind)
- Deploying a Vite app to Vercel with environment variable injection

---

## Author

**Rajasekar** — Junior Frontend Developer

- GitHub: [@RAJASEKAR-01](https://github.com/RAJASEKAR-01)
- LinkedIn: [your-linkedin-url](https://www.linkedin.com/in/rajasekar-developer)

---

## License

MIT — free to use and modify
