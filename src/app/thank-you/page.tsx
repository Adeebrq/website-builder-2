"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Mail, CheckCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const router = useRouter();
  
//   const portfolioUrl = `username.adeebrq.me`;

  const handleGoHome = () => {
    router.push('/register');
  };

  const handleCreateAnother = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl p-8 bg-card border-border shadow-card text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🎉 Portfolio Submitted Successfully!
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Thank you! We've received your portfolio information and are currently setting everything up.
          </p>
        </div>

        {/* Processing Status */}
        <div className="bg-muted/30 rounded-lg p-6 border border-border mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your Portfolio is Being Created
              </h2>
              <p className="text-muted-foreground">
                Estimated completion time: 2-5 minutes
              </p>
            </div>
          </div>
          
          <div className="bg-background rounded-md p-4 border border-border">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Email Notification</span>
            </div>
            <p className="text-sm text-muted-foreground">
              We'll send your portfolio link to your email once it's ready
            </p>
          </div>
        </div>

        {/* Expected URL Preview */}
        {/* <div className="bg-muted/20 rounded-lg p-4 border border-border mb-8">
          <p className="text-sm text-muted-foreground mb-2">Your portfolio will be available at:</p>
          <div className="font-mono text-primary bg-background px-4 py-2 rounded-md border border-border text-lg">
            {portfolioUrl}
          </div>
        </div> */}

        {/* What's Happening */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            What's Happening Now?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="text-primary font-medium mb-2">⚙️ Processing</div>
              <p>Setting up your custom domain and portfolio structure</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="text-primary font-medium mb-2">🎨 Designing</div>
              <p>Applying your chosen color theme and organizing your content</p>
            </div>
            <div className="bg-muted/20 rounded-lg p-4 border border-border">
              <div className="text-primary font-medium mb-2">🚀 Deploying</div>
              <p>Making your portfolio live and accessible worldwide</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {/* <Button
            onClick={handleGoHome}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6 px-8"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button> */}
          
          <Button
            onClick={handleCreateAnother}
            variant="outline"
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6 px-8"
          >
            Create Another Portfolio
          </Button>
        </div>

        {/* Important Note */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Important:</strong> Please check your email (including spam folder) for the portfolio link.
          </p>
        </div>
      </Card>
    </div>
  );
}