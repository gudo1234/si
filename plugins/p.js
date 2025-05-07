const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  const chatId = msg.key.remoteJid;
  const errorEmoji = '❌';

  if (!text) {
    return await conn.sendMessage2(chatId, {
      text: `${errorEmoji} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command} música*`
    }, msg);
  }

  await conn.sendMessage(chatId, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    // Buscar video
    const searchUrl = `https://delirius-apiofc.vercel.app/search/ytsearch?q=${encodeURIComponent(text)}`;
    const searchRes = await axios.get(searchUrl);
    const searchData = searchRes.data;

    if (!searchData?.data || searchData.data.length === 0) {
      return await conn.sendMessage2(chatId, {
        text: `⚠️ No se encontraron resultados para "${text}".`
      }, msg);
    }

    const video = searchData.data[0];
    const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author.name}
⏱️ *Duración:* ${video.duration}
👀 *Vistas:* ${video.views}
📅 *Publicado:* ${video.publishedAt}
🌐 *Enlace:* ${video.url}
    `;

    await conn.sendMessage2(chatId, {
      image: { url: video.image },
      caption: videoDetails.trim()
    }, msg);

    // Descargar audio
    const downloadUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
    const downloadRes = await axios.get(downloadUrl);
    const downloadData = downloadRes.data;

    if (!downloadData?.result?.download?.url) {
      return await conn.sendMessage2(chatId, {
        text: `${errorEmoji} No se pudieron obtener los resultados del audio.`
      }, msg);
    }

    await conn.sendMessage2(chatId, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`
    }, msg);

    await conn.sendMessage(chatId, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(chatId, {
      text: `${errorEmoji} Ocurrió un error al intentar descargar el audio.`
    }, msg);
  }
};

handler.command = ['p'];
module.exports = handler;
