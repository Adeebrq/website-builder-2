import { supabase } from "@/lib/dataBase";
import type { ColorTheme } from "@/lib/colorThemes";

// Define the user data type
export interface UserData {
  id: string;
  username: string;
  name: string;
  title: string | null;
  bio: string | null;
  tagline: string | null;
  email: string | null;
  phone: string | null;
  instagram_handle: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  whatsapp_url: string | null;
  avatar_url: string | null;
  template: string;
  instagram_posts: string[] | null;
  linkedin_posts: { url: string; height: number }[] | null;
  created_at: string;
  updated_at: string;
  color_preference?: ColorTheme | null;
}

export async function getUsersData(): Promise<UserData[]> {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    console.log(users);
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }
    
    return users || [];
  } catch (error) {
    console.error('Error fetching users for static params:', error);
    return [];
  }
}
