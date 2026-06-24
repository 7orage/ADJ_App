export async function demanderPermissions() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function envoyerNotification(titre, corps, modes = [], userId = null, userIds = null) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(titre, { body: corps });
  }
}

export function supprimerToken() {
  // Web : pas de token push à supprimer
}
