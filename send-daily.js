import webpush from 'web-push';
import { redisCommand } from './_redis.js';

const mots = [
  { mot: 'Bonjour', definition: "Formule de politesse utilisée pour saluer quelqu'un." },
  { mot: 'Manger', definition: 'Mettre de la nourriture dans sa bouche, la mâcher et l’avaler.' },
  { mot: 'Maison', definition: 'Bâtiment où des personnes habitent, vivent et dorment.' },
  { mot: 'Ami', definition: "Personne avec qui on s'entend bien et qu'on apprécie." },
  { mot: 'Apprendre', definition: 'Acquérir de nouvelles connaissances ou compétences.' },
  { mot: 'Voyager', definition: 'Se déplacer pour découvrir de nouveaux lieux.' },
  { mot: 'Éphémère', definition: 'Qui ne dure que très peu de temps.' }
];

function getDailyWord() {
  const origin = new Date('2024-01-01T00:00:00Z');
  const now = new Date();
  const diff = Math.floor((now - origin) / 86400000);
  return mots[diff % mots.length];
}

export default async function handler(req, res) {
  if (process.env.CRON_SECRET) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${process.env.CRON_SECRET}` && !req.headers['x-vercel-cron']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  try {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || 'mailto:you@example.com';

    if (!publicKey || !privateKey) {
      return res.status(500).json({ error: 'Missing VAPID keys' });
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const result = await redisCommand(['SMEMBERS', 'subscriptions']);
    const subscriptions = result.result || [];
    const word = getDailyWord();

    const payload = JSON.stringify({
      title: `✨ Mot du jour : ${word.mot}`,
      body: word.definition,
      url: '/'
    });

    let sent = 0;
    let failed = 0;

    for (const item of subscriptions) {
      const subscription = JSON.parse(item);
      try {
        await webpush.sendNotification(subscription, payload);
        sent++;
      } catch (error) {
        failed++;
        if (error.statusCode === 404 || error.statusCode === 410) {
          await redisCommand(['SREM', 'subscriptions', item]);
        }
      }
    }

    return res.status(200).json({ ok: true, sent, failed, word: word.mot });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}
