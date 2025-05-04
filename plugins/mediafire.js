const fetch = require("node-fetch");

let handler = async (msg, { conn, text, usedPrefix, command }) => {

if (!text) throw m.reply(`${e} Por favor, ingresa un link de mediafire.`);
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
    fileName: `archivo.zip`
  },
  msg 
)
        await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
}

handler.command = ['mf', 'mediafire']
module.exports = handler;
