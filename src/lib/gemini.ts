// src/lib/gemini.ts
// Enhanced Gemini AI integration with RAG context and optimized prompts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ExtractedDealData, DEMO_DEAL_DATA } from "./pdf-generator";
import {
    TERM_SHEET_ANALYSIS_PROMPT,
    TERM_SHEET_VALIDATION_PROMPT,
    NEGOTIATION_RESOLUTION_PROMPT,
    CHATBOT_PROMPT,
    VOICE_COMMAND_PROMPT,
    buildChatbotContext,
    buildConflictContext,
    buildMarketContext
} from "./gemini-prompts";

let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const initializeGemini = (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

export const getApiKey = (): string | null => {
    return window.localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || null;
};

export const isGeminiInitialized = (): boolean => {
    return model !== null;
};

// ==================== DOCUMENT VALIDATION ====================

export interface ValidationResult {
    is_valid_term_sheet: boolean;
    confidence: number;
    detected_elements: string[];
    rejection_reason?: string;
    document_type: "term_sheet" | "other_financial" | "non_financial" | "unreadable";
}

/**
 * Validates if an image is a term sheet using Gemini Vision
 */
export const validateTermSheetImage = async (base64Image: string, mimeType: string): Promise<ValidationResult> => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            }
        };

        const result = await model.generateContent([TERM_SHEET_VALIDATION_PROMPT, imagePart]);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(responseText) as ValidationResult;
    } catch (error) {
        console.error("Gemini Validation Error:", error);
        return {
            is_valid_term_sheet: false,
            confidence: 0,
            detected_elements: [],
            rejection_reason: "Failed to analyze document. Please try again.",
            document_type: "unreadable"
        };
    }
};

/**
 * Validates if text content is a term sheet
 */
export const validateTermSheetText = async (text: string): Promise<ValidationResult> => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const result = await model.generateContent(TERM_SHEET_VALIDATION_PROMPT + text);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(responseText) as ValidationResult;
    } catch (error) {
        console.error("Gemini Validation Error:", error);
        return {
            is_valid_term_sheet: false,
            confidence: 0,
            detected_elements: [],
            rejection_reason: "Failed to analyze document. Please try again.",
            document_type: "unreadable"
        };
    }
};

// ==================== DATA EXTRACTION ====================

/**
 * Extracts deal data from a term sheet image using enhanced prompts
 */
export const extractTermSheetDataFromImage = async (base64Image: string, mimeType: string): Promise<ExtractedDealData> => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType
            }
        };

        const result = await model.generateContent([TERM_SHEET_ANALYSIS_PROMPT, imagePart]);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const parsed = JSON.parse(responseText) as ExtractedDealData;
        return mergeWithDefaults(parsed);
    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        return DEMO_DEAL_DATA;
    }
};

/**
 * Extracts deal data from term sheet text using enhanced prompts
 */
export const extractTermSheetDataFromText = async (text: string): Promise<ExtractedDealData> => {
    if (!model) throw new Error("Gemini not initialized");

    try {
        const result = await model.generateContent(TERM_SHEET_ANALYSIS_PROMPT + text);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        const parsed = JSON.parse(responseText) as ExtractedDealData;
        return mergeWithDefaults(parsed);
    } catch (error) {
        console.error("Gemini Extraction Error:", error);
        return DEMO_DEAL_DATA;
    }
};

/**
 * Merges extracted data with defaults for any missing fields
 */
function mergeWithDefaults(extracted: Partial<ExtractedDealData>): ExtractedDealData {
    return {
        borrower: {
            name: extracted.borrower?.name || DEMO_DEAL_DATA.borrower.name,
            industry: extracted.borrower?.industry || DEMO_DEAL_DATA.borrower.industry,
            headquarters: extracted.borrower?.headquarters || DEMO_DEAL_DATA.borrower.headquarters,
            credit_rating: extracted.borrower?.credit_rating || DEMO_DEAL_DATA.borrower.credit_rating,
            annual_revenue: extracted.borrower?.annual_revenue || DEMO_DEAL_DATA.borrower.annual_revenue,
            employees: extracted.borrower?.employees || DEMO_DEAL_DATA.borrower.employees,
        },
        facility: {
            amount: extracted.facility?.amount || DEMO_DEAL_DATA.facility.amount,
            currency: extracted.facility?.currency || DEMO_DEAL_DATA.facility.currency,
            type: extracted.facility?.type || DEMO_DEAL_DATA.facility.type,
            tenor_months: extracted.facility?.tenor_months || DEMO_DEAL_DATA.facility.tenor_months,
            purpose: extracted.facility?.purpose || DEMO_DEAL_DATA.facility.purpose,
        },
        covenants: {
            leverage_ratio: extracted.covenants?.leverage_ratio || DEMO_DEAL_DATA.covenants.leverage_ratio,
            interest_coverage: extracted.covenants?.interest_coverage || DEMO_DEAL_DATA.covenants.interest_coverage,
            capex_limit: extracted.covenants?.capex_limit || DEMO_DEAL_DATA.covenants.capex_limit,
            debt_incurrence_test: extracted.covenants?.debt_incurrence_test || DEMO_DEAL_DATA.covenants.debt_incurrence_test,
        },
        parties: extracted.parties?.length ? extracted.parties : DEMO_DEAL_DATA.parties,
        pricing: {
            base_rate: extracted.pricing?.base_rate || DEMO_DEAL_DATA.pricing.base_rate,
            margin_bps: extracted.pricing?.margin_bps || DEMO_DEAL_DATA.pricing.margin_bps,
            commitment_fee_bps: extracted.pricing?.commitment_fee_bps || DEMO_DEAL_DATA.pricing.commitment_fee_bps,
            upfront_fee_bps: extracted.pricing?.upfront_fee_bps || DEMO_DEAL_DATA.pricing.upfront_fee_bps,
        },
        esg: {
            sustainability_linked: extracted.esg?.sustainability_linked ?? DEMO_DEAL_DATA.esg.sustainability_linked,
            green_use_of_proceeds: extracted.esg?.green_use_of_proceeds ?? DEMO_DEAL_DATA.esg.green_use_of_proceeds,
            esg_kpis: extracted.esg?.esg_kpis?.length ? extracted.esg.esg_kpis : DEMO_DEAL_DATA.esg.esg_kpis,
            margin_adjustment_bps: extracted.esg?.margin_adjustment_bps || DEMO_DEAL_DATA.esg.margin_adjustment_bps,
        },
        jurisdiction: extracted.jurisdiction || DEMO_DEAL_DATA.jurisdiction,
    };
}

// ==================== NEGOTIATION RESOLUTION ====================

export interface NegotiationResolution {
    recommendation: {
        covenant_value: string;
        step_down: string;
        cure_rights: string;
        full_text: string;
    };
    rationale: string;
    predicted_acceptance: number;
    pros: string[];
    cons: string[];
    acceptance_by_party: Array<{
        party: string;
        predicted_acceptance: number;
        reasoning: string;
    }>;
}

/**
 * Enhanced conflict resolution with market context (RAG)
 */
export const resolveConflictEnhanced = async (negotiation: any, deal: any): Promise<NegotiationResolution> => {
    if (!model) throw new Error("Gemini not initialized");

    const context = buildConflictContext(negotiation, deal);

    const prompt = NEGOTIATION_RESOLUTION_PROMPT
        .replace('{deal_name}', context.deal_name)
        .replace('{borrower_name}', context.borrower_name)
        .replace('{industry}', context.industry)
        .replace('{deal_size}', String(context.deal_size))
        .replace('{deal_type}', context.deal_type)
        .replace('{conflict_description}', context.conflict_description)
        .replace('{bank_positions}', JSON.stringify(context.positions, null, 2))
        .replace('{sample_size}', String(context.market_context.sample_size))
        .replace('{market_median}', context.market_context.median)
        .replace('{p25}', context.market_context.p25)
        .replace('{p75}', context.market_context.p75)
        .replace('{trend}', context.market_context.recent_trend)
        .replace('{comparable_deals}', context.market_context.comparable_deals);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(responseText) as NegotiationResolution;
    } catch (error) {
        console.error("Gemini Resolution Error:", error);
        // Return default resolution
        return {
            recommendation: {
                covenant_value: "5.0x",
                step_down: "4.75x beginning in Year 3",
                cure_rights: "Two (2) equity cure rights",
                full_text: "Total Net Leverage Ratio: Not to exceed 5.0x (tested quarterly), with step-down to 4.75x beginning in Year 3."
            },
            rationale: "This proposal balances credit protection with operational flexibility based on market median.",
            predicted_acceptance: 0.85,
            pros: ["Within market range", "Addresses both conservative and aggressive lenders"],
            cons: ["Compromise position"],
            acceptance_by_party: []
        };
    }
};

// ==================== AI CHATBOT ====================

/**
 * Enhanced chatbot with deal context (RAG)
 */
export const chatbotQuery = async (question: string, deal: any): Promise<string> => {
    if (!model) throw new Error("Gemini not initialized");

    const context = buildChatbotContext(deal);

    const prompt = CHATBOT_PROMPT
        .replace('{deal_name}', context.deal_name)
        .replace('{borrower_name}', context.borrower_name)
        .replace('{facility_amount}', String(context.facility_amount))
        .replace('{deal_type}', context.deal_type)
        .replace('{status}', context.status)
        .replace('{leverage_ratio}', String(context.leverage_ratio))
        .replace('{esg_score}', String(context.esg_score))
        .replace('{comparison}', context.comparison)
        .replace('{percentile}', context.percentile)
        .replace('{user_question}', question);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Gemini Chatbot Error:", error);
        return "I'm sorry, I couldn't process your question. Please try again or check your API key.";
    }
};

// ==================== VOICE COMMANDER ====================

export interface VoiceCommand {
    command_type: "navigation" | "query" | "unknown";
    action: string | null;
    confidence: number;
    display_text: string;
    parameters: Record<string, any>;
}

/**
 * Parse voice input into structured commands
 */
export const parseVoiceCommand = async (voiceInput: string): Promise<VoiceCommand> => {
    if (!model) throw new Error("Gemini not initialized");

    const prompt = VOICE_COMMAND_PROMPT.replace('{voice_input}', voiceInput);

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let responseText = response.text()
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        return JSON.parse(responseText) as VoiceCommand;
    } catch (error) {
        console.error("Gemini Voice Command Error:", error);
        return {
            command_type: "unknown",
            action: null,
            confidence: 0,
            display_text: "I didn't understand that command",
            parameters: {}
        };
    }
};

// ==================== LEGACY FUNCTIONS (for backwards compatibility) ====================

// Simple prompt for basic term sheet analysis (legacy)
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

// Legacy negotiation resolution (simple version)
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

// Export market context builder for external use
export { buildMarketContext };
