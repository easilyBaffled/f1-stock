export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  availableShares: number;
  priceHistory: { timestamp: number; price: number }[];
}

export const mockStocks: Stock[] = [
  {
    id: "1",
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 150.25,
    previousPrice: 149.75,
    availableShares: 1000,
    priceHistory: generatePriceHistory(150),
  },
  {
    id: "2",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 2750.50,
    previousPrice: 2755.25,
    availableShares: 500,
    priceHistory: generatePriceHistory(2750),
  },
  {
    id: "3",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 310.75,
    previousPrice: 309.50,
    availableShares: 750,
    priceHistory: generatePriceHistory(310),
  },
  {
    id: "4",
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 3300.00,
    previousPrice: 3295.50,
    availableShares: 300,
    priceHistory: generatePriceHistory(3300),
  },
  {
    id: "5",
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 875.25,
    previousPrice: 880.00,
    availableShares: 600,
    priceHistory: generatePriceHistory(875),
  },
  {
    id: "6",
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 330.50,
    previousPrice: 328.75,
    availableShares: 450,
    priceHistory: generatePriceHistory(330),
  },
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

export function generateNewPrice(currentPrice: number): number {
  const maxChange = currentPrice * 0.05; // 5% maximum change
  const change = (Math.random() - 0.5) * maxChange;
  return Number((currentPrice + change).toFixed(2));
}