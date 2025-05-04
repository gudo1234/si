const { 
  downloadTrack2,
} = require("@nechlophomeriaa/spotifydl");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* diles`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
  try{
    let downTrack = await downloadTrack2(`${text}`)
    let urlspo=await spotifydl(downTrack.url)
    if (!urlspo.status) return await m.react('❌')
    urlspo=urlspo.download
    let txt = `\`Spotify Track Download\`\n
*Artista:* ${downTrack.artists}\n
*Título:* ${downTrack.title}\n
*Duración:* ${downTrack.duration}`
//conn.sendFile(m.chat, downTrack.imageUrl, 'error.jpg', txt, m, null, rcanal)
const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
if (im) {
await conn.sendMessage(msg.key.remoteJid, {
  text: txt,
  contextInfo: {
    externalAdReply: {
      title: `${msg.pushName}`,
      body: textbot,
      thumbnailUrl: red,
      thumbnail: downTrack.imageUrl,
      sourceUrl: red,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  }
}, { quoted: msg })}
    await conn.sendMessage(msg.key.remoteJid, {audio: {url: urlspo}, fileName: `${downTrack.title}.mp3`, mimetype: 'audio/mpeg'}, msg );
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "✅", key: msg.key} 
        });
    }
  catch (err) {
    console.error('Error al descargar el video:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Ocurrió un error al intentar descargar el video.`
    }, msg );
  }
}

handler.command = ['spotify']
module.exports = handler;

async function spotifydl(url) {
  try {
    let maxIntentos = 10
    let intentos = 0;
    let statusOk = 0;
    let res;
    while (statusOk!==3 && statusOk!==-3 && intentos < maxIntentos) {
      try 
      {
          var { data } = await axios.get('https://api.fabdl.com/spotify/get?url=' + url, {
          headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          referer: "https://spotifydownload.org/",
          }});
          const datax = await axios.get(`https://api.fabdl.com/spotify/mp3-convert-task/${data.result.gid}/${data.result.id}`, {
          headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          referer: "https://spotifydownload.org/",
          }});
          res=datax.data
          statusOk=res.result.status
          intentos++;
          if (statusOk!==3 && statusOk!==-3) await new Promise(resolve => setTimeout(resolve, 3000));
      } 
      catch (error) {
        return {
          status: false,
          message:"Error inesperado.",
          code: 500,
          creator:"Enigma Team"
        };
      }
    }
    if(statusOk!==3) return {
      status: false,
      message:"Error inesperado.",
      code: 500,
      creator:"Enigma Team"
    };
    
    return({
    status: true,
    title: data.result.name,
    duration: data.result.duration_ms,
    cover: data.result.image,
    download: "https://api.fabdl.com" + res.result.download_url,
    creator:"Enigma Team"
    })
  } 
  catch (e) {
  return {
    status: false,
    message:"Error inesperado.",
    code: 500,
    creator:"Enigma Team"
  }}
           }
