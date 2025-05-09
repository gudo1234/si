const { igdl } = require("ruhend-scraper");
const handler = async (msg, { conn, text, usedPrefix, command}) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.instagram.com/reel/DJRyQeGslC9/?igsh=MjF0aHl1ZDlwYmVj`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
try {
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
    const res = await igdl(text);
    const data = res.data;

    for (let media of data) {
      //await conn.sendFile(m.chat, media.url, 'instagram.mp4', `${m.pushName}`, m, null, rcanal);
    await conn.sendMessage2(msg.key.remoteJid, {
  video: { url: media.url },
  caption: `${e}Video de Instagram`
}, msg);
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    }
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }}
handler.command = ['ig', 'instagram']
module.exports = handler;
