const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* hola mundo`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: '🕒', key: msg.key }
  });

  try {
    const apiURL = `https://api.nekorinn.my.id/maker/bratvid?text=${encodeURIComponent(text)}`;
    const res = await axios.get(apiURL, { responseType: 'arraybuffer' });
    
    const buffer = Buffer.from(res.data);

    await conn.sendMessage2(msg.key.remoteJid, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: `${e} *Video generado para:* _${text}_`
    }, msg);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '✅', key: msg.key }
    });
  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video, pruebe más tarde.`
    }, msg);
  }
};

handler.command = ['bratvid', 'vidbrat'];
module.exports = handler;
