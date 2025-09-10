import { createClient } from '@supabase/supabase-js'

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Supabase client (with fallback for demo)
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-anon-key'
)

// Admin client for table creation (uses service key)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseServiceKey || 'demo-service-key'
)

export const createTables = async () => {
  try {
    // Users table with your ClientDetails structure
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .select('*')
      .limit(1)

    if (usersError && usersError.code === 'PGRST116') {
      // Table doesn't exist, create it
      const { error: createError } = await supabaseAdmin.rpc('exec', {
        sql: `
          CREATE TABLE users (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            
            -- Personal Information
            name TEXT NOT NULL,
            title TEXT,
            bio TEXT,
            
            -- Contact Information  
            email TEXT,
            phone TEXT,
            instagram_handle TEXT,
            
            -- Social Links
            instagram_url TEXT,
            linkedin_url TEXT,
            whatsapp_url TEXT,
            
            -- Profile Assets
            avatar_url TEXT,
            template TEXT DEFAULT 'v1',
            
            -- Embedded Posts (JSONB for structured data)
            instagram_posts TEXT[],
            linkedin_posts JSONB DEFAULT '[]'::jsonb,
            
            -- Metadata
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })

      if (createError) throw createError
    }

    // Projects table
    const { error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .limit(1)

    if (projectsError && projectsError.code === 'PGRST116') {
      const { error: createError } = await supabaseAdmin.rpc('exec', {
        sql: `
          CREATE TABLE projects (
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
          );
        `
      })

      if (createError) throw createError
    }

    // Skills table (optional - for portfolio enhancement)
    const { error: skillsError } = await supabaseAdmin
      .from('skills')
      .select('*')
      .limit(1)

    if (skillsError && skillsError.code === 'PGRST116') {
      const { error: createError } = await supabaseAdmin.rpc('exec', {
        sql: `
          CREATE TABLE skills (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            skill_name TEXT NOT NULL,
            skill_level INTEGER CHECK (skill_level BETWEEN 1 AND 10),
            category TEXT, -- e.g., 'Frontend', 'Backend', 'Design'
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })

      if (createError) throw createError
    }

    // Testimonials table (optional)
    const { error: testimonialsError } = await supabaseAdmin
      .from('testimonials')
      .select('*')
      .limit(1)

    if (testimonialsError && testimonialsError.code === 'PGRST116') {
      const { error: createError } = await supabaseAdmin.rpc('exec', {
        sql: `
          CREATE TABLE testimonials (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            client_name TEXT NOT NULL,
            client_position TEXT,
            client_company TEXT,
            testimonial_text TEXT NOT NULL,
            client_image_url TEXT,
            rating INTEGER CHECK (rating BETWEEN 1 AND 5),
            is_featured BOOLEAN DEFAULT false,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      })

      if (createError) throw createError
    }

    console.log("✅ All tables created successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error creating tables:", error)
    return { success: false, error }
  }
}
