// src/app/api/suggest-message/route.ts
export const runtime = "edge";

const OLLAMA_URL = "http://localhost:11434/api/generate";

const PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by '||'. These questions are for an anonymous social messaging platform, 
like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing 
instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 
'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

export async function POST(req: Request): Promise<Response> {
  try {
    // Call Ollama requesting a streaming response (many Ollama builds use `stream: true` to enable SSE)
    const upstream = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json",
      },
      body: JSON.stringify({
        model: "mistral",
        prompt: PROMPT,
        stream: true, // request streaming; behavior depends on Ollama server capabilities
      }),
    });

    if (!upstream.ok) {
      // If Ollama returned an error status, forward the error details
      const text = await upstream.text();
      return new Response(JSON.stringify({ error: "Ollama error", detail: text }), {
        status: upstream.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If upstream provides a streaming body (SSE / chunked), forward it as-is to the client.
    const upstreamBody = upstream.body;
    if (upstreamBody) {
      // We create a passthrough ReadableStream that pipes upstream chunks to the client.
      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstreamBody.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              // value is a Uint8Array chunk from upstream — forward it
              controller.enqueue(value);
            }
          } catch (err) {
            console.error("Error while reading upstream stream:", err);
            controller.error(err);
            return;
          } finally {
            controller.close();
            reader.releaseLock();
          }
        },
      });

      // Return streaming response (as event-stream so client can handle SSE-style chunks)
      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    // Fallback: upstream had no body (unlikely) — try to parse JSON and stream a single block
    const json = await upstream.json().catch(async () => {
      const txt = await upstream.text();
      return { response: txt };
    });

    const finalText = (json && (json.response || json.text || JSON.stringify(json))) ?? "No response";

    // Stream the final text as a single SSE-style chunk (so client still receives stream semantics)
    const fallbackStream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        controller.enqueue(encoder.encode(`data: ${finalText}\n\n`));
        controller.close();
      },
    });

    return new Response(fallbackStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in suggest-message stream:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}





























// // src/app/api/suggest-message/route.ts
// export const runtime = "edge";

// const OLLAMA_URL = "http://localhost:11434/api/generate";

// const DEFAULT_PROMPT = `Create a list of three open-ended and engaging questions formatted as a single string. 
// Each question should be separated by '||'. These questions are for an anonymous social messaging platform, 
// like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing 
// instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 
// 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. 
// Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

// type OllamaRaw =
//   | { response?: string; text?: string }
//   | { output?: Array<{ content?: string; text?: string }>; [k: string]: any }
//   | any;

// /** Best-effort extraction of textual result from common Ollama response shapes */
// function extractTextFromOllama(resp: OllamaRaw): string {
//   if (!resp) return "";

//   // 1) direct response or text
//   if (typeof resp.response === "string" && resp.response.trim()) return resp.response.trim();
//   if (typeof resp.text === "string" && resp.text.trim()) return resp.text.trim();

//   // 2) output array with content / text fields
//   if (Array.isArray(resp.output) && resp.output.length > 0) {
//     const parts = resp.output
//       .map((o) => {
//         if (!o) return "";
//         if (typeof o.content === "string" && o.content.trim()) return o.content.trim();
//         if (typeof o.text === "string" && o.text.trim()) return o.text.trim();
//         // fallback stringify small objects
//         if (typeof o === "string") return o;
//         try {
//           return JSON.stringify(o);
//         } catch {
//           return "";
//         }
//       })
//       .filter(Boolean);
//     if (parts.length > 0) return parts.join(" ").trim();
//   }

//   // 3) fallback to stringify entire response (last resort)
//   try {
//     const s = JSON.stringify(resp);
//     return s.length > 0 ? s : "";
//   } catch {
//     return "";
//   }
// }

// export async function POST(req: Request): Promise<Response> {
//   try {
//     // Allow caller to override model/prompt/max_tokens via POST body
//     const body = (await req.json().catch(() => ({}))) as {
//       model?: string;
//       prompt?: string;
//       max_tokens?: number;
//     };

//     const model = body.model ?? "mistral";
//     const prompt = (body.prompt ?? DEFAULT_PROMPT).trim();
//     const max_tokens = body.max_tokens ?? 512;

//     const upstream = await fetch(OLLAMA_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         model,
//         prompt,
//         max_tokens,
//         stream: false, // ensure non-streaming response
//       }),
//     });

//     if (!upstream.ok) {
//       const text = await upstream.text().catch(() => "Unable to read error body");
//       return new Response(
//         JSON.stringify({ success: false, error: "Ollama error", detail: text }),
//         { status: upstream.status || 502, headers: { "Content-Type": "application/json" } }
//       );
//     }

//     // Parse model response (best-effort; Ollama variants differ)
//     const json = await upstream.json().catch(async () => {
//       // if JSON parse fails, attempt plain text read
//       const txt = await upstream.text().catch(() => "");
//       return { response: txt || "" };
//     });

//     const questions = extractTextFromOllama(json) || "No text generated by model.";

//     return new Response(
//       JSON.stringify({
//         success: true,
//         questions, // parsed/clean string (e.g., "Q1||Q2||Q3")
//         modelResponse: json, // raw model response for debugging / display
//         modelUsed: model,
//       }),
//       { status: 200, headers: { "Content-Type": "application/json" } }
//     );
//   } catch (err: any) {
//     console.error("suggest-message error:", err);
//     return new Response(
//       JSON.stringify({ success: false, error: "Internal server error", detail: String(err?.message ?? err) }),
//       { status: 500, headers: { "Content-Type": "application/json" } }
//     );
//   }
// }




