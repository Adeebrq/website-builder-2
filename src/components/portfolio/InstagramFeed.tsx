"use client";
import { useEffect } from "react";
import { Instagram } from "lucide-react";
interface InstagramFeedProps {
  clientDetails: {
    instagram: string;
    socialLinks: {
      instagram: string;
    };
    embeddedPosts: {
      instagram: string[];
    };
  };
}

const InstagramFeed = ({ clientDetails }: InstagramFeedProps) => {
  const embeddedPosts: string[] = clientDetails.embeddedPosts.instagram;

  useEffect(() => {
    // Inject the Instagram embed script once
    const script = document.createElement("script");
    script.async = true;
    script.src = "//www.instagram.com/embed.js";
    script.onload = () => {
      if ((window as any)?.instgrm?.Embeds?.process) {
        (window as any).instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount if needed
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Latest from Instagram
          </h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with my recent work
          </p>
          <a
            href={clientDetails.socialLinks.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors"
          >
            <Instagram className="w-5 h-5" />
            Follow {clientDetails.instagram}
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {embeddedPosts.map((url, index) => (
            <div key={index} className="w-full rounded-lg overflow-hidden flex justify-center">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={url}
                data-instgrm-version="14"
                style={{
                  background: "#FFF",
                  border: 0,
                  borderRadius: "10px",
                  boxShadow: "0 0 1px rgba(0,0,0,0.5), 0 1px 10px rgba(0,0,0,0.15)",
                  margin: "1px",
                  maxWidth: "540px",
                  minWidth: "326px",
                  padding: 0,
                  width: "100%"
                }}
              ></blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramFeed;
