import { formatCurrency } from "@/utils/formatters";
import { useStockStore } from "@/store/stockStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Header() {
  const { walletBalance, updateInterval, setUpdateInterval } = useStockStore();

  const calculatePortfolioValue = () => {
    const { stocks, portfolio } = useStockStore.getState();
    return Object.entries(portfolio).reduce((total, [stockId, quantity]) => {
      const stock = stocks.find((s) => s.id === stockId);
      return total + (stock?.price || 0) * quantity;
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">StockSim</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-6">
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="font-bold">{formatCurrency(calculatePortfolioValue())}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Wallet Balance</p>
              <p className="font-bold">{formatCurrency(walletBalance)}</p>
            </div>
            <Select
              value={updateInterval.toString()}
              onValueChange={(value) => setUpdateInterval(Number(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10000">10 seconds</SelectItem>
                <SelectItem value="30000">30 seconds</SelectItem>
                <SelectItem value="60000">1 minute</SelectItem>
                <SelectItem value="300000">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </header>
  );
}