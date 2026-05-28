import os
from datetime import date, datetime
from decimal import Decimal

import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "database": os.getenv("DB_NAME", "atlascommerce"),
    "user": os.getenv("DB_USER", "atlas_user"),
    "password": os.getenv("DB_PASSWORD", "atlas_pass"),
    "port": int(os.getenv("DB_PORT", "5433")),
}

sslmode = os.getenv("DB_SSLMODE")

if sslmode:
    DB_CONFIG["sslmode"] = sslmode


def serialize_value(value):
    if isinstance(value, Decimal):
        return float(value)

    if isinstance(value, (date, datetime)):
        return value.isoformat()

    return value


def serialize_row(row):
    return {key: serialize_value(value) for key, value in row.items()}


def get_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)


def fetch_all(query: str, params: tuple = ()):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [serialize_row(row) for row in rows]
    finally:
        cursor.close()
        connection.close()


def fetch_one(query: str, params: tuple = ()):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(query, params)
        row = cursor.fetchone()
        return serialize_row(row) if row else None
    finally:
        cursor.close()
        connection.close()