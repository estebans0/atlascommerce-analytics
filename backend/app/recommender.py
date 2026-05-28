from app.database import fetch_all


def get_recommendations_for_user(user_id: int):
    query = """
        WITH user_categories AS (
            SELECT
                p.category,
                COUNT(*) AS interactions
            FROM events e
            JOIN products p
                ON e.product_id = p.product_id
            WHERE e.user_id = %s
            GROUP BY p.category
        ),
        purchased_products AS (
            SELECT DISTINCT product_id
            FROM orders
            WHERE user_id = %s
        ),
        popular_products AS (
            SELECT
                p.product_id,
                p.name,
                p.category,
                COUNT(*) AS popularity_score
            FROM events e
            JOIN products p
                ON e.product_id = p.product_id
            WHERE e.event_type IN ('view', 'click', 'add_to_cart', 'purchase')
            GROUP BY p.product_id, p.name, p.category
        )
        SELECT
            pp.product_id,
            pp.name,
            pp.category,
            pp.popularity_score
        FROM popular_products pp
        JOIN user_categories uc
            ON pp.category = uc.category
        LEFT JOIN purchased_products purchased
            ON pp.product_id = purchased.product_id
        WHERE purchased.product_id IS NULL
        ORDER BY uc.interactions DESC, pp.popularity_score DESC
        LIMIT 5;
    """

    return fetch_all(query, (user_id, user_id))