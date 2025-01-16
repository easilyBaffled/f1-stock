import { useLeagueStore } from "@/store/leagueStore";
import { Card } from "./ui/card";
import { formatCurrency } from "@/utils/formatters";

export function LeagueStandings() {
  const { members } = useLeagueStore();

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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">League Standings</h2>
      <div className="grid gap-4">
        {sortedMembers.map((member) => (
          <Card key={member.id} className="p-4">
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
          </Card>
        ))}
      </div>
    </div>
  );
}