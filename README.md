# AtlasCommerce Analytics / User Behavior Tracker

AtlasCommerce Analytics is an end-to-end analytics platform designed to track e-commerce user behavior, transform raw interaction data into business insights, identify underperforming products, forecast revenue trends, and generate behavior-based product recommendations.

The project was built as a practical AI/Data Analytics and Software Engineering portfolio project using **Python, SQL, PostgreSQL, FastAPI, React, forecasting, and recommendation logic**.

---

## Live Demo

* **Frontend Dashboard:** https://atlascommerce-analytics.vercel.app/
* **Backend API Docs:** https://atlascommerce-analytics.onrender.com/

---

## Project Objective

The objective of this project is to simulate how an e-commerce company can use behavioral data to answer relevant business questions:

* Which product categories generate the most revenue?
* Which products receive attention but fail to convert?
* How does revenue evolve over time?
* Which products show strong conversion performance?
* What products should be recommended to a user?
* How could this analytics layer support an AI agent or business intelligence assistant?

The project focuses on transforming raw user events into business-readable insights through a complete analytics workflow.

---

## Business Problem

E-commerce platforms collect large volumes of user interaction data, but raw events alone do not provide business value.

A product may receive many views but few purchases. This could indicate:

* Pricing issues.
* Poor product descriptions.
* Inventory or availability problems.
* UX friction.
* Weak product-market fit.
* Mismatch between user expectations and the product offering.

AtlasCommerce Analytics helps identify these situations by calculating metrics such as conversion rate, revenue by category, monthly growth, and underperforming products.

---

## Main Features

* Synthetic e-commerce user behavior data generation.
* PostgreSQL relational data model.
* SQL-based analytics queries.
* FastAPI backend exposing analytics endpoints.
* React dashboard for business-readable insights.
* Revenue by category analysis.
* Monthly revenue trend analysis.
* Monthly growth calculation.
* User activity summary.
* Underperforming product detection.
* Top conversion rate analysis.
* Revenue forecasting using a moving average baseline.
* Behavior-based product recommendations.
* Light/dark mode dashboard UI.
* Explanation tooltips for charts and business metrics.
* Production-style frontend/backend separation.
* Cloud deployment using Vercel, Render, and Neon PostgreSQL.

---

## Tech Stack

### Backend

* Python
* FastAPI
* PostgreSQL
* psycopg2
* pandas
* SQL
* Uvicorn

### Frontend

* React
* Vite
* Axios
* Recharts
* CSS custom properties
* Light/dark theme support

### Database

* PostgreSQL
* Neon PostgreSQL for cloud deployment

### Deployment

* Vercel for frontend deployment
* Render for backend deployment
* Neon for cloud PostgreSQL database

### Analytics

* SQL aggregation
* Conversion rate analysis
* Revenue trend analysis
* Monthly growth analysis
* Underperforming product detection
* Moving average forecasting
* Behavior-based recommendation logic

---

## Architecture

```text
React Dashboard
      |
      | HTTP requests
      v
FastAPI Backend
      |
      | SQL queries
      v
PostgreSQL Database
      |
      v
Users, Products, Events, Orders
```

### Deployment Architecture

```text
Vercel Frontend
      |
      | HTTPS API calls
      v
Render FastAPI Backend
      |
      | Secure PostgreSQL connection
      v
Neon PostgreSQL Database
```

---

## Data Model

The project uses four main entities.

### Users

Stores synthetic user profiles.

```text
user_id
name
country
signup_date
```

### Products

Stores product catalog information.

```text
product_id
name
category
price
cost
```

### Events

Stores user behavior interactions.

```text
event_id
user_id
product_id
event_type
event_time
session_id
```

Supported interaction types:

```text
view
click
add_to_cart
remove_from_cart
purchase
```

### Orders

Stores purchase transactions.

```text
order_id
user_id
product_id
order_date
quantity
revenue
```

---

## Key Analytics Metrics

### Total Revenue

Calculates the total revenue generated from all orders.

### Revenue by Category

Aggregates revenue by product category to identify the strongest business segments.

### User Activity Summary

Shows the volume of user interactions by type, helping analyze engagement across the shopping funnel.

### Conversion Rate

Measures how effectively products convert views into purchases.

```text
conversion_rate = purchases / views
```

### Underperforming Products

Identifies products with high views but low conversion.

These products may require business review in areas such as:

* Pricing.
* Product content.
* Inventory.
* Promotion strategy.
* User experience.

### Monthly Revenue

Aggregates revenue by month to show business performance over time.

### Monthly Growth

Compares each month’s revenue against the previous month.

```text
growth_rate = (current_month_revenue - previous_month_revenue) / previous_month_revenue
```

### Revenue Forecast

Uses a simple 3-month moving average as a baseline forecasting method.

This is intentionally explainable and suitable as a first version. A production system could improve it with seasonality-aware models or machine learning forecasting techniques.

### Recommendations

Generates product recommendations using:

* User category affinity.
* Product popularity.
* Previous user interactions.
* Exclusion of already purchased products.

---

## API Endpoints

| Endpoint                              | Description                                         |
| ------------------------------------- | --------------------------------------------------- |
| `/`                                   | Health check                                        |
| `/analytics/total-revenue`            | Returns total revenue                               |
| `/analytics/revenue-by-category`      | Returns revenue grouped by category                 |
| `/analytics/interaction-summary`      | Returns user interaction counts by type             |
| `/analytics/conversion-rates`         | Returns product-level conversion rates              |
| `/analytics/underperforming-products` | Returns products with high views and low conversion |
| `/analytics/monthly-revenue`          | Returns monthly revenue trend                       |
| `/analytics/monthly-growth`           | Returns month-over-month revenue growth             |
| `/analytics/abandoned-carts`          | Returns abandoned cart candidates                   |
| `/forecast/revenue`                   | Returns a simple revenue forecast                   |
| `/recommendations/{user_id}`          | Returns behavior-based recommendations for a user   |

---

## Dashboard

The React dashboard presents the analytics layer in a business-readable way.

It includes:

* KPI cards.
* Revenue by category chart.
* Monthly revenue chart.
* User activity summary chart.
* Monthly growth table.
* Revenue forecast cards.
* Underperforming products table.
* Top conversion rates table.
* Recommendations for a sample user.
* Light/dark mode toggle.
* Contextual explanation tooltips.

The goal is not only to expose raw API endpoints, but to present insights in a way that a business team could understand and use for decision-making.

---

## AI Agent Extension

This project can be extended into an AI agent or analytics assistant.

A business user could ask:

> Which products are losing conversion despite high user interest?

The AI agent would:

1. Interpret the business question.
2. Map the question to a trusted metric definition.
3. Query PostgreSQL or a data platform such as Snowflake.
4. Validate the result.
5. Return a business-readable explanation.

In a production environment, this could be connected to a semantic layer to ensure consistent definitions for metrics such as revenue, conversion rate, active users, and product performance.

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/atlascommerce-analytics.git
cd atlascommerce-analytics
```

### 2. Start PostgreSQL with Docker

```powershell
docker run --name atlas-postgres `
  -e POSTGRES_USER=atlas_user `
  -e POSTGRES_PASSWORD=atlas_pass `
  -e POSTGRES_DB=atlascommerce `
  -p 5433:5432 `
  -d postgres
```

### 3. Create database tables

```powershell
docker cp backend/scripts/create_tables.sql atlas-postgres:/create_tables.sql
docker exec -it atlas-postgres psql -U atlas_user -d atlascommerce -f /create_tables.sql
```

### 4. Configure backend environment variables

Create `backend/.env`:

```env
DB_HOST=127.0.0.1
DB_NAME=atlascommerce
DB_USER=atlas_user
DB_PASSWORD=atlas_pass
DB_PORT=5433
```

For a cloud database such as Neon:

```env
DB_HOST=your_neon_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_PORT=5432
DB_SSLMODE=require
```

### 5. Install backend dependencies

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 6. Seed synthetic data

```powershell
python scripts\seed_data.py
```

### 7. Run FastAPI backend

```powershell
uvicorn app.main:app --reload --host localhost --port 8000
```

Backend docs:

```text
http://localhost:8000/docs
```

### 8. Run React frontend

Open a new terminal:

```powershell
cd frontend\atlascommerce-dashboard
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Deployment

Recommended deployment architecture:

```text
Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL
```

### Backend Deployment

Deploy the `backend` folder as a Render Web Service.

Recommended settings:

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Required environment variables:

```env
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_PORT=5432
DB_SSLMODE=require
FRONTEND_URL=*
```

### Frontend Deployment

Deploy `frontend/atlascommerce-dashboard` as a Vercel project.

Recommended settings:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
Root Directory: frontend/atlascommerce-dashboard
```

Required environment variable:

```env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

---

## Environment Variables

### Backend

Create `backend/.env.example`:

```env
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_PORT=5432
DB_SSLMODE=require
FRONTEND_URL=*
```

### Frontend

Create `frontend/atlascommerce-dashboard/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

---

## Security Notes

Do not commit real `.env` files or database credentials.

Recommended `.gitignore` entries:

```gitignore
backend/.venv/
__pycache__/
*.pyc
.env
backend/.env
frontend/.env
frontend/atlascommerce-dashboard/.env
node_modules/
dist/
build/
.ipynb_checkpoints/
```

---

## Future Improvements

* Add authentication and role-based access.
* Replace PostgreSQL with Snowflake for cloud-scale analytics.
* Add a semantic layer for trusted metric definitions.
* Add a natural language AI analytics assistant.
* Add real-time event ingestion.
* Add automated data quality checks.
* Add unit and integration tests.
* Add CI/CD pipelines.
* Improve forecasting with seasonality-aware models.
* Improve recommendations with collaborative filtering or embeddings.
* Add product-level drill-down pages.
* Add customer segmentation.
* Add anomaly detection for sudden metric changes.
