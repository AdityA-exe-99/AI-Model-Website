import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import TopLayout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { predictEmail } from "@/lib/api";
import { scanSchema, toUserMessage } from "@/lib/validation";
import { addToHistory } from "@/lib/scan-history";

type ModelChoice = "nb" | "lr" | "both";

const NewScan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"text" | "file">("text");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [modelChoice, setModelChoice] = useState<ModelChoice>(() => {
    const stored = localStorage.getItem('defaultModel') as ModelChoice;
    return stored || 'both';
  });
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string>("");

  const charCount = emailText.length;
  const wordCount = emailText.trim().split(/\s+/).filter(Boolean).length;

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.name.endsWith('.txt')) {
      toast({ 
        title: "Invalid File Type", 
        description: "Please upload a .txt file only.", 
        variant: "destructive" 
      });
      return;
    }

    // Validate file size (2MB limit)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast({ 
        title: "File Too Large", 
        description: "File must be less than 2MB.", 
        variant: "destructive" 
      });
      return;
    }

    setFile(selectedFile);

    // Read file content
    try {
      const text = await selectedFile.text();
      setEmailText(text);
      setValidationError("");
    } catch (error) {
      toast({ 
        title: "Error Reading File", 
        description: "Could not read file content.", 
        variant: "destructive" 
      });
    }
  };

  const handleSubmit = async () => {
    setValidationError("");

    // Validate input
    const validation = scanSchema.safeParse({ text: emailText, model: modelChoice });
    if (!validation.success) {
      const error = validation.error.issues[0]?.message || "Validation failed";
      setValidationError(error);
      toast({ title: "Validation Error", description: error, variant: "destructive" });
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => setScanProgress(p => Math.min(p + 5, 95)), 100);

    try {
      const result = await predictEmail(emailText, modelChoice);
      clearInterval(interval);
      setScanProgress(100);

      // Save to history
      if ('results' in result) {
        // Both models
        result.results.forEach(r => {
          addToHistory({
            text: emailText,
            prediction: r.prediction,
            confidence: r.confidence,
            model: r.model
          });
        });
      } else {
        // Single model
        addToHistory({
          text: emailText,
          prediction: result.prediction,
          confidence: result.confidence,
          model: result.model
        });
      }

      // Store result for Results page
      sessionStorage.setItem('lastScan', JSON.stringify({ 
        result, 
        text: emailText, 
        model: modelChoice 
      }));

      toast({ title: "Scan Complete", description: "Analysis finished successfully." });
      navigate("/results");
    } catch (error: any) {
      clearInterval(interval);
      setIsScanning(false);
      setScanProgress(0);
      const message = toUserMessage(error);
      setValidationError(message);
      toast({ 
        title: "Scan Failed", 
        description: message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <TopLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-primary" />
          New Email Scan
        </h1>

        <div className="flex gap-2">
          <Button variant={activeTab === "text" ? "default" : "outline"} onClick={() => setActiveTab("text")} className="flex-1">
            <FileText className="w-4 h-4 mr-2" />Text Analysis
          </Button>
          <Button variant={activeTab === "file" ? "default" : "outline"} onClick={() => setActiveTab("file")} className="flex-1">
            <Upload className="w-4 h-4 mr-2" />File Upload
          </Button>
        </div>

        <Card className="p-6" role="region" aria-label="Model Selection">
          <Label className="text-base font-semibold mb-3 block">Select Model</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "nb", label: "Naïve Bayes", desc: "Fast" },
              { value: "lr", label: "Logistic Regression", desc: "Precise" },
              { value: "both", label: "Both Models", desc: "Compare" }
            ].map(m => (
              <Button key={m.value} variant={modelChoice === m.value ? "default" : "outline"} 
                onClick={() => setModelChoice(m.value as ModelChoice)} className="h-auto py-3 flex flex-col gap-1">
                <span className="font-semibold">{m.label}</span>
                <span className="text-xs opacity-80">{m.desc}</span>
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6" role="region" aria-label="Email Input">
          {activeTab === "text" ? (
            <div className="space-y-4">
              <Label htmlFor="emailContent">Email Content</Label>
              <Textarea 
                id="emailContent"
                placeholder="Paste email text here..." 
                value={emailText} 
                onChange={(e) => {
                  setEmailText(e.target.value);
                  setValidationError("");
                }}
                className="min-h-[300px]" 
                aria-describedby="char-count"
              />
              <div className="flex justify-between text-sm text-muted-foreground" id="char-count">
                <span>{wordCount} words • {charCount} characters</span>
                <span className={charCount < 10 ? "text-destructive" : charCount > 20000 ? "text-warning" : ""}>
                  {charCount < 10 ? "Minimum 10 characters" : charCount > 20000 ? "Maximum 20,000 characters" : ""}
                </span>
              </div>
              {validationError && (
                <p className="text-sm text-destructive">{validationError}</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <label className="border-2 border-dashed rounded-lg p-8 text-center block">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <span className="cursor-pointer text-primary font-semibold">
                  Choose .txt file (max 2MB)
                </span>
                <input 
                  id="file" 
                  type="file" 
                  accept=".txt" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                {file && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {file.name} ({(file.size / 1024).toFixed(1)}KB)
                  </p>
                )}
              </label>
              {emailText && (
                <>
                  <Label>File Preview</Label>
                  <div className="max-h-48 overflow-y-auto p-4 bg-muted/30 rounded-lg text-sm">
                    {emailText.slice(0, 500)}
                    {emailText.length > 500 && '...'}
                  </div>
                </>
              )}
            </div>
          )}
        </Card>

        <Button 
          onClick={handleSubmit} 
          disabled={isScanning || charCount < 10 || charCount > 20000} 
          className="w-full py-6 text-lg"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5 mr-2" />
              Analyze Email
            </>
          )}
        </Button>

        {isScanning && (
          <Card className="p-6">
            <Progress value={scanProgress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Analyzing with {modelChoice === "both" ? "both models" : modelChoice === "nb" ? "Naïve Bayes" : "Logistic Regression"}...
            </p>
          </Card>
        )}
      </div>
    </TopLayout>
  );
};

export default NewScan;
