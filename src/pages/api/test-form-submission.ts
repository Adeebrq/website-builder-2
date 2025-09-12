import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, username } = req.body;

  if (!name || !email || !username) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Simulate the form submission email scheduling
  console.log(`📧 Scheduling email for ${name} (${email}) to be sent in 1 minute...`);
  
  setTimeout(async () => {
    try {
      const response = await fetch(`${req.headers.host?.includes('localhost') ? 'http://' : 'https://'}${req.headers.host}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: {
            name,
            email,
            username,
          },
          submissionTime: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Email sent successfully:', result);
      } else {
        console.error('❌ Email failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ Email error:', error);
    }
  }, 1 * 60 * 1000); // 1 minute

  res.status(200).json({ 
    success: true, 
    message: `Email scheduled for ${name} (${email}) to be sent in 1 minute`,
    scheduledFor: new Date(Date.now() + 60 * 1000).toISOString()
  });
}

