const hispamemes = require("hispamemes");

const handler = async (msg, { conn }) => {
  try {
    const meme = hispamemes.meme();

    // 🔄 Reacción antes de enviar el meme
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "😆", key: msg.key }
    });

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: meme },
      caption: `${e} *¡Aquí tienes un meme random!*\n> Espero que esta mierda te cause gracia porque yo asi quede "🫩"`
    }, msg );

  } catch (e) {
    console.error("❌ Error en el comando .memes:", e);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Hubo un error al obtener el meme. Inténtalo de nuevo.*`
    }, msg );
  }
};

handler.command = ['meme', 'memes'];
module.exports = handler;
