/* Fonction serverless Vercel : envoie une notification push aux abonnés.
   La clé privée VAPID est lue depuis la variable d'environnement (jamais dans le code). */
const webpush = require('web-push');

const VAPID_PUBLIC  = 'BCD75gHfv6xGXA6HpWVZTKmaj9oMwvfqgNMeJmnim9yEMP155WLfLQ5VjSRM6mZmeZLRjVDEDCxaYndnB5PLs78';
const VAPID_SUBJECT = 'mailto:yves.grumet@orange.fr';

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }
  const priv = process.env.VAPID_PRIVATE;
  if (!priv) { res.status(500).json({ error: 'VAPID_PRIVATE manquante' }); return; }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const subs  = (body && body.subs) || [];
  const title = (body && body.title) || 'Team Rando';
  const msg   = (body && body.body)  || '';
  const url   = (body && body.url)   || '/';
  if (!Array.isArray(subs) || subs.length === 0) { res.status(200).json({ sent: 0 }); return; }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, priv);
  const payload = JSON.stringify({ title, body: msg, url });

  let sent = 0, expired = 0;
  await Promise.all(subs.map(async (s) => {
    const sub = (s && s.sub) ? s.sub : s;
    try { await webpush.sendNotification(sub, payload); sent++; }
    catch (e) { if (e.statusCode === 404 || e.statusCode === 410) expired++; }
  }));

  res.status(200).json({ sent, expired });
};
