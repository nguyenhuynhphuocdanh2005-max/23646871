import React, { memo } from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SIZES } from '@constants/theme';

interface ShopButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
}

export const ShopButton = memo(({ 
  title, 
  isLoading, 
  variant = 'primary', 
  style, 
  ...props 
}: ShopButtonProps) => {
  const isOutline = variant === 'outline';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isOutline ? styles.outline : styles.primary,
        isLoading && styles.disabled,
        style,
      ]}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.surface} />
      ) : (
        <Typography variant="body1" color={isOutline ? COLORS.primary : COLORS.surface}>
          {title}
        </Typography>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  disabled: {
    opacity: 0.7,
  }
});
