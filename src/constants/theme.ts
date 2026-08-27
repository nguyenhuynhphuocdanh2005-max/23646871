export const COLORS = {
  primary: '#0F766E',
  secondary: '#F59E0B',
  background: '#F0FDFA',
  surface: '#FFFFFF',
  text: '#134E4A',
  textLight: '#5F7A77',
  border: '#CCFBF1',
  error: '#DC2626',
  success: '#16A34A',
};

// Chuẩn bị sẵn cho Dark Mode ở Câu 3
export const DARK_COLORS = {
  ...COLORS,
  background: '#042F2E',
  surface: '#0B4F4A',
  text: '#F0FDFA',
};

export const SIZES = {
  base: 8,
  padding: 16,
  radius: 8,
};

export const FONTS = {
  h1: { fontSize: 24, fontWeight: 'bold' as const },
  h2: { fontSize: 20, fontWeight: 'bold' as const },
  body1: { fontSize: 16 },
  body2: { fontSize: 14 },
};
