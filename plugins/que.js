const handler = async (msg, { conn }) => {
  await conn.sendMessage(msg.key.remoteJid, {
    text: 'zo🧀'
  }, { quoted: msg });
};

handler.customPrefix = false; // false si usas un prefijo como "." o "!"
handler.command = /^zo$/i; // El comando será "zo", sin prefijo si customPrefix = true
module.exports = handler;
