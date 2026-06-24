import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

const BACKEND = process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3000';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Demande la permission et enregistre le token auprès du backend
export async function demanderPermissions(mode, userId) {
  if (!Device.isDevice) {
    console.log('[notif] Simulateur — push non disponible');
    return null;
  }

  const { status: existant } = await Notifications.getPermissionsAsync();
  let status = existant;

  if (existant !== 'granted') {
    const { status: demande } = await Notifications.requestPermissionsAsync();
    status = demande;
  }

  if (status !== 'granted') {
    console.log('[notif] Permission refusée');
    return null;
  }

  // Android : canal obligatoire
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Accueil du Jour',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#fb7500',
    });
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  console.log('[notif] Token obtenu:', token);

  // Envoie le token au backend
  try {
    await fetch(`${BACKEND}/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, mode, userId }),
    });
  } catch (e) {
    console.warn('[notif] Impossible d\'enregistrer le token:', e.message);
  }

  return token;
}

// Supprime le token du backend à la déconnexion
export async function supprimerToken() {
  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    await fetch(`${BACKEND}/token`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
  } catch (_) {}
}

// Envoie une notification push via le backend
// modes : ['resident','equipier','admin'] ou [] pour tous
// userId : NOM en majuscules pour cibler une seule personne (ex: 'DUPONT')
export async function envoyerNotification(titre, corps, modes = [], userId = null, userIds = null) {
  try {
    const res = await fetch(`${BACKEND}/notifier`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, corps, modes, userId, userIds }),
    });
    const data = await res.json();
    console.log(`[notif] Envoyé : ${data.sent}/${data.total}`);
  } catch (e) {
    console.warn('[notif] Erreur envoi:', e.message);
  }
}
