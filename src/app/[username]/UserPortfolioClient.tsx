"use client";
import { useEffect } from "react";
import Hero from "@/components/portfolio/Hero";
import InstagramFeed from "@/components/portfolio/InstagramFeed";
import LinkedInFeed from "@/components/portfolio/LinkedInFeed";
import ContactForm from "@/components/portfolio/ContactForm";
import Footer from "@/components/portfolio/Footer";
import { applyTheme } from "@/lib/colorThemes";
import type { ColorTheme } from "@/lib/colorThemes";

interface ClientDetails {
  name: string;
  title: string;
  bio: string;
  tagline: string;
  email: string;
  phone: string;
  instagram: string;
  avatar_url?: string;
  socialLinks: {
    instagram: string;
    linkedin: string;
    whatsapp: string;
  };
  embeddedPosts: {
    instagram: string[];
    linkedin: { url: string; height: number }[];
  };
}

interface UserPortfolioClientProps {
  clientDetails: ClientDetails;
  colorPreference: ColorTheme;
}

export default function UserPortfolioClient({ clientDetails, colorPreference }: UserPortfolioClientProps) {
  // Apply user's saved theme color
  useEffect(() => {
    applyTheme(colorPreference);
  }, [colorPreference]);

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

