import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Bot, Loader2, BrainCircuit } from "lucide-react";
import type { Asset } from "../../types";
import { callGeminiAPI } from "../../utils/api";

type AssetDetailPanelProps = {
    asset: Asset | null;
    onClose: () => void;
};

export const AssetDetailPanel = ({ asset, onClose }: AssetDetailPanelProps) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateAnalysis = async () => {
        if (!asset) return;
        setLoading(true);
        const prompt = `
      Act as a senior crypto analyst. Provide a short, punchy 3-sentence analysis for ${asset.name} (${asset.symbol}).
      Current Context: Price $${asset.price}, Category: ${asset.category}.
      Highlight one major strength and one potential risk.
    `;
        const result = await callGeminiAPI(prompt);
        setAnalysis(result);
        setLoading(false);
    };

    useEffect(() => {
        setAnalysis(null);
    }, [asset]);

    return (
        <AnimatePresence>
            {asset && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full md:w-[480px] bg-[#0F0F13] border-l border-white/10 z-[70] p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-bold text-gray-400">Asset Details</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-20 h-20 rounded-3xl bg-[#18181C] border border-white/10 flex items-center justify-center shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                                <span className={`text-4xl font-bold ${asset.color}`}>
                                    {asset.symbol[0]}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-white mb-1">
                                    {asset.name}
                                </h3>
                                <div className="flex gap-2">
                                    <span className="text-gray-500 font-medium">
                                        {asset.symbol}
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/5 text-gray-400">
                                        {asset.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#18181C] p-5 rounded-2xl border border-white/5">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                                    Current Price
                                </p>
                                <p className="text-2xl font-bold text-white">
                                    ${asset.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-[#18181C] p-5 rounded-2xl border border-white/5">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">
                                    24h Change
                                </p>
                                <p
                                    className={`text-2xl font-bold ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"
                                        }`}
                                >
                                    {asset.change24h > 0 ? "+" : ""}
                                    {asset.change24h}%
                                </p>
                            </div>
                        </div>

                        <div className="mb-8 bg-[#18181C] p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <BrainCircuit size={100} />
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                    <Sparkles size={16} className="text-purple-400" /> Lumina AI
                                    Insight
                                </h4>

                                {!analysis ? (
                                    <div className="text-center py-6">
                                        <p className="text-gray-500 text-sm mb-4">
                                            Get real-time fundamental analysis powered by Gemini.
                                        </p>
                                        <button
                                            onClick={generateAnalysis}
                                            disabled={loading}
                                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2 mx-auto disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <Bot size={16} />
                                            )}
                                            Generate Analysis
                                        </button>
                                    </div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <p className="text-gray-300 text-sm leading-relaxed italic border-l-2 border-purple-500 pl-4 py-1">
                                            "{analysis}"
                                        </p>
                                        <button
                                            onClick={() => setAnalysis(null)}
                                            className="text-xs text-gray-500 mt-4 hover:text-white underline"
                                        >
                                            Refresh Analysis
                                        </button>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-900/20">
                                Buy {asset.symbol}
                            </button>
                            <button className="flex-1 py-4 bg-[#18181C] hover:bg-[#25252b] text-white border border-white/10 font-bold rounded-xl transition-colors">
                                Trade
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
