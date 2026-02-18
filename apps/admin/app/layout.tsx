/**
 * Admin App Root Layout
 * Wraps the entire application with providers
 */

import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard - 130Tools Platform',
  description: 'Comprehensive admin dashboard for managing your tools platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme-storage');
                  if (theme) {
                    var parsed = JSON.parse(theme);
                    if (parsed.state && parsed.state.currentTheme) {
                      document.documentElement.classList.add('theme-' + parsed.state.currentTheme.id);
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-body antialiased">
        {children}
      </body>
    </html>
  )
}