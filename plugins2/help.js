const { getDevice } = require("@whiskeysockets/baileys");
const PhoneNumber = require("awesome-phonenumber");
const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const path = require("path");

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
    if (paisdata) mundo = `${paisdata.name} ${paisdata.emoji}\n│ 🗓️ *Fecha:* ${paisdata.date}\n│ 🕒 *Hora local:* ${paisdata.time12}`;
  } catch (e) {
    console.error('Error consultando país:', e.message);
  }
  const rawID = conn.user?.id || "";
  const subbotID = rawID.split(":")[0] + "@s.whatsapp.net";

  const prefixPath = path.resolve("prefixes.json");
  let prefixes = {};
  if (fs.existsSync(prefixPath)) {
    prefixes = JSON.parse(fs.readFileSync(prefixPath, "utf-8"));
  }
  const usedPrefix = prefixes[subbotID] || ".";
  const userId = msg.key.participant || msg.key.remoteJid;

  // Reacción normal (no cambia)
  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "📜", key: msg.key }
  });

  const txt = `${e} ¡Hola! *🥀Buenos días🌅tardes🌇noches...*\n\n🤖 \`izuBot:\` Es un sistema automático que responde a comandos para realizar ciertas acciones dentro del \`Chat\` como las descargas de videos de diferentes plataformas y búsquedas en la \`Web\`.

━━━━━━━━━━━━━
\`ᴄᴏɴᴛᴇxᴛ-ɪɴғᴏ☔\`
┌────────────
│ 🚩 *Nombre:* ${user}
│ 🌎 *País:* ${mundo}
│ ⚡ *Conexión:* Jadibot
└────────────

⟢ ${usedPrefix}serbot / qr
⟢ ${usedPrefix}code / codigo 
⟢ ${usedPrefix}sercode / codigo

〔 AI & Respuestas 〕
⟢ ${usedPrefix}chatgpt
⟢ ${usedPrefix}geminis

〔 Descargas 〕
⟢ ${usedPrefix}play
⟢ ${usedPrefix}play2
⟢ ${usedPrefix}play3
⟢ ${usedPrefix}play4
⟢ ${usedPrefix}ytmp3 
⟢ ${usedPrefix}ytmp4
⟢ ${usedPrefix}apk
⟢ ${usedPrefix}instagram / ${usedPrefix}ig
⟢ ${usedPrefix}tiktok / ${usedPrefix}tt
⟢ ${usedPrefix}tiktokvid
⟢ ${usedPrefix}facebook / ${usedPrefix}fb
⟢ ${usedPrefix}xnxxdl
⟢ ${usedPrefix}xvideosdl
⟢ ${usedPrefix}porno

〔 Stickers & Multimedia 〕
⟢ ${usedPrefix}s
⟢ ${usedPrefix}ver
⟢ ${usedPrefix}toaudio 
⟢ ${usedPrefix}hd
⟢ ${usedPrefix}toimg
⟢ ${usedPrefix}whatmusic
⟢ ${usedPrefix}tts
⟢ ${usedPrefix}perfil

〔 Grupos 〕
⟢ ${usedPrefix}abrirgrupo
⟢ ${usedPrefix}cerrargrupo
⟢ ${usedPrefix}infogrupo
⟢ ${usedPrefix}kick
⟢ ${usedPrefix}modoadmins on o off
⟢ ${usedPrefix}antilink on o off
⟢ ${usedPrefix}welcome on o off
⟢ ${usedPrefix}tag
⟢ ${usedPrefix}tagall / ${usedPrefix}invocar / ${usedPrefix}todos
⟢ ${usedPrefix}infogrupo
⟢ ${usedPrefix}damelink

〔 Comandos De Juegos 〕
⟢ ${usedPrefix}verdad
⟢ ${usedPrefix}reto
⟢ ${usedPrefix}memes o meme

〔 Configuración & Dueño 〕

▣ ${usedPrefix}setprefix ↷
  Cambiar prefijo del subbot
▣ ${usedPrefix}creador ↷
  Contacto del creador
▣ ${usedPrefix}get ↷
  Descargar estados
▣ ${usedPrefix}addgrupo ↷
  Autorizar grupo pa que lo usen.
▣ ${usedPrefix}addlista ↷
  Autorizar usuario privado pa lo usen.
▣ ${usedPrefix}dellista ↷
  Quitar usuario autorizado pa que o lo usen.
▣ ${usedPrefix}delgrupo ↷
  Eliminar grupo autorizado pa que no lo usen.
▣ ${usedPrefix}pong ↷
  Medir latencia del bot`;

  await conn.sendMessage(chatId, {
    react: { text: "⚡", key: msg.key }
  });

  const formatos = [
    // Formato tipo texto con preview
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

    // Formato tipo gif/video
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

    // Formato tipo anuncio tipo "broadcast"
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

  // Selecciona y ejecuta aleatoriamente uno de los formatos
  const randomFormato = formatos[Math.floor(Math.random() * formatos.length)];
  await randomFormato();
};

handler.command = ['menu', 'help', 'ayuda', 'comandos'];
module.exports = handler;
