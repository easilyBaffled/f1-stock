import { create } from 'zustand';
import { useStockStore } from './stockStore';

interface DebugState {
  isDebugMode: boolean;
  isPaused: boolean;
  toggleDebugMode: () => void;
  togglePause: () => void;
  stepForward: () => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  isDebugMode: false,
  isPaused: false,
  
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  
  togglePause: () => {
    set((state) => ({ isPaused: !state.isPaused }));
    useStockStore.getState().setPaused(!get().isPaused);
  },
  
  stepForward: () => {
    if (!get().isPaused) return;
    useStockStore.getState().updateStockPrices();
  },
}));
