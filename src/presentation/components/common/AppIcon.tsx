import { useFonts } from 'expo-font';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { MaterialSymbols_400Regular_Filled } from '@expo-google-fonts/material-symbols/400Regular_Filled';

const filledWeight = {
  name: 'MaterialSymbols_400Regular_Filled',
  font: MaterialSymbols_400Regular_Filled,
};

const filledFont = { MaterialSymbols_400Regular_Filled };

const symbols = {
  home: { ios: 'house', android: 'home', web: 'home' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  heart: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
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
  play: { ios: 'play.fill', android: 'play_arrow', web: 'play_arrow' },
  pause: { ios: 'pause.fill', android: 'pause', web: 'pause' },
  list: { ios: 'list.bullet', android: 'format_list_bulleted', web: 'format_list_bulleted' },
  check: { ios: 'checkmark.seal.fill', android: 'verified', web: 'verified' },
  chat: { ios: 'text.bubble', android: 'chat_bubble', web: 'chat_bubble' },
  chevronDown: { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' },
  chevronUp: { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' },
  skipPrevious: { ios: 'backward.end.fill', android: 'skip_previous', web: 'skip_previous' },
  skipNext: { ios: 'forward.end.fill', android: 'skip_next', web: 'skip_next' },
  rewind10: { ios: 'gobackward.10', android: 'replay_10', web: 'replay_10' },
  forward10: { ios: 'goforward.10', android: 'forward_10', web: 'forward_10' },
  timer: { ios: 'timer', android: 'timer', web: 'timer' },
  playlist: { ios: 'list.bullet', android: 'queue_music', web: 'queue_music' },
  bookmark: { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' },
  bookmarkFilled: { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' },
  share: { ios: 'square.and.arrow.up', android: 'share', web: 'share' },
  minimize: { ios: 'arrow.down.right.and.arrow.up.left', android: 'close_fullscreen', web: 'close_fullscreen' },
} as const satisfies Record<string, SymbolViewProps['name']>;

export type AppIconName = keyof typeof symbols;

const filledIcons = new Set<AppIconName>(['heartFilled', 'star', 'bookmarkFilled']);

export function AppIcon({ name, size = 22, color = '#172033' }: {
  name: AppIconName;
  size?: number;
  color?: SymbolViewProps['tintColor'] | null;
}) {
  // Expo's web server font context exists during React rendering, not module import.
  useFonts(filledFont);
  const isFilled = filledIcons.has(name);
  return (
    <SymbolView
      key={`${name}-${isFilled ? 'fill' : 'reg'}`}
      name={symbols[name]}
      size={size}
      tintColor={color ?? '#172033'}
      weight={isFilled ? { ios: 'regular', android: filledWeight } : undefined}
    />
  );
}
