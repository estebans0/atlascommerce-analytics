-- Total revenue
SELECT
    SUM(revenue) AS total_revenue
FROM orders;

-- Revenue by category
SELECT
    p.category,
    SUM(o.revenue) AS total_revenue
FROM orders o
JOIN products p
    ON o.product_id = p.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;

-- Event counts
SELECT
    event_type,
    COUNT(*) AS total_events
FROM events
GROUP BY event_type
ORDER BY total_events DESC;

-- Conversion rate by product
WITH product_events AS (
    SELECT
        product_id,
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS purchases
    FROM events
    GROUP BY product_id
)
SELECT
    p.product_id,
    p.name,
    p.category,
    pe.views,
    pe.purchases,
    ROUND(pe.purchases * 1.0 / NULLIF(pe.views, 0), 4) AS conversion_rate
FROM product_events pe
JOIN products p
    ON pe.product_id = p.product_id
ORDER BY conversion_rate DESC NULLS LAST;

-- Underperforming products: high views, low conversion
WITH product_events AS (
    SELECT
        product_id,
        SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) AS views,
        SUM(CASE WHEN event_type = 'purchase' THEN 1 ELSE 0 END) AS purchases
    FROM events
    GROUP BY product_id
),
metrics AS (
    SELECT
        product_id,
        views,
        purchases,
        purchases * 1.0 / NULLIF(views, 0) AS conversion_rate
    FROM product_events
)
SELECT
    p.product_id,
    p.name,
    p.category,
    m.views,
    m.purchases,
    ROUND(m.conversion_rate, 4) AS conversion_rate
FROM metrics m
JOIN products p
    ON m.product_id = p.product_id
WHERE m.views >= 50
ORDER BY m.conversion_rate ASC NULLS LAST
LIMIT 10;

-- Monthly revenue
SELECT
    DATE_TRUNC('month', order_date)::date AS month,
    SUM(revenue) AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', order_date)
ORDER BY month;

-- Monthly revenue growth
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', order_date)::date AS month,
        SUM(revenue) AS revenue
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
growth AS (
    SELECT
        month,
        revenue,
        LAG(revenue) OVER (ORDER BY month) AS previous_revenue
    FROM monthly_revenue
)
SELECT
    month,
    revenue,
    previous_revenue,
    ROUND(
        (revenue - previous_revenue) * 1.0 / NULLIF(previous_revenue, 0),
        4
    ) AS growth_rate
FROM growth;

-- Abandoned carts
WITH cart_events AS (
    SELECT
        user_id,
        product_id,
        COUNT(*) FILTER (WHERE event_type = 'add_to_cart') AS add_to_cart_count,
        COUNT(*) FILTER (WHERE event_type = 'purchase') AS purchase_count
    FROM events
    GROUP BY user_id, product_id
)
SELECT
    user_id,
    product_id,
    add_to_cart_count,
    purchase_count
FROM cart_events
WHERE add_to_cart_count > 0
  AND purchase_count = 0;