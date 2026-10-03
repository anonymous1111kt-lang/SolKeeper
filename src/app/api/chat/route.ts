import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, tokenData } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is missing in .env.local' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // We strictly instruct Gemini to ONLY use the provided live data.
    const systemInstruction = `
      You are an expert Solana Web3 Security Analyst. 
      You are assisting a user who is analyzing a specific Solana token.
      
      CRITICAL RULE: You MUST base your answers strictly on the LIVE on-chain data provided below. 
      Do not hallucinate facts. Do not use outside knowledge regarding this specific token's price or history unless it is explicitly in the data. 
      If the user asks something not covered by the data, politely state that the data does not contain that information.
      Keep your answers concise, professional, and easy to understand.

      LIVE TOKEN DATA:
      ${JSON.stringify(tokenData, null, 2)}
    `;

    const fullPrompt = `${systemInstruction}\n\nUser Question: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error('Error in AI Chat:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate AI response' }, { status: 500 });
  }
}
