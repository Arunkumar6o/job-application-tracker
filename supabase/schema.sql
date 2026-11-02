-- =====================================================================
-- Job Application Tracker - Database Schema & Row Level Security (RLS)
-- =====================================================================
-- Instructions:
-- 1. Open your Supabase project dashboard (https://supabase.com/dashboard).
-- 2. Navigate to the SQL Editor in the left navigation sidebar.
-- 3. Paste the contents of this file and click "Run".
-- =====================================================================

-- 1. Enable UUID generation extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create the `applications` table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    job_type TEXT CHECK (job_type IN ('Full-time', 'Internship', 'Part-time')),
    job_url TEXT,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('Applied', 'Assessment', 'Interview', 'Offer', 'Rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Create index for fast user queries
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_app_date ON public.applications(application_date DESC);

-- 4. Automatically update `updated_at` on row modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies to ensure users can only access their own records
-- Policy: Authenticated users can view only their own applications
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
CREATE POLICY "Users can view their own applications"
    ON public.applications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Authenticated users can insert applications only for themselves
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
CREATE POLICY "Users can insert their own applications"
    ON public.applications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can update only their own applications
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
CREATE POLICY "Users can update their own applications"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Authenticated users can delete only their own applications
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;
CREATE POLICY "Users can delete their own applications"
    ON public.applications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
