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
    if (paisdata) mundo = `${paisdata.name} ${paisdata.emoji}`;
  } catch (e) {
    console.error('Error consultando país:', e.message);
  }

  const txt = `${mundo}`;

  await conn.sendMessage(chatId, {
    react: { text: "⚡", key: msg.key }
  });

  const formatos = [
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

  const randomFormato = formatos[Math.floor(Math.random() * formatos.length)];
  await randomFormato();
};

handler.command = ['test'];
module.exports = handler;
