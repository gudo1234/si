const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
let txt = `╭──────────────╮  
│ ✦ 𝙈𝙀𝙉𝙐✦ │  
╰──────────────╯
⎔ 𝗣𝗿𝗲𝗳𝗶𝗷𝗼 𝗔𝗰𝘁𝘂𝗮𝗹: 『${global.prefix}』  
⎔ 𝗨𝘀𝗮 『${global.prefix}』 𝗮𝗻𝘁𝗲𝘀 𝗱𝗲 𝗰𝗮𝗱𝗮 𝗰𝗼𝗺𝗮𝗻𝗱𝗼.  

⎔ ${global.prefix}serbot / ${global.prefix}jadibot
⎔ ${global.prefix}sercode / ${global.prefix}code
⎔ ${global.prefix}delbots
° mas comandos en el menu de subbots...

╭──────────────╮  
│ ✦ 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 ✦ │  
╰──────────────╯

⎔ ${global.prefix}speedtest  
⎔ ${global.prefix}ping  
⎔ ${global.prefix}creador    

╭──────────────╮  
│ ✦ 𝙈𝙀𝙉𝙐𝙎 𝘿𝙄𝙎𝙋𝙊𝙉𝙄𝘽𝙇𝙀𝙎 ✦ │  
╰──────────────╯  
⎔ ${global.prefix}allmenu  
⎔ ${global.prefix}menugrupo  
⎔ ${global.prefix}menuaudio  
⎔ ${global.prefix}menurpg  
⎔ ${global.prefix}info  
⎔ ${global.prefix}menuowner  

╭──────────────╮  
│ ✦ 𝙄𝘼 - 𝘾𝙃𝘼𝙏 𝘽𝙊𝙏 ✦ │  
╰──────────────╯  
⎔ ${global.prefix}gemini  
⎔ ${global.prefix}chatgpt
⎔ ${global.prefix}dalle
⎔ ${global.prefix}visión 
⎔ ${global.prefix}simi
⎔ ${global.prefix}visión2
⎔ ${global.prefix}chat on o off
⎔ ${global.prefix}lumi on o off
⎔ ${global.prefix}luminai

╭──────────────╮  
│ ✦ 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼 ✦ │  
╰──────────────╯  
⎔ ${global.prefix}play → título  
⎔ ${global.prefix}play1 → título  
⎔ ${global.prefix}play2 → título  
⎔ ${global.prefix}play3 spotify → titulo
⎔ ${global.prefix}play5 → titulo
⎔ ${global.prefix}play6 → titulo
⎔ ${global.prefix}ytmp3 → link  
⎔ ${global.prefix}ytmp35 → link  
⎔ ${global.prefix}get → responder a un estado.
⎔ ${global.prefix}ytmp4 → link  
⎔ ${global.prefix}ytmp45 → link  
⎔ ${global.prefix}tiktok → link  
⎔ ${global.prefix}fb → link  
⎔ ${global.prefix}ig → link  
⎔ ${global.prefix}spotify → link
⎔ ${global.prefix}mediafire → link
⎔ ${global.prefix}apk → título

╭──────────────╮  
│ ✦ 𝘽𝙐𝙎𝘾𝘼𝘿𝙊𝙍𝙀𝙎  ✦ │  
╰──────────────╯  

⎔ ${global.prefix}pixai → titulo
⎔ ${global.prefix}Tiktoksearch → título
⎔ ${global.prefix}Yts → título
⎔ ${global.prefix}tiktokstalk → usuario

╭──────────────╮  
│ ✦ 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝘿𝙊𝙍𝙀𝙎 ✦ │  
╰──────────────╯ 
 
⎔ ${global.prefix}tomp3  
⎔ ${global.prefix}tts  
⎔ ${global.prefix}tovideo
⎔ ${global.prefix}toimg
⎔ ${global.prefix}gifvideo → responde a un video.
⎔ ${global.prefix}ff
⎔ ${global.prefix}ff2

╭──────────────╮  
│ ✦ 𝙎𝙏𝙄𝘾𝙆𝙀𝙍𝙎 ✦ │  
╰──────────────╯  

⎔ ${global.prefix}s
⎔ ${global.prefix}newpack
⎔ ${global.prefix}addsticker
⎔ ${global.prefix}listpacks
⎔ ${global.prefix}sendpack

╭──────────────╮  
│ ✦ 𝙃𝙀𝙍𝙍𝘼𝙈𝙄𝙀𝙉𝙏𝘼𝙎 ✦ │  
╰──────────────╯  

⎔ ${global.prefix}ver → responder a un mensaje  
⎔ ${global.prefix}tourl → responder a una imagen/video/musica
⎔ ${global.prefix}whatmusic → Responder a un audio(mp3)/video(mp4)
⎔ ${global.prefix}perfil 
⎔ ${global.prefix}get
⎔ ${global.prefix}xxx
⎔ ${global.prefix}carga
⎔ ${global.prefix}addco
⎔ ${global.prefix}delco

╭──────────────╮  
│ ✦ 𝙈𝙄𝙉𝙄 𝙅𝙐𝙀𝙂𝙊𝙎 ✦ │  
╰──────────────╯  
⎔ ${global.prefix}verdad  
⎔ ${global.prefix}reto  
⎔ ${global.prefix}personalidad  
⎔ ${global.prefix}ship  
⎔ ${global.prefix}parejas  

╭─────────────────╮  
> ✦ BOT EN DESARROLLO ✦
╰─────────────────╯`
  const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
if (im) {
  await conn.sendMessage(chatId, {
            react: { text: "⚡", key: msg.key} 
        });
  await conn.sendMessage(chatId, {
    text: txt, 
    contextInfo: {
      mentionedJid: [],
      groupMentions: [],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363285614743024@newsletter',
        newsletterName: wm,
        serverMessageId: 0
      },
      businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
      forwardingScore: 0,
      externalAdReply: {
        title: 'hola',
        body: 'hola mosha',
        thumbnailUrl: red,
        thumbnail: im,
        sourceUrl: red
      }
    }
  }, { quoted: msg })};

};

handler.command = ['menu'];

module.exports = handler;
