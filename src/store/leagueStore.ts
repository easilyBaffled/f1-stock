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
}));