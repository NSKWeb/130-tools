/**
 * Theme Settings Page
 * Comprehensive theme customization interface
 */

'use client';

import React, { useState } from 'react';
import { Theme } from '@130tools/ui/src/components/theme/theme-types';
import { useThemeStore } from '../../lib/theme-store';
import ThemeSelector from '../../components/theme/ThemeSelector';
import ThemeCustomizer from '../../components/theme/ThemeCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@130tools/ui/src/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@130tools/ui/src/components/ui/card';
import { Button } from '@130tools/ui/src/components/ui/button';
import { Switch } from '@130tools/ui/src/components/ui/switch';
import { Label } from '@130tools/ui/src/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@130tools/ui/src/components/ui/select';
import { ThemePreview } from '../../components/theme/ThemePreview';

export default function ThemeSettingsPage() {
  const { 
    currentTheme, 
    themeSettings, 
    updateThemeSettings, 
    getUserThemes,
    resetToDefault 
  } = useThemeStore();
  
  const [activeTab, setActiveTab] = useState('themes');
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    // Theme selection is handled by the theme selector component
  };

  const handleCustomizeSave = (colors: any, fonts: any, effects: any) => {
    setCustomizerOpen(false);
    // The customizer handles saving through the theme store
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all theme customizations? This cannot be undone.')) {
      resetToDefault();
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
          <p className="text-muted-foreground">
            Customize the appearance of your admin dashboard with beautiful themes
          </p>
        </div>
        <Button onClick={() => setCustomizerOpen(true)} variant="outline">
          Customize Current Theme
        </Button>
      </div>

      {/* Current Theme Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <span className="text-2xl">{currentTheme.preview.icon}</span>
            <span>{currentTheme.name}</span>
          </CardTitle>
          <CardDescription>{currentTheme.preview.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border-2 border-border"
                style={{
                  backgroundColor: currentTheme.colors.primary,
                }}
              />
              <div>
                <p className="font-medium">Primary Color</p>
                <p className="text-sm text-muted-foreground">
                  {currentTheme.colors.primary}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border-2 border-border"
                style={{
                  backgroundColor: currentTheme.colors.background,
                }}
              />
              <div>
                <p className="font-medium">Background</p>
                <p className="text-sm text-muted-foreground">
                  {currentTheme.colors.background}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="themes">Theme Gallery</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Choose Your Theme</h2>
            <p className="text-muted-foreground mb-6">
              Select from our curated collection of themes designed for different use cases
            </p>
          </div>
          <ThemeSelector onThemeSelect={handleThemeSelect} />
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Customize Theme</h2>
              <p className="text-muted-foreground">
                Fine-tune colors, fonts, and effects to create your perfect theme
              </p>
            </div>
            <Button onClick={() => setCustomizerOpen(true)}>
              Open Customizer
            </Button>
          </div>
          
          {customizerOpen && (
            <Card>
              <CardHeader>
                <CardTitle>Theme Customizer</CardTitle>
                <CardDescription>
                  Create a custom version of the current theme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ThemeCustomizer
                  theme={currentTheme}
                  onSave={handleCustomizeSave}
                  onCancel={() => setCustomizerOpen(false)}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Theme Preview</h2>
            <p className="text-muted-foreground mb-6">
              See how your theme looks in different parts of the dashboard
            </p>
          </div>
          <ThemePreview theme={currentTheme} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Theme Settings</h2>
            <p className="text-muted-foreground mb-6">
              Configure auto-switching and other theme preferences
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Auto-Switching</CardTitle>
              <CardDescription>
                Automatically switch themes based on time or system preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Follow System Preference</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to light/dark mode based on your system settings
                  </p>
                </div>
                <Switch
                  checked={themeSettings.followSystem}
                  onCheckedChange={(checked) =>
                    updateThemeSettings({ followSystem: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Switch at Time</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically switch themes at specific times
                  </p>
                </div>
                <Switch
                  checked={themeSettings.autoSwitch}
                  onCheckedChange={(checked) =>
                    updateThemeSettings({ autoSwitch: checked })
                  }
                />
              </div>

              {themeSettings.autoSwitch && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                  <div>
                    <Label>Switch Time</Label>
                    <Select
                      value={themeSettings.autoSwitchTime}
                      onValueChange={(value) =>
                        updateThemeSettings({ autoSwitchTime: value as any })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunrise">Sunrise (6 AM)</SelectItem>
                        <SelectItem value="sunset">Sunset (7 PM)</SelectItem>
                        <SelectItem value="custom">Custom Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {themeSettings.autoSwitchTime === 'custom' && (
                    <div>
                      <Label>Custom Time</Label>
                      <input
                        type="time"
                        value={themeSettings.customSwitchTime}
                        onChange={(e) =>
                          updateThemeSettings({ customSwitchTime: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-input rounded-md"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Effects</CardTitle>
              <CardDescription>
                Configure animations and transitions for theme changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Show smooth animations and transitions
                  </p>
                </div>
                <Switch
                  checked={themeSettings.enableAnimations}
                  onCheckedChange={(checked) =>
                    updateThemeSettings({ enableAnimations: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Transition Duration</Label>
                <Select
                  value={themeSettings.transitionDuration.toString()}
                  onValueChange={(value) =>
                    updateThemeSettings({ transitionDuration: parseInt(value) })
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Instant (0ms)</SelectItem>
                    <SelectItem value="150">Quick (150ms)</SelectItem>
                    <SelectItem value="300">Normal (300ms)</SelectItem>
                    <SelectItem value="500">Slow (500ms)</SelectItem>
                    <SelectItem value="750">Very Slow (750ms)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                Irreversible changes to your theme settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleReset} variant="destructive">
                Reset All Theme Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}