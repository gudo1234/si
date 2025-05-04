const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* link`
    }, msg );
  }

  /*await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: m.key }
  });*/

  try {
    let res = await fetch(`https://api.agatz.xyz/api/mediafire?url=${text}`);
    if (!res.ok) throw 'No se pudo obtener respuesta de la API.';

    let data = await res.json();

    if (!data || !data.url) throw 'No se pudo obtener el archivo. Asegúrate de que el enlace sea correcto.';

    let { url, filename, size, mime } = data;

    await conn.sendMessage(msg.key.remoteJid, {
      document: { url },
      fileName: filename,
      mimetype: mime || 'application/octet-stream',
      caption: `*Nombre:* ${filename}\n*Tamaño:* ${size}\n*Enlace directo:* ${url}`
    }, { quoted: msg });

  } catch (e) {
    console.error(e);
    //m.reply('Ocurrió un error al procesar el enlace. Asegúrate de que sea válido y vuelve a intentarlo.');
  }

  /*await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "✅", key: m.key }
  });*/
};

handler.command = ['mf', 'mediafire'];
module.exports = handler;
