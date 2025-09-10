"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/dataBase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    tagline: "Available for freelance projects and collaborations",
    email: "",
    phone: "",
    instagram_handle: "",
    instagram_url: "",
    linkedin_url: "",
    whatsapp_url: ""
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
        toast({
          title: "Demo Mode",
          description: "Please configure Supabase environment variables to create real portfolios. Check the setup instructions.",
          variant: "destructive",
        });
        return;
      }

      let avatarUrl = "";

      // Upload avatar image if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${formData.username}-avatar.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(fileName);

        avatarUrl = publicUrl;
      }

      // Create user with avatar URL
      const userData = {
        ...formData,
        avatar_url: avatarUrl
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Portfolio created successfully!",
        description: `Your portfolio is now available at ${formData.username}.adeebrq.me`,
      });

      // Redirect to the user's portfolio
      router.push(`/${formData.username}`);
    } catch (error) {
      toast({
        title: "Error creating portfolio",
        description: error.message || "Please check your Supabase configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-20">
      <Card className="w-full max-w-2xl p-8 bg-card border-border shadow-card">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Your Portfolio
          </h1>
          <p className="text-muted-foreground">
            Fill out the form below to create your personalized portfolio website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="text-center">
            <Label htmlFor="avatar" className="text-foreground mb-4 block">
              Profile Picture
            </Label>
            <div className="flex flex-col items-center gap-4">
              {avatarPreview && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-background border-border focus:border-primary max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                Upload a profile picture (optional)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username" className="text-foreground">
                Username (for your URL)
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="bg-background border-border focus:border-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Your portfolio will be at {formData.username || 'username'}.adeebrq.me
              </p>
            </div>
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title" className="text-foreground">
              Professional Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-foreground">
              Bio
            </Label>
            <Textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              className="bg-background border-border focus:border-primary resize-none"
            />
          </div>

          <div>
            <Label htmlFor="tagline" className="text-foreground">
              Tagline
            </Label>
            <Input
              id="tagline"
              name="tagline"
              type="text"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Available for freelance projects and collaborations"
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="bg-background border-border focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="instagram_handle" className="text-foreground">
              Instagram Handle
            </Label>
            <Input
              id="instagram_handle"
              name="instagram_handle"
              type="text"
              value={formData.instagram_handle}
              onChange={handleChange}
              placeholder="@johndoe"
              className="bg-background border-border focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin_url" className="text-foreground">
                LinkedIn URL
              </Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/johndoe"
                className="bg-background border-border focus:border-primary"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp_url" className="text-foreground">
                WhatsApp URL
              </Label>
              <Input
                id="whatsapp_url"
                name="whatsapp_url"
                type="url"
                value={formData.whatsapp_url}
                onChange={handleChange}
                placeholder="https://wa.me/1234567890"
                className="bg-background border-border focus:border-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            {isSubmitting ? "Creating Portfolio..." : "Create Portfolio"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
