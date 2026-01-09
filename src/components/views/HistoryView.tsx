import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, RefreshCw, Sparkles, Loader2, BrainCircuit } from "lucide-react";
import type { Transaction } from "../../types";
import { callGeminiAPI } from "../../utils/api";

type HistoryViewProps = {
    transactions: Transaction[];
};

export const HistoryView = ({ transactions }: HistoryViewProps) => {
    const [filter, setFilter] = useState("all");
    const [aiInsight, setAiInsight] = useState<string | null>(null);
    const [analyzing, setAnalyzing] = useState(false);
    const filtered = transactions.filter(
        (t) => filter === "all" || t.type === filter
    );

    const analyzeHistory = async () => {
        setAnalyzing(true);
        const txSummary = transactions
            .slice(0, 10)
            .map((t) => `${t.type} ${t.amount} ${t.asset} on ${t.date}`)
            .join(", ");
        const prompt = `Analyze these crypto transactions: ${txSummary}. Identify the user's trading style (e.g., "HODLer", "Degen", "Swing Trader") and give 1 witty observation. Keep it very short.`;
        const result = await callGeminiAPI(prompt);
        setAiInsight(result);
        setAnalyzing(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* AI Insight Section */}
            <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BrainCircuit size={80} className="text-purple-400" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                        <Sparkles size={18} className="text-purple-400" /> Transaction
                        Intelligence
                    </h3>
                    {!aiInsight ? (
                        <div className="flex items-center gap-4">
                            <p className="text-gray-400 text-sm">
                                Unlock insights about your spending habits and trading patterns.
                            </p>
                            <button
                                onClick={analyzeHistory}
                                disabled={analyzing}
                                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {analyzing ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : (
                                    "Analyze My Activity"
                                )}
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2"
                        >
                            <p className="text-purple-200 text-sm italic">"{aiInsight}"</p>
                            <button
                                onClick={() => setAiInsight(null)}
                                className="text-xs text-gray-500 mt-2 hover:text-white"
                            >
                                Reset Analysis
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                <div className="flex bg-[#121215] p-1 rounded-lg border border-white/5">
                    {["all", "send", "receive", "swap"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-sm capitalize font-medium transition-all ${filter === f
                                    ? "bg-indigo-600 text-white"
                                    : "text-gray-500 hover:text-white"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>
            <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 min-h-[500px]">
                {filtered.map((tx, i) => (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={tx.id}
                        className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0"
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/5 ${tx.type === "receive"
                                        ? "bg-green-500/10 text-green-500"
                                        : tx.type === "send"
                                            ? "bg-red-500/10 text-red-500"
                                            : "bg-blue-500/10 text-blue-500"
                                    }`}
                            >
                                {tx.type === "receive" ? (
                                    <ArrowDownRight size={20} />
                                ) : tx.type === "send" ? (
                                    <ArrowUpRight size={20} />
                                ) : (
                                    <RefreshCw size={20} />
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-white capitalize text-lg">
                                    {tx.type} {tx.asset}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <span>{tx.date}</span>
                                    <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                    <span
                                        className={`capitalize ${tx.status === "completed"
                                                ? "text-green-500"
                                                : "text-yellow-500"
                                            }`}
                                    >
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p
                                className={`text-lg font-bold ${tx.type === "receive" ? "text-green-400" : "text-white"
                                    }`}
                            >
                                {tx.type === "receive" ? "+" : "-"}
                                {tx.amount} {tx.asset}
                            </p>
                            <p className="text-xs text-gray-500">Completed</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
