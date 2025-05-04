const { googleImage } = require("@bochilteam/scraper");

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}imagen* mia khalifa`
    }, msg );
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  const results = await googleImage(text);
  if (!results || results.length === 0) {
    return await conn.sendMessage(msg.key.remoteJid, {
      text: 'No se encontraron imágenes.'
    }, { quoted: msg });
  }

  // Seleccionar 5 imágenes aleatorias (o menos si no hay suficientes)
  const images = results.sort(() => 0.5 - Math.random()).slice(0, 5);

  for (const img of images) {
    await conn.sendMessage2(
      msg.key.remoteJid,
      {
        image: { url: img },
        caption: '',
        fileName: 'image.jpg'
      },
      msg 
    );
  }
};

handler.command = ['image', 'imagen'];
module.exports = handler;
