const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `zo🧀`
    }, msg);
  }
  }
handler.command = ['ppcouple', 'par'];
//handler.customPrefix = /^(Audio|audio)/
//handler.command = new RegExp
module.exports = handler;
