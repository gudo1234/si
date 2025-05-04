const yts = require('yt-search'); const axios = require('axios');

const handler = async (msg, { conn, text, usedPrefix, command, args }) => { if (!text) { return await conn.sendMessage2(msg.key.remoteJid, { text: ❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* diles }, msg); }

await conn.sendMessage(msg.key.remoteJid, { react: { text: "🕒", key: msg.key } });

try { const query = args.join(' '); const isUrl = /youtu/.test(query);

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
  `┃ *🔗 LINK:* ${url}`,
  '┗━━━━━━━━━━━━━━━',
  `> ${tipoEnvio}`
].join('\n');

await conn.sendMessage2(msg.key.remoteJid, {
  image: { url: thumbnail },
  caption: txt
}, msg);

const apiURL = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;
const res = await axios.get(apiURL);
const json = res.data;
if (!json || !json.data || !json.data.url) {
  throw new Error('API alternativa falló al obtener URL');
}

const mediaUrl = json.data.url;
const bufferRes = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
const buffer = Buffer.from(bufferRes.data);

const fileExt = isAudioCommand ? 'mp3' : 'mp4';
const mimeType = isAudioCommand ? 'audio/mpeg' : 'video/mp4';

if (isDocument) {
  await conn.sendMessage2(msg.key.remoteJid, {
    document: buffer,
    mimetype: mimeType,
    fileName: `${title}.${fileExt}`
  }, msg);
} else {
  const key = isAudioCommand ? 'audio' : 'video';
  await conn.sendMessage2(msg.key.remoteJid, {
    [key]: buffer,
    mimetype: mimeType,
    fileName: `${title}.${fileExt}`
  }, msg);
}

await conn.sendMessage(msg.key.remoteJid, {
  react: { text: "✅", key: msg.key }
});

} catch (err) { console.error('Error:', err); await conn.sendMessage2(msg.key.remoteJid, { text: ❗ *Ocurrió un error al procesar la descarga.* }, msg); } };

handler.command = [ 'play', 'yta', 'mp3', 'ytmp3', 'play3', 'ytadoc', 'mp3doc', 'ytmp3doc', 'play2', 'ytv', 'mp4', 'ytmp4', 'play4', 'ytvdoc', 'mp4doc', 'ytmp4doc' ];

module.exports = handler;

