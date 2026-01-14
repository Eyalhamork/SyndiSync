// src/components/ai/AIAssistant.tsx
// Modern Full-Width AI Chat Panel with premium animations

import { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader, FiChevronDown, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiKey, chatbotQuery, initializeGemini, isGeminiInitialized } from '../../lib/gemini';
import { MARKET_STATS } from '../../data/comparable-deals';
import { useAutoTypewriter } from '../../hooks/useTypewriter';
import useAppStore from '../../store/appStore';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

const SUGGESTED_QUESTIONS = [
    "What's the leverage covenant?",
    "Summarize key risks",
    "What's the ESG score?",
    "Show syndicate members",
    "AI proposal for covenant conflict"
];

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
    const { isAIChatOpen, toggleAIChat } = useAppStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isAIChatOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isAIChatOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: `msg_${Date.now()} `,
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiKey = getApiKey();

            if (!apiKey) {
                await simulateResponse(userMessage.content);
                return;
            }

            if (!isGeminiInitialized()) {
                initializeGemini(apiKey);
            }

            const text = await chatbotQuery(userMessage.content, {
                deal_name: 'TechCorp LBO Financing',
                borrower: { name: 'TechCorp Industries Inc.', industry: 'Manufacturing - Industrial Technology' },
                facility_amount: 450000000,
                deal_type: 'LBO',
                status: 'under_negotiation',
                leverage_ratio: 5.0,
                esg_score: 92
            });

            const assistantMessage: Message = {
                id: `msg_${Date.now()} `,
                role: 'assistant',
                content: text
            };
            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('AI Chat Error:', error);
            await simulateResponse(userMessage.content);
        } finally {
            setIsLoading(false);
        }
    };

    const simulateResponse = async (question: string) => {
        const q = question.toLowerCase();
        let response = '';

        if (q.includes('leverage') || q.includes('covenant')) {
            response = `The current leverage covenant under negotiation is at **5.0x** with a proposed step-down to **4.75x** in Year 3. Bank of America prefers 4.5x (conservative), while JP Morgan supports 5.5x (flexible). Based on ${MARKET_STATS.sample_size} comparable deals, the market median is **${MARKET_STATS.leverage.median}x**. My recommendation has an **85% predicted acceptance rate**.`;
        } else if (q.includes('risk')) {
            response = "**Key Deal Risks:**\n\n1. **Covenant Misalignment** - 5 banks have conflicting leverage preferences (4.5x-5.5x range)\n2. **Interest Rate Exposure** - SOFR-based pricing in volatile rate environment\n3. **Sector Headwinds** - Manufacturing facing supply chain pressures\n4. **Execution Timeline** - Target close in 72 hours is aggressive\n\nMitigation: The proposed equity cure rights (2x) provide flexibility without weakening credit protection.";
        } else if (q.includes('esg') || q.includes('sustainability')) {
            response = `**ESG Profile:** Score **92/100** (SLLP Certified)\n\n• Environmental: 95/100\n• Social: 88/100\n• Governance: 93/100\n\nThis deal qualifies for **green bond eligibility** and includes a margin ratchet tied to sustainability KPIs. Based on our data, **${MARKET_STATS.esg_linked_pct}%** of comparable deals are ESG-linked.`;
        } else if (q.includes('syndicate') || q.includes('bank') || q.includes('member')) {
            response = "**Syndicate Composition:**\n\n| Bank | Role | Commitment |\n|------|------|------------|\n| Global Investment Bank | Arranger | $150M |\n| JP Morgan Chase | Co-Lead | $100M |\n| Bank of America | Member | $75M |\n| Citibank | Member | $75M |\n| Wells Fargo | Member | $50M |\n\n**Total Facility:** $450M";
        } else if (q.includes('proposal') || q.includes('ai') || q.includes('recommend')) {
            response = `**AI-Proposed Resolution:**\n\nLeverage ratio of **5.0x** (market-aligned) with:\n• Step-down to 4.75x beginning Year 3\n• Two equity cure rights per period\n• 0.25x cushion per cure\n\n**Rationale:** Balances BofA's conservative stance with JPM's flexibility. Based on ${MARKET_STATS.sample_size} comparable LBO transactions. **Predicted acceptance: 85%**`;
        } else if (q.includes('market') || q.includes('comparable')) {
            response = `**Market Comparables (${MARKET_STATS.sample_size} deals):**\n\n• Median Leverage: **${MARKET_STATS.leverage.median}x**\n• 25th Percentile: ${MARKET_STATS.leverage.p25}x\n• 75th Percentile: ${MARKET_STATS.leverage.p75}x\n• Median Margin: SOFR + **${MARKET_STATS.margin.median}bps**\n• ESG-Linked: ${MARKET_STATS.esg_linked_pct}%\n\nYour deal at 5.0x leverage is within market range.`;
        } else {
            response = `I'm here to help with the **TechCorp LBO** ($450M facility). You can ask me about:\n\n• Leverage covenant negotiations\n• ESG compliance & sustainability\n• Syndicate member positions\n• Risk assessment\n• AI resolution proposals\n• Market comparables (${MARKET_STATS.sample_size} deals)\n\nWhat would you like to know?`;
        }

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
        inputRef.current?.focus();
    };

    return (
        <>
            {/* Full-Width Bottom Panel */}
            <AnimatePresence>
                {isAIChatOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleAIChat}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 z-50 max-h-[70vh] flex flex-col"
                        >
                            {/* Glowing top edge */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

                            <div className="bg-navy-900/95 backdrop-blur-xl border-t border-white/10 flex flex-col flex-1 overflow-hidden">

                                {/* Header */}
                                <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-navy-800/50">
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center shadow-lg"
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <span className="text-2xl">🤖</span>
                                        </motion.div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                                SyndiSync AI
                                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30">
                                                    Online
                                                </span>
                                            </h3>
                                            <p className="text-slate-400 text-sm">Intelligent deal assistant powered by Gemini 2.0</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-navy-800 rounded-full border border-white/5">
                                            <FiZap className="text-gold-400" />
                                            <span className="text-xs text-slate-400">RAG-Enhanced</span>
                                        </div>
                                        <motion.button
                                            onClick={toggleAIChat}
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FiChevronDown size={20} />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 flex overflow-hidden">

                                    {/* Suggested Questions Sidebar */}
                                    <div className="hidden lg:flex w-64 flex-col border-r border-white/5 p-4 bg-navy-950/50">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Questions</h4>
                                        <div className="space-y-2">
                                            {SUGGESTED_QUESTIONS.map((q, i) => (
                                                <motion.button
                                                    key={i}
                                                    onClick={() => handleSuggestedQuestion(q)}
                                                    className="w-full text-left px-3 py-2.5 text-sm bg-navy-800/50 hover:bg-navy-700/50 text-slate-300 hover:text-white rounded-lg border border-white/5 hover:border-primary-500/30 transition-all"
                                                    whileHover={{ x: 4 }}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    {q}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        {/* Messages */}
                                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                            {messages.length === 0 && (
                                                <motion.div
                                                    className="text-center py-12"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                >
                                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center border border-white/10">
                                                        <span className="text-4xl">💬</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white mb-2">How can I help you today?</h3>
                                                    <p className="text-slate-400 max-w-md mx-auto">
                                                        Ask me anything about the TechCorp LBO deal — covenants, risks, ESG, syndicate positions, or AI recommendations.
                                                    </p>

                                                    {/* Mobile suggested questions */}
                                                    <div className="lg:hidden mt-6 flex flex-wrap gap-2 justify-center">
                                                        {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleSuggestedQuestion(q)}
                                                                className="px-3 py-1.5 text-xs bg-navy-800 hover:bg-navy-700 text-slate-300 rounded-full border border-white/10 transition-colors"
                                                            >
                                                                {q}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {messages.map((msg, idx) => (
                                                <motion.div
                                                    key={msg.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    {msg.role === 'assistant' && (
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center mr-3 flex-shrink-0">
                                                            <span className="text-sm">🤖</span>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`max-w-2xl px-4 py-3 rounded-2xl text-sm ${msg.role === 'user'
                                                            ? 'bg-primary-500 text-white rounded-br-sm'
                                                            : 'bg-navy-800 text-slate-200 rounded-bl-sm border border-white/5'
                                                            }`}
                                                    >
                                                        {msg.role === 'assistant' && idx === messages.length - 1 && !isLoading ? (
                                                            <TypewriterMessage content={msg.content} />
                                                        ) : (
                                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                                        )}
                                                    </div>
                                                    {msg.role === 'user' && (
                                                        <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center ml-3 flex-shrink-0">
                                                            <span className="text-sm">👤</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}

                                            {isLoading && (
                                                <motion.div
                                                    className="flex justify-start"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center mr-3">
                                                        <span className="text-sm">🤖</span>
                                                    </div>
                                                    <div className="bg-navy-800 text-slate-400 px-4 py-3 rounded-2xl rounded-bl-sm border border-white/5 flex items-center gap-3">
                                                        <div className="flex gap-1">
                                                            <motion.div
                                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                            />
                                                            <motion.div
                                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                                                            />
                                                            <motion.div
                                                                className="w-2 h-2 bg-primary-400 rounded-full"
                                                                animate={{ y: [0, -8, 0] }}
                                                                transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                                                            />
                                                        </div>
                                                        <span className="text-sm">Analyzing with Gemini...</span>
                                                    </div>
                                                </motion.div>
                                            )}

                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Area */}
                                        <div className="p-4 border-t border-white/5 bg-navy-800/30">
                                            <div className="max-w-4xl mx-auto flex gap-3">
                                                <div className="flex-1 relative">
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                        placeholder="Ask about covenants, risks, ESG, syndicate..."
                                                        className="w-full px-5 py-4 bg-navy-900 rounded-xl text-white placeholder-slate-500 border border-white/10 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                                                    />
                                                </div>
                                                <motion.button
                                                    onClick={handleSend}
                                                    disabled={isLoading || !input.trim()}
                                                    className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center gap-2 font-medium shadow-lg shadow-primary-500/20"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {isLoading ? (
                                                        <FiLoader className="animate-spin" size={18} />
                                                    ) : (
                                                        <FiSend size={18} />
                                                    )}
                                                    <span className="hidden sm:inline">Send</span>
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default AIAssistant;
