import { useState } from "react";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { Stock } from "@/utils/stockData";
import { useStockStore } from "@/store/stockStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface TransactionModalProps {
  stock: Stock;
  type: "buy" | "sell";
  isOpen: boolean;
  onClose: () => void;
}

export function TransactionModal({
  stock,
  type,
  isOpen,
  onClose,
}: TransactionModalProps) {
  const [quantity, setQuantity] = useState("1");
  const { buyStock, sellStock, portfolio } = useStockStore();
  const { toast } = useToast();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setQuantity(value);
  };

  const handleTransaction = () => {
    const qty = Number(quantity);
    if (qty <= 0) return;

    const success =
      type === "buy"
        ? buyStock(stock.id, qty)
        : sellStock(stock.id, qty);

    if (success) {
      toast({
        title: `${type === "buy" ? "Bought" : "Sold"} ${qty} shares of ${stock.symbol}`,
        description: `Transaction completed successfully`,
      });
      onClose();
    } else {
      toast({
        title: "Transaction failed",
        description: `Unable to ${type} ${qty} shares of ${stock.symbol}`,
        variant: "destructive",
      });
    }
  };

  const totalCost = Number(quantity) * stock.price;
  const ownedQuantity = portfolio[stock.id] || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "buy" ? "Buy" : "Sell"} {stock.symbol}
          </DialogTitle>
          <DialogDescription>
            Current price: {formatCurrency(stock.price)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="col-span-3"
              min="1"
              max={type === "buy" ? stock.availableShares : ownedQuantity}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Total</Label>
            <div className="col-span-3">{formatCurrency(totalCost)}</div>
          </div>
          {type === "buy" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Available</Label>
              <div className="col-span-3">
                {formatNumber(stock.availableShares)} shares
              </div>
            </div>
          )}
          {type === "sell" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Owned</Label>
              <div className="col-span-3">
                {formatNumber(ownedQuantity)} shares
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleTransaction}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}