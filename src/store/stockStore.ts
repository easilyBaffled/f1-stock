import { create } from 'zustand';
import { Stock, mockStocks, generateNewPrice } from '../utils/stockData';

interface StockState {
  stocks: Stock[];
  walletBalance: number;
  portfolio: { [key: string]: number }; // stockId -> quantity
  updateInterval: number;
  isPaused: boolean;
  setUpdateInterval: (interval: number) => void;
  updateStockPrices: () => void;
  buyStock: (stockId: string, quantity: number) => boolean;
  sellStock: (stockId: string, quantity: number) => boolean;
  setPaused: (paused: boolean) => void;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: mockStocks,
  walletBalance: 100000, // Start with $100,000
  portfolio: {},
  updateInterval: 60000, // 1 minute default
  isPaused: false,

  setUpdateInterval: (interval: number) => set({ updateInterval: interval }),

  updateStockPrices: () => {
    // Only check isPaused when the update is triggered by the interval
    // Manual updates should work regardless of the paused state
    set((state) => ({
      stocks: state.stocks.map((stock) => ({
        ...stock,
        previousPrice: stock.price,
        price: generateNewPrice(stock.price),
      })),
    }));
  },

  buyStock: (stockId: string, quantity: number) => {
    const state = get();
    const stock = state.stocks.find((s) => s.id === stockId);
    
    if (!stock) return false;
    
    const totalCost = stock.price * quantity;
    
    if (totalCost > state.walletBalance) return false;
    if (quantity > stock.availableShares) return false;
    
    set((state) => ({
      walletBalance: state.walletBalance - totalCost,
      portfolio: {
        ...state.portfolio,
        [stockId]: (state.portfolio[stockId] || 0) + quantity,
      },
      stocks: state.stocks.map((s) =>
        s.id === stockId
          ? { ...s, availableShares: s.availableShares - quantity }
          : s
      ),
    }));
    
    return true;
  },

  sellStock: (stockId: string, quantity: number) => {
    const state = get();
    const stock = state.stocks.find((s) => s.id === stockId);
    const ownedQuantity = state.portfolio[stockId] || 0;
    
    if (!stock || quantity > ownedQuantity) return false;
    
    const totalValue = stock.price * quantity;
    
    set((state) => ({
      walletBalance: state.walletBalance + totalValue,
      portfolio: {
        ...state.portfolio,
        [stockId]: state.portfolio[stockId] - quantity,
      },
      stocks: state.stocks.map((s) =>
        s.id === stockId
          ? { ...s, availableShares: s.availableShares + quantity }
          : s
      ),
    }));
    
    return true;
  },

  setPaused: (paused: boolean) => set({ isPaused: paused }),
}));