import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/dataBase';
import type { ColorTheme } from '../../lib/colorThemes';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  colorPreference: ColorTheme;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, colorPreference }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user exists by email, if not create a new user
    let { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id, username')
      .eq('email', email)
      .single();

    let userId: string;

    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const username = email.split('@')[0] + '_' + Date.now();
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert([
          {
            username,
            name,
            email,
            color_preference: colorPreference,
          },
        ])
        .select('id')
        .single();

      if (createUserError) {
        throw createUserError;
      }

      userId = newUser.id;
    } else if (existingUser) {
      // User exists, update their color preference
      userId = existingUser.id;
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          color_preference: colorPreference,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Failed to update user color preference:', updateError);
      }
    } else {
      throw userCheckError;
    }

    // Log the contact form submission (you can create a separate table for this if needed)
    console.log('Contact form submitted:', {
      userId,
      name,
      email,
      subject,
      message,
      colorPreference,
      timestamp: new Date().toISOString(),
    });

    // Here you can add email sending logic if needed
    // For now, we'll just return success

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully!',
      userId,
      colorPreference,
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to process contact form',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
