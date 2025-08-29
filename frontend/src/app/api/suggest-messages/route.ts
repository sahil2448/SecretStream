// app/api/suggest-messages/route.ts
import { NextResponse } from 'next/server';

const PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by '||'. These questions are for an anonymous social messaging platform, 
like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing 
instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 
'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'mistral:latest';

function extractSuggestionsFromText(raw: string): string[] {
  if (!raw) return [];
  let text = raw.trim();

  // Remove surrounding quotes if present (safe unescape)
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    try { text = JSON.parse(text); } catch { text = text.slice(1, -1); }
  }

  // split on the requested separator first
  if (text.includes('||')) {
    return text.split(/\s*\|\|\s*/).map(s => s.trim()).filter(Boolean).slice(0, 3);
  }

  // try to find a JSON array in the text
  const arrMatch = text.match(/\[.*?\]/s);
  if (arrMatch) {
    try {
      const arr = JSON.parse(arrMatch[0]);
      if (Array.isArray(arr)) return arr.map(String).slice(0, 3);
    } catch {}
  }

  // try parsing the whole thing as JSON { suggestions: [...] } or similar
  try {
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.map(String).slice(0, 3);
    }
  } catch {}

  // split by lines or bulletin points as a fallback
  const lines = text.split(/\r?\n+/).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean);
  if (lines.length >= 3) return lines.slice(0, 3);

  // final fallback: return the whole string as one item
  return text ? [text] : [];
}

export async function POST(req: Request) {
  try {
    const { username = 'friend' } = (await req.json().catch(() => ({}))) as { username?: string };

    const prompt = `${PROMPT}\n\nTarget username (for tone): @${username}\n\nReturn only the single string of three questions separated by '||'.`;

    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        max_tokens: 150,
        temperature: 0.6,
        stream: false,
      }),
    });

    const rawText = await res.text().catch(() => '');

    if (!res.ok) {
      console.error('Ollama returned error:', res.status, rawText);
      return NextResponse.json({ suggestions: [], error: `Ollama error: ${res.status} ${rawText}` }, { status: 502 });
    }

    // Try parse as JSON object (likely shape: { model:..., response: "...", ... })
    let suggestions: string[] = [];
    try {
      const parsed = JSON.parse(rawText);
      // Ollama commonly uses "response" field for the generated text
      let candidate: any = parsed.suggestions ?? parsed.response ?? parsed.output ?? parsed.message ?? parsed.result ?? null;

      // if output is an array of chunks, join contents
      if (Array.isArray(candidate) && candidate.length && typeof candidate[0] === 'object') {
        candidate = candidate.map((c: any) => c.content ?? c).join('');
      }

      // sometimes response is a quoted JSON string; normalize
      if (typeof candidate === 'string') {
        try { candidate = JSON.parse(candidate); } catch { /* keep as string */ }
      }

      if (Array.isArray(candidate)) {
        suggestions = candidate.map(String).slice(0, 3);
      } else if (typeof candidate === 'string') {
        suggestions = extractSuggestionsFromText(candidate);
      }
    } catch (e) {
      // not JSON — rawText may be plain string
      suggestions = extractSuggestionsFromText(rawText);
    }

    // Defensive extra split if needed
    if (suggestions.length === 1 && suggestions[0].includes('||')) {
      suggestions = suggestions[0].split(/\s*\|\|\s*/).map(s => s.trim()).filter(Boolean).slice(0, 3);
    }

    // Final fallback set so UI never breaks
    if (!suggestions.length) {
      suggestions = [
        "Hey — I just wanted to say you made me smile today.",
        "Curious — what's one hobby you can't stop talking about?",
        "If I had to guess, you're secretly great at something — care to share?"
      ];
    }

    suggestions = suggestions.map(s => s.trim()).filter(Boolean).slice(0, 3);

    return NextResponse.json({ suggestions });
  } catch (err: any) {
    console.error('suggest-messages route error:', err);
    return NextResponse.json({ suggestions: [], error: String(err) }, { status: 500 });
  }
}