import { formatCurrency } from "@/utils/formatters";
import { useStockStore } from "@/store/stockStore";
import { useDebugStore } from "@/store/debugStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pause, Play, Forward } from "lucide-react";

export function Header() {
  const { 
    walletBalance, 
    updateInterval, 
    setUpdateInterval,
    stocks,
    portfolio,
    scenario,
    setScenario
  } = useStockStore();
  
  const {
    isPaused,
    togglePause,
    stepForward
  } = useDebugStore();

  const calculatePortfolioValue = () => {
    return Object.entries(portfolio).reduce((total, [stockId, quantity]) => {
      const stock = stocks.find((s) => s.id === stockId);
      return total + (stock?.price || 0) * quantity;
    }, 0);
  };

  const handleManualUpdate = () => {
    if (isPaused) {
      stepForward();
    }
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
            <Select
              value={scenario}
              onValueChange={(value) => setScenario(value as ScenarioType)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select scenario" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midweek">Mid-Week</SelectItem>
                <SelectItem value="raceday">Race Day</SelectItem>
                <SelectItem value="postseason">Post-Season</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={togglePause}
                className="h-8 w-8"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleManualUpdate}
                disabled={!isPaused}
                className="h-8 w-8"
              >
                <Forward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}