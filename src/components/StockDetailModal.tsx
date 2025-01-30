    import { Stock } from "@/utils/stockData";
    import { formatCurrency, formatNumber, formatPercentage } from "@/utils/formatters";
    import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
    } from "@/components/ui/dialog";
    import { calculateRSI, calculateMACD } from "@/trading/analysis/technical";
    import { analyzeValue } from "@/trading/analysis/fundamentals";
    import { Newspaper } from "lucide-react";
    import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import React from "react";

    interface StockDetailModalProps {
      stock: Stock;
      isOpen: boolean;
      onClose: () => void;
    }

    export function StockDetailModal({
      stock,
      isOpen,
      onClose,
    }: StockDetailModalProps) {
      const priceHistory = stock.priceHistory;
      const rsi = calculateRSI(priceHistory.map(h => h.price));
      const macd = calculateMACD(priceHistory.map(h => h.price));
      const valueMetrics = analyzeValue(stock.price);

      const findSignificantChanges = () => {
        const significantChanges = [];
        const threshold = 0.02; // 2% change threshold

        for (let i = 1; i < priceHistory.length; i++) {
          const previousPrice = priceHistory[i - 1].price;
          const currentPrice = priceHistory[i].price;
          const percentChange = (currentPrice - previousPrice) / previousPrice;

          if (Math.abs(percentChange) >= threshold && stock.news[i]) {
            significantChanges.push({
              x: i / (priceHistory.length - 1) * 100, // Convert to percentage for positioning
              news: stock.news[i],
              price: currentPrice,
              timestamp: priceHistory[i].timestamp
            });
          }
        }

        return significantChanges;
      };

      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{stock.name} Details</DialogTitle>
              <DialogDescription>
                Detailed stock information and performance metrics
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="chart-container">
                <div className="relative h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={priceHistory}>
                      <defs>
                        <linearGradient id={`gradient-${stock.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}/>
                      <YAxis tickFormatter={(price) => formatCurrency(price)} />
                      <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}/>
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="#8884d8"
                        fill="url(#gradient-1)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  
                  {/* News Markers */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-start pointer-events-none">
                    <TooltipProvider>
                      {findSignificantChanges().map((change, index) => (
                        <div
                          key={index}
                          className="relative h-4"
                          style={{ left: `${change.x}%` }}
                        >
                          <UiTooltip>
                            <TooltipTrigger asChild>
                              <div className="relative top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-muted-foreground cursor-pointer pointer-events-auto" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-2">
                                <p className="font-medium">{change.news.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(change.timestamp).toLocaleDateString()}
                                </p>
                                {change.news.url && (
                                  <a
                                    href={change.news.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline block"
                                  >
                                    Read more →
                                  </a>
                                )}
                              </div>
                            </TooltipContent>
                          </UiTooltip>
                        </div>
                      ))}
                    </TooltipProvider>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Performance Metrics</h4>
                  <p>P/E Ratio: {formatNumber(valueMetrics.peRatio)}</p>
                  <p>Price to Book: {formatNumber(valueMetrics.priceToBook)}</p>
                  <p>RSI: {formatNumber(rsi)}</p>
                  <p>MACD Signal: {macd}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Stock Statistics</h4>
                  <p>Current Price: {formatCurrency(stock.price)}</p>
                  <p>Available Shares: {formatNumber(stock.availableShares)}</p>
                  <p>Market Cap: {formatCurrency(stock.price * 1000000)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      );
    }
