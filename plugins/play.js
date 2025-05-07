const fetch = require("node-fetch");
const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const yts = require('yt-search');
const axios = require('axios');

let limit = 100;

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* diles`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let query = args.join(' ');
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const ytMatch = query.match(ytRegex);

    let video;
    if (ytMatch) {
      const videoId = ytMatch[1];
      const ytres = await yts({ videoId });
      video = ytres;
    } else {
      const ytres = await yts(query);
      video = ytres.videos[0];
      if (!video) {
        return await conn.sendMessage2(msg.key.remoteJid, {
          text: `❗ *Video no encontrado.*`
        }, msg);
      }
    }

    let { title, thumbnail, timestamp, views, ago, url } = video;

    let yt = await youtubedl(url).catch(async () => await youtubedlv2(url));
    let videoInfo = yt.video['360p'];

    if (!videoInfo) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *No se encontró una calidad compatible para el video.*`
      }, msg);
    }

    let { fileSizeH: sizeHumanReadable, fileSize } = videoInfo;
    let sizeMB = fileSize / (1024 * 1024);

    if (sizeMB >= 700) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *El archivo es demasiado pesado (más de 700 MB). Se canceló la descarga.*`
      }, msg);
    }

    const docAudioCommands = ['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
    const videoCommands = ['play2', 'ytv', 'mp4', 'ytmp4'];
    const docVideoCommands = ['play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'];

    const isAudioDoc = docAudioCommands.includes(command);
    const isVideo = videoCommands.includes(command);
    const isVideoDoc = docVideoCommands.includes(command);

    let txt = `┏━━━━━━━⊱\n`;
    txt += `┃ *🎧 TÍTULO:* ${title}\n`;
    txt += `┃ *📺 CANAL:* ${video.author.name}\n`;
    txt += `┃ *⏱️ DURACIÓN:* ${timestamp}\n`;
    txt += `┃ *👀 VISTAS:* ${views}\n`;
    txt += `┃ *📆 PUBLICACIÓN:* ${ago}\n`;
    txt += `┃ *💾 TAMAÑO:* ${sizeHumanReadable}\n`;
    txt += `┃ *🔗 LINK:* ${url}\n`;
    txt += `┗━━━━━━━━━━━━\n\n`;
    txt += `> ${
      isAudioDoc ? '📂 Enviando audio como documento...' :
      isVideo ? '🎞️ Enviando video...' :
      isVideoDoc ? '📂 Enviando video como documento...' :
      '🔊 Enviando audio...'
    }`;

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    }, msg);

    // Primera API (principal)
    let downloadUrl;
    try {
      const api1 = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
      if (api1.data?.data?.dl) {
        downloadUrl = api1.data.data.dl;
      } else {
        throw new Error('No válido');
      }
    } catch (e) {
      // API de respaldo
      const api2 = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`);
      if (api2.data?.result?.download?.url) {
        downloadUrl = api2.data.result.download.url;
      } else {
        return await conn.sendMessage2(msg.key.remoteJid, {
          text: `❗ *Error: Ninguna API respondió correctamente.*`
        }, msg);
      }
    }

    if (isVideo || isVideoDoc) {
      await conn.sendMessage2(msg.key.remoteJid, {
        [isVideoDoc ? 'document' : 'video']: { url: downloadUrl },
        mimetype: 'video/mp4',
        fileName: `${title}.mp4`
      }, msg);
    } else {
      await conn.sendMessage2(msg.key.remoteJid, {
        [isAudioDoc ? 'document' : 'audio']: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, msg);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ Ocurrió un error al intentar descargar el video.`
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
