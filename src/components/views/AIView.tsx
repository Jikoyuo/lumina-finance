import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Bot, User, Send, PieChart, Activity, Lightbulb, Zap } from "lucide-react";
import type { Asset, ChatMessage } from "../../types";
import { callGeminiAPI } from "../../utils/api";

type AIViewProps = {
    assets: Asset[];
};

export const AIView = ({ assets }: AIViewProps) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            role: "ai",
            text: "Hello Alex! I am your Lumina AI Advisor. I have access to your portfolio data. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const totalValue = assets.reduce(
        (acc, curr) => acc + curr.price * curr.balance,
        0
    );

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            text: input,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        const portfolioSummary = assets
            .map(
                (a) =>
                    `${a.name}: ${a.balance} ${a.symbol} ($${(
                        a.price * a.balance
                    ).toFixed(2)})`
            )
            .join(", ");
        const systemPrompt = `
      You are Lumina AI, a helpful and professional crypto financial advisor.
      User's Portfolio: Total Value $${totalValue.toFixed(
            2
        )}. Assets: ${portfolioSummary}.
      Current Market Context: BTC is around $45k.
      User Question: "${userMsg.text}"
      
      Provide a concise, helpful answer. If the user asks about their portfolio, use the provided data.
      Format response in plain text or simple markdown. Be encouraging but warn about risks.
    `;

        const responseText = await callGeminiAPI(systemPrompt);

        setIsTyping(false);
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: responseText,
                timestamp: new Date(),
            },
        ]);
    };

    const runQuickAction = async (action: string) => {
        let prompt = "";
        if (action === "audit")
            prompt =
                "Perform a quick audit of my portfolio. Are there any high risks? Is it well diversified? Give 3 bullet points.";
        if (action === "sentiment")
            prompt =
                "What is the general crypto market sentiment right now based on Bitcoin price action? Be brief.";
        if (action === "predict")
            prompt =
                "Based on general crypto history, what usually happens to altcoins when Bitcoin is stable? No financial advice, just theory.";

        setInput(prompt);

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            text:
                action === "audit"
                    ? "Audit my portfolio"
                    : action === "sentiment"
                        ? "Market Sentiment"
                        : "Market Theory",
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMsg]);
        setIsTyping(true);

        const portfolioSummary = assets
            .map(
                (a) =>
                    `${a.name}: ${a.balance} ${a.symbol} ($${(
                        a.price * a.balance
                    ).toFixed(2)})`
            )
            .join(", ");
        const systemPrompt = `
      Act as Lumina AI. User Portfolio: ${portfolioSummary}. Total: $${totalValue}.
      User Request: ${prompt}
      Keep answer under 100 words.
    `;

        const responseText = await callGeminiAPI(systemPrompt);
        setIsTyping(false);
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                role: "ai",
                text: responseText,
                timestamp: new Date(),
            },
        ]);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-[calc(100vh-140px)] flex gap-6"
        >
            <div className="flex-1 bg-[#121215] border border-white/5 rounded-[2rem] p-6 flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <Sparkles className="text-white" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Lumina AI Advisor</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>{" "}
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMessages([])}
                        className="text-xs text-gray-500 hover:text-white"
                    >
                        Clear Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar relative z-10">
                    {messages.map((msg) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === "ai"
                                    ? "bg-[#18181C] border border-white/10"
                                    : "bg-indigo-600"
                                    }`}
                            >
                                {msg.role === "ai" ? (
                                    <Bot size={16} className="text-indigo-400" />
                                ) : (
                                    <User size={16} className="text-white" />
                                )}
                            </div>
                            <div
                                className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${msg.role === "ai"
                                    ? "bg-[#18181C] border border-white/5 text-gray-300"
                                    : "bg-indigo-600 text-white"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#18181C] border border-white/10 flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-indigo-400" />
                            </div>
                            <div className="bg-[#18181C] px-4 py-3 rounded-2xl border border-white/5 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <div className="mt-4 relative z-10">
                    <div className="bg-[#0A0A0C] border border-white/10 rounded-xl p-2 flex items-center gap-2 focus-within:border-indigo-500/50 transition-colors">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask about your portfolio or market trends..."
                            className="bg-transparent flex-1 text-white text-sm px-3 focus:outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="w-80 flex flex-col gap-4">
                <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Zap size={18} className="text-yellow-400" /> Quick Insights
                    </h3>
                    <div className="space-y-3 relative z-10">
                        <button
                            onClick={() => runQuickAction("audit")}
                            className="w-full text-left p-3 rounded-xl bg-[#18181C] hover:bg-[#202025] border border-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
                                    <PieChart size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-200 group-hover:text-white">
                                    Portfolio Audit
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 pl-10">
                                Analyze risk & diversification
                            </p>
                        </button>
                        <button
                            onClick={() => runQuickAction("sentiment")}
                            className="w-full text-left p-3 rounded-xl bg-[#18181C] hover:bg-[#202025] border border-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-1.5 bg-green-500/10 rounded-lg text-green-400">
                                    <Activity size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-200 group-hover:text-white">
                                    Market Sentiment
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 pl-10">
                                Bullish or Bearish trends?
                            </p>
                        </button>
                        <button
                            onClick={() => runQuickAction("predict")}
                            className="w-full text-left p-3 rounded-xl bg-[#18181C] hover:bg-[#202025] border border-white/5 transition-colors group"
                        >
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
                                    <Lightbulb size={14} />
                                </div>
                                <span className="text-sm font-bold text-gray-200 group-hover:text-white">
                                    Crypto Theory
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 pl-10">
                                Educational concepts
                            </p>
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-gradient-to-b from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-3xl p-6 flex flex-col justify-end relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-30">
                        <Bot size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-indigo-300 font-bold text-sm mb-2">PRO TIP</p>
                        <p className="text-white text-lg font-bold leading-tight mb-4">
                            "Ask me to analyze your top performing asset."
                        </p>
                        <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
