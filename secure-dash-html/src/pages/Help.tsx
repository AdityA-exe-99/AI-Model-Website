import { Shield, HelpCircle, Book, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TopLayout from '@/components/TopLayout';

const Help = () => {
  const faqs = [
    {
      question: "How does SecureShield detect spam and malware?",
      answer: "SecureShield uses advanced machine learning algorithms combined with signature-based detection to identify threats. Our system analyzes email headers, content patterns, sender reputation, and attachment characteristics to provide comprehensive threat detection with high accuracy."
    },
    {
      question: "What file formats are supported for analysis?",
      answer: "We support .eml (standard email format), .msg (Outlook format), and .txt files. Files should be under 10MB in size. For best results, use the original email format (.eml) as it preserves all header information needed for thorough analysis."
    },
    {
      question: "How accurate is the threat detection?",
      answer: "Our system maintains a 94% accuracy rate with less than 2% false positives. The confidence score provided with each analysis indicates the system's certainty level. Scores above 85% are considered highly reliable."
    },
    {
      question: "Is my data stored or shared with third parties?",
      answer: "No. All email analysis is performed locally and securely. We do not store email content permanently or share any data with third parties. Scan results are kept for 90 days for your reference and then automatically deleted."
    },
    {
      question: "What should I do if a safe email is marked as spam?",
      answer: "False positives can occur. If you believe an email was incorrectly flagged, you can adjust the detection sensitivity in Settings or contact our support team to help improve the detection algorithms."
    },
    {
      question: "How often are threat definitions updated?",
      answer: "Our threat intelligence database is updated in real-time as new threats are discovered. The system automatically downloads updates every 4 hours to ensure protection against the latest threats."
    }
  ];

  const resources = [
    {
      title: "Email Security Best Practices",
      description: "Learn how to identify and avoid common email threats",
      icon: Shield,
      link: "#"
    },
    {
      title: "Understanding Threat Scores", 
      description: "How to interpret analysis results and confidence levels",
      icon: HelpCircle,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Integrate SecureShield into your existing security stack",
      icon: Book,
      link: "#"
    }
  ];

  return (
    <TopLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
          <p className="text-lg text-muted-foreground">
            Get help with SecureShield and learn about email security
          </p>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center text-center p-6">
              <MessageSquare className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Mail className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Email Support</h3>
              <p className="text-sm text-muted-foreground">Send us a detailed inquiry</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="flex flex-col items-center text-center p-6">
              <Book className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Documentation</h3>
              <p className="text-sm text-muted-foreground">Browse our comprehensive guides</p>
            </CardContent>
          </Card>
        </div>

        {/* About SecureShield */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              About SecureShield
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              SecureShield is an advanced email security platform designed to protect organizations 
              from spam, phishing, and malware threats. Built using cutting-edge machine learning 
              algorithms and real-time threat intelligence, our system provides comprehensive 
              email analysis with industry-leading accuracy.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time threat detection</li>
                  <li>• Machine learning-powered analysis</li>
                  <li>• Phishing and malware protection</li>
                  <li>• Email authentication validation</li>
                  <li>• Detailed threat reporting</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technical Specifications</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 94% detection accuracy</li>
                  <li>• &lt;2% false positive rate</li>
                  <li>• Real-time updates</li>
                  <li>• Enterprise-grade security</li>
                  <li>• GDPR compliant</li>
                </ul>
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg mt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Academic Project Disclaimer:</strong> This is a demonstration project 
                created for educational purposes. While the interface and functionality are 
                designed to showcase real-world email security concepts, this is not a 
                production security system.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about using SecureShield
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
            <CardDescription>
              Expand your knowledge about email security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <resource.icon className="h-5 w-5 text-primary" />
                    <section>
                      <h4 className="font-semibold">{resource.title}</h4>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </section>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h4 className="font-semibold mb-2">Support Hours</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </section>
            
            <section>
              <h4 className="font-semibold mb-2">Contact Methods</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Email: support@secureshield.demo</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Live Chat: Available during support hours</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </TopLayout>
  );
};

export default Help;