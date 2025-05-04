const { googleImage } = require("@bochilteam/scraper");
const handler = async (msg, { conn, text, usedPrefix, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}imagen* mia kalifa`
    }, msg );
  }
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
const res = await googleImage(text);
//const image = await res.getRandom();
const link = image;
await conn.sendMessage(
  msg.key.remoteJid,
  {
    image: { url: res },
    caption: null,
    fileName: 'image.jpg'
  },
  { quoted: msg }
)
};

handler.command = ['image','imagen'];
module.exports = handler;
