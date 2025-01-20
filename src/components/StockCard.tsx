import { Stock } from "@/utils/stockData";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface StockCardProps {
  stock: Stock;
  onBuy: () => void;
  onSell: () => void;
}

type TimeRange = "1D" | "1W" | "1M";

export function StockCard({ stock, onBuy, onSell }: StockCardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const priceChange = stock.price - stock.previousPrice;
  const isPositive = priceChange >= 0;

  const getFilteredPriceHistory = () => {
    const now = Date.now();
    const ranges = {
      "1D": 24 * 60 * 60 * 1000, // 1 day in milliseconds
      "1W": 7 * 24 * 60 * 60 * 1000, // 1 week in milliseconds
      "1M": 30 * 24 * 60 * 60 * 1000, // 1 month in milliseconds
    };

    return stock.priceHistory.filter(
      (point) => point.timestamp > now - ranges[timeRange]
    );
  };

  return (
    <Card className="p-4 glass hover:bg-accent/10 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold">{stock.symbol}</h3>
          <p className="text-sm text-muted-foreground">{stock.name}</p>
          <p className="text-xs text-muted-foreground mt-1">Team: {stock.team}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">{formatCurrency(stock.price)}</p>
          <p className={`text-sm ${isPositive ? "text-success" : "text-danger"}`}>
            {isPositive ? "↑" : "↓"} {formatCurrency(Math.abs(priceChange))}
          </p>
        </div>
      </div>

      <div className="space-x-2 mb-2">
        <Button
          variant={timeRange === "1D" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("1D")}
          className="text-xs"
        >
          1D
        </Button>
        <Button
          variant={timeRange === "1W" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("1W")}
          className="text-xs"
        >
          1W
        </Button>
        <Button
          variant={timeRange === "1M" ? "default" : "outline"}
          size="sm"
          onClick={() => setTimeRange("1M")}
          className="text-xs"
        >
          1M
        </Button>
      </div>

      <div className="h-24 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getFilteredPriceHistory()}>
            <defs>
              <linearGradient id={`gradient-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#4CAF50" : "#FF5252"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? "#4CAF50" : "#FF5252"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "#4CAF50" : "#FF5252"}
              fill={`url(#gradient-${stock.id})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Available: {formatNumber(stock.availableShares)}
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onSell}
            className="hover:bg-danger hover:text-danger-foreground"
          >
            Sell
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBuy}
            className="hover:bg-success hover:text-success-foreground"
          >
            Buy
          </Button>
        </div>
      </div>
    </Card>
  );
}