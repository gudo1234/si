const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
const jp = [
  'https://files.catbox.moe/rdyj5q.mp4',
  'https://files.catbox.moe/693ws4.mp4'
];
const jpg = jp[Math.floor(Math.random() * jp.length)];
  let or = ['grupo', 'gif', 'anu'];
  let media = or[Math.floor(Math.random() * 3)]
let txt = `${e} ¡Hola! *🥀Buenos días🌅tardes🌇noches...*\n\n⚡ \`izuBot:\` Es un sistema automático que responde a comandos para realizar ciertas acciones dentro del \`Chat\` como las descargas de videos de diferentes plataformas y búsquedas en la \`Web\`.

> ⁉ ᴊᴀᴅɪʙᴛs-ʙᴏᴛs🤖 
╭━━━━━━═❮◆❯═━━━━━━╮
┃ ⎔ ${global.prefix}serbot / ${global.prefix}jadibot
┃ ⎔ ${global.prefix}sercode / ${global.prefix}code
┃ ⎔ ${global.prefix}delbots
┃ ° mas comandos en el menu de subbots...
╰━━━━━━═❮◆❯═━━━━━━╯

> ⁉ ɪɴғᴏʀᴍᴀᴄɪóɴ 🪐
╭━━━〔✦〕━━━╮
┃ ⎔ ${global.prefix}speedtest  
┃ ⎔ ${global.prefix}ping  
┃ ⎔ ${global.prefix}creador
╰━━━〔✦〕━━━╯

> ⁉ ᴍᴇɴᴜs ᴅɪsᴘᴏɴɪʙʟᴇs📕
╭━⊰═❖═⊱━╮
┃ ⎔ ${global.prefix}allmenu  
┃ ⎔ ${global.prefix}menugrupo  
┃ ⎔ ${global.prefix}menuaudio  
┃ ⎔ ${global.prefix}menurpg  
┃ ⎔ ${global.prefix}info  
┃ ⎔ ${global.prefix}menuowner
╰━⊰═❖═⊱━╯

> ⁉ ɪᴀ ᴄʜᴀᴛ-ʙᴏᴛ🌐
╭─━━━━༺༻━━━━─╮
┃ ⎔ ${global.prefix}gemini  
┃ ⎔ ${global.prefix}chatgpt
┃ ⎔ ${global.prefix}dalle
┃ ⎔ ${global.prefix}visión 
┃ ⎔ ${global.prefix}simi
┃ ⎔ ${global.prefix}visión2
┃ ⎔ ${global.prefix}chat on o off
┃ ⎔ ${global.prefix}lumi on o off
┃ ⎔ ${global.prefix}luminai
╰─━━━━༺༻━━━━─╯

> ⁉ ᴅᴇsᴄᴀʀɢᴀs - ᴍᴜʟᴛɪᴍᴇᴅɪᴀ📁
╭─────๑۞๑─────╮
┃ ⎔ ${global.prefix}play → título  
┃ ⎔ ${global.prefix}play1 → título  
┃ ⎔ ${global.prefix}play2 → título  
┃ ⎔ ${global.prefix}play3 spotify → titulo
┃ ⎔ ${global.prefix}play5 → titulo
┃ ⎔ ${global.prefix}play6 → titulo
┃ ⎔ ${global.prefix}ytmp3 → link  
┃ ⎔ ${global.prefix}ytmp35 → link  
┃ ⎔ ${global.prefix}get → responder a un estado.
┃ ⎔ ${global.prefix}ytmp4 → link  
┃ ⎔ ${global.prefix}ytmp45 → link  
┃ ⎔ ${global.prefix}tiktok → link  
┃ ⎔ ${global.prefix}fb → link  
┃ ⎔ ${global.prefix}ig → link  
┃ ⎔ ${global.prefix}spotify → link
┃ ⎔ ${global.prefix}mediafire → link
┃ ⎔ ${global.prefix}apk → título
╰─────๑۞๑─────╯

> ⁉ ʙᴜsᴄᴀᴅᴏʀᴇs🔎
╭─═[✰]═─╮
┃ ⎔ ${global.prefix}pixai → titulo
┃ ⎔ ${global.prefix}Tiktoksearch → título
┃ ⎔ ${global.prefix}Yts → título
┃ ⎔ ${global.prefix}tiktokstalk → usuario
╰─═[✰]═─╯

> ⁉ ᴄᴏɴᴠᴇʀᴛɪᴅᴏʀᴇs🕹️ 
╭─≪◆≫─╮
┃ ⎔ ${global.prefix}tomp3  
┃ ⎔ ${global.prefix}tts  
┃ ⎔ ${global.prefix}tovideo
┃ ⎔ ${global.prefix}toimg
┃ ⎔ ${global.prefix}gifvideo → responde a un video.
┃ ⎔ ${global.prefix}ff
┃ ⎔ ${global.prefix}ff2
╰─≪◆≫─╯

> ⁉ sᴛɪᴄᴋᴇʀs - ғғᴘᴇɢ🧩
╭━━⊹⊱✿⊰⊹━━╮
┃ ⎔ ${global.prefix}s
┃ ⎔ ${global.prefix}newpack
┃ ⎔ ${global.prefix}addsticker
┃ ⎔ ${global.prefix}listpacks
┃ ⎔ ${global.prefix}sendpack
╰━━⊹⊱✿⊰⊹━━╯

> ⁉ ʜᴇʀʀᴀᴍɪᴇɴᴛᴀs🛠️
╭━━━━━⊰✮⊱━━━━━╮
┃ ⎔ ${global.prefix}ver → responder a un mensaje  
┃ ⎔ ${global.prefix}tourl → responder a una imagen/video/musica
┃ ⎔ ${global.prefix}whatmusic → Responder a un audio(mp3)/video(mp4)
┃ ⎔ ${global.prefix}perfil 
┃ ⎔ ${global.prefix}get
┃ ⎔ ${global.prefix}xxx
┃ ⎔ ${global.prefix}carga
┃ ⎔ ${global.prefix}addco
┃ ⎔ ${global.prefix}delco
╰━━━━━⊰✮⊱━━━━━╯

> ⁉ ᴍɪɴɪ - ᴊᴜᴇɢᴏs🎮
╭━〔★〕━╮
┃ ⎔ ${global.prefix}verdad  
┃ ⎔ ${global.prefix}reto  
┃ ⎔ ${global.prefix}personalidad  
┃ ⎔ ${global.prefix}ship  
┃ ⎔ ${global.prefix}parejas
╰━〔★〕━╯

\`ʙᴏᴛ ᴇɴ ᴅᴇsᴀʀʀᴏʟʟᴏ, ᴘʀᴏɴᴛᴏ sᴇ ᴀɢʀᴇɢᴀʀᴀɴ ᴍᴀs ᴄᴏᴍᴀɴᴅᴏs.\``
await conn.sendMessage(chatId, {
            react: { text: "⚡", key: msg.key} 
        });
  const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
if (im) {
if (media === 'grupo') {
await conn.sendMessage(chatId, {
  text: txt,
  contextInfo: {
    externalAdReply: {
      title: `${msg.pushName}`,
      body: textbot,
      thumbnailUrl: red,
      thumbnail: im,
      sourceUrl: red,
      mediaType: 1,
      renderLargerThumbnail: true
    }
  }
}, { quoted: msg })};
  
  if (media === 'gif') {
await conn.sendMessage(chatId, {
    video: { url: jpg },
    gifPlayback: true,
    caption: txt,
    contextInfo: {
          mentionedJid: [],
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
              newsletterJid: channel,
              newsletterName: wm,
              serverMessageId: -1,
          },
          forwardingScore: false,
          externalAdReply: {
              title: `${msg.pushName}`,
              body: textbot,
              thumbnailUrl: red,
              thumbnail: im,
              sourceUrl: red,
              mediaType: 1,
              showAdAttribution: true,
              //renderLargerThumbnail: true,
          },
      },
  }, { quoted: msg })};

if (media === 'anu') {
  await conn.sendMessage(chatId, {
    text: txt, 
    contextInfo: {
      mentionedJid: [],
      groupMentions: [],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: channel,
        newsletterName: wm,
        serverMessageId: 0
      },
      businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
      forwardingScore: 0,
      externalAdReply: {
        title: `${msg.pushName}`,
        body: textbot,
        thumbnailUrl: red,
        thumbnail: im,
        sourceUrl: red
      }
    }
  }, { quoted: msg })}
  
  };

//arriba
};

handler.command = ['menu', 'm'];

module.exports = handler;
