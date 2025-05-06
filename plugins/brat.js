const axios = require("axios");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* hola`
    }, msg);
  }

  try {
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    const inputText = encodeURIComponent(args.join(" "));
    const apiUrl = `https://api.siputzx.my.id/api/m/brat?text=${inputText}`;

    // Descarga la imagen como buffer
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    // Genera el sticker con el packname como pushName
    let stiker = await sticker(buffer, `${msg.pushName}`, '');

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '🎨', key: msg.key }
    });

    await conn.sendMessage(msg.key.remoteJid, {
      sticker: stiker,
      contextInfo: {
        forwardingScore: 200,
        isForwarded: false,
        externalAdReply: {
          showAdAttribution: false,
          title: `${msg.pushName}`,
          body: textbot,
          mediaType: 1,
          sourceUrl: await global.getRandomRed(),
          thumbnailUrl: await global.getRandomRed(),
          thumbnail: await global.getRandomIcon()
        }
      }
    }, { quoted: msg });

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
