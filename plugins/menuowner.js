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
let txt = `🔥 \`ᴍᴇɴᴜ ᴘᴀʀᴀ ᴇʟ ᴏᴡɴᴇʀ\`
╭━⊰══❖══⊱━╮
┃ ⎔ ${global.prefix}bc
┃ ⎔ ${global.prefix}rest
┃ ⎔ ${global.prefix}carga
┃ ⎔ ${global.prefix}cargabots
┃ ⎔ ${global.prefix}delsesion
┃ ⎔ ${global.prefix}delsubbots
┃ ⎔ ${global.prefix}deltmp
┃ ⎔ ${global.prefix}modoprivado on/off
┃ ⎔ ${global.prefix}addmascota
┃ ⎔ ${global.prefix}addper
┃ ⎔ ${global.prefix}botfoto
┃ ⎔ ${global.prefix}botname
┃ ⎔ ${global.prefix}git
┃ ⎔ ${global.prefix}dar
┃ ⎔ ${global.prefix}dame
┃ ⎔ ${global.prefix}addlista
┃ ⎔ ${global.prefix}deletelista
┃ ⎔ ${global.prefix}setprefix
┃ ⎔ ${global.prefix}re
┃ ⎔ ${global.prefix}antideletepri on/off
┃ ⎔ ${global.prefix}unre
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

handler.command = ['menuowner'];
module.exports = handler;
