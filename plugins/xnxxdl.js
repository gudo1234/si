const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Scraper que extrae el enlace directo y título del video desde XNXX
async function xnxxScraper(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content') || 'video';
  const videoUrl = $('meta[property="og:video"]').attr('content');

  if (!videoUrl) {
    throw new Error('No se encontró el enlace directo del video.');
  }

  return {
    title,
    videoUrl
  };
}

// Handler del comando
const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage2(msg.key.remoteJid, {
      text: `✖️ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.com/video-xxxx`
    }, msg);
  }

  try {
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "⏳", key: msg.key }
    });

    const { title, videoUrl } = await xnxxScraper(text);

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, msg);
  } catch (err) {
    console.error(err);
    conn.sendMessage2(msg.key.remoteJid, {
      text: '✖️ No se pudo obtener el video. Asegúrate de que el enlace sea válido.'
    }, msg);
  }
};

handler.command = ['xnxxdl', 'xnxx'];
module.exports = handler;
