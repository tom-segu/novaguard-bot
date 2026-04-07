const wppconnect = require('@wppconnect-team/wppconnect');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

wppconnect.create({
  session: 'novaguard',
  catchQR: (qr, asciiQR) => {
    console.log('📲 ESCANEÁ ESTE QR:\n');
    console.log(asciiQR);
  },
  headless: false
}).then(client => start(client));

function start(client) {
  console.log("🔥 NovaGuard conectado a WhatsApp");

  client.onMessage(async (message) => {
    if (message.isGroupMsg) return;

    console.log("📩 Mensaje:", message.body);

    try {
      const res = await fetch("https://novaguard-bot.cos-tortugasopen.workers.dev/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: message.from,
          message: message.body
        })
      });

      const data = await res.json();

      if (data.reply) {
        await client.sendText(message.from, data.reply);
      }

    } catch (err) {
      console.log("❌ Error:", err);
    }
  });
}