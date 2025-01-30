    import React, { useState, useEffect } from "react";
    import { Card } from "@/components/ui/card";
    import { formatCurrency } from "@/utils/formatters";
    import { useStockStore } from "@/store/stockStore";

    interface NewsItem {
      title: string;
      description: string;
      url: string;
      impact: 'positive' | 'negative' | 'neutral';
      stocks: string[];
    }

    const mockNewsData: NewsItem[] = [
      {
        title: "Verstappen Dominates Qualifying",
        description: "Max Verstappen secures pole position for the upcoming race, showcasing Red Bull's strong performance.",
        url: "https://www.espn.com/f1/qualifying-results",
        impact: "positive",
        stocks: ["VER", "PER"],
      },
      {
        title: "Ferrari Faces Strategy Issues",
        description: "Ferrari's strategic decisions come under scrutiny after a disappointing qualifying session.",
        url: "https://www.espn.com/f1/ferrari-strategy-error",
        impact: "negative",
        stocks: ["LEC", "SAI"],
      },
      {
        title: "Mercedes Shows Improvement",
        description: "Mercedes demonstrates improved pace, with both drivers qualifying in the top 5.",
        url: "https://www.espn.com/f1/mercedes-improvement",
        impact: "positive",
        stocks: ["HAM", "RUS"],
      },
      {
        title: "McLaren's Norris Impresses",
        description: "Lando Norris delivers a strong performance, securing a front-row start for McLaren.",
        url: "https://www.espn.com/f1/mclaren-norris-performance",
        impact: "positive",
        stocks: ["NOR"],
      },
      {
        title: "Alpine Struggles in Qualifying",
        description: "Alpine's drivers struggle to find pace, failing to make it into Q3.",
        url: "https://www.espn.com/f1/alpine-struggles",
        impact: "negative",
        stocks: ["GAS", "OCO"],
      },
    ];

    export function NewsFeed() {
      const [news, setNews] = useState<NewsItem[]>([]);
      const { stocks } = useStockStore();

      useEffect(() => {
        // Simulate fetching data from an API
        setTimeout(() => {
          setNews(mockNewsData);
        }, 500);
      }, []);

      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">News Feed</h2>
          <div className="space-y-4">
            {news.map((item, index) => (
              <Card key={index} className="p-4">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block hover:underline">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                </a>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex items-center mt-2 space-x-2">
                  {item.stocks.map((symbol) => {
                    const stock = stocks.find((s) => s.symbol === symbol);
                    if (!stock) return null;
                    return (
                      <span key={symbol} className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                        {stock.symbol}
                        {item.impact === 'positive' && <span className="ml-1 text-success">↑</span>}
                        {item.impact === 'negative' && <span className="ml-1 text-danger">↓</span>}
                      </span>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      );
    }
