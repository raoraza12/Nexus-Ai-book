-- ============================================================
-- MIGRATION: Add AI Agent & Reading Settings to Profiles
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- ============================================================

-- Add AI Model setting
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gpt-3.5-turbo';

-- Add Persona setting
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_persona TEXT DEFAULT 'academic';

-- Add Context Depth setting
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS context_depth INTEGER DEFAULT 5;

-- Add Reading Goal setting
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS reading_goal INTEGER DEFAULT 3;

-- Notify success
DO $$ 
BEGIN 
  RAISE NOTICE 'Migration Complete: Profiles table updated with AI settings.';
END $$;
