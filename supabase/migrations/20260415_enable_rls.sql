-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — Enable on all portal tables
-- Run this in the Supabase SQL Editor (Project > SQL Editor)
-- ═══════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────
-- HELPER: role-check functions (avoids repetitive subqueries)
-- ──────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'primary_admin')
  );
$$;

CREATE OR REPLACE FUNCTION is_practitioner_or_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
  );
$$;


-- ══════════════════════════════════════════════════════
-- PROFILES
-- ══════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Any authenticated portal user can read all profiles
-- (needed so admin pages can list practitioners, and practitioners
--  can see their own data)
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT TO authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Only admins can insert (invite new users) or delete profiles
CREATE POLICY "profiles_insert_admin" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "profiles_delete_admin" ON profiles
  FOR DELETE TO authenticated
  USING (is_admin());


-- ══════════════════════════════════════════════════════
-- PROGRAMS
-- ══════════════════════════════════════════════════════

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read programs
-- (practitioners need to see programs they're assigned to)
CREATE POLICY "programs_select" ON programs
  FOR SELECT TO authenticated
  USING (true);

-- Only admins can create, edit, or delete programs
CREATE POLICY "programs_insert_admin" ON programs
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "programs_update_admin" ON programs
  FOR UPDATE TO authenticated
  USING (is_admin());

CREATE POLICY "programs_delete_admin" ON programs
  FOR DELETE TO authenticated
  USING (is_admin());


-- ══════════════════════════════════════════════════════
-- PROGRAM_ASSIGNMENTS
-- ══════════════════════════════════════════════════════

ALTER TABLE program_assignments ENABLE ROW LEVEL SECURITY;

-- Practitioners can see their own assignments; admins see all
CREATE POLICY "assignments_select" ON program_assignments
  FOR SELECT TO authenticated
  USING (practitioner_id = auth.uid() OR is_admin());

-- Only admins can create assignments (invitations)
CREATE POLICY "assignments_insert_admin" ON program_assignments
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- Admins can update any assignment; practitioners can update
-- only their own (to accept/decline)
CREATE POLICY "assignments_update" ON program_assignments
  FOR UPDATE TO authenticated
  USING (practitioner_id = auth.uid() OR is_admin());

CREATE POLICY "assignments_delete_admin" ON program_assignments
  FOR DELETE TO authenticated
  USING (is_admin());


-- ══════════════════════════════════════════════════════
-- AVAILABILITY_BLOCKS
-- ══════════════════════════════════════════════════════

ALTER TABLE availability_blocks ENABLE ROW LEVEL SECURITY;

-- Practitioners see their own; admins see all
CREATE POLICY "availability_select" ON availability_blocks
  FOR SELECT TO authenticated
  USING (practitioner_id = auth.uid() OR is_admin());

CREATE POLICY "availability_insert" ON availability_blocks
  FOR INSERT TO authenticated
  WITH CHECK (practitioner_id = auth.uid() OR is_admin());

CREATE POLICY "availability_update" ON availability_blocks
  FOR UPDATE TO authenticated
  USING (practitioner_id = auth.uid() OR is_admin());

CREATE POLICY "availability_delete" ON availability_blocks
  FOR DELETE TO authenticated
  USING (practitioner_id = auth.uid() OR is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_ACCOUNTS
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_accounts ENABLE ROW LEVEL SECURITY;

-- LeadForge is admin-only
CREATE POLICY "leadforge_accounts_admin" ON leadforge_accounts
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_PROSPECTS
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadforge_prospects_admin" ON leadforge_prospects
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_ACTIVITIES
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadforge_activities_admin" ON leadforge_activities
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_TRIGGER_EVENTS
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_trigger_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadforge_trigger_events_admin" ON leadforge_trigger_events
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_CONTENT
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadforge_content_admin" ON leadforge_content
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- LEADFORGE_KNOWLEDGE_BASE
-- ══════════════════════════════════════════════════════

ALTER TABLE leadforge_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leadforge_knowledge_base_admin" ON leadforge_knowledge_base
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());


-- ══════════════════════════════════════════════════════
-- VERIFICATION: check RLS is enabled on all tables
-- ══════════════════════════════════════════════════════
-- Run this query after applying to confirm:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;
--
-- Every row should show rowsecurity = true
