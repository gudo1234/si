const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn, update, activos }) => {
  const chatId = update.id;
  const welcomeActivo = activos.welcome?.[chatId];
  const despedidasActivo = activos.despedidas?.[chatId];

  if (!welcomeActivo && !despedidasActivo) return;

  const welcomePath = "./welcome.json";
  let customWelcomes = {};
  if (fs.existsSync(welcomePath)) {
    customWelcomes = JSON.parse(fs.readFileSync(welcomePath, "utf-8"));
  }

  const red = await global.getRandomRed();
  console.log("[Red Random]", red);

  for (const participant of update.participants) {
    const mention = `@${participant.split("@")[0]}`;

    let profilePicUrl;
    try {
      profilePicUrl = await sock.profilePictureUrl(participant, "image");
    } catch {
      try {
        profilePicUrl = await sock.profilePictureUrl(chatId, "image");
      } catch {
        profilePicUrl = 'https://files.catbox.moe/ztexr8.jpg'; // Imagen por defecto si falla todo
      }
    }

    if (update.action === "add" && welcomeActivo) {
      const customMessage = customWelcomes[chatId];

      await conn.sendMessage(chatId, {
        react: { text: "👋", key: msg.key } // Reacción emoji de bienvenida
      });

      await conn.sendMessage(chatId, {
        text: `👋🏻 ¡Bienvenido ${mention}!`,
        contextInfo: {
          mentionedJid: [participant],
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
            title: wm,
            body: 'izuBot te da la bienvenida',
            thumbnailUrl: red,
            thumbnail: profilePicUrl,
            sourceUrl: red
          }
        }
      }, { quoted: null });

    } else if (update.action === "remove" && despedidasActivo) {
      await conn.sendMessage(chatId, {
        text: `👋🏻 Adiós ${mention}`,
        contextInfo: {
          mentionedJid: [participant],
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
            title: wm,
            body: 'izuBot te da la bienvenida',
            thumbnailUrl: red,
            thumbnail: profilePicUrl,
            sourceUrl: red
          }
        }
      }, { quoted: null });
    }
  }
};

handler.command = ['we']; // No comandos, sólo se ejecuta automáticamente

module.exports = handler;
          
