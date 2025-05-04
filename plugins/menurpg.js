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
let txt = `✦ \`ʙɪᴇɴᴠᴇɴɪᴅᴏ ᴀʟ ᴍᴇɴᴜ ᴅᴇ ʀᴘɢ\` ✦  
━━━━━━━━━━━━━
➤ ᴘᴀʀᴀ ᴇᴍᴘᴇᴢᴀʀ, ᴜsᴀ:  
.rpg <nombre> <edad>  
Así te registras  
━━━━━━━━━━━━━

👤 \`ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ᴜsᴜᴀʀɪᴏ\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}nivel ⎔ ${global.prefix}picar
┃ ⎔ ${global.prefix}minar ⎔ ${global.prefix}minar2
┃ ⎔ ${global.prefix}work ⎔ ${global.prefix}crime
┃ ⎔ ${global.prefix}robar ⎔ ${global.prefix}cofre
┃ ⎔ ${global.prefix}claim ⎔ ${global.prefix}batallauser
┃ ⎔ ${global.prefix}hospital ⎔ ${global.prefix}hosp
╰━⊰══❖══⊱━╯

🧩 \`ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ᴘᴇʀsᴏɴᴀᴊᴇs\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}luchar ⎔ ${global.prefix}poder
┃ ⎔ ${global.prefix}volar ⎔ ${global.prefix}otromundo
┃ ⎔ ${global.prefix}otrouniverso ⎔ ${global.prefix}mododios
┃ ⎔ ${global.prefix}mododiablo ⎔ ${global.prefix}podermaximo
┃ ⎔ ${global.prefix}enemigos ⎔ ${global.prefix}nivelper
┃ ⎔ ${global.prefix}per ⎔ ${global.prefix}bolasdeldragon
┃ ⎔ ${global.prefix}vender ⎔ ${global.prefix}quitarventa
┃ ⎔ ${global.prefix}batallaanime ⎔ ${global.prefix}comprar
┃ ⎔ ${global.prefix}tiendaper ⎔ ${global.prefix}alaventa
┃ ⎔ ${global.prefix}verper
╰━⊰══❖══⊱━╯

🐾 \`ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ᴍᴀsᴄᴏᴛᴀs\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}daragua ⎔ ${global.prefix}darcariño
┃ ⎔ ${global.prefix}darcomida ⎔ ${global.prefix}presumir
┃ ⎔ ${global.prefix}cazar ⎔ ${global.prefix}entrenar
┃ ⎔ ${global.prefix}pasear ⎔ ${global.prefix}supermascota
┃ ⎔ ${global.prefix}mascota ⎔ ${global.prefix}curar
┃ ⎔ ${global.prefix}nivelmascota ⎔ ${global.prefix}batallamascota
┃ ⎔ ${global.prefix}compra ⎔ ${global.prefix}tiendamascotas
┃ ⎔ ${global.prefix}vermascotas
╰━⊰══❖══⊱━╯

🤳🏻 \`ᴏᴛʀᴏs ᴄᴏᴍᴀɴᴅᴏs\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}addmascota ⎔ ${global.prefix}addper
┃ ⎔ ${global.prefix}deleteuser ⎔ ${global.prefix}deleteper
┃ ⎔ ${global.prefix}deletemascota ⎔ ${global.prefix}totalper
┃ ⎔ ${global.prefix}tran ⎔ ${global.prefix}transferir
┃ ⎔ ${global.prefix}dame ⎔ ${global.prefix}dep
┃ ⎔ ${global.prefix}bal ⎔ ${global.prefix}saldo
┃ ⎔ ${global.prefix}retirar ⎔ ${global.prefix}depositar
┃ ⎔ ${global.prefix}retirar ⎔ ${global.prefix}delrpg
╰━⊰══❖══⊱━╯

🕹️ \`ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ᴛᴏᴘ\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}topuser
┃ ⎔ ${global.prefix}topmascotas
┃ ⎔ ${global.prefix}topper
╰━⊰══❖══⊱━╯`
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

handler.command = ['menurpg'];
module.exports = handler;
