const handler = async (msg, { conn }) => {
await conn.sendMessage2(msg.key.remoteJid, {
      text: `zo🧀`
    }, msg);
  }
//handler.command = ['que'];
handler.customPrefix = /^(que)/
handler.command = new RegExp
module.exports = handler;
