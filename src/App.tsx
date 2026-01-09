import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Asset, Transaction } from "./types";
import { initialAssets, initialTransactions } from "./data/mockData";
import { ToastContainer } from "./context/ToastContext";
import { AppLoader } from "./components/ui/AppLoader";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { AssetDetailPanel } from "./components/features/AssetDetailPanel";
import { SwapWidget } from "./components/features/SwapWidget";
import { DashboardView } from "./components/views/DashboardView";
import { MarketView } from "./components/views/MarketView";
import { WalletView } from "./components/views/WalletView";
import { HistoryView } from "./components/views/HistoryView";
import { SettingsView } from "./components/views/SettingsView";
import { AIView } from "./components/views/AIView";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [gasPrice, setGasPrice] = useState(15);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  setTransactions(initialTransactions);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2500);

    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((a) => ({
          ...a,
          price: a.price * (1 + (Math.random() * 0.004 - 0.002)),
          change24h: a.change24h + (Math.random() * 0.1 - 0.05),
        }))
      );
      setGasPrice((prev) =>
        Math.max(10, Math.min(50, prev + Math.floor(Math.random() * 5 - 2)))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const totalBalance = assets.reduce(
    (acc, curr) => acc + curr.price * curr.balance,
    0
  );

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWalletAddress("0x71...9A21");
      setIsConnecting(false);
    }, 1500);
  };

  return (
    <ToastContainer>
      <AnimatePresence>{isLoading && <AppLoader />}</AnimatePresence>

      <div className="min-h-screen bg-[#050505] font-sans text-gray-300 selection:bg-indigo-500/30 overflow-hidden flex">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
        />

        <AssetDetailPanel
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />

        <div
          className={`flex-1 h-screen overflow-y-auto transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-0"
            } md:ml-64 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050505] to-[#050505]`}
        >
          <Header
            currentView={currentView}
            gasPrice={gasPrice}
            walletAddress={walletAddress}
            isConnecting={isConnecting}
            isNotificationsOpen={isNotificationsOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            setIsNotificationsOpen={setIsNotificationsOpen}
            handleConnect={handleConnect}
          />

          <main className="p-6 md:p-8 max-w-[1600px] mx-auto pb-24">
            <AnimatePresence mode="wait">
              {currentView === "dashboard" && (
                <DashboardView
                  key="dashboard"
                  assets={assets}
                  totalBalance={totalBalance}
                  transactions={transactions}
                />
              )}
              {currentView === "market" && (
                <MarketView
                  key="market"
                  assets={assets}
                  onSelectAsset={setSelectedAsset}
                />
              )}
              {currentView === "swap" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-xl mx-auto mt-12"
                >
                  <h2 className="text-center text-3xl font-bold text-white mb-8">
                    Swap Tokens
                  </h2>
                  <SwapWidget assets={assets} onSwap={() => { }} />
                </motion.div>
              )}
              {currentView === "ai" && <AIView key="ai" assets={assets} />}
              {currentView === "wallet" && (
                <WalletView key="wallet" assets={assets} />
              )}
              {currentView === "history" && (
                <HistoryView key="history" transactions={transactions} />
              )}
              {currentView === "settings" && <SettingsView key="settings" />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ToastContainer>
  );
}
