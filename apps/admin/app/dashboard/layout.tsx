/**
 * Admin Dashboard Layout
 * Main dashboard layout with sidebar and navigation
 */

'use client';

import React from 'react';
import { ThemeProvider } from '../../lib/theme-provider';
import { useThemeInit } from '../../lib/theme-store';
import '../styles/themes.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Initialize theme on mount
  useThemeInit();

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}