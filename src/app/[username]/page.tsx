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

// Generate static params for all existing usernames
export async function generateStaticParams() {
  try {
    const { data: users } = await supabase
      .from('users')
      .select('username');
    
    if (!users) return [];
    
    return users.map((user) => ({
      username: user.username,
    }));
  } catch (error) {
    console.error('Error fetching users for static params:', error);
    return [
      { username: 'demo' },
      { username: 'example' }
    ];
  }
}

// REMOVE this line - it conflicts with static export
// export const dynamic = 'force-dynamic';

interface UserPortfolioProps {
  params: Promise<{ username: string }>;
}

export default async function UserPortfolio({ params }: UserPortfolioProps) {
  const { username } = await params;

  // Fetch user data on the server
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !userData) {
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

  const validUserData: UserData = userData;

  const clientDetails = {
    name: validUserData.name,
    title: validUserData.title || "Professional",
    bio: validUserData.bio || "Welcome to my portfolio",
    tagline: validUserData.tagline || "Available for freelance projects and collaborations",
    email: validUserData.email || "contact@example.com",
    phone: validUserData.phone || "+1234567890",
    instagram: validUserData.instagram_handle || "username",
    avatar_url: validUserData.avatar_url || undefined,
    socialLinks: {
      instagram: validUserData.instagram_url || "#",
      linkedin: validUserData.linkedin_url || "#",
      whatsapp: validUserData.whatsapp_url || "#"
    },
    embeddedPosts: {
      instagram: validUserData.instagram_posts || [],
      linkedin: validUserData.linkedin_posts || []
    }
  };

  return (
    <UserPortfolioClient 
      clientDetails={clientDetails} 
      colorPreference={validUserData.color_preference || 'purple'} 
    />
  );
}
