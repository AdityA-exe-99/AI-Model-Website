import { useState, useEffect } from 'react';
import TopLayout from '@/components/TopLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Brain, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';

type ModelType = 'nb' | 'lr' | 'both';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [defaultModel, setDefaultModel] = useState<ModelType>(() => {
    const stored = localStorage.getItem('defaultModel') as ModelType;
    return stored || 'both';
  });

  useEffect(() => {
    localStorage.setItem('defaultModel', defaultModel);
  }, [defaultModel]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <TopLayout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </header>

        <div className="grid gap-6">
          {/* Appearance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
                  <SelectTrigger id="theme" className="gap-2">
                    <ThemeIcon className="h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light" className="gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </SelectItem>
                    <SelectItem value="dark" className="gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </SelectItem>
                    <SelectItem value="system" className="gap-2">
                      <Monitor className="h-4 w-4" />
                      System
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how the application appears. System will match your OS preference.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Model Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Model Preferences
              </CardTitle>
              <CardDescription>Set your default spam detection model</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultModel">Default Model</Label>
                <Select value={defaultModel} onValueChange={(value) => setDefaultModel(value as ModelType)}>
                  <SelectTrigger id="defaultModel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nb">Naïve Bayes (Fast)</SelectItem>
                    <SelectItem value="lr">Logistic Regression (Precise)</SelectItem>
                    <SelectItem value="both">Both Models (Compare)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This model will be pre-selected when you start a new scan.
                </p>
              </div>
              <Button onClick={handleSaveSettings}>Save Preferences</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </TopLayout>
  );
};

export default Settings;