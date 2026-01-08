import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const initializeGemini = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Use 2.0-flash for Vision support
};

export const getApiKey = (): string | null => {
    return window.localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || null;
};

// Prompt for analyzing term sheets
const TERM_SHEET_PROMPT = `
You are an expert legal AI assistant for syndicated loans. 
Analyze the following term sheet (text or image) and extract key deal points.
Return ONLY a valid JSON object (no markdown formatting, no extra text) with the following structure:
{
  "borrower": "Name of borrower",
  "amount": "Loan amount",
  "currency": "USD/EUR/GBP",
  "type": "New Deal/Refinancing",
  "summary": "A 2-sentence summary of the deal structure and key covenants."
}

Term Sheet Content:
`;

export const analyzeTermSheet = async (text: string) => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const result = await model.generateContent(TERM_SHEET_PROMPT + text);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
    }
};

export const analyzeTermSheetImage = async (base64Image: string, mimeType: string) => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            }
        };

        const result = await model.generateContent([TERM_SHEET_PROMPT, imagePart]);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Vision Error:", error);
        throw error;
    }
};

// Prompt for negotiation resolution
const NEGOTIATION_PROMPT = `
You are a senior banking arbitrator. Three banks have conflicting positions on a syndicated loan covenant.
Bank A: {bankA_pos}
Bank B: {bankB_pos}
Bank C: {bankC_pos}
Market Median: {market_median}

Propose a compromise that is fair, market-standard, and likely to be accepted by all parties. 
Keep it concise (under 100 words). Format as:
"Recommendation: [Value]"
"Rationale: [One sentence explanation]"
`;

export const resolveConflict = async (positions: any) => {
    if (!model) throw new Error("Gemini not initialized");

    const prompt = NEGOTIATION_PROMPT
        .replace('{bankA_pos}', positions.bankA)
        .replace('{bankB_pos}', positions.bankB)
        .replace('{bankC_pos}', positions.bankC)
        .replace('{market_median}', positions.median);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Resolution Error:", error);
        throw error;
    }
};
