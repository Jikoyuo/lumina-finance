import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Scale, Loader2, Bot, RefreshCw, Zap, Sparkles, Image as ImageIcon } from "lucide-react";
import type { Asset } from "../../types";
import { useToast } from "../../context/ToastContext";
import { callGeminiAPI } from "../../utils/api";
import { ModernDonutChart } from "../features/ModernDonutChart";
import { mockNFTs } from "../../data/mockData";

type WalletViewProps = {
    assets: Asset[];
};

export const WalletView = ({ assets }: WalletViewProps) => {
    const { showToast } = useToast();
    const totalValue = assets.reduce(
        (acc, curr) => acc + curr.price * curr.balance,
        0
    );
    const [rebalanceSuggestion, setRebalanceSuggestion] = useState<string | null>(
        null
    );
    const [analyzing, setAnalyzing] = useState(false);

    const getRebalanceAdvice = async () => {
        setAnalyzing(true);
        const assetSummary = assets
            .map(
                (a) =>
                    `${a.symbol}: ${Math.round(
                        ((a.price * a.balance) / totalValue) * 100
                    )}%`
            )
            .join(", ");
        const prompt = `
      Act as a portfolio manager. Current Allocation: ${assetSummary}.
      Total Value: $${totalValue.toFixed(0)}.
      Suggest 1 concrete rebalancing action to reduce risk or improve diversity. Be concise (max 2 sentences).
    `;
        const res = await callGeminiAPI(prompt);
        setRebalanceSuggestion(res);
        setAnalyzing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#121215] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <PieChart size={20} className="text-indigo-400" /> Allocation
                            </h3>
                            <p className="text-sm text-gray-500">
                                Visual breakdown of your holdings
                            </p>
                        </div>
                        <button
                            onClick={getRebalanceAdvice}
                            disabled={analyzing}
                            className="text-xs font-bold bg-[#18181C] hover:bg-[#202025] text-indigo-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors border border-white/5"
                        >
                            {analyzing ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Scale size={14} />
                            )}
                            {analyzing ? "AI Analyzing..." : "Auto Rebalance"}
                        </button>
                    </div>

                    {rebalanceSuggestion && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-4 rounded-xl flex items-start gap-3 relative z-10"
                        >
                            <Bot size={20} className="text-indigo-400 shrink-0 mt-1" />
                            <div>
                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1">
                                    AI Recommendation
                                </p>
                                <p className="text-sm text-indigo-100 leading-relaxed">
                                    {rebalanceSuggestion}
                                </p>
                            </div>
                        </motion.div>
                    )}

                    <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                        {/* Modern Donut Chart */}
                        <ModernDonutChart assets={assets} totalValue={totalValue} />

                        {/* Modern Asset List */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {assets.slice(0, 4).map((asset, idx) => {
                                const percent =
                                    ((asset.price * asset.balance) / totalValue) * 100;
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={asset.id}
                                        className="flex flex-col p-4 rounded-2xl bg-[#18181C]/50 hover:bg-[#18181C] border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-2 h-8 rounded-full"
                                                    style={{ backgroundColor: asset.hexColor }}
                                                ></div>
                                                <div>
                                                    <p className="font-bold text-white">{asset.symbol}</p>
                                                    <p className="text-xs text-gray-500">{asset.name}</p>
                                                </div>
                                            </div>
                                            <span className="text-lg font-bold text-white">
                                                {Math.round(percent)}%
                                            </span>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: asset.hexColor }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20">
                        <Zap size={100} />
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
                            <RefreshCw size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-white">Staking Earnings</h3>
                        <p className="text-gray-400 text-sm mt-1">Passive income stream</p>
                    </div>
                    <div>
                        <div className="text-5xl font-bold text-white mb-2 tracking-tight">
                            $450.21
                        </div>
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-green-400 text-xs font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/10">
                                +12.5% APY
                            </span>
                            <span className="text-gray-500 text-xs">Last updated 1h ago</span>
                        </div>
                        <button
                            onClick={() => showToast("Rewards Claimed!", "success")}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/20 flex justify-center items-center gap-2 group"
                        >
                            <Sparkles size={16} className="group-hover:animate-ping" /> Claim
                            Rewards
                        </button>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <ImageIcon size={20} className="text-pink-400" /> NFT Gallery
                    </h3>
                    <button className="text-sm text-gray-500 hover:text-white">
                        View All
                    </button>
                </div>
                <div className="grid md:grid-cols-4 gap-6">
                    {mockNFTs.map((nft) => (
                        <motion.div
                            key={nft.id}
                            whileHover={{ y: -5 }}
                            className="bg-[#121215] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer"
                        >
                            <div className="aspect-square bg-gray-800 relative overflow-hidden">
                                <img
                                    src={nft.image}
                                    alt={nft.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-lg text-xs text-white font-bold border border-white/10">
                                    ETH {nft.floorPrice}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-xs text-indigo-400 font-bold mb-1">
                                    {nft.collection}
                                </p>
                                <h4 className="text-white font-bold truncate">{nft.name}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
