const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions');
const fg = require("api-dylux"); // Cliente para la API TTP
const e = '⚠️'; // Emoji de advertencia

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  try {
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

    // Generar sticker con color personalizado
    const color = '2FFF2E';
    const res = await fg.ttp(text, color);

    // Crear sticker
    const stiker = await sticker(null, res.result, global.packname, global.author);

    if (stiker) {
      // Enviar sticker
      await conn.sendMessage(msg.key.remoteJid, {
        sticker: { url: stiker }
      }, { quoted: msg });

      // Reacción de éxito
      return await conn.sendMessage(msg.key.remoteJid, {
        react: { text: "✅", key: msg.key }
      });
    } else {
      // Si no se generó el sticker
      await conn.sendMessage(msg.key.remoteJid, {
        react: { text: "❌", key: msg.key }
      });
      throw new Error('No se pudo generar el sticker.');
    }
  } catch (err) {
    // Manejo de errores
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al generar el sticker.`,
    }, msg);
  }
};

handler.command = ['ttp'];
module.exports = handler;
