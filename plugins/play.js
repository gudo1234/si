const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const yts = require('yt-search');
const axios = require('axios');

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
    const query = args.join(' ');
    const isUrl = /youtu/.test(query);

    let video;
    if (isUrl) {
      const id = query.split('v=')[1];
      const ytres = await yts({ videoId: id });
      video = ytres.videos[0];
    } else {
      const ytres = await yts(query);
      video = ytres.videos[0];
    }

    if (!video) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *Video no encontrado.*`
      }, msg);
    }

    const { title, thumbnail, timestamp, views, ago, url } = video;
    const yt = await youtubedl(url).catch(() => youtubedlv2(url));

    const isAudioCommand = [
      'play', 'yta', 'mp3', 'ytmp3', 'play3', 'ytadoc', 'mp3doc', 'ytmp3doc'
    ].includes(command);

    const isVideo = [
      'play2', 'ytv', 'mp4', 'ytmp4',
      'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'
    ].includes(command);

    const isDocument = [
      'play3', 'ytadoc', 'mp3doc', 'ytmp3doc',
      'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'
    ].includes(command);

    const media = isAudioCommand
      ? yt.audio['128kbps'] || yt.audio['160kbps']
      : yt.video['360p'] || yt.video['480p'] || yt.video['720p'];

    if (!media) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *No se encontró ${isAudioCommand ? 'audio' : 'video'} descargable.*`
      }, msg);
    }

    const sizeMB = (media.fileSize || 0) / (1024 * 1024);
    const duration = timestamp.split(':').reduce((acc, val) => acc * 60 + +val, 0);

    if (sizeMB > 100 || duration > 1800) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *El archivo supera el límite permitido.*`
      }, msg);
    }

    const tipoEnvio = isAudioCommand
      ? isDocument
        ? '📂 Enviando *audio como documento*...'
        : '🔊 Enviando *audio*...'
      : isDocument
        ? '📂 Enviando *video como documento*...'
        : '🎥 Enviando *video*...';

    const txt = [
      '┏━━━━━━━━━━━━━━━',
      `┃ *🎬 TÍTULO:* ${title}`,
      `┃ *📺 CANAL:* ${video.author.name}`,
      `┃ *⏱️ DURACIÓN:* ${timestamp}`,
      `┃ *👀 VISTAS:* ${views}`,
      `┃ *📆 PUBLICADO:* ${ago}`,
      `┃ *💾 PESO:* ${media.fileSizeH || 'N/A'}`,
      `┃ *🔗 LINK:* ${url}`,
      '┗━━━━━━━━━━━━━━━',
      `> ${tipoEnvio}`
    ].join('\n');

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    }, msg);

    const res = await axios.get(media.download, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);

    if (isDocument) {
      await conn.sendMessage2(msg.key.remoteJid, {
        document: buffer,
        mimetype: isAudioCommand ? 'audio/mpeg' : 'video/mp4',
        fileName: `${title}.${isAudioCommand ? 'mp3' : 'mp4'}`
      }, msg);
    } else {
      const key = isAudioCommand ? 'audio' : 'video';
      await conn.sendMessage2(msg.key.remoteJid, {
        [key]: buffer,
        mimetype: isAudioCommand ? 'audio/mpeg' : 'video/mp4',
        fileName: `${title}.${isAudioCommand ? 'mp3' : 'mp4'}`
      }, msg);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ *Ocurrió un error al procesar la descarga.*`
    }, msg);
  }
};

handler.command = [
  // Audio
  'play', 'yta', 'mp3', 'ytmp3', 'play3', 'ytadoc', 'mp3doc', 'ytmp3doc',
  // Video
  'play2', 'ytv', 'mp4', 'ytmp4', 'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'
];

module.exports = handler;
