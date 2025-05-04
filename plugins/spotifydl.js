const Starlights = require('@StarlightsTeam/Scraper');

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ingresa el enlace de algún Track, Playlist o Álbum de Spotify:\n\n📌 Ejemplo: *${usedPrefix + command}* https://open.spotify.com/track/3k3NWokhRRkEPhCzPmV8TW`
    }, msg );
  }
    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
let isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
if (!isSpotifyUrl) return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ingresa un enlace válido de Track, Playlist o Álbum de Spotify.`}, msg );

try {
let { title, artist, album, thumbnail, dl_url } = await Starlights.spotifydl(text);
//let img = await (await fetch(thumbnail)).buffer();

let txt = `*乂  S P O T I F Y  -  D O W N L O A D*\n\n`;
    txt += `    ✩  *Título* : ${title}\n`;
    txt += `    ✩  *Álbum* : ${album}\n`;
    txt += `    ✩  *Artista* : ${artist}\n\n`;
    txt += `*- ↻ Los audios se están enviando, espera un momento. . .*`;
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: thumbnail },
      caption: txt
    },  msg );
await conn.sendMessage2(msg.key.remoteJid, {
      audio: { url: dl_url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      caption: ``
    }, msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
} catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al procesar. Asegúrate de que el enlace sea válido.`
    }, msg );
  }
}

handler.command = ['spotifydl']
module.exports = handler;
