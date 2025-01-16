import { StockCard } from "@/components/StockCard";
import { useStockStore } from "@/store/stockStore";
import { Card } from "./ui/card";
import { formatCurrency } from "@/utils/formatters";

export function PortfolioSection() {
  const { stocks, portfolio, walletBalance } = useStockStore();
  
  const ownedStocks = stocks.filter((stock) => (portfolio[stock.id] || 0) > 0);
  
  const portfolioValue = ownedStocks.reduce((total, stock) => {
    return total + stock.price * (portfolio[stock.id] || 0);
  }, 0);

  if (ownedStocks.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          You don't own any stocks yet. Start trading to build your portfolio!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Portfolio</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
          <p className="text-xl font-bold">{formatCurrency(portfolioValue)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ownedStocks.map((stock) => (
          <div key={stock.id} className="relative">
            <div className="absolute top-2 right-2 z-10 bg-background/80 px-2 py-1 rounded-md">
              <span className="text-sm font-medium">
                Owned: {portfolio[stock.id]}
              </span>
            </div>
            <StockCard
              key={stock.id}
              stock={stock}
              onBuy={() => handleTransaction(stock, "buy")}
              onSell={() => handleTransaction(stock, "sell")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}