/*const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions');

const handler = async (msg, { conn }) => {
  try {
    let mediaMsg = null;
    let mediaType = null;

    const m = msg.message;

    // Detectar multimedia enviada directamente con el comando en caption
    if (m.imageMessage && m.imageMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.imageMessage;
      mediaType = 'image';
    } else if (m.videoMessage && m.videoMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.videoMessage;
      mediaType = 'video';
    }

    // Detectar si se respondió a una imagen/video
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
        text: `👾 *Uso correcto:*\n\n1. Envía una imagen/video con *s* como pie de foto.\n2. O responde a una imagen/video con *s*.`
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

    const stickerBuffer = mediaType === 'image'
      ? await writeExifImg(buffer, metadata)
      : await writeExifVid(buffer, metadata);

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

handler.command = ['s', 'sticker'];
module.exports = handler;*/

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const { tmpdir } = require('os');
const { randomUUID } = require('crypto');

const handler = async (msg, { conn }) => {
  try {
    let mediaMsg = null;
    let mediaType = null;
    let modifier = null;
    const m = msg.message;

    // Detectar multimedia con caption
    if (m.imageMessage && m.imageMessage.caption?.toLowerCase().startsWith('.s')) {
      mediaMsg = m.imageMessage;
      mediaType = 'image';
      modifier = m.imageMessage.caption.split(' ')[1]; // -i, -x, -c
    } else if (m.videoMessage && m.videoMessage.caption?.toLowerCase().startsWith('.s')) {
      mediaMsg = m.videoMessage;
      mediaType = 'video';
    }

    // Detectar si se respondió a un mensaje multimedia
    if (!mediaMsg && m.extendedTextMessage?.text?.toLowerCase().startsWith('.s')) {
      const quoted = m.extendedTextMessage.contextInfo?.quotedMessage;
      if (quoted?.imageMessage) {
        mediaMsg = quoted.imageMessage;
        mediaType = 'image';
        modifier = m.extendedTextMessage.text.split(' ')[1];
      } else if (quoted?.videoMessage) {
        mediaMsg = quoted.videoMessage;
        mediaType = 'video';
      }
    }

    if (!mediaMsg || !mediaType) {
      return await conn.sendMessage(msg.key.remoteJid, {
        text: `👾 *Uso correcto:*\n\n1. Envía imagen/video con \`.s\`, \`.s -i\`, \`.s -x\` o \`.s -c\`.\n2. O responde a una imagen/video con el comando.`
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
      stickerBuffer = await writeExifImg(buffer, modifier);
    } else {
      stickerBuffer = await writeExifVid(buffer);
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

// Función para imágenes con estilos
async function writeExifImg(buffer, modifier) {
  const fileName = path.join(tmpdir(), `${randomUUID()}.webp`);
  let image = sharp(buffer).resize(512, 512, { fit: 'cover' });

  switch (modifier) {
    case '-i': // Ampliado
      image = sharp(buffer).resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });
      break;
    case '-x': // Acoplado
      image = sharp(buffer).resize(512, 512, { fit: 'fill' });
      break;
    case '-c': // Circular
      const mask = Buffer.from(`<svg><circle cx="256" cy="256" r="256" fill="white"/></svg>`);
      image = sharp(buffer)
        .resize(512, 512)
        .composite([{ input: mask, blend: 'dest-in' }]);
      break;
  }

  await image.webp({ quality: 100 }).toFile(fileName);
  return fileName;
}

// Función para videos
async function writeExifVid(buffer) {
  const inputPath = path.join(tmpdir(), `${randomUUID()}.mp4`);
  const outputPath = path.join(tmpdir(), `${randomUUID()}.webp`);
  fs.writeFileSync(inputPath, buffer);

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .inputFormat('mp4')
      .outputOptions([
        '-vcodec', 'libwebp',
        '-vf', 'scale=512:512:force_original_aspect_ratio=decrease,fps=15',
        '-loop', '0',
        '-ss', '00:00:00',
        '-t', '00:00:06'
      ])
      .output(outputPath)
      .on('end', () => {
        fs.unlinkSync(inputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
}

handler.command = ['s', 'sticker'];
module.exports = handler;
