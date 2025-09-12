import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { formData, submissionTime } = await request.json();
    
    if (!formData || !formData.email || !formData.name || !formData.username) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate delay (2 minutes from submission time)
    const submissionDate = new Date(submissionTime);
    const delayTime = new Date(submissionDate.getTime() + 4 * 60 * 1000); // 2 minutes
    
    // For now, we'll send the email immediately since we can't actually delay it
    // In a real implementation, you'd use a job queue like Bull, Agenda, or similar
    
    const { data, error } = await resend.emails.send({
      from: 'contactus@cruxcreations.com',
      to: [formData.email],
      subject: `Your Portfolio is Ready! 🎉`,
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Ready Email</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fefefe;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff6b35; font-size: 28px; margin-bottom: 10px;">🎉 Your Portfolio Website is Ready!</h1>
            <p style="color: #666; font-size: 16px;">Hi ${formData.name}, your professional portfolio website has been successfully created!</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff5f0 0%, #ffffff 100%); padding: 25px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #ff6b35;">
            <h2 style="color: #d85d2a; margin-bottom: 15px;">📋 Portfolio Details</h2>
            <p style="margin: 8px 0; color: #555;"><strong>Website delivery link:</strong> <a href="https://portfolio.cruxcreations.com/?name=${formData.username}" style="color: #ff6b35; text-decoration: none; font-weight: 500;">https://portfolio.cruxcreations.com/?name=${formData.username}</a></p>
            <p style="margin: 8px 0; color: #555;"><strong>Portfolio URL:</strong> <a href="https://profile.cruxcreations.com/${formData.username}" style="color: #ff6b35; text-decoration: none; font-weight: 500;">https://profile.cruxcreations.com/${formData.username}</a></p>
            <p style="margin: 8px 0; color: #555;"><strong>Created:</strong> ${submissionDate.toLocaleString()}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">✅ Live & Active</span></p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://portfolio.cruxcreations.com/?name=${formData.username}" 
               style="background: linear-gradient(135deg, #ff6b35 0%, #f55a2c 100%); color: black; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3); transition: all 0.3s ease;">
              🚀 View Your Portfolio
            </a>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff8f5 0%, #ffffff 100%); padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #ffe5d9;">
            <h3 style="color: #d85d2a; margin-bottom: 15px;">📝 Next Steps</h3>
            <ul style="color: #555; line-height: 1.6; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Share your portfolio URL with potential clients and employers</li>
                <li>Add it to your resume, LinkedIn profile, and business cards</li>
            </ul>
        </div>
        
        <div style="border-top: 2px solid #ffe5d9; padding-top: 20px; text-align: center; background: #fefefe;">
            <p style="color: #6c757d; font-size: 14px; margin: 0;">
                Need help or have questions? Contact us at <a href="mailto:contactus@cruxcreations.com" style="color: #ff6b35; font-weight: 500;">contactus@cruxcreations.com</a>
            </p>
        </div>
    </div>
</body>
</html>
      `,
      scheduledAt: delayTime.toISOString(),
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: data?.id,
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
