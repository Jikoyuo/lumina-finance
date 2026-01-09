import { useState } from "react";
import { ArrowRightLeft, Settings, ChevronDown, ArrowDownRight, Loader2 } from "lucide-react";
import type { Asset } from "../../types";
import { useToast } from "../../context/ToastContext";

type SwapWidgetProps = {
    assets: Asset[];
    onSwap: (from: string, to: string, amount: number) => void;
};

export const SwapWidget = ({ assets, onSwap }: SwapWidgetProps) => {
    const [fromAsset, setFromAsset] = useState("BTC");
    const [toAsset, setToAsset] = useState("ETH");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const handleSwap = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setIsLoading(true);
        setTimeout(() => {
            onSwap(fromAsset, toAsset, parseFloat(amount));
            setIsLoading(false);
            setAmount("");
            showToast(`Successfully swapped ${amount} ${fromAsset} to ${toAsset}`);
        }, 1500);
    };

    const fromAssetData = assets.find((a) => a.symbol === fromAsset);
    const toAssetData = assets.find((a) => a.symbol === toAsset);
    const exchangeRate =
        fromAssetData && toAssetData ? fromAssetData.price / toAssetData.price : 0;

    return (
        <div className="bg-[#121215] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-white flex items-center gap-2">
                    <ArrowRightLeft size={18} className="text-indigo-400" /> Instant Swap
                </h3>
                <button className="text-gray-500 hover:text-white">
                    <Settings size={16} />
                </button>
            </div>

            <div className="space-y-2 relative">
                <div className="bg-[#0A0A0C] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Pay with</span>
                        <span>Balance: {fromAssetData?.balance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.0"
                            className="bg-transparent text-2xl font-bold text-white w-full focus:outline-none"
                        />
                        <button className="flex items-center gap-2 bg-[#18181C] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-[#202025]">
                            <div
                                className={`w-5 h-5 rounded-full ${fromAssetData?.color.replace(
                                    "text-",
                                    "bg-"
                                )} flex items-center justify-center text-[10px]`}
                            >
                                {fromAsset[0]}
                            </div>
                            <span className="font-bold text-sm text-white">{fromAsset}</span>
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <button
                        className="w-10 h-10 bg-[#18181C] border-4 border-[#121215] rounded-xl flex items-center justify-center text-indigo-400 hover:text-white hover:scale-110 transition-all shadow-lg"
                        onClick={() => {
                            setFromAsset(toAsset);
                            setToAsset(fromAsset);
                        }}
                    >
                        <ArrowDownRight size={20} />
                    </button>
                </div>

                <div className="bg-[#0A0A0C] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Receive</span>
                        <span>
                            Price: 1 {fromAsset} = {exchangeRate.toFixed(4)} {toAsset}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold text-gray-300">
                            {(parseFloat(amount || "0") * exchangeRate).toFixed(4)}
                        </div>
                        <button className="flex items-center gap-2 bg-[#18181C] px-3 py-1.5 rounded-xl border border-white/10 hover:bg-[#202025]">
                            <div
                                className={`w-5 h-5 rounded-full ${toAssetData?.color.replace(
                                    "text-",
                                    "bg-"
                                )} flex items-center justify-center text-[10px]`}
                            >
                                {toAsset[0]}
                            </div>
                            <span className="font-bold text-sm text-white">{toAsset}</span>
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={handleSwap}
                disabled={isLoading || !amount}
                className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 text-lg"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : "Swap Now"}
            </button>
        </div>
    );
};
