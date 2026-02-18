# Theme System Documentation

## Overview

The 130+ Tools Platform now includes a comprehensive theme system for the admin dashboard with 10+ customizable themes including aesthetic, eye-friendly, medical, and child-friendly options.

## Features

### 🎨 Theme Collection

**Aesthetic Themes:**
- **Midnight Dark** - Deep dark theme with indigo accents for night work
- **Ocean Blue** - Deep ocean blues with cyan accents
- **Forest Green** - Rich forest greens with nature-inspired design
- **Sunset Warm** - Warm orange tones reminiscent of sunset

**Eye-Friendly Themes:**
- **Sepia Comfort** - Warm sepia tones for reduced eye strain
- **Soft Cream** - Gentle cream background with soft purple

**Medical Themes:**
- **Medical Clean** - Clinical teal and white for healthcare use
- **Medical Blue** - Trustworthy blue tones for medical dashboards

**Child-Friendly Themes:**
- **Playful Rainbow** - Fun pink and rainbow accents
- **Kids Adventure** - Adventure greens and yellows for children

**Business Themes:**
- **Corporate Slate** - Professional slate gray for business use
- **High Contrast** - Maximum contrast black/white for accessibility
- **Light** - Clean white theme (default)

### ⚙️ Features

1. **Instant Theme Switching** - No page reload required
2. **Theme Customization** - Create custom themes with color pickers
3. **Auto-Switching** - Time-based or system preference-based switching
4. **Theme Persistence** - Preferences saved to localStorage and database
5. **Live Preview** - See theme changes in real-time
6. **Responsive Design** - Themes work on all screen sizes
7. **Accessibility** - WCAG AAA compliant high contrast theme
8. **Smooth Transitions** - Animated theme switching

## Usage

### Quick Theme Switch

1. Navigate to the admin dashboard
2. Click on any theme preview to switch instantly
3. Or use the theme selector in the settings panel

### Advanced Customization

1. Go to `Settings` → `Appearance`
2. Click `Customize Current Theme`
3. Use the color picker to adjust any color
4. Change fonts, border radius, and effects
5. Save as a custom theme

### Auto-Switching Setup

1. In Settings → Appearance → Settings tab
2. Enable "Follow System Preference" for dark/light mode
3. Or enable "Auto-Switch at Time" for sunrise/sunset/custom times
4. Configure transition duration and animations

## Architecture

### Core Components

- **ThemeProvider** - React context provider for theme state
- **ThemeStore** - Zustand store for theme management
- **ThemeSelector** - Grid of theme cards for selection
- **ThemeCustomizer** - Advanced customization interface
- **ThemePreview** - Live preview of theme in dashboard components

### Database Integration

The theme system includes database models for:
- User theme preferences
- Custom themes
- Theme settings
- Usage analytics

### CSS Integration

Themes use CSS custom properties (variables) for:
- Color palette
- Typography
- Effects and shadows
- Border radius
- Transitions

## File Structure

```
packages/ui/src/components/theme/
├── theme-types.ts           # TypeScript interfaces
├── theme-definitions.ts     # Theme definitions (10+ themes)
└── index.ts                 # Theme exports

apps/admin/lib/
├── theme-store.ts           # Zustand theme store
├── theme-provider.tsx       # React context provider

apps/admin/components/theme/
├── ThemeSelector.tsx        # Theme selection UI
├── ThemeCustomizer.tsx      # Customization interface
├── ThemePreview.tsx         # Live preview component
├── ThemeToggle.tsx          # Quick theme switcher

apps/admin/app/dashboard/settings/appearance/
└── page.tsx                 # Theme settings page

apps/admin/styles/
└── themes.css               # CSS theme variables

packages/database/
├── src/theme-models.ts      # Database models
└── migrations/
    └── 20240101000000_add_theme_system/
        └── migration.sql    # Database schema
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install zustand
   ```

2. **Database Migration**
   ```bash
   pnpm db:migrate
   ```

3. **Build & Run**
   ```bash
   pnpm build
   pnpm dev:admin
   ```

4. **Access Admin Dashboard**
   - Navigate to http://localhost:3001
   - Go to Settings → Appearance

## Customization

### Adding New Themes

1. Add theme definition to `theme-definitions.ts`:
   ```typescript
   yourNewTheme: {
     id: 'your-new-theme',
     name: 'Your New Theme',
     colors: { /* color definitions */ },
     fonts: { /* font definitions */ },
     effects: { /* effect definitions */ },
     preview: { /* theme metadata */ }
   }
   ```

2. Add CSS variables to `themes.css`:
   ```css
   .theme-your-new-theme {
     --color-primary: #your-color;
     /* ... other colors ... */
   }
   ```

### Creating Custom Themes

Users can create custom themes through the customizer:
1. Select base theme
2. Adjust colors with color picker
3. Change fonts and effects
4. Save as custom theme
5. Share publicly (optional)

## Performance

- **Lazy Loading** - Theme components loaded on demand
- **Efficient Storage** - LocalStorage for quick access, DB for persistence
- **Smooth Transitions** - CSS-based transitions for 60fps animations
- **Optimized Bundle** - Theme CSS included with components, not global

## Browser Support

- **Modern Browsers** - Chrome 90+, Firefox 88+, Safari 14+
- **CSS Variables** - Full support for custom properties
- **LocalStorage** - For theme persistence
- **Canvas/SVG** - For theme preview generation

## Accessibility

- **High Contrast Theme** - WCAG AAA compliant
- **Keyboard Navigation** - Full keyboard support
- **Screen Readers** - Proper ARIA labels and roles
- **Color Blindness** - Themes tested for accessibility
- **Focus Indicators** - Clear focus states for all interactive elements

## API Reference

### Theme Store

```typescript
useThemeStore.setTheme(themeId: string) // Switch theme
useThemeStore.getTheme(themeId: string) // Get theme by ID
useThemeStore.createCustomTheme(config) // Create custom theme
useThemeStore.updateThemeSettings(settings) // Update preferences
```

### Theme Hook

```typescript
const { theme, setTheme, isLoading } = useTheme()
```

## Contributing

To add new features or fix issues:

1. **Add Theme** - Update `theme-definitions.ts` and CSS
2. **Fix Bug** - Check theme store, provider, or component
3. **Add Feature** - Extend types, store, and components
4. **Update Docs** - Update this README with changes

## Future Enhancements

- [ ] Theme marketplace for sharing custom themes
- [ ] Theme analytics and recommendations
- [ ] Import/export theme configurations
- [ ] Advanced animation controls
- [ ] Theme scheduling and automation
- [ ] Third-party theme integration
- [ ] Theme preview screenshots
- [ ] Bulk theme application

## Support

For issues or questions about the theme system:
1. Check the theme settings page
2. Verify browser compatibility
3. Check console for errors
4. Review theme definitions and CSS
5. Test with different themes