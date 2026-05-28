import random
import uuid
from datetime import datetime, timedelta

import psycopg2
from psycopg2.extras import execute_values

import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": int(os.getenv("DB_PORT", "5432")),
}

sslmode = os.getenv("DB_SSLMODE")

if sslmode:
    DB_CONFIG["sslmode"] = sslmode

COUNTRIES = ["Costa Rica", "USA", "Mexico", "Colombia", "Spain"]
CATEGORIES = ["Electronics", "Books", "Home", "Beauty", "Sports", "Clothing"]
EVENT_TYPES = ["view", "click", "add_to_cart", "remove_from_cart", "purchase"]


def random_date(days_back: int = 180) -> datetime:
    return datetime.now() - timedelta(days=random.randint(0, days_back))


def connect():
    return psycopg2.connect(**DB_CONFIG)


def seed_users(cursor, n=300):
    users = [
        (
            f"User {i}",
            random.choice(COUNTRIES),
            random_date(365).date(),
        )
        for i in range(1, n + 1)
    ]

    execute_values(
        cursor,
        """
        INSERT INTO users (name, country, signup_date)
        VALUES %s
        """,
        users,
    )


def seed_products(cursor, n=80):
    products = []

    for i in range(1, n + 1):
        category = random.choice(CATEGORIES)
        price = round(random.uniform(10, 500), 2)
        cost = round(price * random.uniform(0.4, 0.8), 2)

        products.append(
            (
                f"Product {i}",
                category,
                price,
                cost,
            )
        )

    execute_values(
        cursor,
        """
        INSERT INTO products (name, category, price, cost)
        VALUES %s
        """,
        products,
    )


def get_ids(cursor, table, column):
    cursor.execute(f"SELECT {column} FROM {table}")
    return [row[0] for row in cursor.fetchall()]


def get_product_prices(cursor):
    cursor.execute("SELECT product_id, price FROM products")
    return dict(cursor.fetchall())


def seed_events_and_orders(cursor, n_events=8000):
    user_ids = get_ids(cursor, "users", "user_id")
    product_ids = get_ids(cursor, "products", "product_id")
    product_prices = get_product_prices(cursor)

    events = []
    orders = []

    popular_products = product_ids[:10]
    low_conversion_products = product_ids[10:20]

    for _ in range(n_events):
        user_id = random.choice(user_ids)

        product_id = random.choices(
            population=product_ids,
            weights=[
                8 if p in popular_products else
                6 if p in low_conversion_products else
                2
                for p in product_ids
            ],
            k=1,
        )[0]

        session_id = str(uuid.uuid4())
        event_time = random_date(180)

        if product_id in low_conversion_products:
            event_type = random.choices(
                EVENT_TYPES,
                weights=[70, 15, 10, 4, 1],
                k=1,
            )[0]
        elif product_id in popular_products:
            event_type = random.choices(
                EVENT_TYPES,
                weights=[40, 20, 20, 5, 15],
                k=1,
            )[0]
        else:
            event_type = random.choices(
                EVENT_TYPES,
                weights=[55, 20, 15, 5, 5],
                k=1,
            )[0]

        events.append(
            (
                user_id,
                product_id,
                event_type,
                event_time,
                session_id,
            )
        )

        if event_type == "purchase":
            quantity = random.randint(1, 3)
            revenue = round(float(product_prices[product_id]) * quantity, 2)

            orders.append(
                (
                    user_id,
                    product_id,
                    event_time,
                    quantity,
                    revenue,
                )
            )

    execute_values(
        cursor,
        """
        INSERT INTO events (user_id, product_id, event_type, event_time, session_id)
        VALUES %s
        """,
        events,
    )

    execute_values(
        cursor,
        """
        INSERT INTO orders (user_id, product_id, order_date, quantity, revenue)
        VALUES %s
        """,
        orders,
    )


def main():
    connection = connect()
    cursor = connection.cursor()

    seed_users(cursor)
    seed_products(cursor)
    seed_events_and_orders(cursor)

    connection.commit()
    cursor.close()
    connection.close()

    print("Database seeded successfully.")


if __name__ == "__main__":
    main()