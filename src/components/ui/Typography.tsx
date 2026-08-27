import React, { memo } from 'react';
import { Text, TextProps } from 'react-native';
import { FONTS, COLORS } from '@constants/theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof FONTS;
  color?: string;
  children: React.ReactNode;
}

export const Typography = memo(({ 
  variant = 'body1', 
  color = COLORS.text, 
  style, 
  children, 
  ...props 
}: TypographyProps) => {
  return (
    <Text style={[FONTS[variant], { color }, style]} {...props}>
      {children}
    </Text>
  );
});
