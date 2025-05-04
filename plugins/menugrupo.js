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
let txt = `> 🛠 ᴄᴏɴғɪɢᴜʀᴀᴄɪóɴ
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}setinfo
┃ ⎔ ${global.prefix}infogrupo
┃ ⎔ ${global.prefix}setname
┃ ⎔ ${global.prefix}delwelcome
┃ ⎔ ${global.prefix}setwelcome
┃ ⎔ ${global.prefix}antiporno on/off
┃ ⎔ ${global.prefix}antidelete on/off
┃ ⎔ ${global.prefix}setfoto
┃ ⎔ ${global.prefix}welcome on/off
┃ ⎔ ${global.prefix}despedidas on/off
╰━⊰══❖══⊱━╯

> 🔱 ᴀᴅᴍɪɴɪsᴛʀᴀᴄɪóɴ
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}daradmins
┃ ⎔ ${global.prefix}quitaradmins
┃ ⎔ ${global.prefix}tag
┃ ⎔ ${global.prefix}tagall
┃ ⎔ ${global.prefix}modoadmins on/off
┃ ⎔ ${global.prefix}invocar
┃ ⎔ ${global.prefix}todos
┃ ⎔ ${global.prefix}damelink
┃ ⎔ ${global.prefix}abrirgrupo
┃ ⎔ ${global.prefix}cerrargrupo
╰━⊰══❖══⊱━╯

> 🛡 sᴇɢᴜʀɪᴅᴀᴅ
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}antilink on/off
┃ ⎔ ${global.prefix}antiarabe on/off
┃ ⎔ ${global.prefix}antidelete on/off
┃ ⎔ ${global.prefix}kick
┃ ⎔ ${global.prefix}add
╰━⊰══❖══⊱━╯`
await conn.sendMessage(chatId, {
            react: { text: "🛠️", key: msg.key} 
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

handler.command = ['menugrupo'];
module.exports = handler;
