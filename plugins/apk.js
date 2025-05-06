const { search, download } = require("aptoide-scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* unicode pad`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
  try {
    const searchA = await search(text);
    if (!searchA.length) {
      return await conn.sendMessage(msg.key.remoteJid, { text: "No se encontraron resultados." }, { quoted: msg });
    }

    const data5 = await download(searchA[0].id);
    let response = `📲 Descargar aplicaciones 📲\n\n📌 *Nombre de la aplicación:* ${data5.name}\n📦 *Paquete:* ${data5.package}\n🕒 *Número de actualización:* ${data5.lastup}\n📥 *Tamaño de la aplicación:* ${data5.size}`;

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: data5.icon },
      caption: response
    },  msg );

    if (data5.size.includes('GB') || parseFloat(data5.size.replace(' MB', '')) > 999) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: 'El archivo es demasiado grande, por lo que no se enviará.'
      }, { quoted: msg });
    }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: data5.dllink },
      mimetype: 'application/vnd.android.package-archive',
      fileName: `${data5.name}.apk`
    }, msg );
    
  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: 'Ocurrió un error al intentar descargar la aplicación.'
    }, msg );
  }
};

handler.command = ["apk", "aplicación"];
module.exports = handler;
