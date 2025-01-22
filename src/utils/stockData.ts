export interface NewsItem {
  title: string;
  timestamp: number;
  url?: string;
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  availableShares: number;
  priceHistory: { timestamp: number; price: number }[];
  team: string;
  news: NewsItem[];
}

export type ScenarioType = 'midweek' | 'raceday' | 'postseason';

const scenarios = {
  midweek: {
    news: [
      {
        title: "Breaking: Hamilton in Talks with Ferrari for Next Season",
        url: "https://www.espn.com/f1/breaking/hamilton-ferrari",
      },
      {
        title: "Red Bull Unveils Major Upgrade Package for Next Race",
        url: "https://www.espn.com/f1/redbull-upgrades",
      }
    ],
    volatility: 0.03, // 3% price swings
    volumeMultiplier: 1,
  },
  raceday: {
    news: [
      {
        title: "Verstappen Takes Pole Position in Qualifying",
        url: "https://www.espn.com/f1/qualifying-results",
      },
      {
        title: "Ferrari Strategy Blunder Costs Leclerc Podium",
        url: "https://www.espn.com/f1/ferrari-strategy-error",
      }
    ],
    volatility: 0.05, // 5% price swings
    volumeMultiplier: 2, // Double the trading volume
  },
  postseason: {
    news: [
      {
        title: "2024 Season Review: Records Broken and Milestones Achieved",
        url: "https://www.espn.com/f1/season-review",
      },
      {
        title: "Teams Announce Driver Lineups for 2025",
        url: "https://www.espn.com/f1/driver-lineup-2025",
      }
    ],
    volatility: 0.02, // 2% price swings
    volumeMultiplier: 0.5, // Half the trading volume
  }
};

function generateMockNews(scenario: ScenarioType) {
  const news: NewsItem[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    if (i === 1) { // Add scenario-specific news for recent history
      scenarios[scenario].news.forEach((newsItem, index) => {
        news.push({
          title: newsItem.title,
          url: newsItem.url,
          timestamp: timestamp + (index * 3600000) // Space out news by hours
        });
      });
    } else if (Math.random() > 0.7) { // 30% chance of news on other days
      news.push({
        title: `Performance Update ${i} days ago`,
        timestamp
      });
    } else {
      news.push({ title: "", timestamp });
    }
  }

  return news;
}

function generatePriceHistory(basePrice: number, scenario: ScenarioType) {
  const history = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const { volatility } = scenarios[scenario];

  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    const randomChange = (Math.random() - 0.5) * 2 * volatility * basePrice;
    const price = basePrice + randomChange;
    history.push({ timestamp, price });
  }

  return history;
}

export function generateStockData(scenario: ScenarioType): Stock[] {
  const { volumeMultiplier } = scenarios[scenario];
  
  return [
    {
      id: "1",
      symbol: "VER",
      name: "Max Verstappen",
      price: 350.25,
      previousPrice: 349.75,
      availableShares: 1000 * volumeMultiplier,
      priceHistory: generatePriceHistory(350, scenario),
      team: "Red Bull Racing",
      news: generateMockNews(scenario)
    },
    {
      id: "2",
      symbol: "PER",
      name: "Sergio Perez",
      price: 275.50,
      previousPrice: 278.25,
      availableShares: 500 * volumeMultiplier,
      priceHistory: generatePriceHistory(275, scenario),
      team: "Red Bull Racing",
      news: generateMockNews(scenario)
    },
    {
      id: "3",
      symbol: "HAM",
      name: "Lewis Hamilton",
      price: 310.75,
      previousPrice: 309.50,
      availableShares: 750 * volumeMultiplier,
      priceHistory: generatePriceHistory(310, scenario),
      team: "Mercedes",
      news: generateMockNews(scenario)
    },
    {
      id: "4",
      symbol: "LEC",
      name: "Charles Leclerc",
      price: 330.00,
      previousPrice: 329.50,
      availableShares: 300 * volumeMultiplier,
      priceHistory: generatePriceHistory(330, scenario),
      team: "Ferrari",
      news: generateMockNews(scenario)
    },
    {
      id: "5",
      symbol: "NOR",
      name: "Lando Norris",
      price: 295.25,
      previousPrice: 290.00,
      availableShares: 600 * volumeMultiplier,
      priceHistory: generatePriceHistory(295, scenario),
      team: "McLaren",
      news: generateMockNews(scenario)
    },
    {
      id: "6",
      symbol: "RUS",
      name: "George Russell",
      price: 285.50,
      previousPrice: 288.75,
      availableShares: 450 * volumeMultiplier,
      priceHistory: generatePriceHistory(285, scenario),
      team: "Mercedes",
      news: generateMockNews(scenario)
    }
  ];
}

export function generateNewPrice(currentPrice: number): number {
  const maxChange = currentPrice * 0.05; // 5% maximum change
  const change = (Math.random() - 0.5) * maxChange;
  return Number((currentPrice + change).toFixed(2));
}