-- Theme Management Database Schema
-- This migration adds support for theme persistence and customization

-- User Theme Preferences
CREATE TABLE user_theme_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme_id VARCHAR(100) NOT NULL,
    custom_colors JSONB,
    custom_fonts JSONB,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, theme_id)
);

-- Custom Themes Created by Users
CREATE TABLE custom_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    colors JSONB NOT NULL,
    fonts JSONB NOT NULL,
    effects JSONB NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Theme Settings
CREATE TABLE theme_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    auto_switch BOOLEAN DEFAULT false,
    auto_switch_time VARCHAR(20),
    custom_switch_time TIME,
    follow_system BOOLEAN DEFAULT true,
    transition_duration INTEGER DEFAULT 300,
    enable_animations BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Theme Usage Analytics
CREATE TABLE theme_usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    theme_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100),
    duration_seconds INTEGER DEFAULT 0,
    switched_from VARCHAR(100),
    switched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_theme_preferences_user_id ON user_theme_preferences(user_id);
CREATE INDEX idx_user_theme_preferences_is_default ON user_theme_preferences(is_default);
CREATE INDEX idx_custom_themes_user_id ON custom_themes(user_id);
CREATE INDEX idx_custom_themes_is_public ON custom_themes(is_public);
CREATE INDEX idx_theme_settings_user_id ON theme_settings(user_id);
CREATE INDEX idx_theme_usage_analytics_user_id ON theme_usage_analytics(user_id);
CREATE INDEX idx_theme_usage_analytics_theme_id ON theme_usage_analytics(theme_id);
CREATE INDEX idx_theme_usage_analytics_switched_at ON theme_usage_analytics(switched_at);

-- Triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_theme_preferences_updated_at 
    BEFORE UPDATE ON user_theme_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_themes_updated_at 
    BEFORE UPDATE ON custom_themes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_settings_updated_at 
    BEFORE UPDATE ON theme_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE user_theme_preferences IS 'Stores user theme preferences and customizations';
COMMENT ON TABLE custom_themes IS 'Stores user-created custom themes';
COMMENT ON TABLE theme_settings IS 'Stores user theme settings like auto-switch and animations';
COMMENT ON TABLE theme_usage_analytics IS 'Tracks theme usage for analytics and recommendations';