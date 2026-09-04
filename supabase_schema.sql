-- ================================================================
-- FURSAD Platform - Supabase Database Schema
-- Run this SQL in your Supabase Dashboard -> SQL Editor
-- ================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  avatar TEXT,
  country_origin TEXT DEFAULT 'Somalia',
  current_country TEXT DEFAULT 'Somalia',
  current_city TEXT DEFAULT 'Mogadishu',
  education_level TEXT DEFAULT 'bachelor',
  field_of_study TEXT DEFAULT 'Computer Science & Technology',
  graduation_year INT DEFAULT 2026,
  skills TEXT[] DEFAULT ARRAY['Academic Research', 'Leadership', 'English Writing'],
  languages TEXT[] DEFAULT ARRAY['Somali', 'English', 'Arabic'],
  has_ielts BOOLEAN DEFAULT false,
  has_toefl BOOLEAN DEFAULT false,
  has_moi_certificate BOOLEAN DEFAULT true,
  preferred_countries TEXT[] DEFAULT ARRAY['Turkey', 'Germany', 'United Kingdom', 'Canada'],
  preferred_categories TEXT[] DEFAULT ARRAY['scholarship', 'fellowship', 'internship'],
  funding_preference TEXT DEFAULT 'fully_funded',
  career_goals TEXT,
  profile_strength INT DEFAULT 80,
  subscription TEXT DEFAULT 'free',
  notifications_enabled BOOLEAN DEFAULT true,
  saved_opp_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Opportunities Table
CREATE TABLE IF NOT EXISTS public.opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT,
  funding_type TEXT NOT NULL,
  degree_level TEXT[] DEFAULT ARRAY['bachelor', 'master'],
  field_of_study TEXT[] DEFAULT ARRAY['All Fields'],
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT[] DEFAULT ARRAY[]::TEXT[],
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
  deadline TEXT NOT NULL,
  application_url TEXT NOT NULL,
  source_url TEXT NOT NULL,
  accepts_moi BOOLEAN DEFAULT true,
  requires_ielts BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Applications (Tracker) Table
CREATE TABLE IF NOT EXISTS public.applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  opportunity_id TEXT NOT NULL,
  opportunity_title TEXT NOT NULL,
  organization TEXT NOT NULL,
  country TEXT NOT NULL,
  flag TEXT DEFAULT '🌍',
  category TEXT DEFAULT 'scholarship',
  funding_type TEXT DEFAULT 'fully_funded',
  deadline TEXT NOT NULL,
  application_url TEXT,
  status TEXT DEFAULT 'interested',
  progress INT DEFAULT 20,
  sop_status TEXT DEFAULT 'not_started',
  lor_status TEXT DEFAULT 'not_started',
  transcripts_ready BOOLEAN DEFAULT false,
  cv_ready BOOLEAN DEFAULT false,
  checklist JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  applied_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL,
  opportunity_title TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  reporter_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Allow Public / Authenticated Read & Write Policies
CREATE POLICY "Public Read Opportunities" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Admin Insert/Update Opportunities" ON public.opportunities FOR ALL USING (true);

CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Users can manage own applications" ON public.applications FOR ALL USING (true);
CREATE POLICY "Public Insert Reports" ON public.reports FOR INSERT WITH CHECK (true);
