const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  
  /*global.icono = [ 
    'https://files.catbox.moe/ztexr8.jpg',
    'https://files.catbox.moe/fd7x3t.jpg',
    'https://files.catbox.moe/nsfx7f.jpg',
    'https://files.catbox.moe/p3wdxz.jpg',
    'https://files.catbox.moe/cbagtg.jpg',
    'https://files.catbox.moe/ojqdd0.jpg',
    'https://files.catbox.moe/9tkqgt.jpg',
    'https://files.catbox.moe/3s7htp.jpg',
    'https://files.catbox.moe/kkcj69.jpg',
    'https://files.catbox.moe/mkjnzl.jpg',
    'https://files.catbox.moe/zxwp9c.jpg',
    'https://files.catbox.moe/p3fssk.jpg',
    'https://files.catbox.moe/u5bspe.jpg',
    'https://files.catbox.moe/wf4bb1.jpg',
    'https://files.catbox.moe/f28poz.jpg',
    'https://files.catbox.moe/dpx2s1.jpg',
    'https://files.catbox.moe/wg1vbo.jpg',
    'https://files.catbox.moe/grk81s.jpg'
  ];
  
  // Elegimos una URL aleatoria
  const randomIcon = icono[Math.floor(Math.random() * icono.length)];
  
  // Descargamos esa imagen
  const thumbnail = await (await fetch(randomIcon)).buffer();*/
  
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
      forwardingScore: 0,
      externalAdReply: {
        title: 'hola',
        body: 'hola mosha',
        thumbnailUrl: 'https://www.instagram.com/edar504__', // Aquí ahora sí una imagen válida
        thumbnail: thumbnail,
        sourceUrl: 'https://www.instagram.com/edar504__' // Esto está bien aunque no sea imagen directa
      }
    }
  }, { quoted: msg });
};

handler.command = ['hola'];
handler.reaction = '🔄';

module.exports = handler;
