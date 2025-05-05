const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
try {
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
let { women, man } = await Starlights.ppcouple("xd")
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: women },
      caption: '*Chica* 👧🏼'
    },  msg );
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: man },
      caption: '*Chico* 🧒🏻'
    },  msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar las fotos.`
    }, msg );
  }}

handler.command = ['ppcouple', 'par']
module.exports = handler;
