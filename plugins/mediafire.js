const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.mediafire.com/file/ruwl8ldd2hde8sh/archivo.zip`
    }, msg);
  }

  // Reaccionar con reloj de espera
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    const apiURL = `https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(text)}`;
    const res = await axios.get(apiURL);
    const { data } = res.data;

    if (!data || !data.link) {
      throw new Error("No se pudo obtener el enlace de descarga.");
    }

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: data.link },
      mimetype: data.mime || 'application/octet-stream',
      fileName: data.nama || 'archivo',
      caption: `*Nombre:* ${data.nama}\n*Peso:* ${data.size}\n*Tipo:* ${data.mime}`
    }, msg);

    // Reacción de éxito
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });
  } catch (error) {
    console.error(error);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Error al procesar la solicitud. Asegúrate de que el enlace sea válido.`
    }, msg);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "⚠️", key: msg.key }
    });
  }
};

handler.command = ['mf', 'mediafire'];
module.exports = handler;
