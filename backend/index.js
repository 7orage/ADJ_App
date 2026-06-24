const express = require('express');
const cors = require('cors');
const { Expo } = require('expo-server-sdk');
const { lire, ecrire } = require('./db');

const app = express();
const expo = new Expo();

app.use(cors());
app.use(express.json());

// Santé du serveur
app.get('/health', (req, res) => res.json({ ok: true }));

// Enregistrer le token push d'un appareil à la connexion
app.post('/token', (req, res) => {
  const { token, mode, userId } = req.body;

  if (!token) return res.status(400).json({ error: 'token manquant' });
  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: 'token Expo invalide' });
  }

  const db = lire();
  db.tokens[token] = { mode, userId: userId || null, misAJour: new Date().toISOString() };
  ecrire(db);

  console.log(`[token] ${mode} ${userId || '?'} → ${token}`);
  res.json({ ok: true });
});

// Supprimer le token à la déconnexion
app.delete('/token', (req, res) => {
  const { token } = req.body;
  if (token) {
    const db = lire();
    delete db.tokens[token];
    ecrire(db);
  }
  res.json({ ok: true });
});

// Envoyer une notification push à un ou plusieurs modes, et/ou un userId précis
app.post('/notifier', async (req, res) => {
  const { titre, corps, modes, userId } = req.body;

  if (!titre || !corps) return res.status(400).json({ error: 'titre et corps requis' });

  const db = lire();
  // userIds = tableau de noms (ex: ['DUPONT', 'MARTIN']), userId = valeur unique legacy
  const ciblesUser = userIds?.length > 0 ? userIds : (userId ? [userId] : []);
  const tokens = Object.entries(db.tokens)
    .filter(([, info]) => {
      const modeOk = !modes || modes.length === 0 || modes.includes(info.mode);
      const userOk = ciblesUser.length === 0 || ciblesUser.includes(info.userId);
      return modeOk && userOk;
    })
    .map(([token]) => token)
    .filter(t => Expo.isExpoPushToken(t));

  const messages = tokens.map(token => ({
    to: token,
    title: titre,
    body: corps,
    sound: 'default',
    badge: 1,
  }));

  if (messages.length === 0) {
    return res.json({ ok: true, sent: 0, info: 'Aucun appareil enregistré pour ces modes' });
  }

  let totalEnvoye = 0;
  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      totalEnvoye += tickets.filter(t => t.status === 'ok').length;
    } catch (err) {
      console.error('[notifier] erreur chunk:', err.message);
    }
  }

  // Historique
  db.notifications.push({
    id: Date.now(),
    titre,
    corps,
    modes: modes || ['tous'],
    envoyeLe: new Date().toISOString(),
    sent: totalEnvoye,
  });
  ecrire(db);

  console.log(`[notifier] "${titre}" → ${totalEnvoye}/${messages.length} envoyés`);
  res.json({ ok: true, sent: totalEnvoye, total: messages.length });
});

// Historique des notifications
app.get('/notifications', (req, res) => {
  const db = lire();
  res.json((db.notifications || []).slice(-50).reverse());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅  Backend ADJ opérationnel sur le port ${PORT}`);
});
