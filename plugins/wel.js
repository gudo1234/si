const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");

const handler = async (msg, { conn, update, activos, metadata, }) => {
  const chatId = msg.key.remoteJid;
  const welcomeActivo = activos.welcome?.[update.id];
  const despedidasActivo = activos.despedidas?.[update.id];

  if (!welcomeActivo && !despedidasActivo) return;

  const welcomePath = "./welcome.json";
  let customWelcomes = {};
  if (fs.existsSync(welcomePath)) {
    customWelcomes = JSON.parse(fs.readFileSync(welcomePath, "utf-8"));
  }

  const red = await global.getRandomRed();
  console.log(red);
  const im = await global.getRandomIcon();
  const option = Math.random();

  if (update.action === "add" && welcomeActivo) {
    for (const participant of update.participants) {
      const mention = `@${participant.split("@")[0]}`;
      const customMessage = customWelcomes[update.id];

      // Obtener foto de perfil (o grupo si falla)
      let profilePicUrl;
      try {
        profilePicUrl = await sock.profilePictureUrl(participant, "image");
      } catch (err) {
        try {
          profilePicUrl = await sock.profilePictureUrl(update.id, "image");
        } catch {
          profilePicUrl = im;
        }
      }

      if (customMessage) {
        // Enviar mensaje personalizado
        await conn.sendMessage(chatId, {
          text: `${e} ¡Hola! ${mention}\n\n${customMessage}`,
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
              thumbnail: im,
              sourceUrl: red
            }
          }
        }, { quoted: null });

      } else {
        // Elegir mensaje aleatorio
        if (option < 0.33) {
          await conn.sendMessage(chatId, {
            text: `°   /)🎩/)
(｡•ㅅ•｡) *𖹭︩︪𝚆꯭᪶۫۫͝𝙴꯭᪶͡𝙻᪶۫۫͝𝙲꯭᪶֟፟፝͡𝙾᪶۫۫͝𝙼꯭᪶͡𝙴᪶𖹭︩︪*
╭∪─∪─────────❤︎₊᪲
¡Hola!🍷 *${mention}* buenos días/tardes/noches.\n🎉¡Bienvenido a *${metadata.subject}*!\n\n> 🐢Disfruta del grupo, diviértete, no olvides en leer las reglas...
╰────────────❤︎₊᪲`,
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
                thumbnail: im,
                sourceUrl: red
              }
            }
          }, { quoted: null });
        }
      }
    }
  } else if (update.action === "remove" && despedidasActivo) {
    for (const participant of update.participants) {
      const mention = `@${participant.split("@")[0]}`;
      if (option < 0.5) {
        await conn.sendMessage(chatId, {
          text: `${e} adiós ${mention}`,
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
              thumbnail: im,
              sourceUrl: red
            }
          }
        }, { quoted: null });
      }
    }
  }
};

handler.command = ['wel'];

module.exports = handler;
