const Starlights = require('@StarlightsTeam/Scraper');

const handler = async (msg, { conn, text, usedPrefix, args }) => {
  if (!text) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}ttimg* https://vm.tiktok.com/ZMBwnbFe7/`
    }, { quoted: msg });
  }
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
if (!args[0].match(/tiktok/gi)) return await conn.sendMessage(msg.key.remoteJid, {
      text: `${e} Verifica que el link sea de TikTok` }, { quoted: msg });
try {
let { username, views, comments, shares, downloads, profile, dl_urls } = await Starlights.tiktokdlV2(args[0])
let txt = '`乂  T I K T O K - I M G`\n\n'
    txt += `\t\t*» Usuario* : ${username}\n`
    txt += `\t\t*» Visitas* : ${views}\n`
    txt += `\t\t*» Comentarios* : ${comments}\n`
    txt += `\t\t*» Compartidos* : ${shares}\n`
    txt += `\t\t*» Descargas* : ${downloads}\n`
       
for (let i = 0; i < dl_urls.length; i++) {
await conn.sendmessage(msg.key.remoteJid, dl_urls[i].dl_url, `tiktokimg${i + 1}.jpg`, txt, msg)
  await conn.sendMessage(
  msg.key.remoteJid,
  {
    image: { url: dl_urls[i].dl_url }, 
    caption: txt
  },
  msg 
)

await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
}} catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '✖️ Ocurrió un error al procesar las imágenes. Asegúrate de que el enlace sea válido.'
    }, { quoted: msg });
  }
}

handler.command = ['tiktokimg', 'tiktokimgs', 'ttimg', 'ttimgs']
module.exports = handler;
