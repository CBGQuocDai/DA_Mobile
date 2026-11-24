import { createBookFavorites } from "@/application/favorites/createBookFavorites";
import { bookFavoriteService } from "@/infrastructure/api/services/bookFavorite.service";
import { customerAuth } from "./customerAuth";

export const customerFavorites = createBookFavorites(bookFavoriteService);

const syncSession = () => {
  const { user, isReady } = customerAuth.getSnapshot();
  const token = customerAuth.getAccessToken();
  customerFavorites.setSession(
    isReady && user && token ? { userId: user.id, token } : null,
  );
};
customerAuth.subscribe(syncSession);
syncSession();
