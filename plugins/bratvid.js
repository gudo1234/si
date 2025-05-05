const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* hola mundo`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  const apiUrl = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Error al generar el video: ${response.statusText}`);

    const buffer = await response.buffer();

    await conn.sendMessage2(msg.key.remoteJid, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: `✅ *Video generado para:* _${text}_`
    }, msg);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Ocurrió un error al intentar descargar el video, pruebe más tarde`
    }, msg);
  }
};

handler.command = ['bratvid', 'vidbrat'];
module.exports = handler;
