const { igdl } = require("ruhend-scraper");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!args) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}*`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });

  let res;
  try {
    res = await igdl(text);
  } catch (e) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Error al obtener los datos, verifica el enlace`
    }, msg);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} No se encontraron resultados`
    }, msg);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (e) {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Error alprocesar los resultados`
    }, msg);
  }

  if (!data) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} No se encontró una resolución adecuada`
    }, msg);
  }

  let video = data.url;
  try {
  //await conn.sendFile(m.chat, video, `thumbnail.mp4`, `${m.pushName}`, m, null, rcanal)
  await conn.sendMessage2(msg.key.remoteJid, {
  video: { url: video },
  caption: `${e}Video de Facebook`
}, msg);
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
  } catch (e) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Error al obtener el video`
    }, msg);
  }
}

handler.command = ['facebook', 'fb']
module.exports = handler;
