// Point d'entrée pour l'hébergement serverless (Vercel).
// On réutilise la même app Express ; Vercel l'appelle comme une fonction.
import { createApp } from '../src/app.js';

export default createApp();
