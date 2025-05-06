const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { writeExifImg, writeExifVid } = require('../libs/fuctions');

const handler = async (msg, { conn, args, command }) => {
  try {
    const m = msg.message;

    const noMedia =
      !m.imageMessage &&
      !m.videoMessage &&
      !m.stickerMessage &&
      !m.extendedTextMessage?.contextInfo?.quotedMessage;

    let packname = `${msg.pushName || 'Usuario'} ✨`;
    let author = global.wm || 'Bot';
    const joinedText = args.join(' ').trim();

    // Mostrar solo packname si no hay texto ni multimedia
    if (noMedia && !joinedText && ['wm', 'take', 's', 'sticker'].includes(command)) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `✏️ *Packname actual:* ${packname}`
      }, msg);
    }

    // Aplicar personalización si hay texto
    if (command === 'wm' || command === 'take') {
      if (joinedText.includes('|')) {
        const [p, a] = joinedText.split('|');
        packname = p?.trim() || packname;
        author = a?.trim() || '';
      } else if (joinedText) {
        packname = joinedText;
        author = '';
      }
    } else if (command === 's' || command === 'sticker') {
      if (joinedText) {
        packname = joinedText;
        author = '';
      }
    }

    let mediaMsg = null;
    let mediaType = null;

    // Detectar multimedia directa
    if (m.imageMessage && m.imageMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.imageMessage;
      mediaType = 'image';
    } else if (m.videoMessage && m.videoMessage.caption?.toLowerCase().includes('s')) {
      mediaMsg = m.videoMessage;
      mediaType = 'video';
    } else if (m.stickerMessage && m.stickerMessage.isAnimated === false) {
      mediaMsg = m.stickerMessage;
      mediaType = 'image';
    }

    // Detectar multimedia respondida
    if (!mediaMsg && m.extendedTextMessage?.contextInfo?.quotedMessage) {
      const quoted = m.extendedTextMessage.contextInfo.quotedMessage;
      if (quoted.imageMessage) {
        mediaMsg = quoted.imageMessage;
        mediaType = 'image';
      } else if (quoted.videoMessage) {
        mediaMsg = quoted.videoMessage;
        mediaType = 'video';
      } else if (quoted.stickerMessage && quoted.stickerMessage.isAnimated === false) {
        mediaMsg = quoted.stickerMessage;
        mediaType = 'image';
      }
    }

    if (!mediaMsg || !mediaType) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❌ Responde a una imagen, video o sticker estático, o inclúyelo con el comando.`
      }, msg);
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

    const metadata = { packname, author };

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

handler.command = ['s', 'sticker', 'wm', 'take'];
module.exports = handler;
