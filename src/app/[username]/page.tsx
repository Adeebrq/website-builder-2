import UserPortfolioClient from "./UserPortfolioClient";
import { getUsersData, type UserData } from "@/lib/userData";

// Generate static params for all existing usernames
export async function generateStaticParams() {
  try {
    const users = await getUsersData();
    
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
  const users = await getUsersData();
  
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