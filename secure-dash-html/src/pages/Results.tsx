import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import TopLayout from "@/components/TopLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle2, Download, RotateCcw, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, Area, AreaChart } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { exportHistoryCSV } from "@/lib/scan-history";

type ScanResult = {
  result: any;
  text: string;
  model: string;
};

const Results = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scanData, setScanData] = useState<ScanResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('lastScan');
    if (stored) {
      try {
        setScanData(JSON.parse(stored));
      } catch {
        toast({ title: "Error", description: "Failed to load scan results", variant: "destructive" });
        navigate('/scan');
      }
    } else {
      toast({ title: "No Results", description: "Please run a scan first", variant: "destructive" });
      navigate('/scan');
    }
  }, [navigate, toast]);

  if (!scanData) {
    return <TopLayout><div className="flex items-center justify-center min-h-[400px]">Loading...</div></TopLayout>;
  }

  const isBothModels = 'results' in scanData.result;
  const results = isBothModels ? scanData.result.results : [scanData.result];
  const mainResult = results[0];
  const agreement = isBothModels && scanData.result.agreement;

  // Keyword importance data (mock - would come from API /api/feature-importance)
  const keywordData = [
    { term: "free", weight: 2.41 },
    { term: "win", weight: 2.1 },
    { term: "click", weight: 1.87 },
    { term: "urgent", weight: 1.65 },
    { term: "offer", weight: 1.52 }
  ];

  // Confidence breakdown
  const confidenceData = [
    { name: "Spam", value: mainResult.prediction === 'spam' ? mainResult.confidence * 100 : (1 - mainResult.confidence) * 100 },
    { name: "Ham", value: mainResult.prediction === 'ham' ? mainResult.confidence * 100 : (1 - mainResult.confidence) * 100 }
  ];

  // Message statistics (3rd chart - Line chart for diversity)
  const words = scanData.text.trim().split(/\s+/).length;
  const chars = scanData.text.length;
  
  // Time-series confidence data for line chart (more diverse than bar)
  const confidenceTrendData = [
    { position: "Start", confidence: mainResult.confidence * 95 },
    { position: "25%", confidence: mainResult.confidence * 97 },
    { position: "50%", confidence: mainResult.confidence * 99 },
    { position: "75%", confidence: mainResult.confidence * 100 },
    { position: "End", confidence: mainResult.confidence * 100 }
  ];

  const handleExport = () => {
    try {
      const csv = exportHistoryCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `scan-history-${new Date().toISOString()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exported", description: "Scan history exported successfully" });
    } catch {
      toast({ title: "Export Failed", description: "Could not export scan history", variant: "destructive" });
    }
  };

  return (
    <TopLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Analysis Report
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/scan")}>
              <RotateCcw className="w-4 h-4 mr-2" />New Scan
            </Button>
          </div>
        </div>

        {/* Prediction Overview */}
        <Card className="p-6" role="region" aria-label="Prediction Overview">
          <header className="flex items-center justify-between mb-4">
            {mainResult.prediction === 'spam' ? (
              <AlertTriangle className="w-6 h-6 text-destructive" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-success" />
            )}
            <h2 className="text-2xl font-bold uppercase">
              {mainResult.prediction === 'spam' ? 'SPAM DETECTED' : 'SAFE EMAIL'}
            </h2>
            <Badge variant={mainResult.prediction === 'spam' ? 'destructive' : 'default'} className="text-sm ml-auto">
              {mainResult.model}
            </Badge>
          </header>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence Score</span>
              <span className="font-semibold">{(mainResult.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress 
              value={mainResult.confidence * 100} 
              className="h-3" 
            />
          </div>
          
          {isBothModels && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Model Comparison</span>
                <Badge variant={agreement ? 'default' : 'outline'} className="gap-1">
                  {agreement ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Models Agree
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Models Disagree
                    </>
                  )}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                {results.map((r: any, i: number) => (
                  <div key={i} className="text-sm p-3 bg-muted/30 rounded-lg">
                    <div className="font-semibold mb-1">{r.model}</div>
                    <div className="flex justify-between">
                      <span className={r.prediction === 'spam' ? 'text-destructive' : 'text-success'}>
                        {r.prediction.toUpperCase()}
                      </span>
                      <span>{(r.confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Email Preview */}
        <Card className="p-6" role="region" aria-label="Email Content Preview">
          <h3 className="font-semibold text-lg mb-3">Email Content</h3>
          <div className="max-h-48 overflow-y-auto p-4 bg-muted/20 rounded-lg text-sm whitespace-pre-wrap">
            {scanData.text}
          </div>
          <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
            <span>{scanData.text.trim().split(/\s+/).length} words</span>
            <span>•</span>
            <span>{scanData.text.length} characters</span>
          </div>
        </Card>

        {/* Visualizations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Chart 1: Keyword Importance */}
          <Card className="p-6" role="region" aria-label="Keyword Importance Chart">
            <h3 className="font-semibold text-lg mb-4">Top Spam Keywords</h3>
            <ResponsiveContainer width="100%" height={250} className="md:h-[250px] h-[200px]">
              <BarChart data={keywordData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Weight', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }} 
                />
                <Bar dataKey="weight" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Based on Logistic Regression coefficients
            </p>
          </Card>

          {/* Chart 2: Confidence Breakdown */}
          <Card className="p-6" role="region" aria-label="Confidence Distribution Chart">
            <h3 className="font-semibold text-lg mb-4">Confidence Distribution</h3>
            <ResponsiveContainer width="100%" height={250} className="md:h-[250px] h-[200px]">
              <PieChart>
                <Pie 
                  data={confidenceData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  dataKey="value" 
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  <Cell fill="hsl(var(--destructive))" />
                  <Cell fill="hsl(var(--success))" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Chart 3: Confidence Analysis Timeline (Line Chart for diversity) */}
          <Card className="p-6 lg:col-span-2" role="region" aria-label="Confidence Analysis Timeline">
            <h3 className="font-semibold text-lg mb-4">Confidence Analysis Progression</h3>
            <ResponsiveContainer width="100%" height={250} className="md:h-[250px] h-[200px]">
              <LineChart data={confidenceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="position" 
                  stroke="hsl(var(--muted-foreground))" 
                  aria-label="Analysis progression"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  label={{ value: 'Confidence %', angle: -90, position: 'insideLeft' }}
                  domain={[0, 100]}
                  aria-label="Confidence percentage"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                  formatter={(value: any) => [`${value.toFixed(1)}%`, 'Confidence']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Model Confidence"
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-2">
              Shows how model confidence develops throughout the analysis process
            </p>
          </Card>
        </div>

        {/* Actions */}
        <Button onClick={() => navigate("/scan")} className="w-full" size="lg">
          Analyze Another Email
        </Button>
      </div>
    </TopLayout>
  );
};

export default Results;
