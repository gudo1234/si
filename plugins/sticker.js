const { sticker } = require("../libs/sticker.js");
const uploadFile = require("../libs/uploadFile.js");
const uploadImage = require("../libs/uploadImage.js");
const { webp2png } = require("../libs/webp2mp4.js");
const stickersDir = "./stickers";
const stickersFile = "./stickers.json";

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
let metadata = {
            packname: `${msg.pushName}`,
            author: `${wm}`
        };
  let stiker = false
  try {
  	
    let q = msg.quoted ? msg.quoted : msg
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (/webp|image|video/g.test(mime)) {
      if (/video/g.test(mime)) if ((q.msg || q).seconds > 11) return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e}Mínimo 10 segundos`
    }, msg);
      let img = await q.download?.()
      if (!img) return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Responda a un mensaje o video`
    }, msg);
      let out
      try {
        stiker = await sticker(img, false, global.packname, global.author)
      } catch (e) {
        console.error(e)
      } finally {
        if (!stiker) {
          if (/webp/g.test(mime)) out = await webp2png(img)
          else if (/image/g.test(mime)) out = await uploadImage(img)
          else if (/video/g.test(mime)) out = await uploadFile(img)
          if (typeof out !== 'string') out = await uploadImage(img)
          stiker = await sticker(false, out, global.packname, global.author)
        }
      }
    } else if (args[0]) {
      if (isUrl(args[0])) stiker = await sticker(false, args[0], global.packname, global.author)
      else return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} La url no es válida`
    }, msg);
    }
  } catch (e) {
    console.error(e)
    if (!stiker) stiker = e
  } finally {
    //if (stiker) conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
    if (stiker) await conn.sendMessage(msg.key.remoteJid, {
            sticker: { url: stiker }
        }, { quoted: msg });
    else return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Responda a una imagen o video`
    }, msg);
  }
}

handler.command = ['st'];
module.exports = handler;

const isUrl = (text) => {
  return text.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)(jpe?g|gif|png)/, 'gi'))
                                                 }
