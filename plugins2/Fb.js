const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ejemplo de uso:\n\n📌 *${usedPrefix + command}* https://fb.watch/ncowLHMp-x/`
    }, msg );
  }

  if (!text.match(/(www\.facebook\.com|fb\.watch)/gi)) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Enlace de Facebook inválido.\n\n📌 Ejemplo de uso:\n*${usedPrefix + command}* https://fb.watch/ncowLHMp-x/`
    }, msg );
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: '⏳', key: msg.key }
  });

  try {
    const response = await axios.get(`https://api.dorratz.com/fbvideo?url=${encodeURIComponent(text)}`);
    const results = response.data;

    if (!results || results.length === 0) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `${e} No se pudo obtener el video.`
      }, msg );
    }

    const message = `📺 *Resoluciones disponibles:*\n${results.map(r => `- ${r.resolution}`).join('\n')}\n\n🔥 Enviado en *720p*`;

    await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: results[0].url },
      caption: message
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al procesar el enlace de Facebook.`
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '❌', key: msg.key }
    });
  }
};

handler.command = ['facebook', 'fb'];
module.exports = handler;
