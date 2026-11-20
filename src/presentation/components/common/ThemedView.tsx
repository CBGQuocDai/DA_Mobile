import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/shared/constants/theme.constants';
import { useTheme } from '@/presentation/hooks/common/useTheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
