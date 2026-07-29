import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv('.env')
load_dotenv('backend/.env')

DATABASE_URL = os.environ.get("DATABASE_URL")

async def init_project_schema():
    if not DATABASE_URL:
        print("DATABASE_URL not found!")
        return

    print("Connecting to Supabase Database...")
    engine = create_async_engine(DATABASE_URL, echo=False)

    async with engine.begin() as conn:
        print("Step 1: Removing old/example tables...")
        old_tables = [
            "comments", "projects", "tasks", "voltix_test_records",
            "agent_logs", "agent_decisions", "supervisor_logs", "consensus_logs",
            "negotiations", "telemetry", "sensor_health", "sensors", "devices",
            "zones", "floors", "buildings", "report_downloads", "reports",
            "alert_history", "alerts", "notifications", "audit_logs",
            "api_keys", "settings", "maintenance", "equipment",
            "optimization_history", "simulation_runs", "scenarios",
            "role_permissions", "permissions", "roles", "users", "organizations"
        ]
        for tbl in old_tables:
            await conn.execute(text(f"DROP TABLE IF EXISTS {tbl} CASCADE;"))
        print("[OK] All old/example tables successfully deleted from Supabase!")

        print("Step 2: Creating Voltix domain tables (Users, Buildings, Sensors, Agents, Reports, Analytics)...")
        
        # 1. Organizations
        await conn.execute(text("""
            CREATE TABLE organizations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                is_active BOOLEAN DEFAULT TRUE NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 2. Users
        await conn.execute(text("""
            CREATE TABLE users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                hashed_password VARCHAR(255),
                full_name VARCHAR(255),
                role VARCHAR(50) DEFAULT 'Viewer' NOT NULL,
                is_active BOOLEAN DEFAULT TRUE NOT NULL,
                is_superuser BOOLEAN DEFAULT FALSE NOT NULL,
                is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
                supabase_uid VARCHAR(255) UNIQUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 3. Buildings, Floors, Zones
        await conn.execute(text("""
            CREATE TABLE buildings (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(500),
                total_floors INT DEFAULT 1,
                total_area_sqft DOUBLE PRECISION,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE floors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
                floor_number INT NOT NULL,
                name VARCHAR(255),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE zones (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                floor_id UUID REFERENCES floors(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                zone_type VARCHAR(100),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 4. Devices & Sensors
        await conn.execute(text("""
            CREATE TABLE devices (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                device_type VARCHAR(100) NOT NULL,
                status VARCHAR(50) DEFAULT 'active',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE sensors (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                sensor_type VARCHAR(100) NOT NULL,
                unit VARCHAR(50),
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 5. Analytics & Telemetry Data
        await conn.execute(text("""
            CREATE TABLE telemetry (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
                metric_name VARCHAR(100) NOT NULL,
                metric_value DOUBLE PRECISION NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        """))

        await conn.execute(text("""
            CREATE TABLE sensor_health (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                sensor_id UUID REFERENCES sensors(id) ON DELETE CASCADE,
                battery_percentage INT,
                signal_strength INT,
                last_ping TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 6. Agents (Decisions, Logs, Negotiations)
        await conn.execute(text("""
            CREATE TABLE agent_decisions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_id VARCHAR(100) NOT NULL,
                scenario_id VARCHAR(100),
                action VARCHAR(255) NOT NULL,
                reason TEXT,
                confidence DOUBLE PRECISION,
                status VARCHAR(50) DEFAULT 'completed',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE agent_logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                agent_name VARCHAR(100) NOT NULL,
                log_level VARCHAR(20) DEFAULT 'INFO',
                message TEXT NOT NULL,
                details JSONB,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE negotiations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                session_id VARCHAR(100) NOT NULL,
                from_agent VARCHAR(100) NOT NULL,
                to_agent VARCHAR(100),
                message_type VARCHAR(50),
                content TEXT NOT NULL,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 7. Reports & Downloads
        await conn.execute(text("""
            CREATE TABLE reports (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                report_type VARCHAR(100) NOT NULL,
                generated_by UUID REFERENCES users(id) ON DELETE SET NULL,
                file_url VARCHAR(500),
                status VARCHAR(50) DEFAULT 'generated',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        await conn.execute(text("""
            CREATE TABLE report_downloads (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        # 8. Alerts
        await conn.execute(text("""
            CREATE TABLE alerts (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                title VARCHAR(255) NOT NULL,
                severity VARCHAR(50) NOT NULL,
                source VARCHAR(100),
                message TEXT,
                is_acknowledged BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        """))

        print("\n=========================================================")
        print("SUCCESS: ALL PREVIOUS TABLES DELETED AND PROJECT TABLES CREATED!")
        print("=========================================================")

if __name__ == "__main__":
    import sys
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(init_project_schema())
