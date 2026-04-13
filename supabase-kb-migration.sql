-- Run this in your Supabase SQL editor to enable the Knowledge Base feature
-- Dashboard → SQL Editor → New Query → paste and run

CREATE TABLE IF NOT EXISTS leadforge_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE leadforge_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access
CREATE POLICY "Authenticated full access" ON leadforge_knowledge_base
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
