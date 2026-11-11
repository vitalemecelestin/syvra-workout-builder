// Point d'entrée : démarre le serveur HTTP.
import { createApp } from './app.js';

const app = createApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Syvra démarrée sur le port ${PORT}`);
});
