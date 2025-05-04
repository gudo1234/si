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
    const res = await fetch(`https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(text)}`);
    const gyh = await res.json();

    if (!gyh?.data?.length) {
      throw new Error("No se encontraron datos válidos en la respuesta.");
    }

    const file = gyh.data[0];

    await conn.sendMessage(msg.key.remoteJid, {
      document: { url: file.link },
      fileName: file.nama || 'archivo',
      mimetype: file.mime || 'application/octet-stream',
      caption: `*Nombre:* ${file.nama}\n*Peso:* ${file.size}\n*Tipo:* ${file.mime}`
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
