const Starlights = require("@StarlightsTeam/Scraper");
const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://vt.tiktok.com/ZShhtdsRh/`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
    if (!args[0].match(/tiktok/gi)) return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Verifica que el enlace sea de TikTok.`
    }, msg);
try {
let { title, author, duration, views, likes, comment, share, published, downloads, dl_url } = await Starlights.tiktokdl(args[0])
let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n'
    txt += `	✩  *Título* : ${title}\n`
    txt += `	✩  *Autor* : ${author}\n`
    txt += `	✩  *Duración* : ${duration} segundos\n`
    txt += `	✩  *Vistas* : ${views}\n`
    txt += `	✩  *Likes* : ${likes}\n`
    txt += `	✩  *Comentarios* : ${comment}\n`
    txt += `	✩  *Compartidos* : ${share}\n`
    txt += `	✩  *Publicado* : ${published}\n`
    txt += `	✩  *Descargas* : ${downloads}\n\n`
    txt += `> *${textbot}*`
await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      caption: txt,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, msg );
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }}
handler.command = ['tt', 'tiktokdl', 'tiktok']
module.exports = handler;
