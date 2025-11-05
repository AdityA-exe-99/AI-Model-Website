import TopLayout from "@/components/TopLayout";
import { Card } from "@/components/ui/card";
import { Brain, Zap } from "lucide-react";

const About = () => {
  return (
    <TopLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">About This Project</h1>

        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="text-muted-foreground">
            AI-powered spam detection using Multinomial Naïve Bayes and Logistic Regression. 
            Built with React.js frontend and FastAPI backend for real-time email analysis.
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multinomial Naïve Bayes</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fast probabilistic classifier using word frequency analysis.
            </p>
            <p className="text-sm"><strong>Accuracy:</strong> 97.19%</p>
          </Card>

          <Card className="p-6">
            <Zap className="w-12 h-12 text-primary-electric mb-4" />
            <h3 className="text-xl font-semibold mb-2">Logistic Regression</h3>
            <p className="text-sm text-muted-foreground mb-4">
              High-precision classifier with interpretable weighted coefficients.
            </p>
            <p className="text-sm"><strong>Accuracy:</strong> 97.01%</p>
          </Card>
        </div>
      </div>
    </TopLayout>
  );
};

export default About;
