import { Menu, Search, Bell, Flame, Wallet, Loader2 } from "lucide-react";
import { NotificationDropdown } from "../ui/NotificationDropdown";

type HeaderProps = {
    currentView: string;
    gasPrice: number;
    walletAddress: string | null;
    isConnecting: boolean;
    isNotificationsOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    setIsNotificationsOpen: (open: boolean) => void;
    handleConnect: () => void;
};

export const Header = ({
    currentView,
    gasPrice,
    walletAddress,
    isConnecting,
    isNotificationsOpen,
    setIsSidebarOpen,
    setIsNotificationsOpen,
    handleConnect,
}: HeaderProps) => {
    return (
        <header className="h-20 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden text-gray-400 hover:text-white"
                >
                    <Menu />
                </button>
                <h1 className="text-xl font-bold text-white capitalize hidden md:block">
                    {currentView}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#121215] rounded-full border border-white/5 text-xs font-bold text-gray-400">
                    <Flame
                        size={14}
                        className={gasPrice > 30 ? "text-red-500" : "text-green-500"}
                        fill="currentColor"
                    />
                    <span>{gasPrice} Gwei</span>
                </div>

                <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

                <div className="flex items-center gap-2 md:gap-4 relative">
                    <div className="relative group hidden sm:block">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#121215] border border-white/5 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/50 w-48 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            className="p-2 hover:bg-white/5 rounded-full relative text-gray-400 hover:text-white transition-colors"
                        >
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#050505]"></span>
                        </button>
                        <NotificationDropdown
                            isOpen={isNotificationsOpen}
                            close={() => setIsNotificationsOpen(false)}
                        />
                    </div>

                    {walletAddress ? (
                        <div className="flex items-center gap-3 bg-[#121215] border border-white/10 rounded-full pl-4 pr-1 py-1 cursor-pointer hover:border-indigo-500/50 transition-colors group">
                            <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                                {walletAddress}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                                <Wallet size={14} className="text-white" />
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {isConnecting ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Wallet size={16} />
                            )}
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
