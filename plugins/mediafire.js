const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}mediafire* link`
    }, msg );
  }
        let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`)
  let gyh = await ouh.json()     
 await conn.sendMessage(msg.key.remoteJid, {
      document: { url: gyh.data[0].link },
      fileName: `${gyh.data[0].nama}`,
      //mimetype: mime || 'application/octet-stream',
      caption: `*Nombre:*  ${gyh.data[0].nama}\n*Peso:* ${gyh.data[0].size}*\n*Type:* ${gyh.data[0].mime}`
    }, { quoted: msg });
}

handler.command = ['mf', 'mediafire'];
module.exports = handler;
