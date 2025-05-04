const { File } = require("megajs");
const path = require("path");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command} <url>*`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });

        const file = File.fromURL(text);
        await file.loadAttributes();

        if (file.size >= 300000000) return m.reply('✘ Error: El archivo es demasiado pesado (Peso máximo: 300MB ( Premium: 800MB )');

        const caption = `*File:* ${file.name}\n*Size:* ${formatBytes(file.size)}`;

        const data = await file.downloadBuffer();

        const fileExtension = path.extname(file.name).toLowerCase();
        const mimeTypes = {
            ".mp4": "video/mp4",
            ".pdf": "application/pdf",
            ".zip": "application/zip",
            ".rar": "application/x-rar-compressed",
            ".7z": "application/x-7z-compressed",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".png": "image/png",
        };

        let mimetype = mimeTypes[fileExtension] || "application/octet-stream";

        //await conn.sendFile(m.chat, data, file.name, caption, m, null, { mimetype, asDocument: true });
await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: data },
      mimetype: null,
      fileName: file.name,
      caption: caption
    }, msg );

    } catch (error) {
        return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} ${msm} Ocurrió un error: ${error.message}`
    }, msg);
    }
}

handler.command = ['mega', 'mg']
module.exports = handler;

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      }
