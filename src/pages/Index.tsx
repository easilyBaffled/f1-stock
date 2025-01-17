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

const Index = () => {
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
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <PortfolioSection />
          </div>
          <div>
            <LeagueStandings />
          </div>
        </div>
        <Separator className="my-8" />
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Market</h2>
            <div className="w-64">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or symbol..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onBuy={() => handleTransaction(stock, "buy")}
                onSell={() => handleTransaction(stock, "sell")}
              />
            ))}
          </div>
        </div>
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
};

export default Index;