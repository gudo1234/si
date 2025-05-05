const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions');
const Jimp = require('jimp');

const handler = async (msg, { conn }) => {
  try {
    let mediaMsg = null;
    let mediaType = null;

    const m = msg.message;

    if (m.imageMessage && m.imageMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.imageMessage;
      mediaType = 'image';
    } else if (m.videoMessage && m.videoMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.videoMessage;
      mediaType = 'video';
    }

    if (!mediaMsg && m.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = m.extendedTextMessage.contextInfo.quotedMessage;
      if (quoted.imageMessage) {
        mediaMsg = quoted.imageMessage;
        mediaType = 'image';
      } else if (quoted.videoMessage) {
        mediaMsg = quoted.videoMessage;
        mediaType = 'video';
      }
    }

    if (!mediaMsg || !mediaType) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: `❗ Responde a una imagen o video para generar un sticker.`
      }, { quoted: msg });
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '🛠️', key: msg.key }
    });

    let buffer = Buffer.alloc(0);
    const stream = await downloadContentFromMessage(mediaMsg, mediaType);
    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    if (!buffer.length) throw new Error('No se pudo descargar el archivo multimedia.');

    const metadata = {
      packname: `${msg.pushName || "Usuario"} ✨`,
      author: global.wm || "Bot"
    };

    let stickerBuffer;
    if (mediaType === 'image') {
      const img = await Jimp.read(buffer);
      const size = Math.min(img.bitmap.width, img.bitmap.height);
      img.resize(size, size);

      const mask = new Jimp(size, size, 0x00000000);
      mask.scan(0, 0, size, size, function (x, y, idx) {
        const cx = size / 2;
        const cy = size / 2;
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy <= (size / 2) ** 2) {
          this.bitmap.data[idx + 3] = 255;
        }
      });

      img.mask(mask, 0, 0);
      buffer = await img.getBufferAsync(Jimp.MIME_PNG);
      stickerBuffer = await writeExifImg(buffer, metadata);
    } else {
      stickerBuffer = await writeExifVid(buffer, metadata);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      sticker: { url: stickerBuffer }
    }, { quoted: msg });

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: '✅', key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error generando sticker:", err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '❌ *Error al generar el sticker.*'
    }, { quoted: msg });
  }
};

handler.command = ['c'];
module.exports = handler;
