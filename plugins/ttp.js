const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions');
const fg = require("api-dylux");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  try {
    const e = '⚠️';

    // Validación del texto
    if (!text || text.length > 200) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `${e} Ingresa un texto válido (máx. 200 caracteres).\n\n*Ejemplo:* ${usedPrefix + command} Hola`
      }, msg);
    }

    // Reacción de espera
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    // Generar imagen desde texto
    const color = '2FFF2E';
    const res = await fg.ttp(text, color);

    // Descargar la imagen
    const buffer = await fetch(res.result).then(res => res.arrayBuffer());

    // Metadata personalizada
    const metadata = {
      packname: `${msg.pushName || "Usuario"} ✨`,
      author: global.wm || "Bot"
    };

    // Crear sticker con metadatos
    const stickerBuffer = await writeExifImg(buffer, metadata);

    // Enviar el sticker
    await conn.sendMessage(msg.key.remoteJid, {
      sticker: { url: stickerBuffer }
    }, { quoted: msg });

    // Reacción de éxito
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `⚠️ Ocurrió un error al generar el sticker.`,
    }, msg);
  }
};

handler.command = ['ttp'];
module.exports = handler;
