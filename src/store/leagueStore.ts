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
        }, 0);
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
  
  executeTrades: () => {
    const { stocks, buyStock, sellStock } = useStockStore.getState();
    const { members } = get();
    
    members.forEach((member) => {
      stocks.forEach((stock) => {
        const currentHolding = member.holdings.find(h => h.stockId === stock.id)?.quantity || 0;
        const decision = member.strategy.analyze(stock, member.portfolioValue, currentHolding);
        
        if (decision.action === 'buy' && decision.quantity) {
          buyStock(stock.id, decision.quantity);
        } else if (decision.action === 'sell' && decision.quantity) {
          sellStock(stock.id, decision.quantity);
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