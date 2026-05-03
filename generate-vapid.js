import webpush from 'web-push';

const keys = webpush.generateVAPIDKeys();
console.log('\nAdd these to Vercel Environment Variables:\n');
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey + '\n');
