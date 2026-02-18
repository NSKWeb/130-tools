/**
 * Theme Customizer Component
 * Advanced theme customization with color pickers and live preview
 */

'use client';

import React, { useState } from 'react';
import { Theme, ThemeColors } from '@130tools/ui/src/components/theme/theme-types';
import { useThemeStore } from '../../lib/theme-store';
import { cn } from '@130tools/ui/src/lib/utils';

interface ThemeCustomizerProps {
  theme: Theme;
  onSave?: (colors: Partial<ThemeColors>, fonts: Partial<Theme['fonts']>, effects: Partial<Theme['effects']>) => void;
  onCancel?: () => void;
}

export function ThemeCustomizer({ theme, onSave, onCancel }: ThemeCustomizerProps) {
  const { createCustomTheme, updateCustomTheme } = useThemeStore();
  const [colors, setColors] = useState<Partial<ThemeColors>>(theme.colors);
  const [fonts, setFonts] = useState(theme.fonts);
  const [effects, setEffects] = useState(theme.effects);
  const [themeName, setThemeName] = useState('');

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }));
  };

  const handleFontChange = (key: keyof Theme['fonts'], value: string) => {
    setFonts((prev) => ({ ...prev, [key]: value }));
  };

  const handleEffectChange = <K extends keyof Theme['effects']>(
    key: K,
    value: Theme['effects'][K]
  ) => {
    setEffects((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const customTheme = createCustomTheme({
      name: themeName || `Custom ${theme.name}`,
      colors: { ...theme.colors, ...colors },
      fonts,
      effects,
      isPublic: false,
    });

    onSave?.(colors, fonts, effects);
  };

  const colorSections = [
    {
      title: 'Primary Colors',
      description: 'Main action colors',
      colors: [
        { key: 'primary' as const, label: 'Primary', description: 'Main buttons and links' },
        { key: 'primaryForeground' as const, label: 'Primary Text', description: 'Text on primary backgrounds' },
      ],
    },
    {
      title: 'Secondary Colors',
      description: 'Supporting colors',
      colors: [
        { key: 'secondary' as const, label: 'Secondary', description: 'Secondary buttons and elements' },
        { key: 'secondaryForeground' as const, label: 'Secondary Text', description: 'Text on secondary backgrounds' },
      ],
    },
    {
      title: 'Accent Colors',
      description: 'Highlight and focus colors',
      colors: [
        { key: 'accent' as const, label: 'Accent', description: 'Highlights and emphasis' },
        { key: 'accentForeground' as const, label: 'Accent Text', description: 'Text on accent backgrounds' },
      ],
    },
    {
      title: 'Surface Colors',
      description: 'Background and card colors',
      colors: [
        { key: 'background' as const, label: 'Background', description: 'Main page background' },
        { key: 'foreground' as const, label: 'Text', description: 'Main text color' },
        { key: 'card' as const, label: 'Card', description: 'Card and panel backgrounds' },
        { key: 'cardForeground' as const, label: 'Card Text', description: 'Text in cards' },
        { key: 'popover' as const, label: 'Popover', description: 'Dropdown and modal backgrounds' },
        { key: 'popoverForeground' as const, label: 'Popover Text', description: 'Text in popovers' },
      ],
    },
    {
      title: 'Muted Colors',
      description: 'Subtle colors for secondary content',
      colors: [
        { key: 'muted' as const, label: 'Muted', description: 'Subtle backgrounds' },
        { key: 'mutedForeground' as const, label: 'Muted Text', description: 'Secondary text' },
      ],
    },
    {
      title: 'Border Colors',
      description: 'Borders and input fields',
      colors: [
        { key: 'border' as const, label: 'Border', description: 'Element borders' },
        { key: 'input' as const, label: 'Input', description: 'Input field backgrounds' },
        { key: 'ring' as const, label: 'Focus Ring', description: 'Focus indicator' },
      ],
    },
    {
      title: 'Status Colors',
      description: 'Status indicators',
      colors: [
        { key: 'destructive' as const, label: 'Error', description: 'Error and destructive actions' },
        { key: 'destructiveForeground' as const, label: 'Error Text', description: 'Text on error backgrounds' },
        { key: 'success' as const, label: 'Success', description: 'Success and positive actions' },
        { key: 'successForeground' as const, label: 'Success Text', description: 'Text on success backgrounds' },
        { key: 'warning' as const, label: 'Warning', description: 'Warning indicators' },
        { key: 'warningForeground' as const, label: 'Warning Text', description: 'Text on warning backgrounds' },
        { key: 'info' as const, label: 'Info', description: 'Information indicators' },
        { key: 'infoForeground' as const, label: 'Info Text', description: 'Text on info backgrounds' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Theme Name</label>
        <input
          type="text"
          value={themeName}
          onChange={(e) => setThemeName(e.target.value)}
          placeholder={`Custom ${theme.name}`}
          className="w-full px-3 py-2 border border-input rounded-md"
        />
      </div>

      {/* Preview */}
      <div className="p-6 rounded-lg border">
        <h3 className="text-sm font-medium mb-3">Live Preview</h3>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: colors.background || theme.colors.background,
            color: colors.foreground || theme.colors.foreground,
          }}
        >
          <div
            className="p-3 rounded-md mb-3"
            style={{
              backgroundColor: colors.card || theme.colors.card,
              color: colors.cardForeground || theme.colors.cardForeground,
            }}
          >
            <h4
              style={{
                color: colors.accent || theme.colors.accent,
              }}
            >
              Card Title
            </h4>
            <p className="text-sm opacity-80">
              Sample card content with different text styles.
            </p>
            <button
              className="mt-2 px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: colors.primary || theme.colors.primary,
                color: colors.primaryForeground || theme.colors.primaryForeground,
              }}
            >
              Primary Button
            </button>
          </div>
        </div>
      </div>

      {/* Color Customization */}
      <div className="space-y-6">
        {colorSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div>
              <h4 className="font-medium">{section.title}</h4>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.colors.map((color) => (
                <ColorPicker
                  key={color.key}
                  label={color.label}
                  description={color.description}
                  value={colors[color.key] || theme.colors[color.key]}
                  onChange={(value) => handleColorChange(color.key, value)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Fonts */}
      <div className="space-y-4">
        <h4 className="font-medium">Typography</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Heading Font</label>
            <select
              value={fonts.heading}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="Inter, system-ui, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Nunito, system-ui, sans-serif">Nunito</option>
              <option value="Comic Neue, cursive">Comic Neue</option>
              <option value="Arial, sans-serif">Arial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Body Font</label>
            <select
              value={fonts.body}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="Inter, system-ui, sans-serif">Inter</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="Nunito, system-ui, sans-serif">Nunito</option>
              <option value="Comic Neue, cursive">Comic Neue</option>
              <option value="Arial, sans-serif">Arial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Monospace Font</label>
            <select
              value={fonts.mono}
              onChange={(e) => handleFontChange('mono', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="JetBrains Mono, monospace">JetBrains Mono</option>
              <option value="Courier New, monospace">Courier New</option>
              <option value="Fira Code, monospace">Fira Code</option>
              <option value="Roboto Mono, monospace">Roboto Mono</option>
            </select>
          </div>
        </div>
      </div>

      {/* Effects */}
      <div className="space-y-4">
        <h4 className="font-medium">Visual Effects</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Border Radius</label>
            <select
              value={effects.borderRadius}
              onChange={(e) => handleEffectChange('borderRadius', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="0.25rem">Small (4px)</option>
              <option value="0.375rem">Medium (6px)</option>
              <option value="0.5rem">Large (8px)</option>
              <option value="0.75rem">Extra Large (12px)</option>
              <option value="1rem">Round (16px)</option>
              <option value="1.25rem">Very Round (20px)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Box Shadow</label>
            <select
              value={effects.boxShadow}
              onChange={(e) => handleEffectChange('boxShadow', e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md"
            >
              <option value="none">None</option>
              <option value="0 1px 3px -1px rgba(0, 0, 0, 0.1)">Subtle</option>
              <option value="0 1px 3px -1px rgba(0, 0, 0, 0.2)">Soft</option>
              <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Medium</option>
              <option value="0 4px 6px -1px rgba(0, 0, 0, 0.3)">Strong</option>
              <option value="0 8px 12px -1px rgba(0, 0, 0, 0.2)">Dramatic</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={effects.transitions}
              onChange={(e) => handleEffectChange('transitions', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Enable Transitions</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={effects.animations}
              onChange={(e) => handleEffectChange('animations', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Enable Animations</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Save Custom Theme
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, description, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">{label}</label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-input cursor-pointer"
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 px-2 py-1 text-xs border border-input rounded"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
  );
}

export default ThemeCustomizer;