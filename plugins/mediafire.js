const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}mediafire* https://www.mediafire.com/download/ruwl8ldd2hde8sh`
    }, msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
        let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`)
  let gyh = await ouh.json() 
        //await conn.sendFile(m.chat, gyh.data[0].link, `${gyh.data[0].nama}`, `*Nombre:*  ${gyh.data[0].nama}\n*Peso:* ${gyh.data[0].size}*\n*Type:* ${gyh.data[0].mime}`, m, null, rcanal)
         await conn.sendMessage2(
  msg.key.remoteJid,
  {
    image: { url: gyh.data[0].link },
    caption: `*Nombre:*  ${gyh.data[0].nama}\n*Peso:* ${gyh.data[0].size}*\n*Type:* ${gyh.data[0].mime}`,
    fileName: `${gyh.data[0].nama}`
  },
  msg 
)
        await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
}

handler.command = ['mf', 'mediafire']
module.exports = handler;
