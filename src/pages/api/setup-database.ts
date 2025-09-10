// pages/api/setup-database.js
import { createTables } from '../../lib/dataBase'
import { createStorageBuckets } from '../../lib/storage'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Add security check
  const { authorization } = req.headers
  if (authorization !== `Bearer ${process.env.SETUP_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    console.log('🚀 Starting database setup...')
    
    await createTables()
    console.log('✅ Tables created')
    
    await createStorageBuckets()
    console.log('✅ Storage buckets created')
    
    res.status(200).json({ 
      message: 'Database setup completed successfully',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    res.status(500).json({ 
      error: 'Database setup failed',
      details: error.message
    })
  }
}
