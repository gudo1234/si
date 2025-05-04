const Starlights = require('@StarlightsTeam/Scraper');

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}ttvid* La Vaca Lola`
    }, msg );
  }

  try {
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
    let {
      title, author, duration, views, likes,
      comments_count, share_count, download_count,
      published, dl_url
    } = await Starlights.tiktokvid(text);

    let txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
    txt += `    ✩  *Título* : ${title}\n`;
    txt += `    ✩  *Autor* : ${author}\n`;
    txt += `    ✩  *Duración* : ${duration} segundos\n`;
    txt += `    ✩  *Vistas* : ${views}\n`;
    txt += `    ✩  *Likes* : ${likes}\n`;
    txt += `    ✩  *Comentarios* : ${comments_count}\n`;
    txt += `    ✩  *Compartidos* : ${share_count}\n`;
    txt += `    ✩  *Publicado* : ${published}\n`;
    txt += `    ✩  *Descargas* : ${download_count}\n\n`;
    txt += `> ${wm}`;
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      caption: txt,
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`
    }, msg );

  } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '✖️ Ocurrió un error al procesar el video. Asegúrate de que el enlace sea válido.'
    }, { quoted: msg });
  }
};

handler.command = ['tiktokvid','tiktoksearch','tiktokdl','ttvid'];
module.exports = handler;
