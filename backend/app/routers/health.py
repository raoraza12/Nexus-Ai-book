from fastapi import APIRouter, Depends
from supabase import Client
from app.dependencies import get_supabase, get_current_user
from app.config import get_settings, Settings

router = APIRouter(prefix="/health-check", tags=["Health"])


@router.get("", summary="Protected Health Check")
async def health_check(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase),
    settings: Settings = Depends(get_settings),
):
    """
    Protected endpoint — requires a valid Supabase JWT.
    Verifies:
      1. JWT is valid (handled by get_current_user dependency)
      2. Supabase connection is alive (pings the profiles table)
    """
    try:
        # Lightweight ping — fetch 1 row limit to verify DB connectivity
        result = supabase.table("profiles").select("id").limit(1).execute()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "app": settings.app_name,
        "version": settings.app_version,
        "database": db_status,
        "authenticated_user_id": current_user.get("sub"),
    }
