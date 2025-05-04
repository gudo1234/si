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
    const audio = yt.audio['128kbps'] || yt.audio['160kbps'];

    if (!audio) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *No se encontró audio descargable.*`
      }, msg);
    }

    const sizeMB = (audio.fileSize || 0) / (1024 * 1024);
    const duration = timestamp.split(':').reduce((acc, val) => acc * 60 + +val, 0);
    const isDocument = ['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'].includes(command);

    if (sizeMB > 100 || duration > 1800) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *El archivo supera el límite permitido.*`
      }, msg);
    }

    // Mensaje decorado
    const txt = [
      '┏━━━━━━━━━━━━━━━',
      `┃ *🎧 TÍTULO:* ${title}`,
      `┃ *📺 CANAL:* ${video.author.name}`,
      `┃ *⏱️ DURACIÓN:* ${timestamp}`,
      `┃ *👀 VISTAS:* ${views}`,
      `┃ *📆 PUBLICADO:* ${ago}`,
      `┃ *💾 PESO:* ${audio.fileSizeH || 'N/A'}`,
      `┃ *🔗 LINK:* ${url}`,
      '┗━━━━━━━━━━━━━━━',
      `> ${isDocument ? '📂 Enviando audio como documento...' : '🔊 Enviando audio...'}`
    ].join('\n');

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    }, msg);

    // Descargar como buffer para acelerar envío
    const res = await axios.get(audio.download, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(res.data);

    if (isDocument) {
      await conn.sendMessage2(msg.key.remoteJid, {
        document: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, msg);
    } else {
      await conn.sendMessage2(msg.key.remoteJid, {
        audio: buffer,
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
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

handler.command = ['play', 'yta', 'mp3', 'ytmp3', 'play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
module.exports = handler;
