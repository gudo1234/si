const fs = require("fs");
const { prepareWAMessageMedia } = require("@whiskeysockets/baileys");

const welcomePath = './welcome.json';
let customWelcomes = {};
if (fs.existsSync(welcomePath)) {
  customWelcomes = JSON.parse(fs.readFileSync(welcomePath, 'utf-8'));
}

const welcomeTexts = [
  "¡Bienvenido(a)! el Bot te recibe con los brazos abiertos 🤗✨. ¡Disfruta y comparte!",
  "¡Hola! el Bot te abraza con alegría 🎉🤖. ¡Prepárate para grandes aventuras!",
  "¡Saludos! el Bot te da la bienvenida para que descubras ideas brillantes 🚀🌟.",
  "¡Bienvenido(a) al grupo! el Bot te invita a explorar un mundo de posibilidades 🤩💡.",
  "¡Qué alegría verte! el Bot te recibe y te hace sentir en casa 🏠💖.",
  "¡Hola! Gracias por unirte; el Bot te saluda con entusiasmo 🎊😊.",
  "¡Bienvenido(a)! Cada nuevo miembro es una chispa de inspiración en el Bot 🔥✨.",
  "¡Saludos cordiales! el Bot te envía un abrazo virtual 🤗💙.",
  "¡Bienvenido(a)! Únete a la experiencia el Bot y comparte grandes ideas 🎉🌈.",
  "¡Hola! el Bot te da la bienvenida para vivir experiencias inolvidables 🚀✨!"
];

const farewellTexts = [
  "¡Adiós! el Bot te despide con gratitud y te desea éxitos en tus nuevos caminos 👋💫.",
  "Hasta pronto, desde el Bot te deseamos lo mejor y esperamos verte de nuevo 🌟🙏.",
  "¡Chao! el Bot te despide, pero siempre tendrás un lugar si decides regresar 🤗💔.",
  "Nos despedimos con cariño; gracias por compartir momentos con el Bot 🏠❤️.",
  "¡Adiós, amigo(a)! el Bot te manda un abrazo y te desea mucha suerte 🤝🌟.",
  "Hasta luego, y gracias por haber sido parte de nuestra comunidad 🚀💙.",
  "Chao, que tus futuros proyectos sean tan brillantes como tú 🌟✨. el Bot te recuerda siempre.",
  "¡Nos vemos! el Bot te dice adiós con un corazón lleno de gratitud 🤗❤️.",
  "¡Adiós! Que tu camino esté lleno de éxitos, te lo desea el Bot 🚀🌟."
];

const handler = async (msg, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return true;
  if (![27, 28, 32].includes(m.messageStubType)) return true;

  const chat = global.db.data.chats[m.chat];
  const welcomeActivo = chat?.welcome;
  const despedidasActivo = chat?.despedidas;

  if (!welcomeActivo && !despedidasActivo) return;

  const isWelcome = m.messageStubType === 27;
  const isFarewell = [28, 32].includes(m.messageStubType);
  const who = m.messageStubParameters[0] + '@s.whatsapp.net';
  const mention = `@${m.messageStubParameters[0].split('@')[0]}`;
  const customMessage = customWelcomes[m.chat];
  const mensajeTexto = isWelcome
    ? welcomeTexts[Math.floor(Math.random() * welcomeTexts.length)]
    : farewellTexts[Math.floor(Math.random() * farewellTexts.length)];
  const option = Math.random();

  let profilePicUrl;
  try {
    profilePicUrl = await conn.profilePictureUrl(who, 'image');
  } catch {
    try {
      profilePicUrl = await conn.profilePictureUrl(m.chat, 'image');
    } catch {
      profilePicUrl = 'https://files.catbox.moe/mkjnzl.jpg';
    }
  }

  if ((isWelcome && welcomeActivo) || (isFarewell && despedidasActivo)) {
    if (customMessage) {
      await conn.sendMessage(m.chat, {
        image: { url: profilePicUrl },
        caption: `👋 ${mention}\n\n${customMessage}`,
        mentions: [who]
      });
    } else {
      if (option < 0.33 && isWelcome) {
        await conn.sendMessage(m.chat, {
          image: { url: profilePicUrl },
          caption: `👋 ${mention}\n\n${mensajeTexto}`,
          mentions: [who]
        });
      } else if (option < 0.66 && isWelcome) {
        let groupDesc = '';
        try {
          groupDesc = groupMetadata.desc
            ? `\n\n📜 *Descripción del grupo:*\n${groupMetadata.desc}`
            : '';
        } catch {}
        await conn.sendMessage(m.chat, {
          text: `👋 ${mention}\n\n${mensajeTexto}${groupDesc}`,
          mentions: [who]
        });
      } else {
        await conn.sendMessage(m.chat, {
          text: `👋 ${mention}\n\n${mensajeTexto}`,
          mentions: [who]
        });
      }
    }
  }
}
