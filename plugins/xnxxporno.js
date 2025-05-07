const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Starlights = require('@StarlightsTeam/Scraper');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `Por favor, ingrese la búsqueda de un video *porno* de xnxx.\n\n> Ejemplo de uso: ${usedPrefix + command} Con mi prima`
    }, msg);
    return;
  }

  if (/^https?:\/\/[^ ]+$/.test(text)) {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `Solo se permite ingresar texto para realizar una búsqueda.\n\nSi deseas descargar directamente, utiliza el comando *${usedPrefix}xnxxdl* https://www.xnxx.es/video-1331hhfa/rubia_de_tetas_grandes_es_golpeada_y_un_bocado_de_semen`
    }, msg);
    return;
  }

  try {
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "🕒", key: msg.key }
    });

    const vids_ = {
      from: msg.sender,
      urls: [],
    };

    if (!global.videoListXXX) global.videoListXXX = [];
    if (global.videoListXXX[0]?.from === msg.sender) {
      global.videoListXXX.splice(0, global.videoListXXX.length);
    }

    const res = await xnxxsearch(text);
    const json = res.result;

    if (!json.length) {
      await conn.sendMessage2(msg.key.remoteJid, {
        text: `No se encontraron resultados para "${text}"`
      }, msg);
      return;
    }

    const firstVideoLink = json[0].link;
    vids_.urls.push(firstVideoLink);

    const { title, dl_url } = await Starlights.xnxxdl(firstVideoLink);

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

    await conn.sendFile(msg.key.remoteJid, dl_url, title + '.mp4', `\`Título:\` ${title}`, msg);
    global.videoListXXX.push(vids_);
  } catch (err) {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `Ocurrió un error: ${err.message}`
    }, msg);
  }
};

handler.command = ['xnxx', 'porno', 'sexo'];
module.exports = handler;

const xnxxsearch = async (query) => {
  return new Promise((resolve, reject) => {
    const baseurl = 'https://www.xnxx.com';

    fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, { method: 'get' })
      .then((res) => res.text())
      .then((res) => {
        const $ = cheerio.load(res);
        const results = [];

        $('div.mozaique').each((_, b) => {
          const thumbs = $(b).find('div.thumb');
          const infos = $(b).find('div.thumb-under');

          thumbs.each((i, el) => {
            const link = $(el).find('a').attr('href');
            const title = $(infos[i]).find('a').attr('title');
            const info = $(infos[i]).find('p.metadata').text();

            if (link && title) {
              results.push({
                title,
                info,
                link: baseurl + link.replace('/THUMBNUM/', '/'),
              });
            }
          });
        });

        resolve({ code: 200, status: true, result: results });
      })
      .catch((err) => reject({ code: 503, status: false, result: err }));
  });
};
