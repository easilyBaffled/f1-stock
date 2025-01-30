    import { useEffect, useState } from "react";
    import { Header } from "@/components/Header";
    import { StockCard } from "@/components/StockCard";
    import { TransactionModal } from "@/components/TransactionModal";
    import { useStockStore } from "@/store/stockStore";
    import { useDebugStore } from "@/store/debugStore";
    import { Stock } from "@/utils/stockData";
    import { PortfolioSection } from "@/components/PortfolioSection";
    import { LeagueStandings } from "@/components/LeagueStandings";
    import { Separator } from "@/components/ui/separator";
    import { SearchInput } from "@/components/SearchInput";
    import { ScrollArea } from "@/components/ui/scroll-area";
    import { NewsFeed } from "@/components/NewsFeed";

    export default function Index() {
      const { stocks, updateStockPrices, updateInterval } = useStockStore();
      const { isPaused } = useDebugStore();
      const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
      const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");
      const [searchQuery, setSearchQuery] = useState("");

      useEffect(() => {
        if (isPaused) return;
        
        const interval = setInterval(updateStockPrices, updateInterval);
        return () => clearInterval(interval);
      }, [updateInterval, updateStockPrices, isPaused]);

      const handleTransaction = (stock: Stock, type: "buy" | "sell") => {
        setSelectedStock(stock);
        setTransactionType(type);
      };

      const handleCloseModal = () => {
        setSelectedStock(null);
      };

      const filteredStocks = stocks.filter((stock) =>
        stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.team.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return (
        <div className="min-h-screen bg-background">
          <Header />
          <main className="container py-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 flex flex-col">
                <div className="mb-4">
                  <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by driver, team or symbol..."
                  />
                </div>
                <div className="flex-1">
                  <ScrollArea className="h-full">
                    <div className="space-y-2">
                      {filteredStocks.map((stock) => (
                        <StockCard
                          key={stock.id}
                          stock={stock}
                          onBuy={() => handleTransaction(stock, "buy")}
                          onSell={() => handleTransaction(stock, "sell")}
                          variant="sidebar"
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              <div className="md:col-span-2 flex flex-col">
                <PortfolioSection />
                <div className="mt-8">
                  <LeagueStandings />
                </div>
                <div className="mt-8">
                  <NewsFeed />
                </div>
              </div>
            </div>
            <Separator className="my-8" />
          </main>
          {selectedStock && (
            <TransactionModal
              stock={selectedStock}
              type={transactionType}
              isOpen={true}
              onClose={handleCloseModal}
            />
          )}
        </div>
      );
    }
