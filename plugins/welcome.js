const fs = require('fs');

const handler = async (msg, { conn }) => {
  if (!msg.messageStubType || !msg.isGroup) return;

  const type = msg.messageStubType;
  const participant = (msg.messageStubParameters || [])[0];
  if (!participant) return;

  const welcomeActivo = activos.welcome?.[chatId];
  const despedidasActivo = activos.despedidas?.[chatId];
  if (!welcomeActivo && !despedidasActivo) return;

  const who = participant + '@s.whatsapp.net';
  const userName = (global.db.data.users[who]?.name) || await conn.getName(who);
  const mention = `@${who.split('@')[0]}`;
  const groupMetadata = await conn.groupMetadata(chatId);
  const groupName = groupMetadata.subject;

  const welcomePath = './welcome.json';
  let customWelcomes = {};
  if (fs.existsSync(welcomePath)) {
    customWelcomes = JSON.parse(fs.readFileSync(welcomePath, 'utf-8'));
  }

  const welcomeTexts = [
    "¡Bienvenido(a)! el Bot te recibe con los brazos abiertos.",
    "¡Hola! el Bot te abraza con alegría.",
    "¡Saludos! el Bot te da la bienvenida para que descubras ideas brillantes.",
    "¡Bienvenido(a) al grupo! Disfruta y comparte.",
    "¡Qué alegría verte! el Bot te recibe con gusto."
  ];

  const farewellTexts = [
    "¡Adiós! el Bot te despide con gratitud.",
    "Hasta pronto, el Bot te desea lo mejor.",
    "¡Chao! Siempre tendrás un lugar aquí.",
    "Nos despedimos con cariño, gracias por todo.",
    "¡Adiós, amigo(a)! Suerte en todo."
  ];

  let profilePicUrl;
  try {
    profilePicUrl = await conn.profilePictureUrl(who, 'image');
  } catch {
    try {
      profilePicUrl = await conn.profilePictureUrl(chatId, 'image');
    } catch {
      profilePicUrl = 'https://files.catbox.moe/mkjnzl.jpg';
    }
  }

  if ((type === 27 || type === 31) && welcomeActivo) {
    const mensaje = customWelcomes[chatId] || welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)];
    await conn.sendMessage(msg.key.remoteJid, {
      image: { url: profilePicUrl },
      caption: `👋 ${mention}\n\n${mensaje}`,
      mentions: [who]
    }, { quoted: null });
  } else if ((type === 28 || type === 32) && despedidasActivo) {
    const mensaje = farewellTexts[Math.floor(Math.random() * farewellTexts.length)];
    await conn.sendMessage(msg.key.remoteJid, {
      text: `👋 ${mention}\n\n${mensaje}`,
      mentions: [who]
    }, { quoted: null });
  }
};

handler.customPrefix = /.^/;
handler.command = new RegExp();
handler.group = true;

module.exports = handler;
