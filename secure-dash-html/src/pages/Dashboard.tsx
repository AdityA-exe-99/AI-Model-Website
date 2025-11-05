import { useState, useCallback } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, Activity, FileText, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TopLayout from '@/components/TopLayout';
import { useNavigate } from 'react-router-dom';
import { useMetricsPolling } from '@/hooks/use-metrics-polling';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('24h');
  const { metrics, error, lastUpdated, isLoading } = useMetricsPolling(20000, true);
  
  // Legend interactivity state
  const [hiddenSeries, setHiddenSeries] = useState<Record<string, boolean>>({});
  
  const toggleSeries = useCallback((dataKey: string) => {
    setHiddenSeries(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  }, []);

  // Mock recent scans (would come from API in production)
  const recentScans = [
    {
      id: 1,
      email: 'marketing@suspicious-site.com',
      status: 'spam',
      confidence: 94,
      time: '2 hours ago',
      threats: ['Phishing', 'Suspicious Links']
    },
    {
      id: 2,
      email: 'newsletter@legitimate-company.com',
      status: 'ham',
      confidence: 98,
      time: '3 hours ago',
      threats: []
    },
    {
      id: 3,
      email: 'urgent@fake-bank.com',
      status: 'spam',
      confidence: 99,
      time: '5 hours ago',
      threats: ['Malware Attachment', 'Identity Theft']
    },
    {
      id: 4,
      email: 'support@real-service.com',
      status: 'ham',
      confidence: 96,
      time: '1 day ago',
      threats: []
    }
  ];

  // Prepare chart data
  const modelComparisonData = metrics ? [
    {
      name: 'Accuracy',
      'Naïve Bayes': metrics.naive_bayes.accuracy,
      'Logistic Regression': metrics.logistic_regression.accuracy
    },
    {
      name: 'Precision',
      'Naïve Bayes': metrics.naive_bayes.precision,
      'Logistic Regression': metrics.logistic_regression.precision
    },
    {
      name: 'Recall',
      'Naïve Bayes': metrics.naive_bayes.recall,
      'Logistic Regression': metrics.logistic_regression.recall
    },
    {
      name: 'F1 Score',
      'Naïve Bayes': metrics.naive_bayes.f1,
      'Logistic Regression': metrics.logistic_regression.f1
    }
  ] : [];

  // Confusion Matrix data (mock - would come from API)
  const confusionMatrixData = [
    { name: 'True Positive', nb: 850, lr: 820 },
    { name: 'False Positive', nb: 50, lr: 20 },
    { name: 'True Negative', nb: 900, lr: 920 },
    { name: 'False Negative', nb: 100, lr: 140 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ham': return 'text-success';
      case 'spam': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ham': return <CheckCircle className="h-4 w-4" />;
      case 'spam': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <TopLayout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <header className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
            <p className="text-muted-foreground">Monitor your email security in real-time</p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/scan')} className="gap-2">
              <Search className="h-4 w-4" />
              New Scan
            </Button>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="flex items-center gap-2 p-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-sm">Failed to load metrics. Retrying...</span>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading && !metrics ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{metrics?.totals.scans.toLocaleString() || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Spam Detected</CardTitle>
              <Shield className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              {isLoading && !metrics ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-destructive">{metrics?.totals.spam || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {metrics ? ((metrics.totals.spam / metrics.totals.scans) * 100).toFixed(1) : 0}% spam rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safe Emails</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              {isLoading && !metrics ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold text-success">{metrics?.totals.ham.toLocaleString() || 0}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {metrics ? ((metrics.totals.ham / metrics.totals.scans) * 100).toFixed(1) : 0}% safe rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              {isLoading && !metrics ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{metrics ? (metrics.totals.avg_confidence * 100).toFixed(1) : 0}%</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Model confidence
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Model Comparison */}
          <Card role="region" aria-label="Model Performance Comparison">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base md:text-lg">
                <span>Model Performance Comparison</span>
                <RefreshCw className={`h-4 w-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Accuracy, Precision, Recall, and F1 Score (Click legend to toggle)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && !metrics ? (
                <Skeleton className="h-[250px] md:h-[300px] w-full" />
              ) : (
                <ResponsiveContainer width="100%" height={300} className="md:h-[300px] h-[250px]">
                  <BarChart data={modelComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      aria-label="Performance metrics"
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      domain={[0, 1]} 
                      fontSize={12}
                      aria-label="Score values"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                      formatter={(value: any) => (value * 100).toFixed(2) + '%'}
                    />
                    <Legend 
                      onClick={(e) => toggleSeries(e.dataKey as string)}
                      wrapperStyle={{ cursor: 'pointer' }}
                      formatter={(value) => (
                        <span style={{ opacity: hiddenSeries[value] ? 0.5 : 1 }}>
                          {value}
                        </span>
                      )}
                    />
                    {!hiddenSeries['Naïve Bayes'] && (
                      <Bar dataKey="Naïve Bayes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    )}
                    {!hiddenSeries['Logistic Regression'] && (
                      <Bar dataKey="Logistic Regression" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Confusion Matrix */}
          <Card role="region" aria-label="Confusion Matrix Comparison">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Confusion Matrix Comparison</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                True/False Positives and Negatives (Click legend to toggle)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300} className="md:h-[300px] h-[250px]">
                <BarChart data={confusionMatrixData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    angle={-15} 
                    textAnchor="end" 
                    height={80}
                    fontSize={11}
                    aria-label="Confusion matrix categories"
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    aria-label="Count values"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))' 
                    }} 
                  />
                  <Legend 
                    onClick={(e) => toggleSeries(e.dataKey as string)}
                    wrapperStyle={{ cursor: 'pointer' }}
                    formatter={(value) => (
                      <span style={{ opacity: hiddenSeries[value] ? 0.5 : 1 }}>
                        {value}
                      </span>
                    )}
                  />
                  {!hiddenSeries['nb'] && (
                    <Bar dataKey="nb" name="Naïve Bayes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  )}
                  {!hiddenSeries['lr'] && (
                    <Bar dataKey="lr" name="Log. Regression" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Protection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-success" />
              Protection Status
            </CardTitle>
            <CardDescription>Your security system is active and monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Real-time Protection</span>
                <span className="text-sm text-success">Active</span>
              </div>
              <Progress value={100} className="h-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Models: </span>
                  <span>Naïve Bayes + Logistic Regression</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Database Version: </span>
                  <span>v2.1.4</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Scans
            </CardTitle>
            <CardDescription>Latest email security analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(scan.status)}>{getStatusIcon(scan.status)}</div>
                    <p className="font-medium">{scan.email}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{scan.time}</span>
                      <span>•</span>
                      <span>{scan.confidence}% confidence</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium capitalize ${getStatusColor(scan.status)}`}>
                      {scan.status === 'ham' ? 'Safe' : 'Spam'}
                    </span>
                    {scan.threats.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {scan.threats.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/results')}>
                View All Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TopLayout>
  );
};

export default Dashboard;
