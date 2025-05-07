const yts = require('yt-search');
const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  const chatId = msg.key.remoteJid;
  const errorEmoji = '❌';

  if (!text) {
    return await conn.sendMessage2(chatId, {
      text: `${errorEmoji} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command} música* o *${usedPrefix + command} https://youtube.com/...*`
    }, msg);
  }

  await conn.sendMessage(chatId, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let video;

    // Si es un enlace de YouTube, usamos directamente eso
    const ytLinkRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+/;
    if (ytLinkRegex.test(text)) {
      video = {
        url: text,
        title: 'Audio de YouTube',
        thumbnail: 'https://i.ytimg.com/vi_webp/default.jpg', // Imagen por defecto si no se obtiene info
      };
    } else {
      // Si no, buscamos con yt-search
      const searchResults = await yts(text);
      const result = searchResults.videos[0];

      if (!result) {
        return await conn.sendMessage2(chatId, {
          text: `⚠️ No se encontraron resultados para "${text}".`
        }, msg);
      }

      video = result;
    }

    // Enviar detalles si hay título y más info
    if (video.title && video.thumbnail) {
      const videoDetails = `
🎵 *Título:* ${video.title}
📺 *Canal:* ${video.author?.name || 'Desconocido'}
⏱️ *Duración:* ${video.timestamp || 'N/A'}
👀 *Vistas:* ${video.views || 'N/A'}
📅 *Publicado:* ${video.ago || 'N/A'}
🌐 *Enlace:* ${video.url}
      `;

      await conn.sendMessage2(chatId, {
        image: { url: video.thumbnail },
        caption: videoDetails.trim()
      }, msg);
    }

    // Descargar usando la API externa
    const downloadUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
    const downloadRes = await axios.get(downloadUrl);
    const downloadData = downloadRes.data;

    if (!downloadData?.result?.download?.url) {
      return await conn.sendMessage2(chatId, {
        text: `${errorEmoji} No se pudo obtener el audio.`
      }, msg);
    }

    await conn.sendMessage2(chatId, {
      audio: { url: downloadData.result.download.url },
      mimetype: 'audio/mpeg',
      fileName: `${video.title || 'audio'}.mp3`
    }, msg);

    await conn.sendMessage(chatId, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error en el comando:', err);
    await conn.sendMessage2(chatId, {
      text: `${errorEmoji} Ocurrió un error al procesar el audio.`
    }, msg);
  }
};

handler.command = ['p'];
module.exports = handler;
