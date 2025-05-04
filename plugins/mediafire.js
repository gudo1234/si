const fetch = require("node-fetch");

let handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) throw m.reply(`${emoji} Por favor, ingresa un link de mediafire.`);
conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });
        let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`)
  let gyh = await ouh.json() 
        await conn.senMessage(m.chat, gyh.data[0].link, `${gyh.data[0].nama}`, `*Nombre:*  ${gyh.data[0].nama}\n*Peso:* ${gyh.data[0].size}*\n*Type:* ${gyh.data[0].mime}`, msg)       
        await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });
}

handler.command = ['mf', 'mediafire'];
module.exports = handler;
