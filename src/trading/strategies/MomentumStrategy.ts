import { BaseStrategy, TradingDecision } from '../BaseStrategy';
import { Stock } from '../../utils/stockData';
import { analyzeMomentum } from '../analysis/technical';

export class MomentumStrategy extends BaseStrategy {
  analyze(
    stock: Stock,
    portfolioValue: number,
    currentHoldings: number
  ): TradingDecision {
    const signals = analyzeMomentum(stock.priceHistory.map(h => h.price));
    const maxShares = this.calculateMaxShares(portfolioValue, stock.price);
    
    if (signals.strongBuy && currentHoldings < maxShares) {
      const quantity = Math.min(
        maxShares - currentHoldings,
        stock.availableShares,
        Math.floor(portfolioValue * 0.1 / stock.price)
      );
      
      return {
        action: 'buy',
        quantity,
        reason: 'Strong momentum buy signal (RSI + MACD)',
      };
    }
    
    if (signals.strongSell && currentHoldings > 0) {
      return {
        action: 'sell',
        quantity: currentHoldings,
        reason: 'Strong momentum sell signal (RSI + MACD)',
      };
    }
    
    return {
      action: 'hold',
      reason: 'No clear momentum signal',
    };
  }
}
