/*const handler = async (msg, { conn }) => {
await conn.sendMessage2(msg.key.remoteJid, {
      text: `zo🧀`
    }, msg);
  }
handler.command = ['que'];
module.exports = handler;*/

const handler = async (msg, { conn }) => {
  const texto = msg.message?.conversation || msg.message?.extendedTextMessage?.text;
  if (!texto) return;

  if (texto.toLowerCase() === 'que') {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: 'zo🧀'
    }, msg);
  }
};

module.exports = handler;
