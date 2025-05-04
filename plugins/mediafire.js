const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    await conn.sendMessage(msg.key.remoteJid, {
      text: `📌 Usa el comando correctamente:\n\nEjemplo: *${usedPrefix}mediafire* https://www.mediafire.com/download/ruwl8ldd2hde8sh`
    }, { quoted: msg });
    return;
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let ouh = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`);
    let gyh = await ouh.json();

    await conn.sendMessage(msg.key.remoteJid, {
      document: { url: gyh.data[0].link },
      fileName: gyh.data[0].nama,
      mimetype: gyh.data[0].mime,
      caption: `*Nombre:* ${gyh.data[0].nama}\n*Peso:* ${gyh.data[0].size}\n*Type:* ${gyh.data[0].mime}`
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });
  } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `❌ Ocurrió un error al procesar el enlace.`,
    }, { quoted: msg });
  }
};

handler.command = ['mf', 'mediafire'];
module.exports = handler;
