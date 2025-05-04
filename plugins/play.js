const fetch = require("node-fetch");
const { youtubedl, youtubedlv2 } = require("@bochilteam/scraper");
const yts = require('yt-search');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');
const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');

let limit = 100;

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* diles`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    let query = args.join(' ');
    let isUrl = query.match(/youtu/gi);

    let video;
    if (isUrl) {
      let ytres = await yts({ videoId: query.split('v=')[1] });
      video = ytres.videos[0];
    } else {
      let ytres = await yts(query);
      video = ytres.videos[0];
      if (!video) {
        return await conn.sendMessage2(msg.key.remoteJid, {
          text: `❗ *Video no encontrado.*`
        }, msg);
      }
    }

    let { title, thumbnail, timestamp, views, ago, url } = video;

    let yt = await youtubedl(url).catch(async () => await youtubedlv2(url));
    let videoInfo = yt.video['360p'];

    if (!videoInfo) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *No se encontró una calidad compatible para el video.*`
      }, msg);
    }

    let { fileSizeH: sizeHumanReadable, fileSize } = videoInfo;
    let sizeMB = fileSize / (1024 * 1024);

    if (sizeMB >= 700) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *El archivo es demasiado pesado (más de 700 MB). Se canceló la descarga.*`
      }, msg);
    }

    let durationInMinutes = parseFloat(timestamp.split(':')[0]) * 60 + parseFloat(timestamp.split(':')[1]);

    let txt = `\`${title}\`\n\n`;
    txt += `*Canal* ${video.author.name}\n`;
    txt += `*Duración* ${timestamp}\n`;
    txt += `*Vistas* ${views}\n`;
    txt += `*Publicación* ${ago}\n`;
    txt += `*Tamaño:* ${sizeHumanReadable}\n`;
    txt += `*Link* ${url}\n`;
    txt += `> ↻ El audio se está enviando, espera un momento...`;

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    }, msg);

    const apiURL = `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`;
    const res = await axios.get(apiURL);
    const json = res.data;
    const { data } = json;

    if (!data || !data.dl) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❗ *Error al obtener el enlace de descarga desde la API.*`
      }, msg);
    }

    let { dl: downloadUrl } = data;

    // Lógica para diferenciar audio normal y documento
    const docCommands = ['play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
    const isDocument = docCommands.includes(command);

    if (isDocument) {
      await conn.sendMessage2(msg.key.remoteJid, {
        document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, msg);
    } else {
      await conn.sendMessage2(msg.key.remoteJid, {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      }, msg);
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❗ Ocurrió un error al intentar descargar el video.`
    }, msg);
  }
};

handler.command = ['play', 'yta', 'mp3', 'ytmp3', 'play3', 'ytadoc', 'mp3doc', 'ytmp3doc'];
module.exports = handler;
