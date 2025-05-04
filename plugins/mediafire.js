const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.mediafire.com/file/ruwl8ldd2hde8sh/archivo.zip`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    const apiUrl = `https://api.agatz.xyz/api/mediafire?url=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);
    const result = response.data;

    if (!result || !result.url) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❌ No se pudo obtener el archivo desde la URL proporcionada.`
      }, msg);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      text: `✅ Archivo encontrado:\n\n📄 *Nombre:* ${result.filename}\n📦 *Tamaño:* ${result.filesizeH}\n\nDescargando archivo...`
    }, msg);

    await conn.sendFile(msg.key.remoteJid, result.url, result.filename, null, msg);
    
  } catch (error) {
    console.error(error);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `⚠️ Error al procesar la solicitud.`
    }, msg);
  }
};

handler.command = ['mf', 'mediafire'];
module.exports = handler;
