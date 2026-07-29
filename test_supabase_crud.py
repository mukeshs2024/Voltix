import asyncio
import os
import uuid
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv('.env')
load_dotenv('backend/.env')

DATABASE_URL = os.environ.get("DATABASE_URL")

async def test_write_read_supabase():
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return

    print("Connecting to Supabase Database...")
    engine = create_async_engine(DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        # Create dedicated test table
        await conn.execute(text("""
            CREATE TABLE IF NOT EXISTS voltix_test_records (
                id UUID PRIMARY KEY,
                test_name VARCHAR(255) NOT NULL,
                message VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))
        print("[OK] 'voltix_test_records' table ready in Supabase!")

    record_id = str(uuid.uuid4())
    test_message = f"Supabase Store Test - {record_id[:8]}"

    async with async_session() as session:
        print(f"Inserting test record into Supabase...")
        await session.execute(
            text("""
                INSERT INTO voltix_test_records (id, test_name, message)
                VALUES (:id, :test_name, :message)
            """),
            {
                "id": record_id,
                "test_name": "Supabase Connection Verification",
                "message": test_message
            }
        )
        await session.commit()
        print("[OK] Data successfully INSERTED and COMMITTED to Supabase DB!")

    async with async_session() as session:
        print("Fetching inserted record back from Supabase...")
        result = await session.execute(
            text("SELECT id, test_name, message, created_at FROM voltix_test_records WHERE id = :id"),
            {"id": record_id}
        )
        row = result.fetchone()
        if row:
            print("\n=========================================================")
            print("SUCCESS: DATA STORED & VERIFIED IN SUPABASE DATABASE!")
            print("=========================================================")
            print(f" Record ID   : {row[0]}")
            print(f" Test Name   : {row[1]}")
            print(f" Message     : {row[2]}")
            print(f" Stored At   : {row[3]}")
            print("=========================================================\n")

if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(test_write_read_supabase())
