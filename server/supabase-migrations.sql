-- ═══════════════════════════════════════════════════════════════════
-- SUPABASE MIGRATION: Adway Serverless Backend
-- Run this in Supabase SQL Editor to create all tables
-- ═══════════════════════════════════════════════════════════════════

-- ═══ Projects (portfolio) ═══
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT DEFAULT '',
  "desc" TEXT DEFAULT '',
  image TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  year TEXT DEFAULT '',
  client TEXT DEFAULT '',
  challenge TEXT DEFAULT '',
  result TEXT DEFAULT '',
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- ═══ Applications ═══
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  phone TEXT DEFAULT '',
  portfolio TEXT DEFAULT '',
  linkedin TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  "startDate" DATE DEFAULT NULL,
  "coverNote" TEXT DEFAULT '',
  resume TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ═══ Career Jobs ═══
CREATE TABLE IF NOT EXISTS career_jobs (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, title)
);

-- ═══ Chat Enquiries ═══
CREATE TABLE IF NOT EXISTS chat_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_business TEXT DEFAULT '',
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_requirements TEXT DEFAULT '',
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Clients ═══
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT DEFAULT '',
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Blogs ═══
CREATE TABLE IF NOT EXISTS blogs (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  "coverImage" TEXT DEFAULT '',
  author TEXT NOT NULL DEFAULT 'Adway Team',
  category TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  "readingTime" INT DEFAULT 1,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);

-- ═══ Contact Enquiries ═══
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT DEFAULT NULL,
  service TEXT DEFAULT NULL,
  budget TEXT DEFAULT NULL,
  message TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Users (admin) ═══
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Messages (replaces messages.json) ═══
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Activity Logs (replaces activity.json) ═══
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  action TEXT NOT NULL,
  "user" TEXT DEFAULT '',
  ip TEXT DEFAULT '',
  time TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Settings (replaces settings.json) ═══
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ Chatbot Enquiries (replaces chatbot_enquiries.json) ═══
CREATE TABLE IF NOT EXISTS chatbot_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══ SUPABASE STORAGE BUCKETS ═══
-- Run these in Supabase Dashboard > Storage or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blogs', 'blogs', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', true);
