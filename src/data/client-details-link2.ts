type LinkedInPost = {
  url: string;
  height: string;
};

export const clientDetails = {

  // Personal Information
  name: "Margoobur Rahman A",
  title: "Freelance Web Developer",
  bio: "I'm a freelance web developer with 4 years of experience building fast, responsive, and user-friendly websites and web apps. I specialize in modern JavaScript frameworks (React, Next.js), UI/UX-focused development, and performance optimization.",

  // Contact Information
  email: "rahman@idesassion.com",
  phone: "+91 9090909090",
  instagram: "@margoobur_rahman",

  // Social Links
  socialLinks: {
    instagram: "https://instagram.com/margoobur_rahman",
    linkedin: "https://www.linkedin.com/in/margoobur-rahman-82426b246/",
    whatsapp: "https://wa.me/919090909090",
  },

  // Embedded Posts Configuration
  embeddedPosts: {
    instagram: [
      "https://www.instagram.com/p/DDmHQevynn4/?utm_source=ig_embed&utm_campaign=loading",
      "https://www.instagram.com/p/Cz_LfiXvHfL/?utm_source=ig_embed&utm_campaign=loading",
      "https://www.instagram.com/p/C9h4-w7P8aE/?utm_source=ig_embed&utm_campaign=loading"
    ],
    linkedin: [
      {
        url: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7371029928731013120?collapsed=1",
        height: "710"
      },
      {
        url: "https://www.linkedin.com/embed/feed/update/urn:li:share:7369343558832545792?collapsed=1",
        height: "660"
      },
      {
        url: "https://www.linkedin.com/embed/feed/update/urn:li:share:7368534665579675648?collapsed=1",
        height: "620"
      }
    ]
  }
};

export default clientDetails;