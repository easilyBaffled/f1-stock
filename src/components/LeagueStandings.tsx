import { useLeagueStore } from "@/store/leagueStore";
import { Card } from "./ui/card";
import { formatCurrency } from "@/utils/formatters";
import { useStockStore } from "@/store/stockStore";

export function LeagueStandings() {
  const { members } = useLeagueStore();
  const { stocks } = useStockStore();

  if (members.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No other traders in the league yet. Competition will begin once others join!
        </p>
      </Card>
    );
  }

  // Sort members by portfolio value in descending order
  const sortedMembers = [...members].sort((a, b) => b.portfolioValue - a.portfolioValue);

  // Add console log to inspect member data
  console.log("League members:", sortedMembers);
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">League Standings</h2>
      <div className="grid gap-4">
        {sortedMembers.map((member) => {
          console.log("Individual member data:", member);
          return (
            <Card key={member.id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Strategy: {member.algorithm}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(member.portfolioValue)}</p>
                  </div>
                </div>
                
                {member.holdings?.length > 0 && (
                  <div className="border-t pt-2">
                    <p className="text-sm font-medium mb-2">Holdings:</p>
                    <div className="space-y-2">
                      {member.holdings.map((holding) => {
                        const stock = stocks.find(s => s.id === holding.stockId);
                        if (!stock) return null;
                        
                        const value = stock.price * holding.quantity;
                        return (
                          <div key={holding.stockId} className="flex justify-between text-sm">
                            <span>{stock.symbol} ({holding.quantity} shares)</span>
                            <span>{formatCurrency(value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}