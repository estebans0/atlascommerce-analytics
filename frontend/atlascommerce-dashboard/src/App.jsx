import { useEffect, useMemo, useState } from "react";
import {
  getTotalRevenue,
  getRevenueByCategory,
  getEventCounts,
  getConversionRates,
  getUnderperformingProducts,
  getMonthlyRevenue,
  getMonthlyGrowth,
  getRevenueForecast,
  getRecommendations,
} from "./api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./App.css";

function InfoTooltip({ text }) {
  return (
    <span className="info-tooltip" tabIndex="0">
      ?
      <span className="tooltip-content">{text}</span>
    </span>
  );
}

function SectionHeader({ title, description, tooltip }) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
  );
}

function formatCurrency(value) {
  if (value === null || value === undefined) return "$0";
  return Number(value).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "N/A";
  }

  return `${(Number(value) * 100).toFixed(2)}%`;
}

function App() {
  const [theme, setTheme] = useState("light");
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [eventCounts, setEventCounts] = useState([]);
  const [conversionRates, setConversionRates] = useState([]);
  const [underperforming, setUnderperforming] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const results = await Promise.allSettled([
          getTotalRevenue(),
          getRevenueByCategory(),
          getEventCounts(),
          getConversionRates(),
          getUnderperformingProducts(),
          getMonthlyRevenue(),
          getMonthlyGrowth(),
          getRevenueForecast(),
          getRecommendations(1),
        ]);

        const getValue = (index, fallback) =>
          results[index].status === "fulfilled" ? results[index].value : fallback;

        setTotalRevenue(getValue(0, { total_revenue: 0 }));
        setRevenueByCategory(getValue(1, []));
        setEventCounts(getValue(2, []));
        setConversionRates(getValue(3, []));
        setUnderperforming(getValue(4, []));
        setMonthlyRevenue(getValue(5, []));
        setMonthlyGrowth(getValue(6, []));
        setForecast(getValue(7, []));
        setRecommendations(getValue(8, []));
      } catch (error) {
        console.error("Unexpected dashboard error:", error);
        setLoadError(
          "Unable to initialize the dashboard. Please verify that the backend API is available."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const bestCategory = useMemo(() => {
    if (!revenueByCategory.length) return "N/A";
    return revenueByCategory[0]?.category ?? "N/A";
  }, [revenueByCategory]);

  const topConversionProduct = useMemo(() => {
    if (!conversionRates.length) return "N/A";
    return conversionRates[0]?.name ?? "N/A";
  }, [conversionRates]);

  if (loading) {
    return (
      <div className="app center-screen">
        <div className="loading-card">
          <div className="spinner" />
          <h2>Loading AtlasCommerce Analytics</h2>
          <p>Preparing business metrics, forecasting, and recommendations.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="app center-screen">
        <div className="error-card">
          <h2>Dashboard unavailable</h2>
          <p>{loadError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">E-commerce Intelligence Platform</p>
          <h1>AtlasCommerce Analytics</h1>
          <p className="hero-description">
            User behavior tracking, product analytics, forecasting, and recommendation insights
            for data-driven business decisions.
          </p>
        </div>

        <button
          className={`theme-switch ${theme === "dark" ? "is-dark" : "is-light"}`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          <span className="theme-icon sun-icon">☀</span>
          <span className="theme-icon moon-icon">☾</span>
          <span className="theme-thumb" />
        </button>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card featured">
          <span>Total Revenue</span>
          <strong>{formatCurrency(totalRevenue?.total_revenue)}</strong>
          <small>Generated from synthetic order data</small>
        </div>

        <div className="kpi-card">
          <span>Top Category</span>
          <strong>{bestCategory}</strong>
          <small>Highest revenue contributor</small>
        </div>

        <div className="kpi-card">
          <span>Event Types</span>
          <strong>{eventCounts.length}</strong>
          <small>Tracked user interaction types</small>
        </div>

        <div className="kpi-card">
          <span>Best Converter</span>
          <strong>{topConversionProduct}</strong>
          <small>Highest view-to-purchase conversion</small>
        </div>
      </section>

      <section className="grid">
        <div className="card">
          <SectionHeader
            title="Revenue by Category"
            description="Identifies which product categories generate the most revenue."
            tooltip="This chart groups orders by product category and sums total revenue. It helps prioritize categories for investment, inventory, or promotion."
          />

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByCategory}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="total_revenue" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHeader
            title="Monthly Revenue"
            description="Shows how revenue evolves over time."
            tooltip="This line chart aggregates revenue by month. It helps detect seasonality, growth, drops, or unusual business behavior."
          />

          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Line
                type="monotone"
                dataKey="revenue"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHeader
            title="Event Counts"
            description="Breakdown of tracked user actions."
            tooltip="Events include views, clicks, add-to-cart actions, removals, and purchases. This helps understand user engagement across the shopping funnel."
          />

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={eventCounts}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="event_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <SectionHeader
            title="Monthly Growth"
            description="Compares revenue against the previous month."
            tooltip="Growth rate shows whether revenue increased or decreased compared with the previous month. This is useful for business trend analysis."
          />

          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {monthlyGrowth.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>{formatCurrency(item.revenue)}</td>
                  <td>
                    <span
                      className={
                        item.growth_rate === null
                          ? "badge neutral"
                          : Number(item.growth_rate) >= 0
                          ? "badge positive"
                          : "badge negative"
                      }
                    >
                      {formatPercent(item.growth_rate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid secondary-grid">
        <div className="card">
          <SectionHeader
            title="Revenue Forecast"
            description="Simple baseline estimate using a moving average."
            tooltip="This forecast uses a 3-month moving average. It is intentionally simple and explainable as a baseline forecasting model."
          />

          <div className="forecast-list">
            {forecast.map((item) => (
              <div className="forecast-item" key={item.month}>
                <span>{item.month}</span>
                <strong>{formatCurrency(item.forecast_revenue)}</strong>
                <small>{item.method}</small>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <SectionHeader
            title="Recommendations for User 1"
            description="Behavior-based product suggestions."
            tooltip="Recommendations are generated using category affinity and product popularity. In production, this could evolve into collaborative filtering or embedding-based recommendations."
          />

          <div className="recommendation-list">
            {recommendations.map((item) => (
              <div className="recommendation-item" key={item.product_id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.category}</span>
                </div>
                <span className="score">Score {item.popularity_score}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <SectionHeader
          title="Underperforming Products"
          description="Products with high interest but weak conversion."
          tooltip="These products receive many views but few purchases. They may need pricing review, better product information, stock validation, UX improvements, or promotion adjustments."
        />

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Views</th>
              <th>Purchases</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {underperforming.map((item) => (
              <tr key={item.product_id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.views}</td>
                <td>{item.purchases}</td>
                <td>{formatPercent(item.conversion_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <SectionHeader
          title="Top Conversion Rates"
          description="Products with the strongest view-to-purchase performance."
          tooltip="This table highlights products that convert user interest into purchases more effectively than others."
        />

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Views</th>
              <th>Purchases</th>
              <th>Conversion</th>
            </tr>
          </thead>
          <tbody>
            {conversionRates.slice(0, 10).map((item) => (
              <tr key={item.product_id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.views}</td>
                <td>{item.purchases}</td>
                <td>{formatPercent(item.conversion_rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;