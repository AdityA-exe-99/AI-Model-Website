import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Lock, BarChart3, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-cyber opacity-10"></div>
        <div className="container mx-auto px-4 py-20 relative max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Email Security</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-electric to-primary bg-clip-text text-transparent">
              Detect Spam & Malware with Machine Learning
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Advanced spam detection powered by two machine learning models: Multinomial Naïve Bayes and Logistic Regression. 
              Analyze emails instantly with confidence scores and detailed insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/login')}
                className="text-lg px-8 py-6"
              >
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/about')}
                className="text-lg px-8 py-6"
              >
                Learn More
              </Button>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our System?</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analysis</h3>
              <p className="text-muted-foreground">
                Instant spam detection with confidence scores. Get results in seconds, not minutes.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dual Model Approach</h3>
              <p className="text-muted-foreground">
                Choose between Naïve Bayes for speed or Logistic Regression for precision, or run both.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary-electric/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary-electric" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Detailed Insights</h3>
              <p className="text-muted-foreground">
                View keyword importance, confusion matrices, and model comparison charts.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 gradient-cyber text-primary-foreground text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Inbox?</h2>
            <p className="text-lg mb-8 opacity-90">
              Start analyzing emails with our advanced ML models today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Spam Detection System. Built with React, FastAPI & Machine Learning.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
