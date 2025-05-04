const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.mediafire.com/download/ruwl8ldd2hde8sh`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
try {
let { title, ext, aploud, size, dl_url } = await Starlights.mediafire(text)
let txt = `乂  *M E D I A F I R E  -  D O W N L O A D*\n\n`
    txt += `	✩  *Nombre* : ${title}\n`
    txt += `	✩  *Peso* : ${size}\n`
    txt += `	✩  *Publicado* : ${aploud}\n`
    txt += `	✩  *MimeType* : ${ext}\n\n`
    txt += `*- ↻ El archivo se esta enviando espera un momento, soy lenta. . .*`
  const im = await global.getRandomIcon();
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: im },
      caption: txt
    },  msg );
await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: dl_url },
      mimetype: ext,
      fileName: title
      //caption: ``
    }, msg );

} catch {
try {
let { title, ext, aploud, size, dl_url } = await Starlights.mediafireV2(text)
let txt = `乂  *M E D I A F I R E  -  D O W N L O A D*\n\n`
    txt += `	✩  *Nombre* : ${title}\n`
    txt += `	✩  *Peso* : ${size}\n`
    txt += `	✩  *Publicado* : ${aploud}\n`
    txt += `	✩  *MimeType* : ${ext}\n\n`
    txt += `*- ↻ El archivo se esta enviando espera un momento, soy lenta. . .*`
const im = await global.getRandomIcon();
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: im },
      caption: txt
    },  msg );
await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: dl_url },
      mimetype: ext,
      fileName: title
      //caption: ``
    }, msg );
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
}}}


handler.command = ['mediafire', 'mdfire', 'mf']
module.exports = handler;
