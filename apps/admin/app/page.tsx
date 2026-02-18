/**
 * Dashboard Home Page
 * Main admin dashboard with theme settings
 */

import React from 'react';
import ThemeSettingsPage from './settings/appearance/page';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the 130+ Tools Platform administration panel
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold">Total Tools</h3>
          <p className="text-2xl font-bold text-primary">113</p>
          <p className="text-sm text-muted-foreground">66.5% of 170 goal</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold">Active Users</h3>
          <p className="text-2xl font-bold text-success">1,248</p>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <h3 className="font-semibold">System Health</h3>
          <p className="text-2xl font-bold text-info">98.2%</p>
          <p className="text-sm text-muted-foreground">All systems operational</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a 
          href="/dashboard/settings/appearance"
          className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <div className="text-2xl mb-2">🎨</div>
          <h3 className="font-semibold">Theme Settings</h3>
          <p className="text-sm text-muted-foreground">Customize your dashboard</p>
        </a>
        <div className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <div className="text-2xl mb-2">🛠️</div>
          <h3 className="font-semibold">Tools Manager</h3>
          <p className="text-sm text-muted-foreground">Manage your tools</p>
        </div>
        <div className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <div className="text-2xl mb-2">👥</div>
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-muted-foreground">View and edit users</p>
        </div>
        <div className="p-4 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="font-semibold">Analytics</h3>
          <p className="text-sm text-muted-foreground">View usage statistics</p>
        </div>
      </div>
    </div>
  );
}