import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please add the following to your .env.local file:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    console.log('📝 Note: You need to create the tables manually in your Supabase dashboard.');
    console.log('📝 Go to: https://supabase.com/dashboard/project/[your-project]/sql');
    console.log('');
    console.log('📋 Copy and paste this SQL:');
    console.log('');
    console.log('-- Users table');
    console.log(`CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  email TEXT,
  phone TEXT,
  instagram_handle TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  whatsapp_url TEXT,
  avatar_url TEXT,
  template TEXT DEFAULT 'v1',
  instagram_posts TEXT[],
  linkedin_posts JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`);
    console.log('');
    console.log('-- Projects table');
    console.log(`CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`);
    console.log('');
    console.log('-- Enable Row Level Security');
    console.log('ALTER TABLE users ENABLE ROW LEVEL SECURITY;');
    console.log('ALTER TABLE projects ENABLE ROW LEVEL SECURITY;');
    console.log('');
    console.log('-- Create policies');
    console.log('CREATE POLICY "Users can read all profiles" ON users FOR SELECT USING (true);');
    console.log('CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (true);');
    console.log('CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (true);');
    console.log('CREATE POLICY "Projects are viewable by everyone" ON projects FOR SELECT USING (true);');
    console.log('CREATE POLICY "Users can insert their own projects" ON projects FOR INSERT WITH CHECK (true);');
    console.log('CREATE POLICY "Users can update their own projects" ON projects FOR UPDATE USING (true);');
    console.log('');

    // Try to create storage bucket
    try {
      const { data, error: bucketError } = await supabase.storage
        .createBucket('portfolio-images', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
        });

      if (bucketError && bucketError.message !== 'Bucket already exists') {
        console.log('⚠️  Could not create storage bucket automatically. Create it manually in Supabase dashboard.');
      } else {
        console.log('✅ Storage bucket created');
      }
    } catch (error) {
      console.log('⚠️  Could not create storage bucket automatically. Create it manually in Supabase dashboard.');
    }

    console.log('');
    console.log('🎉 Setup instructions completed!');
    console.log('After creating the tables, you can run: npm run dev');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
