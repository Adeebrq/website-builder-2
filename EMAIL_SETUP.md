# Email Setup Guide

## Overview
The portfolio system now includes email functionality using Resend. When a user submits the registration form, an email will be automatically sent to them after 2 minutes with their portfolio details.

## Setup Instructions

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (adeebrq.me) in Resend dashboard
3. Get your API key from the dashboard

### 2. Environment Variables
Add the following to your `.env.local` file:
```env
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Domain Verification
Make sure `adeebrq.me` is verified in your Resend dashboard. The email will be sent from `noreply@adeebrq.me`.

## API Endpoints

### `/api/send-email`
- **Method**: POST
- **Purpose**: Sends portfolio confirmation email
- **Triggered**: Automatically 2 minutes after form submission
- **Body**:
```json
{
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  },
  "submissionTime": "2024-01-01T12:00:00.000Z"
}
```

### `/api/test-email`
- **Method**: POST
- **Purpose**: Test email functionality immediately
- **Body**:
```json
{
  "email": "test@example.com",
  "name": "Test User"
}
```

## Email Content
The email includes:
- Personalized greeting with user's name
- Portfolio URL (username.adeebrq.me)
- Creation timestamp
- Call-to-action button to view portfolio
- Next steps and tips
- Support contact information

## Testing
1. Set up your Resend API key
2. Test the email system using the test endpoint:
```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","name":"Your Name"}'
```

## Production Deployment
- Ensure your domain is verified in Resend
- Set the `RESEND_API_KEY` environment variable in your production environment
- The email system will work automatically with form submissions

## Troubleshooting
- Check Resend dashboard for email delivery status
- Verify domain is properly configured
- Check server logs for any API errors
- Ensure environment variables are set correctly



