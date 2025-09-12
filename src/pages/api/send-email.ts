import { Resend } from 'resend';
import type { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(500).json({ error: 'Email service not configured' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { formData, submissionTime } = req.body;
  const fiveMinutesFromNow = new Date(Date.now() + 1 * 60 * 1000).toISOString();

  if (!formData || !formData.email || !formData.name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await resend.emails.send({
      from: 'contactus@cruxcreations.com',
      to: formData.email,             // Recipient
      subject: 'Your Portfolio is Ready! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Hello ${formData.name}! 👋</h2>
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Portfolio is Live!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Portfolio Details:</h3>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Username:</strong> ${formData.username}</p>
            <p><strong>Portfolio URL:</strong> <a href="https://porfolio.cruxcreations.com${formData.username}" style="color: #667eea; text-decoration: none;">${formData.username}.adeebrq.me</a></p>
            <p><strong>Created:</strong> ${new Date(submissionTime).toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://${formData.username}.adeebrq.me" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 25px; 
                      font-weight: bold;
                      display: inline-block;">
              View Your Portfolio 🚀
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1976d2; margin-top: 0;">What's Next?</h4>
            <ul style="color: #333;">
              <li>Share your portfolio link with potential clients</li>
              <li>Update your social media profiles with your new portfolio</li>
              <li>Keep your portfolio updated with new projects</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              Need help? Contact us at <a href="mailto:support@adeebrq.me" style="color: #667eea;">support@adeebrq.me</a>
            </p>
          </div>
        </div>
      `,
      scheduledAt: fiveMinutesFromNow,
    });

    console.log('Email sent:', result.data?.id);
    res.status(200).json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('Email failed:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to send email' });
  }
}
