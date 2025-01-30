export interface ValueMetrics {
  isUndervalued: boolean;
  isOvervalued: boolean;
  peRatio: number;
  priceToBook: number;
}

// Simplified fundamental analysis for demo
export function analyzeValue(price: number, marketCap: number = price * 1000000): ValueMetrics {
  const mockEarnings = marketCap * 0.05; // 5% earnings ratio
  const mockBookValue = marketCap * 0.7; // 70% of market cap is book value
  
  const peRatio = price / (mockEarnings / 1000000);
  const priceToBook = price / (mockBookValue / 1000000);
  
  return {
    isUndervalued: peRatio < 15 && priceToBook < 1.5,
    isOvervalued: peRatio > 25 || priceToBook > 3,
    peRatio,
    priceToBook,
  };
}
