const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Missing Supabase credentials in environment variables.");
}

// We use the service role key if available for admin operations that bypass RLS
const supabase = createClient(
  supabaseUrl || '',
  supabaseServiceRole || supabaseKey || '',
  {
    auth: {
      persistSession: false
    }
  }
);

module.exports = supabase;
