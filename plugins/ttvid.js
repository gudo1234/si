import Starlights from '@StarlightsTeam/Scraper'
//const @StarlightsTeam/Scraper = requiere('@StarlightsTeam/Scraper')
const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}ttvid* La Vaca Lola`
    }, { quoted: msg });
  }
  try {
    let { title, author, duration, views, likes, comments_count, share_count, download_count, published, dl_url } = await Starlights.tiktokvid(text)
      let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n'
          txt += `    ✩  *Título* : ${title}\n`
          txt += `    ✩  *Autor* : ${author}\n`
          txt += `    ✩  *Duración* : ${duration} segundos\n`
          txt += `    ✩  *Vistas* : ${views}\n`
          txt += `    ✩  *Likes* : ${likes}\n`
          txt += `    ✩  *Comentarios* : ${comments_count}\n`
          txt += `    ✩  *Compartidos* : ${share_count}\n`
          txt += `    ✩  *Publicado* : ${published}\n`
          txt += `    ✩  *Descargas* : ${download_count}\n\n`
          txt += `> ${wm}`

      //await conn.sendFile(m.chat, dl_url, `thumbnail.mp4`, txt, m, null, rcanal)

await conn.sendMessage(msg.key.remoteJid, {
      video: dl_url,
      caption: txt,
      mimetype: 'thumbnail.mp4',
      fileName: txt)
    }, { quoted: msg });

  } catch {
    await m.react('✖️')
  }
}

handler.command = ['tiktokvid','tiktoksearch','tiktokdl','ttvid']
module.exports = handler;
