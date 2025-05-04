const fetch = require('node-fetch');
const cheerio = require('cheerio');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.sendMessage2(msg.key.remoteJid, {
      text: `✖️ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.com/video-xxxx`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `⏳ Procesando el enlace, por favor espera...`
    }, msg);

    const result = await xnxxScraper(text);

    if (!result.videoUrl) {
      throw new Error('No se pudo extraer el enlace de video.');
    }

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: result.videoUrl },
      mimetype: 'video/mp4',
      fileName: `${result.title || 'video'}.mp4`
    }, msg);

  } catch (err) {
    console.error(err);
    conn.sendMessage2(msg.key.remoteJid, {
      text: `✖️ Error al procesar el enlace.`
    }, msg);
  }
};

handler.command = ['xnxxdl', 'xnxx'];
module.exports = handler;

async function xnxxScraper(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const title = $('meta[property="og:title"]').attr('content') || 'Sin título';
  const videoUrl = $('meta[property="og:video"]').attr('content');

  return { title, videoUrl };
}
