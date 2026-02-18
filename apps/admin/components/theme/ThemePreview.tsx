/**
 * Theme Preview Component
 * Shows how the theme looks in different parts of the dashboard
 */

'use client';

import React from 'react';
import { Theme } from '@130tools/ui/src/components/theme/theme-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@130tools/ui/src/components/ui/card';
import { Button } from '@130tools/ui/src/components/ui/button';
import { Badge } from '@130tools/ui/src/components/ui/badge';
import { Avatar, AvatarFallback } from '@130tools/ui/src/components/ui/avatar';
import { Input } from '@130tools/ui/src/components/ui/input';
import { Label } from '@130tools/ui/src/components/ui/label';
import { Textarea } from '@130tools/ui/src/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@130tools/ui/src/components/ui/tabs';
import { Progress } from '@130tools/ui/src/components/ui/progress';

interface ThemePreviewProps {
  theme: Theme;
  className?: string;
}

export function ThemePreview({ theme, className }: ThemePreviewProps) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dashboard Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Preview</CardTitle>
            <CardDescription>
              How your theme looks in the main dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Header */}
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <h4
                  style={{
                    color: theme.colors.cardForeground,
                    fontFamily: theme.fonts.heading,
                  }}
                >
                  Admin Dashboard
                </h4>
                <Avatar>
                  <AvatarFallback
                    style={{
                      backgroundColor: theme.colors.accent,
                      color: theme.colors.accentForeground,
                    }}
                  >
                    A
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  113
                </div>
                <div
                  className="text-xs"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  Tools
                </div>
              </div>
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.success }}
                >
                  98%
                </div>
                <div
                  className="text-xs"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  Uptime
                </div>
              </div>
              <div
                className="p-3 rounded-lg border"
                style={{
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.info }}
                >
                  1.2k
                </div>
                <div
                  className="text-xs"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  Users
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.primaryForeground,
                }}
              >
                Primary Action
              </Button>
              <Button
                variant="outline"
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
              >
                Secondary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Form Preview</CardTitle>
            <CardDescription>
              Input fields and form elements in your theme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                style={{ color: theme.colors.foreground }}
              >
                Name
              </Label>
              <Input
                style={{
                  backgroundColor: theme.colors.input,
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-2">
              <Label
                style={{ color: theme.colors.foreground }}
              >
                Description
              </Label>
              <Textarea
                style={{
                  backgroundColor: theme.colors.input,
                  borderColor: theme.colors.border,
                  color: theme.colors.foreground,
                }}
                placeholder="Enter description"
              />
            </div>

            <div className="flex gap-2">
              <Badge
                style={{
                  backgroundColor: theme.colors.success,
                  color: theme.colors.successForeground,
                }}
              >
                Success
              </Badge>
              <Badge
                style={{
                  backgroundColor: theme.colors.warning,
                  color: theme.colors.warningForeground,
                }}
              >
                Warning
              </Badge>
              <Badge
                style={{
                  backgroundColor: theme.colors.info,
                  color: theme.colors.infoForeground,
                }}
              >
                Info
              </Badge>
            </div>

            <div className="space-y-2">
              <div
                className="text-sm font-medium"
                style={{ color: theme.colors.foreground }}
              >
                Progress
              </div>
              <Progress
                value={65}
                className="w-full"
                style={{
                  '--progress-background': theme.colors.muted,
                  '--progress-foreground': theme.colors.primary,
                } as React.CSSProperties}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation Preview</CardTitle>
            <CardDescription>
              Sidebar and navigation elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="w-48 p-3 rounded-lg"
              style={{
                backgroundColor: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <nav className="space-y-2">
                <div
                  className="flex items-center gap-2 p-2 rounded"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: theme.colors.primaryForeground,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span className="text-sm">Dashboard</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 rounded opacity-70"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                  <span className="text-sm">Tools</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 rounded opacity-70"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                  <span className="text-sm">Users</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 rounded opacity-70"
                  style={{ color: theme.colors.mutedForeground }}
                >
                  <div className="w-2 h-2 rounded-full bg-current opacity-50" />
                  <span className="text-sm">Settings</span>
                </div>
              </nav>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts Preview</CardTitle>
            <CardDescription>
              Status messages and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: `${theme.colors.success}15`,
                borderColor: theme.colors.success,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.success }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.success }}
                >
                  Success Message
                </span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: `${theme.colors.warning}15`,
                borderColor: theme.colors.warning,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.warning }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.warning }}
                >
                  Warning Message
                </span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: `${theme.colors.info}15`,
                borderColor: theme.colors.info,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.info }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.info }}
                >
                  Info Message
                </span>
              </div>
            </div>

            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: `${theme.colors.destructive}15`,
                borderColor: theme.colors.destructive,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.destructive }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: theme.colors.destructive }}
                >
                  Error Message
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Tabs Preview</CardTitle>
          <CardDescription>
            Tab navigation in your theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tab1" className="space-y-4">
            <TabsList
              className="grid w-full grid-cols-3"
              style={{
                backgroundColor: theme.colors.muted,
              }}
            >
              <TabsTrigger
                value="tab1"
                style={{
                  color: theme.colors.mutedForeground,
                }}
              >
                Tab 1
              </TabsTrigger>
              <TabsTrigger
                value="tab2"
                style={{
                  color: theme.colors.mutedForeground,
                }}
              >
                Tab 2
              </TabsTrigger>
              <TabsTrigger
                value="tab3"
                style={{
                  color: theme.colors.mutedForeground,
                }}
              >
                Tab 3
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="tab1"
              className="p-4 border rounded-lg"
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              }}
            >
              <p
                style={{ color: theme.colors.cardForeground }}
              >
                Tab content area with your theme colors
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default ThemePreview;