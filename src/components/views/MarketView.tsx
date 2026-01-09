import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import type { Asset } from "../../types";

type MarketViewProps = {
    assets: Asset[];
    onSelectAsset: (asset: Asset) => void;
};

export const MarketView = ({ assets, onSelectAsset }: MarketViewProps) => {
    const [category, setCategory] = useState("All");
    const filteredAssets =
        category === "All" ? assets : assets.filter((a) => a.category === category);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                        Market Overview
                    </h2>
                    <p className="text-gray-400 text-sm">
                        Real-time prices and analytics
                    </p>
                </div>
                <div className="flex gap-2 bg-[#121215] p-1.5 rounded-xl border border-white/5">
                    {["All", "Layer 1", "DeFi", "Stablecoin"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${category === cat
                                    ? "bg-indigo-600 text-white shadow-lg"
                                    : "text-gray-500 hover:text-white"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                    {filteredAssets.map((asset) => (
                        <motion.div
                            key={asset.id}
                            layout
                            onClick={() => onSelectAsset(asset)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#121215] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#18181C] flex items-center justify-center border border-white/5 shadow-lg group-hover:scale-110 transition-transform">
                                        <div className={asset.color}>{asset.symbol[0]}</div>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">
                                            {asset.name}
                                        </h3>
                                        <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                            {asset.category}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className={`text-gray-500 hover:text-yellow-400 transition-colors ${asset.isFavorite ? "text-yellow-400" : ""
                                        }`}
                                >
                                    <Star
                                        size={18}
                                        fill={asset.isFavorite ? "currentColor" : "none"}
                                    />
                                </button>
                            </div>

                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-bold text-white mb-1">
                                        ${asset.price.toLocaleString()}
                                    </p>
                                    <p
                                        className={`text-sm font-bold flex items-center gap-1 ${asset.change24h >= 0 ? "text-green-400" : "text-red-400"
                                            }`}
                                    >
                                        {asset.change24h > 0 ? "+" : ""}
                                        {asset.change24h}%{" "}
                                        <span className="text-gray-600 font-normal">24h</span>
                                    </p>
                                </div>
                                <div className="h-12 w-24 flex items-end gap-1">
                                    {asset.chartData.map((h, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                height: `${(h / Math.max(...asset.chartData)) * 100}%`,
                                            }}
                                            className={`w-full rounded-t-sm opacity-50 ${asset.change24h >= 0 ? "bg-green-500" : "bg-red-500"
                                                }`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};
