const axios = require("axios");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* hola`
    }, msg);
  }

  try {
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    const inputText = encodeURIComponent(args.join(" "));
    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${inputText}`;

    // Usamos axios en lugar de fetch
    const response = await axios.get(apiUrl);
    const stickerUrl = response.data?.url || apiUrl; // Usa la URL directa o la del API si la respuesta tiene formato

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '🎨', key: msg.key }
    });

    const red = await global.getRandomRed();
    const im = await global.getRandomIcon();

    await conn.sendMessage2(msg.key.remoteJid, {
      sticker: { url: stickerUrl },
      contextInfo: {
        forwardingScore: 200,
        isForwarded: false,
        externalAdReply: {
          showAdAttribution: false,
          title: `${msg.pushName}`,
          body: 'Aquí tienes tu sticker!',
          mediaType: 1,
          sourceUrl: red,
          thumbnailUrl: red,
          thumbnail: im
        }
      }
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al procesar el comando:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Ocurrió un error al intentar procesar el comando.`
    }, msg);
  }
};

handler.command = ['brat'];
module.exports = handler;
