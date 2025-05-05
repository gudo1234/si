const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions'); // Asegúrate de tener estas funciones
const fs = require('fs');
const path = require('path');

const handler = async (msg, { conn }) => {
  try {
    let mediaMsg = null;
    let mediaType = null;

    const m = msg.message;

    if (m.imageMessage) {
      mediaMsg = m.imageMessage;
      mediaType = "image";
    } else if (m.videoMessage) {
      mediaMsg = m.videoMessage;
      mediaType = "video";
    } else if (m.extendedTextMessage?.contextInfo?.quotedMessage) {
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
        text: `👾 *Uso correcto:*\nResponde a una imagen o video con *${global.prefix}s* para convertirlo en sticker.\n\nEjemplo: Envía una foto con *${global.prefix}s* como texto.`
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

handler.command = ['st'];
module.exports = handler;
