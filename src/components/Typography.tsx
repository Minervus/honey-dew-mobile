import React from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Text } from 'react-native';

interface TypographyProps {
  children: React.ReactNode;
  style?: TextStyle;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: string;
}

export function Typography({ 
  children, 
  style, 
  variant = 'body', 
  color = '#1F2937' 
}: TypographyProps) {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: 32,
          fontWeight: '700',
          lineHeight: 40,
        };
      case 'h2':
        return {
          fontSize: 24,
          fontWeight: '600',
          lineHeight: 32,
        };
      case 'h3':
        return {
          fontSize: 20,
          fontWeight: '600',
          lineHeight: 28,
        };
      case 'caption':
        return {
          fontSize: 12,
          fontWeight: '400',
          lineHeight: 16,
        };
      default:
        return {
          fontSize: 16,
          fontWeight: '400',
          lineHeight: 24,
        };
    }
  };

  return (
    <Text style={[styles.text, getVariantStyle(), { color }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System',
  },
});