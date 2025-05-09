const Starlights = require("@StarlightsTeam/Scraper");
const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.instagram.com/reel/DJRyQeGslC9/?igsh=MjF0aHl1ZDlwYmVj`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
try {
let { dl_url } = await Starlights.igdl(args[0])
//await conn.sendFile(m.chat, dl_url, 'igdl.mp4', listo, m, null, rcanal)
await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      mimetype: 'video/mp4',
      //fileName: listo.mp4,
      caption: listo
    }, msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }}
handler.command = ['ig', 'instagram']
module.exports = handler;
