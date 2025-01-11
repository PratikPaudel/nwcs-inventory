import os
from dotenv import load_dotenv
from supabase import create_client, Client
from typing import Optional

# Load environment variables
load_dotenv()


class Database:
    _instance: Optional[Client] = None

    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_KEY")

            if not supabase_url or not supabase_key:
                raise ValueError(
                    "Missing Supabase credentials in environment variables"
                )

            cls._instance = create_client(supabase_url, supabase_key)

        return cls._instance


# Create a convenience instance
supabase = Database.get_client()
