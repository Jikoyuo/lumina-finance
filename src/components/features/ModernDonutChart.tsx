import { motion } from "framer-motion";
import type { Asset } from "../../types";

type ModernDonutChartProps = {
    assets: Asset[];
    totalValue: number;
};

export const ModernDonutChart = ({ assets, totalValue }: ModernDonutChartProps) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    let cumulativePercent = 0;

    return (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                {assets.slice(0, 4).map((asset, index) => {
                    const percent = (asset.price * asset.balance) / totalValue;
                    const strokeDasharray = `${percent * circumference} ${circumference}`;
                    const strokeDashoffset = -cumulativePercent * circumference;
                    cumulativePercent += percent;

                    return (
                        <motion.circle
                            key={asset.id}
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="transparent"
                            stroke={asset.hexColor}
                            strokeWidth="10"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="butt"
                            initial={{ strokeDasharray: `0 ${circumference}` }}
                            animate={{ strokeDasharray }}
                            transition={{
                                duration: 1.2,
                                delay: index * 0.1,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </svg>
            {/* Glow Effect Behind */}
            <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="absolute flex flex-col items-center">
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                    Net Worth
                </span>
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl font-bold text-white tracking-tighter"
                >
                    ${(totalValue / 1000).toFixed(1)}k
                </motion.span>
            </div>
        </div>
    );
};
