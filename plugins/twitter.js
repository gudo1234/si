const axios = require("axios");
let enviando = false;

const handler = async (msg, { conn, text, usedPrefix }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix}tw* url`
    }, msg );
  }

    await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
    if (enviando) return; 
    enviando = true;

    try {
        const apiResponse = await axios.get(`https://delirius-apiofc.vercel.app/download/twitterdl?url=${args[0]}`);
        const res = apiResponse.data;

        const caption = res.caption ? res.caption : `${msg.pushName}`;

        if (res?.type === 'video') {
            //await conn.sendMessage(m.chat, { video: { url: res.media[0].url }, caption: caption }, { quoted: m });
        await conn.sendMessage2(msg.key.remoteJid, {
      video: { url: res.media[0].url },
      caption: caption,
      mimetype: 'video/mp4',
      fileName: `video.mp4`
    }, msg );
        } else if (res?.type === 'image') {
            //await conn.sendMessage(m.chat, { image: { url: res.media[0].url }, caption: caption }, { quoted: m });
            await conn.sendMessage2(
  msg.key.remoteJid,
  {
    image: { url: res.media[0].url },
    caption: caption,
    fileName: `image.jpg`
  },
  msg 
)
        }

        enviando = false;
        return;

    } catch (err) {
    console.error(err);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '✖️ Ocurrió un error al procesar el video. Asegúrate de que el enlace sea válido.'
    }, { quoted: msg });
  }
};

handler.command = ['x', 'xdl', 'dlx', 'twdl', 'tw', 'twt', 'twitter'];
module.exports = handler;
