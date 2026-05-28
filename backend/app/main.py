import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.analytics import (
    get_total_revenue,
    get_revenue_by_category,
    get_event_counts,
    get_product_conversion_rates,
    get_underperforming_products,
    get_monthly_revenue,
    get_monthly_revenue_growth,
    get_abandoned_carts,
)
from app.forecasting import get_revenue_forecast
from app.recommender import get_recommendations_for_user

app = FastAPI(title="AtlasCommerce Analytics API")

frontend_url = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "AtlasCommerce Analytics API"}


@app.get("/analytics/total-revenue")
def total_revenue():
    return get_total_revenue()


@app.get("/analytics/revenue-by-category")
def revenue_by_category():
    return get_revenue_by_category()


@app.get("/analytics/interaction-summary")
def interaction_summary():
    return get_event_counts()


@app.get("/analytics/conversion-rates")
def conversion_rates():
    return get_product_conversion_rates()


@app.get("/analytics/underperforming-products")
def underperforming_products():
    return get_underperforming_products()


@app.get("/analytics/monthly-revenue")
def monthly_revenue():
    return get_monthly_revenue()


@app.get("/analytics/monthly-growth")
def monthly_growth():
    return get_monthly_revenue_growth()


@app.get("/analytics/abandoned-carts")
def abandoned_carts():
    return get_abandoned_carts()


@app.get("/forecast/revenue")
def revenue_forecast():
    return get_revenue_forecast()


@app.get("/recommendations/{user_id}")
def recommendations(user_id: int):
    return get_recommendations_for_user(user_id)