import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('📧 send-delayed-email API called');
  console.log('📧 Request method:', req.method);
  console.log('📧 Request body:', req.body);
  
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData, submissionTime } = req.body;

  if (!formData || !formData.email || !formData.name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Schedule email for 1 minute from now
    const scheduledTime = new Date(Date.now() + 1 * 60 * 1000).toISOString();
    
    const result = await resend.emails.send({
      from: 'contactus@cruxcreations.com',
      to: formData.email,
      subject: 'Your Portfolio is Ready! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <h2 style="color: #333; text-align: center;">Hello ${formData.name}! 👋</h2>
          
          <div style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFA500 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);">
            <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🎉 Your Portfolio is Live!</h1>
          </div>
          
          <div style="background: #FFF8F0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #FF6B35;">
            <h3 style="color: #333; margin-top: 0;">Portfolio Details:</h3>
            <p><strong>Portfolio URL:</strong> <a href="https://portfolio.cruxcreations.com/${formData.username}" style="color: #FF6B35; text-decoration: none; font-weight: bold;">https://portfolio.cruxcreations.com/${formData.username}</a></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://portfolio.cruxcreations.com/${formData.username}" 
               style="background: linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FFA500 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
                      transition: transform 0.2s ease;
                      text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
              View Your Portfolio 🚀
            </a>
          </div>
          
          <div style="background: #FFF8F0; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #FFE4D6;">
            <h4 style="color: #FF6B35; margin-top: 0; font-size: 18px;">What's Next?</h4>
            <ul style="color: #333; margin: 10px 0;">
              <li style="margin-bottom: 8px;">Share your portfolio link with potential clients</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #FFE4D6;">
            <p style="color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:contactus@cruxcreations.com" style="color: #FF6B35; font-weight: bold; text-decoration: none;">contactus@cruxcreations.com</a>
            </p>
          </div>
        </div>
      `,
      scheduledAt: scheduledTime,
    });
    

    console.log('Email scheduled:', result.data?.id, 'for', scheduledTime);
    res.status(200).json({ 
      success: true, 
      id: result.data?.id,
      scheduledFor: scheduledTime,
      message: `Email scheduled for ${formData.name} to be sent in 1 minute`
    });
  } catch (error) {
    console.error('Email scheduling failed:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to schedule email' });
  }
}
