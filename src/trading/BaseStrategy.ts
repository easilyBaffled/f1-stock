import { Stock } from '../utils/stockData';

export interface TradingDecision {
  action: 'buy' | 'sell' | 'hold';
  quantity?: number;
  reason: string;
}

export abstract class BaseStrategy {
  protected maxPositionSize: number = 0.1; // 10% of portfolio
  protected minStockPrice: number = 5;
  
  abstract analyze(
    stock: Stock,
    portfolioValue: number,
    currentHoldings: number
  ): TradingDecision;
  
  protected calculateMaxShares(portfolioValue: number, stockPrice: number): number {
    const maxPosition = portfolioValue * this.maxPositionSize;
    return Math.floor(maxPosition / stockPrice);
  }
}