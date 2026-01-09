import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Copy, Zap, Activity, Image as ImageIcon } from "lucide-react";
import type { Asset, Transaction } from "../../types";
import { useToast } from "../../context/ToastContext";
import { SmartBriefWidget } from "../features/SmartBriefWidget";
import { InteractiveChart } from "../features/InteractiveChart";
import { SwapWidget } from "../features/SwapWidget";

type DashboardViewProps = {
    assets: Asset[];
    totalBalance: number;
    transactions: Transaction[];
};

export const DashboardView = ({ assets, totalBalance }: DashboardViewProps) => {
    const [timeRange, setTimeRange] = useState("1H");
    const { showToast } = useToast();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <SmartBriefWidget assets={assets} totalBalance={totalBalance} />

            <div className="grid xl:grid-cols-[2fr_1fr] gap-6">
                <div className="bg-[#121215] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col min-h-[450px]">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <p className="text-gray-400 font-medium mb-1 flex items-center gap-2">
                                Total Balance{" "}
                                <span
                                    onClick={() => showToast("Copied!")}
                                    className="bg-[#18181C] p-1 rounded cursor-pointer hover:bg-white/10 text-gray-500"
                                >
                                    <Copy size={12} />
                                </span>
                            </p>
                            <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-2">
                                $
                                {totalBalance.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </h2>
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full w-fit border border-green-500/10">
                                <ArrowUpRight size={16} />
                                <span className="font-bold">+$1,240.50 (2.4%)</span>
                            </div>
                        </div>
                        <div className="flex bg-[#0A0A0C] p-1 rounded-xl border border-white/5">
                            {["1H", "1D", "1W", "1M", "1Y"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeRange(t)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${timeRange === t
                                            ? "bg-[#18181C] text-white border border-white/10 shadow-lg"
                                            : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 w-full relative z-10">
                        <InteractiveChart timeRange={timeRange} />
                    </div>

                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                </div>

                <SwapWidget
                    assets={assets}
                    onSwap={(from, to, amt) => console.log(from, to, amt)}
                />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        icon: Zap,
                        label: "Staking Rewards",
                        value: "$420.50",
                        sub: "APY 12%",
                        color: "indigo",
                    },
                    {
                        icon: ImageIcon,
                        label: "NFT Valuation",
                        value: "12.5 ETH",
                        sub: "Floor +5.2%",
                        color: "pink",
                    },
                    {
                        icon: Activity,
                        label: "Net Worth Change",
                        value: "+$2,400",
                        sub: "This month",
                        color: "green",
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className={`bg-[#121215] border border-white/5 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group hover:border-${stat.color}-500/30 transition-all`}
                    >
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                            <stat.icon size={80} />
                        </div>
                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            {stat.value}{" "}
                            <span
                                className={`text-xs bg-${stat.color}-500/20 text-${stat.color}-400 px-2 py-0.5 rounded-full`}
                            >
                                {stat.sub}
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
