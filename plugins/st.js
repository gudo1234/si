const axios = require('axios');
const fs = require('fs');
const { writeExifImg, writeExifVid } = require('../libs/fuctions'); // Asegúrate de tener esta función para imágenes y videos

const handler = async (msg, { conn, usedPrefix, command }) => {
  const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

  if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `Responde a una imagen o video para generar un sticker`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  let mediaType = quoted.imageMessage ? 'image' : 'video';
  let mediaMessage = quoted.imageMessage || quoted.videoMessage;
  let mediaBuffer = await conn.downloadMediaMessage({ message: quoted });

  let stickerBuffer;
  if (mediaType === 'image') {
    stickerBuffer = await writeExifImg(mediaBuffer, { packname: "StickerBot", author: "Bot" });
  } else {
    stickerBuffer = await writeExifVid(mediaBuffer, { packname: "StickerBot", author: "Bot" });
  }

  await conn.sendMessage(msg.key.remoteJid, {
    sticker: { url: stickerBuffer }
  }, { quoted: msg });
};

handler.command = ['st'];
module.exports = handler;
