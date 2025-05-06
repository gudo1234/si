/*const handler = async (msg, { conn }) => {
await conn.sendMessage2(msg.key.remoteJid, {
      text: `zo🧀`
    }, msg);
  }
handler.command = ['que'];
module.exports = handler;*/

const handler = async (msg, { conn }) => {
  const texto = msg.message?.conversation 
    || msg.message?.extendedTextMessage?.text 
    || '';

  if (texto.trim().toLowerCase() === 'que') {
    await conn.sendMessage(msg.key.remoteJid, {
      text: 'zo🧀'
    }, { quoted: msg });
  }
};

// Esto hace que no dependa del prefijo ni de handler.command
handler.customPrefix = true;
handler.command = /^$/; // no hace match con nada directamente

module.exports = handler;
