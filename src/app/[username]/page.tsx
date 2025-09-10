"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/dataBase";
import Hero from "@/components/portfolio/Hero";
import InstagramFeed from "@/components/portfolio/InstagramFeed";
import LinkedInFeed from "@/components/portfolio/LinkedInFeed";
import ContactForm from "@/components/portfolio/ContactForm";
import Footer from "@/components/portfolio/Footer";
import { useParams } from "next/navigation";

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
  linkedin_posts: any[] | null;
  created_at: string;
  updated_at: string;
}

export default function UserPortfolio() {
  const params = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fix: Add null check for params
  if (!params?.username) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const username = params.username as string;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('username', username)
          .single();

        if (error) throw error;
        setUserData(data as UserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

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

  // TypeScript type assertion to ensure userData is properly typed
  const validUserData: UserData = userData;

  // Transform user data to match the expected format
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
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Hero clientDetails={clientDetails} />
        <InstagramFeed clientDetails={clientDetails} />
        <LinkedInFeed clientDetails={clientDetails} />
        <ContactForm clientDetails={clientDetails} />
      </div>
      <Footer />
    </div>
  );
}
