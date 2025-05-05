const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions'); // Asegúrate de que estas funciones existan
const fs = require('fs');

const handler = async (msg, { conn, command }) => {
  try {
    let mediaMsg = null;
    let mediaType = null;

    const m = msg.message;

    // Detecta si el mensaje contiene imagen/video con texto (directo al comando)
    if (m.imageMessage && m.imageMessage.caption?.toLowerCase().startsWith(command)) {
      mediaMsg = m.imageMessage;
      mediaType = "image";
    } else if (m.videoMessage && m.videoMessage.caption?.toLowerCase().startsWith(command)) {
      mediaMsg = m.videoMessage;
      mediaType = "video";
    }

    // Detecta si se respondió a una imagen/video
    if (!mediaMsg && m.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = m.extendedTextMessage.contextInfo.quotedMessage;
      if (quoted.imageMessage) {
        mediaMsg = quoted.imageMessage;
        mediaType = "image";
      } else if (quoted.videoMessage) {
        mediaMsg = quoted.videoMessage;
        mediaType = "video";
      }
    }

    if (!mediaMsg || !mediaType) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: `👾 *Uso correcto:*\nEnvía una imagen/video con *${global.prefix}s* como texto o responde a una imagen/video con *${global.prefix}s* para convertirlo en sticker.`
      }, { quoted: msg });
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🛠️", key: msg.key }
    });

    let buffer = Buffer.alloc(0);
    let stream = await downloadContentFromMessage(mediaMsg, mediaType);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (!buffer.length) {
      throw new Error("No se pudo descargar el archivo multimedia.");
    }

    const metadata = {
      packname: `${msg.pushName || "Usuario"} ✨`,
      author: global.wm || "Bot"
    };

    const outBuffer = mediaType === "image"
      ? await writeExifImg(buffer, metadata)
      : await writeExifVid(buffer, metadata);

    await conn.sendMessage(msg.key.remoteJid, {
      sticker: { url: outBuffer }
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error en el comando de sticker:", err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: "❌ *Error al generar el sticker. Intenta de nuevo más tarde.*"
    }, { quoted: msg });
  }
};

handler.command = ['s', 'sticker'];
module.exports = handler;
