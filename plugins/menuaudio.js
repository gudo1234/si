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
let txt = `━━━━━━━━━━━━━
📂 *MENÚ DE MULTIMEDIA*  
🔑 *Palabras Clave Guardadas*  
━━━━━━━━━━━━━

📌 *¿Cómo recuperar un archivo guardado?*  
Usa el comando:  
➡️ _.g palabra_clave_  
( *o puedes solo escribirlas tambien y bot las envia tambien* ) 

📂 *Lista de palabras clave guardadas:*  
━━━━━━━━━━━━━
*1.* hell s paradise
*2.* jujutsu
*3.* black clover
*4.* attack on titan
*5.* yemil mi pistola
*6.* yemil los botines
*7.* yemil eiby
*8.* azura 1
*9.* azura 2
*10.* azura 3
*11.* azura 4
*12.* azura 6
*13.* azura 7
*14.* azura 8
*15.* azura 9
*16.* azura 10
━━━━━━━━━━━━━

📥 *Otros Comandos de Multimedia*  

.guar → Guarda archivos con una clave.  
.g → Recupera archivos guardados.  
.kill → Elimina un archivo guardado.`
await conn.sendMessage(chatId, {
            react: { text: "🗣️", key: msg.key} 
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

handler.command = ['menuaudio'];
module.exports = handler;
