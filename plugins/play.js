const yts = require('yt-search');
const axios = require('axios');
const { youtubedl, youtubedlv2 } = require('@bochilteam/scraper');

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  const chatId = msg.key.remoteJid;

  if (!text) {
    return await conn.sendMessage2(chatId, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command} música* o *${usedPrefix + command} https://youtube.com/...*`
    }, msg);
  }

  await conn.sendMessage(chatId, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let query = args.join(' ');
    let video;

    // Detectar si el texto es una URL de YouTube
    const ytLinkRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^\s&]+)/i;
    const ytMatch = query.match(ytLinkRegex);

    if (ytMatch) {
      // Si es una URL, extraer el ID del video
      const videoId = ytMatch[1];
      const result = await yts({ videoId });
      if (!result) {
        return await conn.sendMessage2(chatId, {
          text: `⚠️ No se pudo obtener información del video.`
        }, msg);
      }
      video = result;
    } else {
      // Si no es una URL, buscar por texto
      const searchResults = await yts(query);
      video = searchResults.videos[0];
      if (!video) {
        return await conn.sendMessage2(chatId, {
          text: `⚠️ No se encontraron resultados para "${query}".`
        }, msg);
      }
    }

    // Detectar el tipo de archivo según el comando
    let sendingMessage;
    let isAudio = false;
    let isVideo = false;
    let isAudioDoc = false;
    let isVideoDoc = false;

    if (['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'].includes(command)) {
      sendingMessage = '📂 Enviando audio como documento...';
      isAudioDoc = true;
    } else if (['play2', 'ytv', 'mp4', 'ytmp4'].includes(command)) {
      sendingMessage = '🎞️ Enviando video...';
      isVideo = true;
    } else if (['play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'].includes(command)) {
      sendingMessage = '📂 Enviando video como documento...';
      isVideoDoc = true;
    } else {
      sendingMessage = '🔊 Enviando audio...';
      isAudio = true;
    }

    const videoDetails = `
╭───── • ─────╮
  𖤐 *YOUTUBE EXTRACTOR* 𖤐
╰───── • ─────╯

✦ *🎶 Título:* ${video.title}
✦ *📹 Canal:* ${video.author?.name || 'Desconocido'}
✦ *⏳ Duración:* ${video.timestamp || 'N/A'}
✦ *👀 Vistas:* ${video.views?.toLocaleString() || 'N/A'}
✦ *📅 Publicado:* ${video.ago || 'N/A'}
🌐 *Enlace:* ${video.url}

╭───── • ─────╮
> *${sendingMessage}*
╰───── • ─────╯
`.trim();

    await conn.sendMessage2(chatId, {
      image: { url: video.thumbnail },
      caption: videoDetails
    }, msg);

    // Obtener el enlace de descarga usando la primera API
    const downloadUrl = `https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(video.url)}`;
    try {
      const downloadRes = await axios.get(downloadUrl);
      const downloadData = downloadRes.data;

      if (!downloadData?.result?.download?.url) {
        return await conn.sendMessage2(chatId, {
          text: `${e} No se pudo obtener el archivo desde la primera API.`
        }, msg);
      }

      // Enviar el archivo según el tipo de archivo detectado
      if (isAudioDoc) {
        // Enviar como documento de audio
        await conn.sendMessage2(chatId, {
          document: { url: downloadData.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title || 'audio'}.mp3`
        }, msg);
      } else if (isVideo || isVideoDoc) {
        // Enviar como video
        await conn.sendMessage2(chatId, {
          [isVideoDoc ? 'document' : 'video']: { url: downloadData.result.download.url },
          mimetype: 'video/mp4',
          fileName: `${video.title}.mp4`
        }, msg);
      } else {
        // Enviar como audio
        await conn.sendMessage2(chatId, {
          audio: { url: downloadData.result.download.url },
          mimetype: 'audio/mpeg',
          fileName: `${video.title || 'audio'}.mp3`
        }, msg);
      }

      await conn.sendMessage(chatId, {
        react: { text: "✅", key: msg.key }
      });

    } catch (err) {
      console.error('Error con la primera API de audio:', err);

      // Si la primera API falla, usar la segunda API
      try {
        const downloadUrlFallback = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(video.url)}`;
        const downloadResFallback = await axios.get(downloadUrlFallback);
        const downloadDataFallback = downloadResFallback.data;

        if (!downloadDataFallback?.data?.dl) {
          return await conn.sendMessage2(chatId, {
            text: `⚠️ No se pudo obtener el archivo desde la segunda API.`
          }, msg);
        }

        // Enviar el archivo según el tipo de archivo detectado
        if (isAudioDoc) {
          // Enviar como documento de audio
          await conn.sendMessage2(chatId, {
            document: { url: downloadDataFallback.data.dl },
            mimetype: 'audio/mpeg',
            fileName: `${video.title || 'audio'}.mp3`
          }, msg);
        } else if (isVideo || isVideoDoc) {
          // Enviar como video
          await conn.sendMessage2(chatId, {
            [isVideoDoc ? 'document' : 'video']: { url: downloadDataFallback.data.dl },
            mimetype: 'video/mp4',
            fileName: `${video.title}.mp4`
          }, msg);
        } else {
          // Enviar como audio
          await conn.sendMessage2(chatId, {
            audio: { url: downloadDataFallback.data.dl },
            mimetype: 'audio/mpeg',
            fileName: `${video.title || 'audio'}.mp3`
          }, msg);
        }

        await conn.sendMessage(chatId, {
          react: { text: "✅", key: msg.key }
        });

      } catch (fallbackError) {
        console.error('Error con la segunda API de audio:', fallbackError);
        await conn.sendMessage2(chatId, {
          text: `❗ Ocurrió un error al intentar obtener el archivo.`
        }, msg);
      }
    }

  } catch (err) {
    console.error('Error en el comando:', err);
    await conn.sendMessage2(chatId, {
      text: `${errorEmoji} Ocurrió un error al procesar el archivo.`
    }, msg);
  }
};

handler.command = [
  'play', 'yta', 'mp3', 'ytmp3',
  'play3', 'ytadoc', 'mp3doc', 'ytmp3doc',
  'play2', 'ytv', 'mp4', 'ytmp4',
  'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'
];

module.exports = handler;
