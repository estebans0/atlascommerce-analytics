import pandas as pd

from app.analytics import get_monthly_revenue


def get_revenue_forecast():
    data = get_monthly_revenue()

    if not data:
        return []

    df = pd.DataFrame(data)
    df["month"] = pd.to_datetime(df["month"])
    df["revenue"] = df["revenue"].astype(float)

    df["moving_average"] = df["revenue"].rolling(window=3, min_periods=1).mean()

    last_month = df["month"].max()
    last_forecast = df["moving_average"].iloc[-1]

    future_months = []

    for i in range(1, 4):
        future_months.append(
            {
                "month": (last_month + pd.DateOffset(months=i)).date().isoformat(),
                "forecast_revenue": round(float(last_forecast), 2),
                "method": "3-month moving average",
            }
        )

    return future_months