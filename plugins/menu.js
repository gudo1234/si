const { getDevice } = require("@whiskeysockets/baileys");
const PhoneNumber = require("awesome-phonenumber");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const user = msg.pushName || 'Usuario';
  const videoUrls = [
    'https://files.catbox.moe/rdyj5q.mp4',
    'https://files.catbox.moe/693ws4.mp4'
  ];
  
  const red = await global.getRandomRed();
  const im = await global.getRandomIcon();
  const jpg = videoUrls[Math.floor(Math.random() * videoUrls.length)];

  const senderNumber = '+' + msg.key.participant.replace('@s.whatsapp.net', '');
  const phoneInfo = new PhoneNumber(senderNumber);
  const internationalNumber = phoneInfo.getNumber('international');

  let mundo = 'Desconocido';
  try {
    const delirius = await axios.get(`https://delirius-apiofc.vercel.app/tools/country?text=${internationalNumber}`);
    const paisdata = delirius.data.result;
    if (paisdata) mundo = `${paisdata.name} ${paisdata.emoji}\n│🗓️ *Fecha:* ${paisdata.date}\n│🕒 *Hora local:* ${paisdata.time12}`;
  } catch (e) {
    console.error('Error consultando país:', e.message);
  }

  const txt = `${e} ¡Hola! *🥀Buenos días🌅tardes🌇noches...*\n\n🤖 \`izuBot:\` Es un sistema automático que responde a comandos para realizar ciertas acciones dentro del \`Chat\` como las descargas de videos de diferentes plataformas y búsquedas en la \`Web\`.

━━━━━━━━━━━━━
\`ᴄᴏɴᴛᴇxᴛ-ɪɴғᴏ☔\`
┌────────────
│ 🚩 *Nombre:* ${msg.pushName}
│ 🌎 *País:* ${mundo}
└────────────

\`ᴊᴀᴅɪʙᴛs-ʙᴏᴛs🤖\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}serbot / ${global.prefix}jadibot
┃ ⎔ ${global.prefix}sercode / ${global.prefix}code
┃ ⎔ ${global.prefix}delbots
┃ ° mas comandos en el menu de subbots...
╰━⊰══❖══⊱━╯

\`ɪɴғᴏʀᴍᴀᴄɪóɴ 🪐\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}speedtest  
┃ ⎔ ${global.prefix}ping  
┃ ⎔ ${global.prefix}creador
╰━⊰══❖══⊱━╯

\`ᴍᴇɴᴜs ᴅɪsᴘᴏɴɪʙʟᴇs📕\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}allmenu  
┃ ⎔ ${global.prefix}menugrupo  
┃ ⎔ ${global.prefix}menuaudio  
┃ ⎔ ${global.prefix}menurpg  
┃ ⎔ ${global.prefix}info  
┃ ⎔ ${global.prefix}menuowner
╰━⊰══❖══⊱━╯

\`ɪᴀ ᴄʜᴀᴛ-ʙᴏᴛ🌐\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}gemini  
┃ ⎔ ${global.prefix}chatgpt
┃ ⎔ ${global.prefix}dalle
┃ ⎔ ${global.prefix}visión
┃ ⎔ ${global.prefix}chat on o off
┃ ⎔ ${global.prefix}lumi on o off
┃ ⎔ ${global.prefix}luminai
╰━⊰══❖══⊱━╯

\`ᴅᴇsᴄᴀʀɢᴀs - ᴍᴜʟᴛɪᴍᴇᴅɪᴀ📁\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}audio → título  
┃ ⎔ ${global.prefix}play → título  
┃ ⎔ ${global.prefix}play2 → título  
┃ ⎔ ${global.prefix}play3 → titulo
┃ ⎔ ${global.prefix}play4 → titulo
┃ ⎔ ${global.prefix}ytmp3 → link  
┃ ⎔ ${global.prefix}get → responder a un estado.
┃ ⎔ ${global.prefix}ytmp4 → link
┃ ⎔ ${global.prefix}tiktok → link
┃ ⎔ ${global.prefix}tiktokvid → título
┃ ⎔ ${global.prefix}tiktokimg → link
┃ ⎔ ${global.prefix}twitter → link
┃ ⎔ ${global.prefix}imagen → título
┃ ⎔ ${global.prefix}xnxxdl → link
┃ ⎔ ${global.prefix}xvideosdl → link
┃ ⎔ ${global.prefix}fb → link
┃ ⎔ ${global.prefix}pinterest → link
┃ ⎔ ${global.prefix}ig → link  
┃ ⎔ ${global.prefix}spotify → título
┃ ⎔ ${global.prefix}spotifydl → link
┃ ⎔ ${global.prefix}mediafire → link
┃ ⎔ ${global.prefix}apk → título
╰━⊰══❖══⊱━╯

\`ʙᴜsᴄᴀᴅᴏʀᴇs🔎\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}pixai → titulo
┃ ⎔ ${global.prefix}Tiktoksearch → título
┃ ⎔ ${global.prefix}Yts → título
┃ ⎔ ${global.prefix}tiktokstalk → usuario
╰━⊰══❖══⊱━╯

\`ᴄᴏɴᴠᴇʀᴛɪᴅᴏʀᴇs🕹️\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}tomp3  
┃ ⎔ ${global.prefix}tts  
┃ ⎔ ${global.prefix}tovideo
┃ ⎔ ${global.prefix}toimg
┃ ⎔ ${global.prefix}gifvideo → responde a un video.
┃ ⎔ ${global.prefix}ff
┃ ⎔ ${global.prefix}ff2
╰━⊰══❖══⊱━╯

\`sᴛɪᴄᴋᴇʀs - ғғᴘᴇɢ🧩\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}sticker → título
┃ ⎔ ${global.prefix}qc → título
┃ ⎔ ${global.prefix}wm → título
┃ ⎔ ${global.prefix}take → título
┃ ⎔ ${global.prefix}newpack
┃ ⎔ ${global.prefix}addsticker
┃ ⎔ ${global.prefix}listpacks
┃ ⎔ ${global.prefix}sendpack
┃ ⎔ ${global.prefix}bratvid → título
╰━⊰══❖══⊱━╯

\`ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs🛠️\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}ver → responder a un mensaje  
┃ ⎔ ${global.prefix}tourl → responder a una imagen/video/musica
┃ ⎔ ${global.prefix}whatmusic → Responder a un audio(mp3)/video(mp4)
┃ ⎔ ${global.prefix}perfil 
┃ ⎔ ${global.prefix}get
┃ ⎔ ${global.prefix}xxx
┃ ⎔ ${global.prefix}carga
┃ ⎔ ${global.prefix}addco
┃ ⎔ ${global.prefix}delco
╰━⊰══❖══⊱━╯

\`ᴍɪɴɪ - ᴊᴜᴇɢᴏs🎮\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}verdad  
┃ ⎔ ${global.prefix}reto  
┃ ⎔ ${global.prefix}personalidad  
┃ ⎔ ${global.prefix}ship  
┃ ⎔ ${global.prefix}parejas
╰━⊰══❖══⊱━╯

\`ʙᴏᴛ ᴇɴ ᴅᴇsᴀʀʀᴏʟʟᴏ, ᴘʀᴏɴᴛᴏ sᴇ ᴀɢʀᴇɢᴀʀᴀɴ ᴍᴀs ᴄᴏᴍᴀɴᴅᴏs.\``;

  await conn.sendMessage(chatId, {
    react: { text: "⚡", key: msg.key }
  });

  const formatos = [
    // Formato tipo texto con preview
    async () => conn.sendMessage(chatId, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: user,
          body: textbot,
          thumbnailUrl: red,
          thumbnail: im,
          sourceUrl: red,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: msg }),

    // Formato tipo gif/video
    async () => conn.sendMessage(chatId, {
      video: { url: jpg },
      gifPlayback: true,
      caption: txt,
      contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        externalAdReply: {
          title: user,
          body: textbot,
          thumbnailUrl: red,
          thumbnail: im,
          sourceUrl: red,
          mediaType: 1,
          showAdAttribution: true
        }
      }
    }, { quoted: msg }),

    // Formato tipo anuncio tipo "broadcast"
    async () => conn.sendMessage(chatId, {
      text: txt,
      contextInfo: {
        forwardingScore: 0,
        isForwarded: true,
        businessMessageForwardInfo: {
          businessOwnerJid: '50492280729@s.whatsapp.net'
        },
        externalAdReply: {
          title: user,
          body: textbot,
          thumbnailUrl: red,
          thumbnail: im,
          sourceUrl: red,
          mediaType: 1
        }
      }
    }, { quoted: msg })
  ];

  // Selecciona y ejecuta aleatoriamente uno de los formatos
  const randomFormato = formatos[Math.floor(Math.random() * formatos.length)];
  await randomFormato();
};

handler.command = ['menu', 'm'];
module.exports = handler;
