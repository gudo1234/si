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
    const ytLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^\s&]+)/i;
    const ytMatch = text.match(ytLinkRegex);

    if (ytMatch) {
      const videoId = ytMatch[1];
      const result = await yts({ videoId });
      if (!result) {
        return await conn.sendMessage2(chatId, {
          text: `⚠️ No se pudo obtener información del video.`
        }, msg);
      }
      video = result;
    } else {
      const searchResults = await yts(text);
      const result = searchResults.videos[0];
      if (!result) {
        return await conn.sendMessage2(chatId, {
          text: `⚠️ No se encontraron resultados para "${text}".`
        }, msg);
      }
      video = result;
    }

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
