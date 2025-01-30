import { create } from 'zustand';
import { Stock, generateStockData, generateNewPrice, ScenarioType } from '../utils/stockData';
import { useLeagueStore } from './leagueStore';

export interface Transaction {
  id: string;
  stockId: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: number;
}

interface StockState {
  stocks: Stock[];
  walletBalance: number;
  portfolio: { [key: string]: number };
  transactions: Transaction[];
  updateInterval: number;
  scenario: ScenarioType;
  isPaused?: boolean;
  setPaused: (paused: boolean) => void;
  setScenario: (scenario: ScenarioType) => void;
  setUpdateInterval: (interval: number) => void;
  updateStockPrices: () => void;
  buyStock: (stockId: string, quantity: number) => boolean;
  sellStock: (stockId: string, quantity: number) => boolean;
}

export const useStockStore = create<StockState>((set, get) => ({
  stocks: generateStockData('midweek'),
  walletBalance: 100000,
  portfolio: {},
  transactions: [],
  updateInterval: 60000,
  scenario: 'midweek',
  isPaused: false,

  setPaused: (paused: boolean) => set({ isPaused: paused }),

  setScenario: (scenario: ScenarioType) => {
    set({ 
      stocks: generateStockData(scenario),
      scenario 
    });
  },

  setUpdateInterval: (interval: number) => set({ updateInterval: interval }),

  updateStockPrices: () => {
    set((state) => ({
      stocks: state.stocks.map((stock) => ({
        ...stock,
        previousPrice: stock.price,
        price: generateNewPrice(stock.price),
        priceHistory: [...stock.priceHistory, { timestamp: Date.now(), price: stock.price }].slice(-30),
      })),
    }));
    
    // Execute AI trades after price updates
    useLeagueStore.getState().executeTrades();
    // Update portfolio values
    useLeagueStore.getState().updateMemberPortfolios();
  },

  buyStock: (stockId: string, quantity: number) => {
    const state = get();
    const stock = state.stocks.find((s) => s.id === stockId);
    
    if (!stock) return false;
    
    const totalCost = stock.price * quantity;
    
    if (totalCost > state.walletBalance) return false;
    if (quantity > stock.availableShares) return false;
    
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      stockId,
      type: 'buy',
      quantity,
      price: stock.price,
      timestamp: Date.now(),
    };
    
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
      transactions: [...state.transactions, transaction],
    }));
    
    return true;
  },

  sellStock: (stockId: string, quantity: number) => {
    const state = get();
    const stock = state.stocks.find((s) => s.id === stockId);
    const ownedQuantity = state.portfolio[stockId] || 0;
    
    if (!stock || quantity > ownedQuantity) return false;
    
    const totalValue = stock.price * quantity;
    
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      stockId,
      type: 'sell',
      quantity,
      price: stock.price,
      timestamp: Date.now(),
    };
    
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
      transactions: [...state.transactions, transaction],
    }));
    
    return true;
  },
}));
