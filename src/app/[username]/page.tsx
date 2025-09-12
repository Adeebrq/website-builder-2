import { supabase } from "@/lib/dataBase";
import UserPortfolioClient from "./UserPortfolioClient";
import type { ColorTheme } from "@/lib/colorThemes";

// Define the user data type
interface UserData {
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

export async function getData(): Promise<UserData[]> {
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

// Generate static params for all existing usernames
export async function generateStaticParams() {
  try {
    const users = await getData();
    
    return users.map((user) => ({
      username: user.username,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [
      { username: 'demo' },
      { username: 'example' }
    ];
  }
}

interface UserPortfolioProps {
  params: Promise<{ username: string }>;
}

export default async function UserPortfolio({ params }: UserPortfolioProps) {
  const { username } = await params;

  // Get all users data statically
  const users = await getData();
  
  // Find the specific user
  const userData = users.find(user => user.username === username);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Portfolio Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The portfolio for "{username}" doesn't exist.
          </p>
          <a href="/" className="text-primary hover:text-primary/80 underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  const clientDetails = {
    name: userData.name,
    title: userData.title || "Professional",
    bio: userData.bio || "Welcome to my portfolio",
    tagline: userData.tagline || "Available for freelance projects and collaborations",
    email: userData.email || "contact@example.com",
    phone: userData.phone || "+1234567890",
    instagram: userData.instagram_handle || "username",
    avatar_url: userData.avatar_url || undefined,
    socialLinks: {
      instagram: userData.instagram_url || "#",
      linkedin: userData.linkedin_url || "#",
      whatsapp: userData.whatsapp_url || "#"
    },
    embeddedPosts: {
      instagram: userData.instagram_posts || [],
      linkedin: userData.linkedin_posts || []
    }
  };

  return (
    <UserPortfolioClient 
      clientDetails={clientDetails} 
      colorPreference={userData.color_preference || 'purple'} 
    />
  );
}