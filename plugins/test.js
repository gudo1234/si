const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const moment = require("moment-timezone");

// Cargar country.json desde misma carpeta
const countries = JSON.parse(fs.readFileSync(__dirname + '/country.json', 'utf-8'));

// Mapas adicionales de zonas horarias y capitales
const zonasHorarias = {
  "AF": "Asia/Kabul",
  "MX": "America/Mexico_City",
  "AR": "America/Argentina/Buenos_Aires",
  "CO": "America/Bogota",
  "VE": "America/Caracas",
  "CL": "America/Santiago",
  "BR": "America/Sao_Paulo",
  "US": "America/New_York",
  "ES": "Europe/Madrid"
};

const capitales = {
  "AF": "Kabul",
  "MX": "Ciudad de México",
  "AR": "Buenos Aires",
  "CO": "Bogotá",
  "VE": "Caracas",
  "CL": "Santiago",
  "BR": "Brasilia",
  "US": "Washington D.C.",
  "ES": "Madrid"
};

const handler = async (msg, { conn }) => {
  const chatId = msg.key.remoteJid;
  const user = msg.pushName || 'Usuario';
  const sender = msg.key.participant || msg.key.remoteJid;
  const phoneNumber = "+" + sender.split("@")[0];

  // Inicializar variables
  let nombrePais = "Desconocido";
  let codigoPais = "";
  let bandera = "🏳️";
  let ciudad = "No definida";
  let hora = "No disponible";
  let imagen = null;
  let slug = "";

  // Buscar país por prefijo telefónico
  const pais = countries.find(c =>
    c.dialCodes.some(code => phoneNumber.startsWith(code))
  );

  if (pais) {
    nombrePais = pais.name;
    codigoPais = pais.code;
    bandera = pais.emoji || "🏳️";
    imagen = pais.image || null;
    slug = pais.slug;

    const zona = zonasHorarias[codigoPais] || "UTC";
    hora = moment().tz(zona).format("HH:mm:ss");

    ciudad = capitales[codigoPais] || "Ciudad no definida";
  }

  const videoUrls = [
    'https://files.catbox.moe/rdyj5q.mp4',
    'https://files.catbox.moe/693ws4.mp4'
  ];
  const red = await global.getRandomRed();
  const im = await global.getRandomIcon();
  const jpg = videoUrls[Math.floor(Math.random() * videoUrls.length)];

  const txt = `*País:* ${nombrePais} ${bandera}\n*Ciudad principal:* ${ciudad}\n*Hora local:* ${hora}`;

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
          thumbnailUrl: imagen || red,
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
          thumbnailUrl: imagen || red,
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
          thumbnailUrl: imagen || red,
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
