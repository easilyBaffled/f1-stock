import { BaseStrategy, TradingDecision } from '../BaseStrategy';
import { Stock } from '../../utils/stockData';
import { analyzeValue } from '../analysis/fundamentals';

export class ValueStrategy extends BaseStrategy {
  analyze(
    stock: Stock,
    portfolioValue: number,
    currentHoldings: number
  ): TradingDecision {
    const metrics = analyzeValue(stock.price);
    const maxShares = this.calculateMaxShares(portfolioValue, stock.price);
    
    if (metrics.isUndervalued && currentHoldings < maxShares) {
      const quantity = Math.min(
        maxShares - currentHoldings,
        stock.availableShares,
        Math.floor(portfolioValue * 0.1 / stock.price)
      );
      
      return {
        action: 'buy',
        quantity,
        reason: 'Stock appears undervalued based on P/E and P/B ratios',
      };
    }
    
    if (metrics.isOvervalued && currentHoldings > 0) {
      return {
        action: 'sell',
        quantity: currentHoldings,
        reason: 'Stock appears overvalued based on fundamentals',
      };
    }
    
    return {
      action: 'hold',
      reason: 'No clear value signal',
    };
  }
}