import React, { memo } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { Typography } from './Typography';
import { COLORS, SIZES, FONTS } from '@constants/theme';

interface ShopInputProps extends TextInputProps {
  label?: string;
  error?: boolean;
}

export const ShopInput = memo(({ label, error, style, ...props }: ShopInputProps) => {
  return (
    <View style={styles.container}>
      {label && (
        <Typography variant="body2" color={COLORS.textLight} style={styles.label}>
          {label}
        </Typography>
      )}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={COLORS.textLight}
        {...props}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    marginBottom: SIZES.base / 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    ...FONTS.body1,
  },
  inputError: {
    borderColor: COLORS.error,
  }
});
