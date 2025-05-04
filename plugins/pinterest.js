const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.es/video-1331hhfa/rubia_de_tetas_grandes_es_golpeada_y_un_bocado_de_semen`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
try {
let { dl_url, quality, size, duration, url } = await Starlights.pinterestdl(text);

let txt = '`乂  P I N T E R E S T  -  D L`\n\n'
txt += `  ✩   *Calidad* : ${quality}\n`;
txt += `  ✩   *Tamaño* : ${size}\n`;
txt += `  ✩   *Duracion* : ${duration}\n`;
txt += `  ✩   *Url* : ${url}\n\n`
txt += `> *${textbot}*`
await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      mimetype: 'video/mp4',
      caption: txt
    }, msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
} catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }}

handler.command = ['pin', 'pinterest', 'pinterestdl']
module.exports = handler;
