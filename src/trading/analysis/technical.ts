export interface MomentumSignals {
  strongBuy: boolean;
  strongSell: boolean;
  rsi: number;
  macdSignal: 'buy' | 'sell' | 'neutral';
}

export function calculateRSI(prices: number[], periods: number = 14): number {
  if (prices.length < periods + 1) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= periods; i++) {
    const difference = prices[prices.length - i] - prices[prices.length - i - 1];
    if (difference >= 0) {
      gains += difference;
    } else {
      losses -= difference;
    }
  }

  const avgGain = gains / periods;
  const avgLoss = losses / periods;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

export function calculateMACD(prices: number[]): 'buy' | 'sell' | 'neutral' {
  if (prices.length < 26) return 'neutral';
  
  // Simple implementation for demo
  const shortEMA = prices.slice(-12).reduce((a, b) => a + b) / 12;
  const longEMA = prices.slice(-26).reduce((a, b) => a + b) / 26;
  
  if (shortEMA > longEMA) return 'buy';
  if (shortEMA < longEMA) return 'sell';
  return 'neutral';
}

export function analyzeMomentum(priceHistory: number[]): MomentumSignals {
  const rsi = calculateRSI(priceHistory);
  const macdSignal = calculateMACD(priceHistory);
  
  return {
    strongBuy: rsi < 30 && macdSignal === 'buy',
    strongSell: rsi > 70 && macdSignal === 'sell',
    rsi,
    macdSignal,
  };
}