import { create } from 'zustand';

interface DebugState {
  isDebugMode: boolean;
  isPaused: boolean;
  toggleDebugMode: () => void;
  togglePause: () => void;
  stepForward: () => void;
}

export const useDebugStore = create<DebugState>((set) => ({
  isDebugMode: false,
  isPaused: false,
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  stepForward: () => {
    const { updateStockPrices } = useStockStore.getState();
    updateStockPrices();
  },
}));