/*const fetch = require("node-fetch");
const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const yts = require('yt-search');
const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  const chatId = msg.key.remoteJid;

  if (!text) {
    return await conn.sendMessage2(chatId, {
  text: `${e} Usa el comando correctamente:

📌 Ejemplo de uso:
*${usedPrefix + command}* diles
*${usedPrefix + command}* https://youtube.com/watch?v=E0hGQ4tEJhI`
}, msg);
  }

  await conn.sendMessage(chatId, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    const query = args.join(' ');
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
        return await conn.sendMessage2(chatId, {
          text: `❗ *Video no encontrado.*`
        }, msg);
      }
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = video;

    let yt = await youtubedl(url).catch(() => youtubedlv2(url));
    let videoInfo = yt.video['360p'];
    if (!videoInfo) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *No se encontró una calidad compatible para el video.*`
      }, msg);
    }

    const { fileSizeH: sizeHumanReadable, fileSize } = videoInfo;
    const sizeMB = fileSize / (1024 * 1024);

    if (sizeMB >= 700) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *El archivo es demasiado pesado (más de 700 MB). Se canceló la descarga.*`
      }, msg);
    }

    const docAudioCommands = ['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
    const videoCommands = ['play2', 'ytv', 'mp4', 'ytmp4'];
    const docVideoCommands = ['play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'];

    const isAudioDoc = docAudioCommands.includes(command);
    const isVideo = videoCommands.includes(command);
    const isVideoDoc = docVideoCommands.includes(command);

    const caption = `
╭───── • ─────╮
  𖤐 \`YOUTUBE EXTRACTOR\` 𖤐
╰───── • ─────╯

✦ *🎶 Título:* ${title}
✦ *📺 Canal:* ${author?.name || 'Desconocido'}
✦ *⏱️ Duración:* ${timestamp || 'N/A'}
✦ *👀 Vistas:* ${views?.toLocaleString() || 'N/A'}
✦ *📅 Publicado:* ${ago || 'N/A'}
✦ *💾 Tamaño:* ${sizeHumanReadable}
✦ *🔗 Link:* ${url}

╭───── • ─────╮
> ${
  isAudioDoc ? '📂 Enviando audio como documento...' :
  isVideo ? '🎞️ Enviando video...' :
  isVideoDoc ? '📂 Enviando video como documento...' :
  '🔊 Enviando audio...'
}
╰───── • ─────╯
`.trim();

    // Enviar detalles
    await conn.sendMessage2(chatId, {
      image: { url: thumbnail },
      caption
    }, msg);

    // Obtener enlace de descarga desde múltiples APIs
    let downloadUrl;

    try {
      const api1 = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
      if (api1.data?.data?.dl) {
        downloadUrl = api1.data.data.dl;
      } else {
        throw new Error();
      }
    } catch {
      try {
        const api2 = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`);
        if (api2.data?.result?.download?.url) {
          downloadUrl = api2.data.result.download.url;
        }
      } catch {
        return await conn.sendMessage2(chatId, {
          text: `❗ *Error al obtener el enlace de descarga desde las APIs.*`
        }, msg);
      }
    }

    if (!downloadUrl) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *No se pudo procesar la descarga.*`
      }, msg);
    }

    const sendPayload = {
      [isVideoDoc ? 'document' : isVideo ? 'video' : isAudioDoc ? 'document' : 'audio']: { url: downloadUrl },
      mimetype: isVideo || isVideoDoc ? 'video/mp4' : 'audio/mpeg',
      fileName: `${title}.${isVideo || isVideoDoc ? 'mp4' : 'mp3'}`
    };
    await conn.sendMessage2(chatId, sendPayload, msg);

    await conn.sendMessage(chatId, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error:', err);
    await conn.sendMessage2(chatId, {
      text: `❗ Ocurrió un error inesperado al procesar el formato.`
    }, msg);
  }
};

handler.command = [
  'play', 'yta', 'mp3', 'ytmp3',
  'play3', 'ytadoc', 'mp3doc', 'ytmp3doc',
  'play2', 'ytv', 'mp4', 'ytmp4',
  'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'
];

module.exports = handler;*/

const fetch = require("node-fetch");
const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const yts = require('yt-search');
const axios = require('axios');
const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  const chatId = msg.key.remoteJid;

  if (!text) {
    return await conn.sendMessage2(chatId, {
  text: `${e} Usa el comando correctamente:

📌 Ejemplo de uso:
*${usedPrefix + command}* diles
*${usedPrefix + command}* https://youtube.com/watch?v=E0hGQ4tEJhI`
}, msg);
  }

  await conn.sendMessage(chatId, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    const query = args.join(' ');
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
        return await conn.sendMessage2(chatId, {
          text: `❗ *Video no encontrado.*`
        }, msg);
      }
    }

    const { title, thumbnail, timestamp, views, ago, url, author } = video;

    let yt = await youtubedl(url).catch(() => youtubedlv2(url));
    let videoInfo = yt.video['360p'];
    if (!videoInfo) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *No se encontró una calidad compatible para el video.*`
      }, msg);
    }

    const { fileSizeH: sizeHumanReadable, fileSize } = videoInfo;
    const sizeMB = fileSize / (1024 * 1024);

    if (sizeMB >= 700) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *El archivo es demasiado pesado (más de 700 MB). Se canceló la descarga.*`
      }, msg);
    }

    const docAudioCommands = ['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
    const videoCommands = ['play2', 'ytv', 'mp4', 'ytmp4'];
    const docVideoCommands = ['play4', 'ytvdoc', 'mp4doc', 'ytmp4doc'];

    const isAudioDoc = docAudioCommands.includes(command);
    const isVideo = videoCommands.includes(command);
    const isVideoDoc = docVideoCommands.includes(command);
//🟢🟢
const videoUrls = [
    'https://files.catbox.moe/rdyj5q.mp4',
    'https://files.catbox.moe/693ws4.mp4'
  ];
const jpg = videoUrls[Math.floor(Math.random() * videoUrls.length)];
const chatId = msg.key.remoteJid;
const user = msg.pushName || 'Usuario';
const im = await global.getRandomIcon();
const red = await global.getRandomRed();
const enviando = `${
  isAudioDoc ? '📂 Enviando audio como documento...' :
  isVideo ? '🎞️ Enviando video...' :
  isVideoDoc ? '📂 Enviando video como documento...' :
  '🔊 Enviando audio...'
}`
    let canalId = [
  "120363285614743024@newsletter",
  "120363395205399025@newsletter",
  "120363393456282459@newsletter"
];
let canalNombre = [
  "🤖⃧►iʑυвöτ◃2.0▹",
  "Zeus Bot🔆Channel-OFC",
  "Zeus Bot🌠Test-Channel"
];

// Elegir índice aleatorio
let index = Math.floor(Math.random() * canalId.length);
    const caption = `
╭───── • ─────╮
  𖤐 \`YOUTUBE EXTRACTOR\` 𖤐
╰───── • ─────╯

✦ *🎶 Título:* ${title}
✦ *📺 Canal:* ${author?.name || 'Desconocido'}
✦ *⏱️ Duración:* ${timestamp || 'N/A'}
✦ *👀 Vistas:* ${views?.toLocaleString() || 'N/A'}
✦ *📅 Publicado:* ${ago || 'N/A'}
✦ *💾 Tamaño:* ${sizeHumanReadable}
✦ *🔗 Link:* ${url}

╭───── • ─────╮
> ${enviando}
╰───── • ─────╯
`.trim();

    // Enviar detalles
    /*await conn.sendMessage2(chatId, {
      image: { url: thumbnail },
      caption
    }, msg);*/
    
const formatos = [
    // Formato tipo texto con preview
    async () => conn.sendMessage(chatId, {
  text: caption,
  contextInfo: {
    mentionedJid: [],
    groupMentions: [],
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: canalId[index],
      newsletterName: canalNombre[index],
      serverMessageId: 0
    },
    businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
    forwardingScore: 9999,
    externalAdReply: {
      title: user,
      body: textbot,
      thumbnailUrl: red,
      thumbnail: im,
      sourceUrl: red,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  }
}, { quoted: msg }),

    // Formato tipo sticker
    async () => conn.sendMessage(chatId, {
  sticker: { url: thumbnail },
  contextInfo: {
    forwardingScore: 200,
    isForwarded: false,
    externalAdReply: {
      showAdAttribution: false,
      title: enviando,
      body: `${title}`,
      mediaType: 1,
      sourceUrl: red,
      thumbnailUrl: red,
      thumbnail: im
    }
  }
}, { quoted: msg }),

    // Formato tipo anuncio tipo "imagen"
    async () => await conn.sendMessage(chatId, {
      video: { url: jpg },
      gifPlayback: true,
      caption: caption,
      contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        externalAdReply: {
          title: user,
          body: textbot,
          thumbnailUrl: red,
          thumbnail: thumbnail,
          sourceUrl: red,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: msg })
  ];
  const randomFormato = formatos[Math.floor(Math.random() * formatos.length)];
  await randomFormato();

    // Obtener enlace de descarga desde múltiples APIs
    let downloadUrl;

    try {
      const api1 = await axios.get(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
      if (api1.data?.data?.dl) {
        downloadUrl = api1.data.data.dl;
      } else {
        throw new Error();
      }
    } catch {
      try {
        const api2 = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${encodeURIComponent(url)}`);
        if (api2.data?.result?.download?.url) {
          downloadUrl = api2.data.result.download.url;
        }
      } catch {
        return await conn.sendMessage2(chatId, {
          text: `❗ *Error al obtener el enlace de descarga desde las APIs.*`
        }, msg);
      }
    }

    if (!downloadUrl) {
      return await conn.sendMessage2(chatId, {
        text: `❗ *No se pudo procesar la descarga.*`
      }, msg);
    }

    const sendPayload = {
      [isVideoDoc ? 'document' : isVideo ? 'video' : isAudioDoc ? 'document' : 'audio']: { url: downloadUrl },
      mimetype: isVideo || isVideoDoc ? 'video/mp4' : 'audio/mpeg',
      fileName: `${title}.${isVideo || isVideoDoc ? 'mp4' : 'mp3'}`
    };
    await conn.sendMessage2(chatId, sendPayload, msg);

    await conn.sendMessage(chatId, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error:', err);
    await conn.sendMessage2(chatId, {
      text: `❗ Ocurrió un error inesperado al procesar el formato.`
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
