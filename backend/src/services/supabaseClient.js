const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[WARNING] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing in your environment variables. ' +
    'Please copy backend/.env.example to backend/.env and provide your Supabase project credentials.'
  );
}

// Create a Supabase client with persistSession disabled for Node backend
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

module.exports = { supabase };
