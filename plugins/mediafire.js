// Si estás usando Node.js versión >= 18, no necesitas importar fetch
// Si usas versión < 18, descomenta la siguiente línea:
// const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}mediafire* link`
    }, msg);
  }

  try {
    let res = await fetch(`https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(text)}`);
    let json = await res.json();

    if (!json.data || !json.data[0]) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: `No se pudo obtener el archivo. Verifica el enlace.`
      }, { quoted: msg });
    }

    let file = json.data[0];

    await conn.sendMessage(msg.key.remoteJid, {
      document: { url: file.link },
      fileName: file.nama,
      caption: `*Nombre:* ${file.nama}\n*Peso:* ${file.size}\n*Tipo:* ${file.mime}`
    }, { quoted: msg });

  } catch (error) {
    console.error(error);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `Ocurrió un error al procesar el enlace.`
    }, { quoted: msg });
  }
};

handler.command = ['mf', 'mediafire'];
module.exports = handler;
