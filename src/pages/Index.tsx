import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { StockCard } from "@/components/StockCard";
import { TransactionModal } from "@/components/TransactionModal";
import { useStockStore } from "@/store/stockStore";
import { Stock } from "@/utils/stockData";

const Index = () => {
  const { stocks, updateStockPrices, updateInterval } = useStockStore();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [transactionType, setTransactionType] = useState<"buy" | "sell">("buy");

  useEffect(() => {
    const interval = setInterval(updateStockPrices, updateInterval);
    return () => clearInterval(interval);
  }, [updateInterval, updateStockPrices]);

  const handleTransaction = (stock: Stock, type: "buy" | "sell") => {
    setSelectedStock(stock);
    setTransactionType(type);
  };

  const handleCloseModal = () => {
    setSelectedStock(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onBuy={() => handleTransaction(stock, "buy")}
              onSell={() => handleTransaction(stock, "sell")}
            />
          ))}
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