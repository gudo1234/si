const fetch = require("node-fetch");
const cheerio = require("cheerio");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `✖️ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  try {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `⏳ El vídeo está siendo procesado, espere un momento...\n\n- El tiempo de envío depende del peso y duración del video.`}, msg);

    let xnxxLink = '';

    if (args[0].includes('xnxx')) {
      xnxxLink = args[0];
    } else {
      const index = parseInt(args[0]) - 1;
      if (index >= 0) {
        if (Array.isArray(global.videoListXXX) && global.videoListXXX.length > 0) {
          const matchingItem = global.videoListXXX.find((item) => item.from === msg.key.participant);
          if (matchingItem) {
            if (index < matchingItem.urls.length) {
              xnxxLink = matchingItem.urls[index];
            } else {
              return await conn.sendMessage2(msg.key.remoteJid, {
                text: `✖️ No se encontró un enlace para ese número. Por favor ingrese un número entre el 1 y el ${matchingItem.urls.length}`
              }, msg);
            }
          } else {
            return await conn.sendMessage2(msg.key.remoteJid, {
              text: `✖️ Realiza una búsqueda con *${usedPrefix}xnxxsearch <texto>* antes de usar este comando con número.`
            }, msg);
          }
        } else {
          return await conn.sendMessage2(msg.key.remoteJid, {
            text: `✖️ Primero realiza una búsqueda con *${usedPrefix}xnxxsearch <texto>* para usar este comando así.`
          }, msg);
        }
      }
    }

    const res = await xnxxdl(xnxxLink);
    const json = res.result.files;

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: json.high },
      mimetype: 'video/mp4',
      fileName: `${res.result.title}.mp4`
    }, msg);

  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '✖️ Ocurrió un error al procesar el video. Asegúrate de que el enlace sea válido.'
    }, msg);
  }
};

handler.command = ['xnxxdl', 'xnxx'];
module.exports = handler;

async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(URL).then((res) => res.text()).then((html) => {
      const $ = cheerio.load(html);
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg script').html();

      const files = {
        low: (videoScript.match(/html5player\.setVideoUrlLow'(.*?)';/) || [])[1],
        high: (videoScript.match(/html5player\.setVideoUrlHigh'(.*?)';/) || [])[1],
        HLS: (videoScript.match(/html5player\.setVideoHLS'(.*?)';/) || [])[1],
        thumb: (videoScript.match(/html5player\.setThumbUrl'(.*?)';/) || [])[1],
        thumb69: (videoScript.match(/html5player\.setThumbUrl169'(.*?)';/) || [])[1],
        thumbSlide: (videoScript.match(/html5player\.setThumbSlide'(.*?)';/) || [])[1],
        thumbSlideBig: (videoScript.match(/html5player\.setThumbSlideBig'(.*?)';/) || [])[1]
      };

      resolve({
        status: 200,
        result: {
          title,
          URL,
          duration,
          image,
          videoType,
          videoWidth,
          videoHeight,
          info,
          files
        }
      });
    }).catch((err) => reject({
      code: 503,
      status: false,
      result: err
    }));
  });
}
