const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: `❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.es/video-1331hhfa/rubia_de_tetas_grandes_es_golpeada_y_un_bocado_de_semen`
    }, { quoted: msg });
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let { title, dl_url } = await Starlights.xnxxdl(text);

    await conn.sendMessage(msg.key.remoteJid, {
      document: { url: dl_url },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `*» Título* : ${title}`
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '❌ Ocurrió un error al intentar descargar el video.'
    }, { quoted: msg });
  }
};

handler.command = ['xnxxdl'];
module.exports = handler;
