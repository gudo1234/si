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

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* diles`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });

  try {
    let query = text.join(' ');
    let isUrl = query.match(/youtu/gi);

    let video;
    if (isUrl) {

      let ytres = await yts({ videoId: query.split('v=')[1] });
      video = ytres.videos[0];
    } else {
      // Si es un texto
      let ytres = await yts(query);
      video = ytres.videos[0];
      if (!video) {
        return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Video no encontrado.*`}, msg);
      }
    }

    let { title, thumbnail, timestamp, views, ago, url } = video;

    let yt = await youtubedl(url).catch(async () => await youtubedlv2(url));
    let videoInfo = yt.video['360p']; 

    if (!videoInfo) {
      return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *No se encontró una calidad compatible para el video.*` }, msg);
    }

    let { fileSizeH: sizeHumanReadable, fileSize } = videoInfo;


    let sizeMB = fileSize / (1024 * 1024); 


    if (sizeMB >= 700) {
      return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *El archivo es demasiado pesado (más de 700 MB). Se canceló la descarga.*` }, msg);
    }


    let durationInMinutes = parseFloat(timestamp.split(':')[0]) * 60 + parseFloat(timestamp.split(':')[1]);


    let txt = `\`${title}\`\n\n`;
txt +=  `*Canal* ${video.author.name}\n`; 
 txt += `*Duración* ${timestamp}\n`;
    txt += `*Vistas* ${views}\n`;
    txt += `*Publicación* ${ago}\n`;
    txt += `*Tamaño:* ${sizeHumanReadable}\n`;
    txt += `*Link* ${url}\n`;
    txt += `> ↻ El audio se está enviando, espera un momento...`;

 await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    },  msg );


    let api = await fetch(`https://api.siputzx.my.id/api/d/ytmp4?url=${url}`);
    let json = await api.json();
    let { data } = json;

    if (!data || !data.dl) {
      return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Error al obtener el enlace de descarga desde la API.*` }, msg);
    }

    let { dl: downloadUrl } = data;

    // Enviar el video según el tamaño o la duración
    if (sizeMB > limit || durationInMinutes > 30) {
      // Enviar como documento si el tamaño supera los 100 MB o si dura más de 30 minutos
      /*await star.sendMessage(
        m.chat,
        { audio: { url: downloadUrl }, mimetype: 'audio/mpeg', fileName: `${title}.mp4` },
        { quoted: m }
      );*/
 await conn.sendMessage2(msg.key.remoteJid, {
      audio: { url: dl_url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp4`,
      caption: ``
    }, msg );
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    } else {
      // Enviar como video normal si es menor o igual al límite y dura menos de 30 minutos
      await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      mimetype: 'audio/mp4',
      fileName: `${title}.mp4`,
      caption: ``
    }, msg );
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    }
  } catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }
};


handler.command = ['play', 'yta', 'mp3', 'ytmp3'];
module.exports = handler;
