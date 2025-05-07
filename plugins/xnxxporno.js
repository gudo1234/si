const axios = require('axios');
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

    await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: dl_url },
      caption: `\`Título:\` ${title}`,
      mimetype: 'video/mp4'
    }, msg );

    global.videoListXXX.push(vids_);
  } catch (err) {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `Ocurrió un error: ${err.message || err}`
    }, msg);
  }
};

handler.command = ['xnxx', 'porno', 'sexo'];
module.exports = handler;

const xnxxsearch = async (query) => {
  try {
    const baseurl = 'https://www.xnxx.com';
    const url = `${baseurl}/search/${encodeURIComponent(query)}/${Math.floor(Math.random() * 3) + 1}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const $ = cheerio.load(data);
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

    return { code: 200, status: true, result: results };
  } catch (err) {
    return { code: 503, status: false, result: [], message: err.message || 'Error al hacer scraping' };
  }
};
