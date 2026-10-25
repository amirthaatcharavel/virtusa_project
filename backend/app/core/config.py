import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Regulatory Change Intelligence Platform"
    PROJECT_DESCRIPTION: str = "Enterprise workbench transforming regulatory circulars into source-traceable, testable, human-approved decision-rule changes."
    VERSION: str = "1.0.0"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./regulatory_platform.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # AI / LLM Configuration
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "deterministic_fallback")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    
    # Demo and Sandbox Settings
    DEMO_MODE: bool = True
    SANDBOX_ENVIRONMENT: str = "demo-sandbox-v1"
    
    # File storage
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    MAX_UPLOAD_SIZE_MB: int = 25

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
