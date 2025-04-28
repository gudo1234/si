const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const thumbnail = await (await fetch(`https://files.catbox.moe/ztexr8.jpg`)).buffer();
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
                thumbnailUrl: 'https://files.catbox.moe/ztexr8.jpg',
                //thumbnail,
                sourceUrl: 'https://www.instagram.com/edar504__'
            }
        }
    }, { quoted: chatId });*/
await conn.sendMessage2(msg.key.remoteJid,
  {
    image: { url: 'https://files.catbox.moe/ztexr8.jpg' }, 
    caption: `${msg.pushName}`
  },
  msg
)
}
handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
