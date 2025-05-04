const fetch = require("node-fetch");
const cheerio = require("cheerio");

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* https://www.xnxx.com/video-14lcwbe8/rubia_novia_follada_en_cuarto_de_bano`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
  try {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} El vídeo está siendo procesado, espere un momento...\n\n- El tiempo de envío depende del peso y duración del video.`}, msg);
    let xnxxLink = '';
    
    if (args[0].includes('xnxx')) {
      xnxxLink = args[0];
    } else {
      const index = parseInt(args[0]) - 1;
      if (index >= 0) {
        if (Array.isArray(global.videoListXXX) && global.videoListXXX.length > 0) {
          const matchingItem = global.videoListXXX.find((item) => item.from === m.sender);
          if (matchingItem) {
            if (index < matchingItem.urls.length) {
              xnxxLink = matchingItem.urls[index];
            } else {
              await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} No se encontró un enlace para ese número, por favor ingrese un número entre el 1 y el ${matchingItem.urls.length}`}, msg);;
            }
          } else {
            await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Para poder usar este comando de esta forma (${usedPrefix + command} <numero>), por favor realiza la búsqueda con el comando ${usedPrefix}xnxxsearch <texto>`}, msg);
          }
        } else {
          await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Para poder usar este comando de esta (${usedPrefix + command} <numero>), por favor realiza la búsqueda con el comando ${usedPrefix}xnxxsearch <texto>`}, msg);
        }
      }
    }

    const res = await xnxxdl(xnxxLink);
    const json = await res.result.files;
    conn.sendMessage2(msg.key.remoteJid, {document: {url: json.high}, mimetype: 'video/mp4', fileName: res.result.title}, msg );
  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '✖️ Ocurrió un error al procesar el video. Asegúrate de que el enlace sea válido.'
    }, msg );
  }
};

handler.command = ['xnxxdl', 'xnxx'];
module.exports = handler;

async function xnxxdl(URL) {
  return new Promise((resolve, reject) => {
    fetch(`${URL}`, {method: 'get'}).then((res) => res.text()).then((res) => {
      const $ = cheerio.load(res, {xmlMode: false});
      const title = $('meta[property="og:title"]').attr('content');
      const duration = $('meta[property="og:duration"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content');
      const videoType = $('meta[property="og:video:type"]').attr('content');
      const videoWidth = $('meta[property="og:video:width"]').attr('content');
      const videoHeight = $('meta[property="og:video:height"]').attr('content');
      const info = $('span.metadata').text();
      const videoScript = $('#video-player-bg > script:nth-child(6)').html();
      const files = {
        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1]
      };
      resolve({status: 200, result: {title, URL, duration, image, videoType, videoWidth, videoHeight, info, files}});
    }).catch((err) => reject({code: 503, status: false, result: err}));
  });
}
