"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import ColorSelector from "@/components/ui/color-selector";
import { applyTheme, type ColorTheme } from "@/lib/colorThemes";
import { supabase } from "@/lib/dataBase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    title: "",
    bio: "",
    tagline: "", // Removed default value
    email: "",
    phone: "",
    instagram_handle: "",
    instagram_url: "",
    linkedin_url: "",
    whatsapp_phone: "" // Changed from whatsapp_url to whatsapp_phone
  });
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const router = useRouter();
  
  const [themeColor, setThemeColor] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') return 'purple';
    return (localStorage.getItem('themeColor') as ColorTheme) || 'purple';
  });

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Domain name is required';
        if (/\s/.test(value)) return 'Domain name cannot contain spaces';
        if (!/^[a-zA-Z0-9_-]+$/.test(value)) return 'Domain name can only contain letters, numbers, hyphens, and underscores';
        if (value.length < 3) return 'Domain name must be at least 3 characters long';
        if (value.length > 30) return 'Domain name must be less than 30 characters';
        return '';
      
      case 'name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters long';
        return '';
      
      case 'title':
        if (!value.trim()) return 'Professional title is required';
        if (value.trim().length < 2) return 'Title must be at least 2 characters long';
        return '';
      
      case 'bio':
        if (!value.trim()) return 'Bio is required';
        if (value.trim().length < 10) return 'Bio must be at least 10 characters long';
        if (value.trim().length > 500) return 'Bio must be less than 500 characters';
        return '';
      
      case 'tagline':
        if (!value.trim()) return 'Tagline is required';
        if (value.trim().length < 5) return 'Tagline must be at least 5 characters long';
        if (value.trim().length > 100) return 'Tagline must be less than 100 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^\+?[\d\s\-()]{10,}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      case 'instagram_handle':
        if (value && !/^@?[a-zA-Z0-9_.]{1,30}$/.test(value)) return 'Please enter a valid Instagram handle';
        return '';
      
      case 'linkedin_url':
        if (value && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/.test(value)) return 'Please enter a valid LinkedIn URL';
        return '';
      
      case 'whatsapp_phone':
        if (value && !/^\+?[\d\s\-()]{10,}$/.test(value)) return 'Please enter a valid phone number';
        return '';
      
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate required fields
    const requiredFields = ['username', 'name', 'title', 'bio', 'tagline', 'email', 'phone'];
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) newErrors[field] = error;
    });

    // Validate optional fields if they have values
    const optionalFields = ['instagram_handle', 'linkedin_url', 'whatsapp_phone'];
    optionalFields.forEach(field => {
      const value = formData[field as keyof typeof formData];
      if (value) {
        const error = validateField(field, value);
        if (error) newErrors[field] = error;
      }
    });

    // Validate avatar file
    if (avatarFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!allowedTypes.includes(avatarFile.type)) {
        newErrors.avatar = 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
      } else if (avatarFile.size > maxSize) {
        newErrors.avatar = 'Image file must be less than 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleColorChange = (color: ColorTheme) => {
    setThemeColor(color);
    applyTheme(color);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear previous avatar error
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to format WhatsApp URL
  const formatWhatsAppUrl = (phoneNumber: string): string => {
    if (!phoneNumber.trim()) return '';
    
    // Remove all non-digit characters except +
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    
    // Ensure it starts with + if it doesn't already
    const formattedNumber = cleanNumber.startsWith('+') ? cleanNumber : `+${cleanNumber}`;
    
    return `https://wa.me/${formattedNumber.substring(1)}`; // Remove + for wa.me format
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast({
        title: "Website creation failed!",
        description: "Some fields are missing or contain errors. Please review and correct them.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co') {
        toast({
          title: "Demo Mode",
          description: "Please configure Supabase environment variables to create real portfolios. Check the setup instructions.",
          variant: "destructive",
        });
        return;
      }

      let avatarUrl = "";

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

      // Format the data for submission
      const userData = {
        username: formData.username,
        name: formData.name,
        title: formData.title,
        bio: formData.bio,
        tagline: formData.tagline,
        email: formData.email,
        phone: formData.phone,
        instagram_handle: formData.instagram_handle,
        instagram_url: formData.instagram_url,
        linkedin_url: formData.linkedin_url,
        whatsapp_url: formatWhatsAppUrl(formData.whatsapp_phone), // Convert phone to WhatsApp URL
        avatar_url: avatarUrl,
        color_preference: themeColor
      };

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Portfolio created successfully!",
        // description: `Your portfolio is now available at ${formData.username}.adeebrq.me`,
      });

      router.push(`/thank-you`);
    } catch (error: unknown) {
      toast({
        title: "Error creating portfolio",
        description: error instanceof Error ? error.message : "Please check your Supabase configuration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-3xl p-8 bg-card border-border shadow-card">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Create Your Portfolio
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill out the form below to create your personalized portfolio website
          </p>
          <p className="text-sm text-red-500">
            <strong>Important:</strong> Please insert maximum details for best result.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Profile Picture</h2>
            <div className="flex flex-col items-center gap-4">
              {avatarPreview && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
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
                className={`bg-background border-border focus:border-primary max-w-sm ${
                  errors.avatar ? 'border-destructive focus:border-destructive' : ''
                }`}
              />
              {errors.avatar && (
                <p className="text-sm text-destructive">{errors.avatar}</p>
              )}
              <p className="text-sm text-muted-foreground text-center">
                Upload a profile picture (JPG, PNG, GIF, or WebP • Max 5MB)
              </p>
            </div>
          </div>

          {/* Theme Color Section */}
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Theme Color</h2>
            <ColorSelector
              selectedColor={themeColor}
              onColorChange={handleColorChange}
            />
          </div>

          {/* Personal Information Section */}
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Personal Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-foreground font-medium">
                    Username <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    className={`bg-background border-border focus:border-primary ${
                      errors.username ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Your portfolio URL: <span className="font-mono text-primary">profile.cruxcreations.com/{formData.username || 'username'}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`bg-background border-border focus:border-primary ${
                      errors.name ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground font-medium">
                  Professional Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter your designation"
                  className={`bg-background border-border focus:border-primary ${
                    errors.title ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-foreground font-medium">
                  Bio <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and your professional journey..."
                  className={`bg-background border-border focus:border-primary resize-none ${
                    errors.bio ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
                {errors.bio && (
                  <p className="text-sm text-destructive">{errors.bio}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formData.bio.length}/500 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-foreground font-medium">
                  Tagline <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="tagline"
                  name="tagline"
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Your expertise in a few words"
                  className={`bg-background border-border focus:border-primary ${
                    errors.tagline ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
                {errors.tagline && (
                  <p className="text-sm text-destructive">{errors.tagline}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`bg-background border-border focus:border-primary ${
                      errors.email ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground font-medium">
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`bg-background border-border focus:border-primary ${
                      errors.phone ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-6">Social Media</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instagram_handle" className="text-foreground font-medium">
                  Instagram Handle (Do not include the @)
                </Label>
                <Input
                  id="instagram_handle"
                  name="instagram_handle"
                  type="text"
                  value={formData.instagram_handle}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className={`bg-background border-border focus:border-primary ${
                    errors.instagram_handle ? 'border-destructive focus:border-destructive' : ''
                  }`}
                />
                {errors.instagram_handle && (
                  <p className="text-sm text-destructive">{errors.instagram_handle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="text-foreground font-medium">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="linkedin_url"
                    name="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/johndoe"
                    className={`bg-background border-border focus:border-primary ${
                      errors.linkedin_url ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.linkedin_url && (
                    <p className="text-sm text-destructive">{errors.linkedin_url}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_phone" className="text-foreground font-medium">
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsapp_phone"
                    name="whatsapp_phone"
                    type="tel"
                    value={formData.whatsapp_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`bg-background border-border focus:border-primary ${
                      errors.whatsapp_phone ? 'border-destructive focus:border-destructive' : ''
                    }`}
                  />
                  {errors.whatsapp_phone && (
                    <p className="text-sm text-destructive">{errors.whatsapp_phone}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    We'll automatically create a WhatsApp link for visitors
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6"
            >
              {isSubmitting ? "Creating Portfolio..." : "Create Portfolio"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}