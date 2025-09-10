import { supabaseAdmin } from './dataBase'

export const createStorageBuckets = async () => {
  try {
    // Create portfolio images bucket
    const { data, error } = await supabaseAdmin.storage
      .createBucket('portfolio-images', {
        public: true,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
      })

    if (error && error.message !== 'Bucket already exists') {
      throw error
    }

    // Create storage policies using direct SQL
    const { error: policyError } = await supabaseAdmin.rpc('exec', {
      sql: `
        CREATE POLICY IF NOT EXISTS "Portfolio images are publicly accessible" 
        ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

        CREATE POLICY IF NOT EXISTS "Anyone can upload portfolio images" 
        ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');
        
        CREATE POLICY IF NOT EXISTS "Users can update their own images" 
        ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');
        
        CREATE POLICY IF NOT EXISTS "Users can delete their own images" 
        ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');
      `
    })

    if (policyError) throw policyError

    console.log("✅ Storage buckets created successfully!")
    return { success: true }
  } catch (error) {
    console.error("❌ Storage setup failed:", error)
    return { success: false, error }
  }
}
