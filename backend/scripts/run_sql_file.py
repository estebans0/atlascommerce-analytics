import os
import sys

import psycopg2
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


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/run_sql_file.py <path_to_sql_file>")
        sys.exit(1)

    sql_file_path = sys.argv[1]

    with open(sql_file_path, "r", encoding="utf-8") as file:
        sql = file.read()

    connection = psycopg2.connect(**DB_CONFIG)
    cursor = connection.cursor()

    try:
        cursor.execute(sql)
        connection.commit()
        print(f"Executed SQL file successfully: {sql_file_path}")
    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    main()