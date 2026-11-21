import { createCustomerPlayer } from '@/application/player/createCustomerPlayer';
import { playbackService } from '@/infrastructure/api/services/playback.service';
import { createExpoAudioEngine } from '@/infrastructure/audio/expoAudioEngine';
import { customerAuth } from './customerAuth';

export const customerPlayer = createCustomerPlayer(playbackService, createExpoAudioEngine(), {
  initialize: customerAuth.initialize,
  getIdentity: () => {
    const user = customerAuth.getSnapshot().user;
    const token = customerAuth.getAccessToken();
    return user && token ? `${user.id}:${token}` : null;
  },
  getToken: customerAuth.getAccessToken,
  subscribe: customerAuth.subscribe,
});
