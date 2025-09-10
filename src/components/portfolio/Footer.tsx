import { Instagram, Linkedin, Youtube } from "lucide-react";
import { clientDetails } from "@/data/client-details-link2";

const Footer = () => {
  return (
    <footer className="h-[50px] bg-card border-t border-border/50 px-6">
      <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
        <div className="flex-1" />
        
        <div className="flex-1 flex justify-center">
          <p className="text-muted-foreground text-sm">
            powered by{" "}
            <a
              href="https://www.cruxcreations.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:text-accent/80 transition-colors"
            >
              Crux Creations
            </a>
          </p>
        </div>
        
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <a
              href='https://www.instagram.com/crux.creations'
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href='https://www.linkedin.com/company/crux-creations/posts/?feedView=all'
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://www.youtube.com/@CruxCreations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;