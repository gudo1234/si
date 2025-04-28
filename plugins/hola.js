const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const { isOwner, setPrefix, allowedPrefixes } = require("./config");
const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const icono = pickRandom(global.icono); 
  const thumbnail = await (await fetch(icono)).buffer();
  await conn.sendMessage(chatId, {
        text: 'test', 
        contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363285614743024@newsletter',
                newsletterName: '🤖⃧►iʑυвöτ◃2.0▹',
                serverMessageId: 0
            },
            businessMessageForwardInfo: { businessOwnerJid: '50492280729@s.whatsapp.net' },
            forwardingScore: false,
            externalAdReply: {
                title: 'hola',
                body: 'hola mosha',
                thumbnailUrl: 'https://www.instagram.com/edar504__',
                thumbnail,
                sourceUrl: 'https://www.instagram.com/edar504__'
            }
        }
    }, { quoted: msg });
/*await conn.sendMessage2(msg.key.remoteJid,
  {
    image: { url: 'https://files.catbox.moe/ztexr8.jpg' }, 
    caption: `${msg.pushName}`
  },
  msg
)*/
}
handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
