```markdown
    # F1 Stock Market Simulator

    A real-time Formula 1 stock market simulator with AI traders and portfolio management. This application simulates a market where users can trade F1 driver stocks while competing against AI traders using different strategies.

    ## Architecture Overview

    ```mermaid
    graph TD
        A[App] --> B[Market Overview]
        A --> C[League Portfolios]
        A --> D[Debug Controls]
        A --> E[News Feed]
        
        B --> F[Stock Cards]
        B --> G[Trade Modal]
        
        C --> H[AI Traders]
        H --> I[Trading Strategies]
        
        subgraph State Management
            J[Stock Store]
            K[League Store]
            L[Debug Store]
        end
        
        I --> M[Technical Analysis]
        I --> N[Fundamental Analysis]
    ```

    ## Core Components

    ### State Management

    The application uses Zustand for state management with three main stores:

    1. **Stock Store** (`stockStore.ts`)
       - Manages stock data and market state
       - Handles real-time price updates
       - Processes trade executions
       ```typescript
       interface StockState {
         stocks: Stock[];
         walletBalance: number;
         portfolio: { [key: string]: number };
         transactions: Transaction[];
         updateInterval: number;
         scenario: ScenarioType;
         isPaused?: boolean;
       }
       ```

    2. **League Store** (`leagueStore.ts`)
       - Manages AI trader portfolios
       - Tracks league performance
       ```typescript
       interface LeagueState {
         members: LeagueMember[];
         updateMemberPortfolios: () => void;
         executeTrades: () => void;
       }
       ```

    3. **Debug Store** (`debugStore.ts`)
       - Controls simulation debugging
       - Manages pause/resume functionality
       ```typescript
       interface DebugState {
         isDebugMode: boolean;
         isPaused: boolean;
         toggleDebugMode: () => void;
         togglePause: () => void;
       }
       ```

    ### Trading System

    #### Strategy Pattern Implementation

    The trading system uses a strategy pattern for implementing different trading algorithms:

    ```typescript
    abstract class BaseStrategy {
      abstract analyze(
        stock: Stock,
        portfolioValue: number,
        currentHoldings: number
      ): TradingDecision;
    }
    ```

    Available strategies:
    - Value Strategy: Based on fundamental analysis
    - Momentum Strategy: Based on technical analysis

    #### Analysis Tools

    1. **Technical Analysis** (`technical.ts`)
       ```typescript
       interface MomentumSignals {
         strongBuy: boolean;
         strongSell: boolean;
         rsi: number;
         macdSignal: 'buy' | 'sell' | 'neutral';
       }
       ```

    2. **Fundamental Analysis** (`fundamentals.ts`)
       ```typescript
       interface ValueMetrics {
         isUndervalued: boolean;
         isOvervalued: boolean;
         peRatio: number;
         priceToBook: number;
       }
       ```

    ## Data Flow

    1. **Price Updates**
    ```mermaid
    sequenceDiagram
        participant Timer
        participant StockStore
        participant AITraders
        participant UI
        
        Timer->>StockStore: Update Interval
        StockStore->>StockStore: Update Prices
        StockStore->>AITraders: Notify Price Change
        AITraders->>StockStore: Execute Trades
        StockStore->>UI: Render Updates
    ```

    2. **Trading Flow**
    ```mermaid
    sequenceDiagram
        participant User
        participant UI
        participant StockStore
        participant LeagueStore
        
        User->>UI: Initiate Trade
        UI->>StockStore: Execute Trade
        StockStore->>LeagueStore: Update Portfolio
        LeagueStore->>UI: Update Display
    ```

    ## Type Definitions

    Key interfaces that define the system:

    ```typescript
    interface Stock {
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

    interface NewsItem {
      title: string;
      timestamp: number;
      url?: string;
    }

    interface Transaction {
      id: string;
      stockId: string;
      type: 'buy' | 'sell';
      quantity: number;
      price: number;
      timestamp: number;
    }

    interface LeagueMember {
      id: string;
      username: string;
      algorithm: 'Conservative' | 'Aggressive' | 'Random';
      portfolioValue: number;
      holdings: MemberHolding[];
      strategy: BaseStrategy;
    }

    type ScenarioType = 'midweek' | 'raceday' | 'postseason';
    ```

    ## Market Scenarios

    The simulator supports three different market scenarios:

    1. **Mid-Week** (`midweek`)
       - Normal trading conditions
       - 3% price volatility
       - Standard trading volume

    2. **Race Day** (`raceday`)
       - High volatility trading
       - 5% price swings
       - Double trading volume
       - Race-specific news events

    3. **Post-Season** (`postseason`)
       - Lower volatility
       - 2% price swings
       - Half trading volume
       - Season wrap-up news

    ## New Features

    *   **Stock Detail Modal:** Tapping a driver card now opens a modal dialog displaying a detailed stock chart, key performance metrics (P/E ratio, EPS), and relevant statistics (volume, market cap).
    *   **News Indicators:** News indicators are displayed as small circles along the bottom of the stock chart in the modal. Clicking on an indicator shows a tooltip with the headline and a link to the article.
    *   **News Feed:** A new "News Feed" component is added below the "League Standings" section, displaying the latest news headlines, summaries, and stock indicators with positive/negative impact.
    *   **Stock Card Variants:** The `StockCard` component now renders differently based on its location. In the left sidebar, it displays a smaller, less detailed version, while in the portfolio section, it displays the full, detailed version.
    *   **Scrollable Driver List:** The driver list is now scrollable, allowing users to see more drivers at once.
    *   **Layout Adjustments:** The driver list is now positioned to the left of the portfolio section and stretches the full height of the section. The League Standings section is now positioned below the Portfolio section.

    ## Updated Functionalities

    *   **Stock Card:**
        *   Added a `variant` prop to control rendering mode.
        *   Prevented clicks on buttons from triggering the modal dialog.
        *   Simplified the sparklines for the sidebar version.
    *   **StockDetailModal:**
        *   Moved news indicators from sparklines to the main chart.
        *   Implemented tooltips for news indicators.
    *   **Index Page:**
        *   Adjusted layout to accommodate the new News Feed component and the new layout of the StockCards.
        *   Added a scrollable area for the driver list.

    ## Code Modifications

    *   Added `StockDetailModal.tsx` for the detailed stock view.
    *   Added `NewsFeed.tsx` for the news feed display.
    *   Modified `StockCard.tsx` to support different rendering modes and prevent event propagation.
    *   Modified `Index.tsx` to include the new components and adjust the layout.
    *   Updated `src/components/ui/scroll-area.tsx` to fix a `useState` error.

    ## Getting Started

    1. Clone the repository
    2. Install dependencies:
       ```bash
       npm install
       ```
    3. Start the development server:
       ```bash
       npm run dev
       ```
    4. Open http://localhost:8080 in your browser

    ## Development Guidelines

    1. **Adding New Trading Strategies**
       - Create a new class extending `BaseStrategy`
       - Implement the `analyze` method
       - Register the strategy in `leagueStore.ts`

    2. **Modifying Market Scenarios**
       - Update scenario configurations in `stockData.ts`
       - Adjust volatility and volume multipliers
       - Add relevant news items

    3. **State Management Best Practices**
       - Use appropriate store for related state
       - Maintain immutability
       - Follow Zustand patterns

    ## Project Structure

    ```
    src/
    ├── components/          # React components
    │   ├── Header.tsx      # Main navigation and controls
    │   ├── StockCard.tsx   # Individual stock display
    │   ├── StockDetailModal.tsx # Modal for detailed stock view
    │   ├── NewsFeed.tsx    # News feed component
    │   └── ...
    ├── store/              # State management
    │   ├── stockStore.ts   # Market state
    │   ├── leagueStore.ts  # AI traders
    │   └── debugStore.ts   # Debug controls
    ├── trading/            # Trading system
    │   ├── strategies/     # Trading algorithms
    │   └── analysis/       # Market analysis tools
    └── utils/              # Utility functions
        └── stockData.ts    # Market data generation
    ```

    ## Contributing

    1. Fork the repository
    2. Create a feature branch
    3. Make your changes
    4. Submit a pull request

    ## License

    This project is licensed under the MIT License - see the LICENSE file for details.
    ```
