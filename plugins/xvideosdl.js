const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xvideos.com/video.ieiaalk4d80/a_las_milfs_les_gusta_grande_-_diamond_kitty_ricky_spanish_-_su_mejor_domingo_-_brazzers`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
try {
let { title, dl_url } = await Starlights.xvideosdl(args[0])
//await conn.sendFile(m.chat, dl_url, title + '.mp4', `*» Título* : ${title}`, m, false, { asDocument: user.useDocument })

await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: dl_url },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '❌ Ocurrió un error al intentar descargar el video.'
    }, { quoted: msg });
  }}

handler.command = ['xvideosdl']
module.exports = handler;
