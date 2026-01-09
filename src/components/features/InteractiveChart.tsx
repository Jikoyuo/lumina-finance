import { useMemo } from "react";
import { motion } from "framer-motion";

type InteractiveChartProps = {
    timeRange: string;
};

export const InteractiveChart = ({ timeRange }: InteractiveChartProps) => {
    const points = useMemo(() => {
        let seed = timeRange === "1H" ? 5 : timeRange === "1D" ? 10 : 20;
        let data = [];
        let y = 50;
        for (let i = 0; i < 40; i++) {
            y += (Math.random() - 0.5) * seed;
            if (y < 10) y = 10;
            if (y > 90) y = 90;
            data.push(y);
        }
        return data;
    }, [timeRange]);

    const pathD =
        `M 0 ${100 - points[0]} ` +
        points
            .map((p, i) => `L ${i * (100 / (points.length - 1))} ${100 - p}`)
            .join(" ");
    const areaD = `${pathD} L 100 120 L 0 120 Z`;

    return (
        <div className="w-full h-full relative group cursor-crosshair">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
            >
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <motion.path
                    d={areaD}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, d: areaD }}
                    transition={{ duration: 0.5 }}
                />
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, d: pathD }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-[#18181C]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-indigo-500/30 shadow-2xl text-white transform -translate-y-12">
                    <span className="text-xs text-gray-400 block">Portfolio Value</span>
                    <span className="text-lg font-bold font-mono">$48,230.50</span>
                </div>
            </div>
        </div>
    );
};
