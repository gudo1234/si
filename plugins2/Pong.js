const handler = async (msg, { conn }) => {
  const start = Date.now();

  const respuesta = await conn.sendMessage2(msg.key.remoteJid, {
    text: `🟢 *Estado actuvo*`
  }, msg );

  const end = Date.now();
  const ping = end - start;

  await conn.sendMessage(msg.key.remoteJid, {
    text: `✅ *Ping:* ${ping} ms`,
    quoted: respuesta
  });
};

handler.command = ['pong'];
module.exports = handler;
