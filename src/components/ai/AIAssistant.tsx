// src/components/ai/AIAssistant.tsx
// Floating AI Chat Assistant with Gemini integration

import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiLoader } from 'react-icons/fi';
import { getApiKey } from '../../lib/gemini';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useAutoTypewriter } from '../../hooks/useTypewriter';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
    "What's the leverage covenant for this deal?",
    "Summarize the key risks",
    "What's the ESG score?",
    "Who are the syndicate members?",
    "What's the AI proposal for the covenant conflict?"
];

// Context prompt for deal-aware responses
const SYSTEM_CONTEXT = `You are SyndiSync AI, an expert assistant for syndicated loan deals. You have access to the following deal information:

Deal: TechCorp LBO Financing
Borrower: TechCorp Industries Inc. (Manufacturing - Industrial Technology)
Amount: $450,000,000 USD
Type: LBO (Leveraged Buyout)
Tenor: 60 months
Status: Under Negotiation
Credit Rating: BB+
ESG Score: 85/100 (SLLP Certified)
Carbon Offset: 1,250 tons CO2

Syndicate Banks:
- Global Investment Bank (Arranger): $150M commitment, max leverage 5.0x
- JP Morgan Chase (Co-Lead): $100M commitment, max leverage 5.5x  
- Bank of America: $75M commitment, max leverage 4.5x
- Citibank: $75M commitment, max leverage 5.0x
- Wells Fargo: $50M commitment, max leverage 4.8x

Current Negotiation: Leverage covenant conflict
- BofA wants 4.5x, JPM wants 5.5x
- AI proposed compromise: 5.0x with step-down to 4.75x in Year 3
- Predicted acceptance: 85%
- Market median for similar LBOs: 5.1x

Be concise, professional, and helpful. Use specific numbers when relevant.`;

function TypewriterMessage({ content, onComplete }: { content: string, onComplete?: () => void }) {
    const { displayText, isComplete } = useAutoTypewriter(content, 15);

    useEffect(() => {
        if (isComplete && onComplete) {
            onComplete();
        }
    }, [isComplete, onComplete]);

    return <div className="whitespace-pre-wrap">{displayText}{!isComplete && <span className="animate-pulse">|</span>}</div>;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentResponse]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setCurrentResponse('');

        try {
            const apiKey = getApiKey();

            if (!apiKey) {
                // Demo mode - provide intelligent canned responses
                await simulateResponse(userMessage.content);
                return;
            }

            // Real Gemini API call
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

            const chat = model.startChat({
                history: [
                    { role: 'user', parts: [{ text: SYSTEM_CONTEXT }] },
                    { role: 'model', parts: [{ text: 'Understood. I am SyndiSync AI, ready to assist with the TechCorp LBO deal.' }] },
                    ...messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model' as 'user' | 'model',
                        parts: [{ text: m.content }]
                    }))
                ]
            });

            const result = await chat.sendMessage(userMessage.content);
            const response = await result.response;
            const text = response.text();

            // Add the response
            const assistantMessage: Message = {
                id: `msg_${Date.now()}`,
                role: 'assistant',
                content: text
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('AI Chat Error:', error);
            // Fallback to demo response
            await simulateResponse(userMessage.content);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateResponse = async (question: string) => {
        // Intelligent demo responses based on question
        const q = question.toLowerCase();
        let response = '';

        if (q.includes('leverage') || q.includes('covenant')) {
            response = "The current leverage covenant under negotiation is at **5.0x** with a proposed step-down to **4.75x** in Year 3. Bank of America prefers 4.5x (conservative), while JP Morgan supports 5.5x (flexible). The market median for similar LBOs is 5.1x. My recommendation has an **85% predicted acceptance rate**.";
        } else if (q.includes('risk')) {
            response = "**Key Deal Risks:**\n\n1. **Covenant Misalignment** - 5 banks have conflicting leverage preferences (4.5x-5.5x range)\n2. **Interest Rate Exposure** - SOFR-based pricing in volatile rate environment\n3. **Sector Headwinds** - Manufacturing facing supply chain pressures\n4. **Execution Timeline** - Target close in 72 hours is aggressive\n\nMitigation: The proposed equity cure rights (2x) provide flexibility without weakening credit protection.";
        } else if (q.includes('esg') || q.includes('sustainability')) {
            response = "**ESG Profile:** Score **85/100** (SLLP Certified)\n\n• Environmental: 88/100\n• Social: 82/100\n• Governance: 85/100\n\nThis deal qualifies for **green bond eligibility** and includes a margin ratchet tied to sustainability KPIs. Carbon offset: 1,250 tons CO2.";
        } else if (q.includes('syndicate') || q.includes('bank') || q.includes('member')) {
            response = "**Syndicate Composition:**\n\n| Bank | Role | Commitment |\n|------|------|------------|\n| Global Investment Bank | Arranger | $150M |\n| JP Morgan Chase | Co-Lead | $100M |\n| Bank of America | Member | $75M |\n| Citibank | Member | $75M |\n| Wells Fargo | Member | $50M |\n\n**Total Facility:** $450M";
        } else if (q.includes('proposal') || q.includes('ai') || q.includes('recommend')) {
            response = "**AI-Proposed Resolution:**\n\nLeverage ratio of **5.0x** (market-aligned) with:\n• Step-down to 4.75x beginning Year 3\n• Two equity cure rights per period\n• 0.25x cushion per cure\n\n**Rationale:** Balances BofA's conservative stance with JPM's flexibility. Based on 147 comparable LBO transactions. **Predicted acceptance: 85%**";
        } else {
            response = `I'm here to help with the **TechCorp LBO** ($450M facility). You can ask me about:\n\n• Leverage covenant negotiations\n• ESG compliance & sustainability\n• Syndicate member positions\n• Risk assessment\n• AI resolution proposals\n\nWhat would you like to know?`;
        }

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const assistantMessage: Message = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: response
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
    };

    const handleSuggestedQuestion = (question: string) => {
        setInput(question);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-8 w-16 h-16 rounded-full bg-green-500 hover:bg-green-400 text-white shadow-glow flex items-center justify-center z-40 transition-all hover:scale-110 active:scale-95 group animate-fade-in"
                title="AI Assistant"
            >
                <FiMessageSquare size={32} className="group-hover:animate-bounce" />
                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-navy-900">
                    AI
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-28 w-96 h-[500px] glass-card rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden border border-primary-500/30 animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-lg">🤖</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">SyndiSync AI</h3>
                        <p className="text-primary-100 text-xs">Ask about your deal</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-1"
                >
                    <FiX size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-navy-950/50">
                {messages.length === 0 && (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-3">💬</div>
                        <p className="text-slate-400 text-sm mb-4">Ask me anything about the TechCorp LBO deal</p>
                        <div className="space-y-2">
                            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSuggestedQuestion(q)}
                                    className="block w-full text-left px-3 py-2 text-xs bg-navy-800/50 hover:bg-navy-700/50 text-slate-300 rounded-lg border border-white/5 transition-colors"
                                >
                                    "{q}"
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] px-3 py-2 rounded-xl text-sm ${msg.role === 'user'
                                ? 'bg-primary-500 text-white rounded-br-sm'
                                : 'bg-navy-800 text-slate-200 rounded-bl-sm border border-white/5'
                                }`}
                        >
                            {/* Use Typewriter only for the very last message if it's from assistant and we just added it */}
                            {msg.role === 'assistant' && idx === messages.length - 1 && !isLoading ? (
                                <TypewriterMessage content={msg.content} />
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-navy-800 text-slate-400 px-4 py-2 rounded-xl rounded-bl-sm border border-white/5 flex items-center gap-2">
                            <FiLoader className="animate-spin" size={14} />
                            <span className="text-sm">Analyzing...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5 bg-navy-900/80">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about the deal..."
                        className="flex-1 px-3 py-2 bg-navy-800 rounded-lg text-sm text-white placeholder-slate-500 border border-white/10 focus:border-primary-500 focus:outline-none transition-colors"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="px-3 py-2 bg-primary-500 hover:bg-primary-400 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <FiSend size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIAssistant;
