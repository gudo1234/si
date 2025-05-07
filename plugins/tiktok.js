const Starlights = require('@StarlightsTeam/Scraper');

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {

  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo:\n*${usedPrefix + command}* La Vaca Lola\n*${usedPrefix + command}* https://vt.tiktok.com/ZShhtdsRh/`
    }, msg );
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let data, txt, dl_url;

    if (text.match(/tiktok\.com\/[^\s]+/gi)) {
      // Si es un enlace de TikTok
      let result = await Starlights.tiktokdl(text);
      dl_url = result.dl_url;
      txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
      txt += `    ✩  *Título* : ${result.title}\n`;
      txt += `    ✩  *Autor* : ${result.author}\n`;
      txt += `    ✩  *Duración* : ${result.duration} segundos\n`;
      txt += `    ✩  *Vistas* : ${result.views}\n`;
      txt += `    ✩  *Likes* : ${result.likes}\n`;
      txt += `    ✩  *Comentarios* : ${result.comment}\n`;
      txt += `    ✩  *Compartidos* : ${result.share}\n`;
      txt += `    ✩  *Publicado* : ${result.published}\n`;
      txt += `    ✩  *Descargas* : ${result.downloads}\n\n`;
    } else {
      // Si es texto (búsqueda)
      let result = await Starlights.tiktokvid(text);
      dl_url = result.dl_url;
      txt = '`乂  T I K T O K  -  D O W N L O A D`\n\n';
      txt += `    ✩  *Título* : ${result.title}\n`;
      txt += `    ✩  *Autor* : ${result.author}\n`;
      txt += `    ✩  *Duración* : ${result.duration} segundos\n`;
      txt += `    ✩  *Vistas* : ${result.views}\n`;
      txt += `    ✩  *Likes* : ${result.likes}\n`;
      txt += `    ✩  *Comentarios* : ${result.comments_count}\n`;
      txt += `    ✩  *Compartidos* : ${result.share_count}\n`;
      txt += `    ✩  *Publicado* : ${result.published}\n`;
      txt += `    ✩  *Descargas* : ${result.download_count}\n\n`;
    }

    txt += `> *${textbot}*`;

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

    await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      caption: txt,
      mimetype: 'video/mp4',
      fileName: `tiktok.mp4`
    }, msg );

  } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al procesar el video.`
    }, { quoted: msg });
  }
};

handler.command = ['t', 'tiktokvid', 'tiktoksearch', 'tiktokdl', 'ttvid', 'tt', 'tiktok'];
module.exports = handler;
