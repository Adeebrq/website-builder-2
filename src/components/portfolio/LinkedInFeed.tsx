import { Linkedin } from "lucide-react";
interface LinkedInPost {
  url: string;
  height: number;
}

interface LinkedInFeedProps {
  clientDetails: {
    socialLinks: {
      linkedin: string;
    };
    embeddedPosts: {
      linkedin: LinkedInPost[];
    };
  };
}

const LinkedInFeed = ({ clientDetails }: LinkedInFeedProps) => {
  const embeddedPosts = clientDetails.embeddedPosts.linkedin;

  return (
    <section className="pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Professional Updates
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect with me on LinkedIn for professional insights
          </p>
          <a
            href={clientDetails.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            Connect on LinkedIn
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {embeddedPosts.map((post, index) => (
            <div key={index} className="w-full flex justify-center">
              <div className="bg-card rounded-lg p-1 border border-border/50 shadow-card w-full max-w-lg">
                <iframe
                  src={post.url}
                  height={post.height}
                  width="504"
                  frameBorder="0"
                  allowFullScreen
                  title={`LinkedIn post ${index + 1}`}
                  className="w-full rounded-lg"
                  style={{
                    maxWidth: "100%",
                    minHeight: "400px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LinkedInFeed;