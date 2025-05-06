const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}*`
    }, msg);
  }
  try {
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });

        const text = encodeURIComponent(args.join(" "));
        const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${text}`;

        await conn.sendMessage(m.chat, { react: { text: '🎨', key: m.key } });
        const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
  await conn.sendMessage(msg.key.remoteJid, {
  sticker: { url: apiUrl },
  contextInfo: {
    forwardingScore: 200,
    isForwarded: false,
    externalAdReply: {
      showAdAttribution: false,
      title: `${msg.pushName}`,
      body: textbot,
      mediaType: 1,
      sourceUrl: red,
      thumbnailUrl: red,
      thumbnail: im
    }
  }
}, { quoted: msg });

        await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el sticker.`
    }, msg );
  }}

handler.command = ['brat']
module.exports = handler;
