export interface NewsItem {
  title: string;
  timestamp: number;
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

export const mockStocks: Stock[] = [
  {
    id: "1",
    symbol: "VER",
    name: "Max Verstappen",
    price: 350.25,
    previousPrice: 349.75,
    availableShares: 1000,
    priceHistory: generatePriceHistory(350),
    team: "Red Bull Racing",
    news: generateMockNews()
  },
  {
    id: "2",
    symbol: "PER",
    name: "Sergio Perez",
    price: 275.50,
    previousPrice: 278.25,
    availableShares: 500,
    priceHistory: generatePriceHistory(275),
    team: "Red Bull Racing",
    news: generateMockNews()
  },
  {
    id: "3",
    symbol: "HAM",
    name: "Lewis Hamilton",
    price: 310.75,
    previousPrice: 309.50,
    availableShares: 750,
    priceHistory: generatePriceHistory(310),
    team: "Mercedes",
    news: generateMockNews()
  },
  {
    id: "4",
    symbol: "LEC",
    name: "Charles Leclerc",
    price: 330.00,
    previousPrice: 329.50,
    availableShares: 300,
    priceHistory: generatePriceHistory(330),
    team: "Ferrari",
    news: generateMockNews()
  },
  {
    id: "5",
    symbol: "NOR",
    name: "Lando Norris",
    price: 295.25,
    previousPrice: 290.00,
    availableShares: 600,
    priceHistory: generatePriceHistory(295),
    team: "McLaren",
    news: generateMockNews()
  },
  {
    id: "6",
    symbol: "RUS",
    name: "George Russell",
    price: 285.50,
    previousPrice: 288.75,
    availableShares: 450,
    priceHistory: generatePriceHistory(285),
    team: "Mercedes",
    news: generateMockNews()
  }
];

function generatePriceHistory(basePrice: number) {
  const history = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 30; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    const randomChange = (Math.random() - 0.5) * 10;
    const price = basePrice + randomChange;
    history.push({ timestamp, price });
  }

  return history;
}

function generateMockNews() {
  const news: NewsItem[] = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;

  for (let i = 30; i >= 0; i--) {
    if (Math.random() > 0.7) { // 30% chance of news on any given day
      news.push({
        title: `Performance Update ${i} days ago`,
        timestamp: now - (i * dayInMs)
      });
    } else {
      news.push({ title: "", timestamp: now - (i * dayInMs) });
    }
  }

  return news;
}

export function generateNewPrice(currentPrice: number): number {
  const maxChange = currentPrice * 0.05; // 5% maximum change
  const change = (Math.random() - 0.5) * maxChange;
  return Number((currentPrice + change).toFixed(2));
}
