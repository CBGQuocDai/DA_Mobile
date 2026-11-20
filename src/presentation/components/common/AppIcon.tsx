import { SymbolView, type SymbolViewProps } from 'expo-symbols';

const symbols = {
  home: { ios: 'house', android: 'home', web: 'home' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  heart: { ios: 'heart', android: 'favorite', web: 'favorite' },
  heartFilled: { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  user: { ios: 'person.crop.circle', android: 'person', web: 'person' },
  headphones: { ios: 'headphones', android: 'headphones', web: 'headphones' },
  chevronLeft: { ios: 'chevron.left', android: 'chevron_left', web: 'chevron_left' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  arrowRight: { ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' },
  close: { ios: 'xmark', android: 'close', web: 'close' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  mail: { ios: 'envelope', android: 'mail', web: 'mail' },
  lock: { ios: 'lock', android: 'lock', web: 'lock' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  userPlus: { ios: 'person.badge.plus', android: 'person_add', web: 'person_add' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
} as const satisfies Record<string, SymbolViewProps['name']>;

export type AppIconName = keyof typeof symbols;

export function AppIcon({ name, size = 22, color = '#172033' }: {
  name: AppIconName;
  size?: number;
  color?: SymbolViewProps['tintColor'] | null;
}) {
  return <SymbolView name={symbols[name]} size={size} tintColor={color ?? '#172033'} />;
}
