export type Asset = {
    id: string;
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    balance: number;
    color: string;
    hexColor: string;
    chartData: number[];
    description: string;
    category: "Layer 1" | "DeFi" | "Stablecoin" | "Metaverse";
    isFavorite: boolean;
};

export type Transaction = {
    id: string;
    type: "send" | "receive" | "swap" | "stake";
    asset: string;
    amount: number;
    toAsset?: string;
    toAmount?: number;
    status: "completed" | "pending" | "failed";
    date: string;
};

export type NFT = {
    id: string;
    name: string;
    collection: string;
    image: string;
    floorPrice: number;
};

export type ChatMessage = {
    id: string;
    role: "user" | "ai";
    text: string;
    timestamp: Date;
};
