const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `⚠️ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.mediafire.com/download/ruwl8ldd2hde8sh`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let { aploud, size, dl_url } = await Starlights.mediafire(text);
    let txt = `乂  *M E D I A F I R E  -  D O W N L O A D*\n\n`;
    txt += `✩  *Nombre* : ${size}\n`;
    txt += `✩  *Peso* : ${size}\n`;
    txt += `✩  *Publicado* : ${aploud}\n`;
    txt += `✩  *MimeType* : ${size}\n\n`;
    txt += `*- ↻ El archivo se está enviando, espera un momento...*`;

    const im = await global.getRandomIcon();
    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: im },
      caption: txt
    }, msg);

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: dl_url },
      mimetype: size,
      fileName: size
    }, msg);

  } catch (err) {
    try {
      let { aploud, size, dl_url } = await Starlights.mediafireV2(text);
      let txt = `乂  *M E D I A F I R E  -  D O W N L O A D*\n\n`;
      txt += `✩  *Nombre* : ${size}\n`;
      txt += `✩  *Peso* : ${size}\n`;
      txt += `✩  *Publicado* : ${aploud}\n`;
      txt += `✩  *MimeType* : ${size}\n\n`;
      txt += `*- ↻ El archivo se está enviando, espera un momento...*`;

      const im = await global.getRandomIcon();
      await conn.sendMessage2(msg.key.remoteJid, {
        image: { url: im },
        caption: txt
      }, msg);

      await conn.sendMessage2(msg.key.remoteJid, {
        document: { url: dl_url },
        mimetype: size,
        fileName: size
      }, msg);

    } catch (err) {
      console.error('Error al descargar el archivo:', err);
      await conn.sendMessage2(msg.key.remoteJid, {
        text: `⚠️ Ocurrió un error al intentar descargar el archivo.`
      }, msg);
    }
  }
};

handler.command = ['mediafire', 'mdfire', 'mf'];
module.exports = handler;
