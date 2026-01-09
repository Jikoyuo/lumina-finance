import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, RefreshCw, Loader2 } from "lucide-react";
import type { Asset } from "../../types";
import { callGeminiAPI } from "../../utils/api";

type SmartBriefWidgetProps = {
    assets: Asset[];
    totalBalance: number;
};

export const SmartBriefWidget = ({ assets, totalBalance }: SmartBriefWidgetProps) => {
    const [brief, setBrief] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const getBrief = async () => {
        setLoading(true);
        const topAsset = assets.reduce((prev, current) =>
            prev.balance * prev.price > current.balance * current.price
                ? prev
                : current
        );
        const prompt = `
      User Portfolio: Total $${totalBalance.toFixed(0)}. Top Asset: ${topAsset.name
            } ($${(topAsset.price * topAsset.balance).toFixed(0)}).
      Create a "Daily Morning Brief" greeting. It should be 1-2 sentences. 
      Be professional yet witty. Comment on their top asset exposure.
    `;
        const res = await callGeminiAPI(prompt);
        setBrief(res);
        setLoading(false);
    };

    useEffect(() => {
        getBrief();
    }, []);

    return (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 rounded-[2rem] p-6 mb-6 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={120} className="text-white" />
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 shrink-0 border border-indigo-500/20">
                <Sparkles size={24} />
            </div>
            <div className="relative z-10 flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Smart Briefing</h3>
                {loading ? (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Loader2 className="animate-spin" size={14} /> Analyze portfolio...
                    </div>
                ) : (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-300 text-sm leading-relaxed max-w-2xl"
                    >
                        {brief}
                    </motion.p>
                )}
            </div>
            <button
                onClick={getBrief}
                className="p-2 text-gray-500 hover:text-white transition-colors relative z-10"
            >
                <RefreshCw size={16} />
            </button>
        </div>
    );
};
