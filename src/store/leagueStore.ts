import { create } from 'zustand';
import { BaseStrategy } from '../trading/BaseStrategy';
import { ValueStrategy } from '../trading/strategies/ValueStrategy';
import { MomentumStrategy } from '../trading/strategies/MomentumStrategy';
import { useStockStore } from './stockStore';

export interface MemberHolding {
  stockId: string;
  quantity: number;
}

export interface LeagueMember {
  id: string;
  username: string;
  algorithm: 'Conservative' | 'Aggressive' | 'Random';
  portfolioValue: number;
  holdings: MemberHolding[];
  strategy: BaseStrategy;
}

interface LeagueState {
  members: LeagueMember[];
  updateMemberPortfolios: () => void;
  addMember: (member: Omit<LeagueMember, 'strategy' | 'portfolioValue' | 'holdings'>) => void;
  executeTrades: () => void;
  updateMemberHoldings: (memberId: string, stockId: string, quantity: number) => void;
}

export const useLeagueStore = create<LeagueState>((set, get) => ({
  members: [],
  
  updateMemberPortfolios: () => {
    const { stocks } = useStockStore.getState();
    set((state) => ({
      members: state.members.map((member) => {
        const portfolioValue = member.holdings.reduce((total, holding) => {
          const stock = stocks.find((s) => s.id === holding.stockId);
          return total + (stock?.price || 0) * holding.quantity;
        }, 100000); // Add initial capital to portfolio value
        return { ...member, portfolioValue };
      }),
    }));
  },
  
  addMember: (member) => {
    const strategy = member.algorithm === 'Conservative' 
      ? new ValueStrategy()
      : new MomentumStrategy();
    
    set((state) => ({
      members: [...state.members, {
        ...member,
        strategy,
        portfolioValue: 100000, // Initial capital
        holdings: [],
      }],
    }));
  },

  updateMemberHoldings: (memberId: string, stockId: string, quantity: number) => {
    set((state) => ({
      members: state.members.map((member) => {
        if (member.id !== memberId) return member;

        const existingHoldingIndex = member.holdings.findIndex(h => h.stockId === stockId);
        let newHoldings = [...member.holdings];

        if (existingHoldingIndex >= 0) {
          const newQuantity = member.holdings[existingHoldingIndex].quantity + quantity;
          if (newQuantity <= 0) {
            // Remove holding if quantity becomes 0 or negative
            newHoldings = newHoldings.filter(h => h.stockId !== stockId);
          } else {
            // Update existing holding
            newHoldings[existingHoldingIndex] = {
              ...newHoldings[existingHoldingIndex],
              quantity: newQuantity
            };
          }
        } else if (quantity > 0) {
          // Add new holding only if quantity is positive
          newHoldings.push({ stockId, quantity });
        }

        return {
          ...member,
          holdings: newHoldings,
        };
      }),
    }));
  },
  
  executeTrades: () => {
    const { stocks, buyStock, sellStock } = useStockStore.getState();
    const { members } = get();
    
    members.forEach((member) => {
      // Calculate available cash (initial capital minus holdings value)
      const holdingsValue = member.holdings.reduce((total, holding) => {
        const stock = stocks.find(s => s.id === holding.stockId);
        return total + (stock?.price || 0) * holding.quantity;
      }, 0);
      const availableCash = 100000 - holdingsValue; // Using initial capital of 100000
      
      stocks.forEach((stock) => {
        const currentHolding = member.holdings.find(h => h.stockId === stock.id)?.quantity || 0;
        const decision = member.strategy.analyze(stock, availableCash, currentHolding);
        
        console.log(`${member.username} analyzing ${stock.symbol}:`, {
          currentHolding,
          availableCash,
          decision
        });
        
        if (decision.action === 'buy' && decision.quantity) {
          const success = buyStock(stock.id, decision.quantity);
          if (success) {
            get().updateMemberHoldings(member.id, stock.id, decision.quantity);
            console.log(`${member.username} bought ${decision.quantity} shares of ${stock.symbol}`);
          }
        } else if (decision.action === 'sell' && decision.quantity) {
          const success = sellStock(stock.id, decision.quantity);
          if (success) {
            get().updateMemberHoldings(member.id, stock.id, -decision.quantity);
            console.log(`${member.username} sold ${decision.quantity} shares of ${stock.symbol}`);
          }
        }
      });
    });
  },
}));

// Initialize some AI traders
const initializeAITraders = () => {
  const store = useLeagueStore.getState();
  
  const aiTraders = [
    {
      id: '1',
      username: 'ValueBot',
      algorithm: 'Conservative' as const,
    },
    {
      id: '2',
      username: 'MomentumBot',
      algorithm: 'Aggressive' as const,
    },
  ];
  
  aiTraders.forEach(trader => store.addMember(trader));
};

// Call this immediately to set up initial AI traders
initializeAITraders();
