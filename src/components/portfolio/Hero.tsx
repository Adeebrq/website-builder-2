"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Instagram, Github, MessageCircle } from "lucide-react";

interface HeroProps {
  clientDetails: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    instagram: string;
    avatar_url?: string;
    tagline: string;
    socialLinks: {
      instagram: string;
      linkedin: string;
      whatsapp: string;
    };
  };
}

const Hero = ({ clientDetails }: HeroProps) => {
  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Avatar */}
        <div className="mb-8">
          <Avatar className="w-32 h-32 mx-auto ring-4 ring-primary/20 ring-offset-4 ring-offset-background">
            <AvatarImage 
              src={clientDetails.avatar_url || "/placeholder.svg"} 
              alt={clientDetails.name} 
            />
            <AvatarFallback className="text-2xl bg-gradient-primary text-white">
              {clientDetails.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Main heading */}
        <div className="space-y-6 mb-12">
          <h1 style={{lineHeight:'normal'}} className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {clientDetails.name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            {clientDetails.title}
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {clientDetails.bio}
          </p>
        </div>

        {/* Contact buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            variant="default" 
            size="lg" 
            onClick={handleContactClick}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Mail className="w-5 h-5 mr-2" />
            Get In Touch
          </Button>
          
          <div className="flex items-center gap-3 flex-wrap">
            <a 
              href={`mailto:${clientDetails.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-secondary transition-colors"
            >
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm">{clientDetails.email}</span>
            </a>
            
            <a 
              href={`tel:${clientDetails.phone}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-secondary transition-colors"
            >
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-sm">{clientDetails.phone}</span>
            </a>
            
            <a 
              href={clientDetails.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card hover:bg-secondary transition-colors"
            >
              <Instagram className="w-4 h-4 text-accent" />
              <span className="text-sm">{clientDetails.instagram}</span>
            </a>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full"></div>
          <div className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 border border-border/50">
            <p className="text-sm text-muted-foreground">
            {clientDetails.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;