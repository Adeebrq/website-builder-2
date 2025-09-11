"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, Globe, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router= useRouter();

  useEffect(()=>{
    router.push("/register")
  },[])

  return (
    // <div className="min-h-screen bg-gradient-hero">
    //   {/* Hero Section */}
    //   <section className="min-h-screen flex items-center justify-center px-6 py-20">
    //     <div className="max-w-4xl mx-auto text-center">
    //       <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
    //         Portfolio Platform
    //       </h1>
    //       <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8">
    //         Create your personalized portfolio website in minutes
    //       </p>
    //       <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12">
    //         Get your own subdomain like <span className="text-primary font-semibold">yourname.adeebrq.me</span> and showcase your work professionally.
    //       </p>
          
    //       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
    //         <Link href="/register">
    //           <Button 
    //             size="lg" 
    //             className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
    //           >
    //             Create Your Portfolio
    //             <ArrowRight className="w-5 h-5 ml-2" />
    //           </Button>
    //         </Link>
    //       </div>

    //       {/* Features */}
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
    //         <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
    //           <Users className="w-8 h-8 text-primary mb-4 mx-auto" />
    //           <h3 className="text-lg font-semibold text-foreground mb-2">Easy Setup</h3>
    //           <p className="text-muted-foreground text-sm">
    //             Fill out a simple form and get your portfolio live in minutes
    //           </p>
    //         </Card>
            
    //         <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
    //           <Globe className="w-8 h-8 text-primary mb-4 mx-auto" />
    //           <h3 className="text-lg font-semibold text-foreground mb-2">Custom Domain</h3>
    //           <p className="text-muted-foreground text-sm">
    //             Get your own subdomain like yourname.adeebrq.me
    //           </p>
    //         </Card>
            
    //         <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
    //           <Zap className="w-8 h-8 text-primary mb-4 mx-auto" />
    //           <h3 className="text-lg font-semibold text-foreground mb-2">Fast & Modern</h3>
    //           <p className="text-muted-foreground text-sm">
    //             Built with Next.js for lightning-fast performance
    //           </p>
    //         </Card>
    //       </div>
    //     </div>
    //   </section>
    // </div>
    <div>
      <p>Loading...</p>

    </div>
  );
}


