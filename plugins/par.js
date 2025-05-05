const Starlights = require("@StarlightsTeam/Scraper");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  try {
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    const { data } = await Starlights.ppcouple(); // Si retorna { data: { women, man } }
    const { women, man } = data;

    if (!women || !man) throw new Error('No se pudieron obtener las imágenes');

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: women },
      caption: '*Chica* 👧🏼'
    }, msg);

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: man },
      caption: '*Chico* 🧒🏻'
    }, msg);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });
  } catch (err) {
    console.error('Error al obtener las imágenes:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${err.message} Ocurrió un error al intentar obtener las fotos.`
    }, msg);
  }
};

handler.command = ['ppcouple', 'par'];
module.exports = handler;
