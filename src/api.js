// ─────────────────────────────────────────────
// FREE Groq API setup:
// 1. Go to https://console.groq.com
// 2. Create API Key
// 3. Paste below
// ─────────────────────────────────────────────
const API_KEY = import.meta.env.VITE_GROQ_API;

export async function analyzeJobFit(jd, resume, role) {
  if (!API_KEY || API_KEY === "YOUR_GROQ_API_KEY") {
    throw new Error("NO_KEY");
  }

  const prompt = `You are a senior tech recruiter. Analyze the job fit for a "${role}" role.

JOB DESCRIPTION:
${jd}

CANDIDATE PROFILE:
${resume}

Reply ONLY with raw JSON. No markdown. No backticks. No explanation. Just the JSON object:
{
  "score": <integer 0-100>,
  "verdict": "<exactly one of: Strong Match, Good Potential, Needs Work, Poor Fit>",
  "summary": "<exactly 2 sentences, honest assessment>",
  "matchedKeywords": ["<keyword>", "<keyword>", "<keyword>"],
  "missingKeywords": ["<keyword>", "<keyword>", "<keyword>"],
  "strengths": ["<strength>", "<strength>", "<strength>"],
  "gaps": ["<gap>", "<gap>", "<gap>"],
  "resumeTweaks": [
    { "original": "<weak phrase from resume>", "improved": "<stronger rewrite>" },
    { "original": "<weak phrase from resume>", "improved": "<stronger rewrite>" },
    { "original": "<weak phrase from resume>", "improved": "<stronger rewrite>" }
  ],
  "coverLineHook": "<one powerful opening sentence for a cover letter tailored to this job>"
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant", // or llama3-70b-8192
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }

  const data = await res.json();

  const text = data.choices?.[0]?.message?.content;

  if (!text) throw new Error("Empty response from Groq");

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}