//const pkg = requiere('@whiskeysockets/baileys')
const fs = requiere('fs')
const fetch = requiere('node-fetch')
const axios = requiere('axios')
const moment = requiere('moment-timezone')
const { generateWAMessageFromContent, prepareWAMessageMedia, proto } = pkg

var handler = msg => msg
handler.all = async function (msg) {

global.getBuffer = async function getBuffer(url, options) {
try {
options ? options : {}
var res = await axios({
method: "get",
url,
headers: {
'DNT': 1,
'User-Agent': 'GoogleBot',
'Upgrade-Insecure-Request': 1
},
...options,
responseType: 'arraybuffer'
})
return res.data
} catch (e) {
console.log(`Error : ${e}`)
}}
  
global.creador = 'Wa.me/50492280729'
global.ofcbot = `${conn.user.jid.split('@')[0]}`
global.asistencia = 'Wa.me/50492280729'
global.namechannel = '🤖⃧►iʑυвöτ◃2.0▹'
global.namechannel2 = 'Zeus Bot🔆Channel-OFC'
global.namegrupo = '🤖⃧►iʑυвöτ◃2.0▹'
global.namecomu = '𓆩ίʑ᭘ɱί-ⲃⲟτ𓆪 & ➲౽໋ⲉⷡυⷪ᥉ࣰ֧ⷮ✰᮫݄݃🪴'
global.listo = '❀ *Aquí tienes ฅ^•ﻌ•^ฅ*'
global.fotoperfil = await conn.profilePictureUrl(m.sender, 'image').catch(_ => 'https://files.catbox.moe/ojqdd0.jpg')

global.canalIdM = ["120363285614743024@newsletter", "120363395205399025@newsletter"]
global.canalNombreM = ["🤖⃧►iʑυвöτ◃2.0▹", "Zeus Bot🔆Channel-OFC"]
global.channelRD = await getRandomChannel()

global.d = new Date(new Date + 3600000)
global.locale = 'es'
global.dia = d.toLocaleDateString(locale, {weekday: 'long'})
global.fecha = d.toLocaleDateString('es', {day: 'numeric', month: 'numeric', year: 'numeric'})
global.mes = d.toLocaleDateString('es', {month: 'long'})
global.año = d.toLocaleDateString('es', {year: 'numeric'})
global.tiempo = d.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})

global.rwait = '🕒'
global.done = '✅'
global.error = '✖️'
global.msm = '⚠︎'

global.emoji = '🍁'
global.emoji2 = '🍁'
global.emoji3 = '🍁'
global.emoji4 = '🍁'
global.emoji5 = '🍁'

global.wait = '❍ Espera un momento, soy lenta...';
global.waitt = '❍ Espera un momento, soy lenta...';
global.waittt = '❍ Espera un momento, soy lenta...';
global.waitttt = '❍ Espera un momento, soy lenta...';

/*var canal = 'https://whatsapp.com/channel/0029VaXHNMZL7UVTeseuqw3H'
var comunidad = 'https://chat.whatsapp.com/HHDvYPActKSDNgMB8bBJ9G'
var ig = 'https://www.instagram.com/edar504__'
var github = 'https://www.instagram.com/edar504__'
let correo = 'izumilitee@gmail.com'*/
let c = 'https://whatsapp.com/channel/0029VaXHNMZL7UVTeseuqw3H'
let g = 'https://chat.whatsapp.com/E7FwA25TmvS2ncJragtbYV'
let i = 'https://www.instagram.com/edar504__'
let t = 'https://www.tiktok.com/@edar_xd'
global.redes = [c, g, i, t].getRandom()

/*let category = "imagen"
const db = './src/database/db.json'
const db_ = JSON.parse(fs.readFileSync(db))
const random = Math.floor(Math.random() * db_.links[category].length)
const randomlink = db_.links[category][random]
const response = await fetch(randomlink)
const rimg = await response.buffer()
global.icons = rimg*/

var ase = new Date(); var hour = ase.getHours(); switch(hour){ case 0: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 1: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 2: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 3: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 4: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 5: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 6: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 7: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌅'; break; case 8: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 9: hour = 'Lɪɴᴅᴀ Mᴀɴ̃ᴀɴᴀ 🌄'; break; case 10: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 11: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 12: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 13: hour = 'Lɪɴᴅᴏ Dɪᴀ 🌤'; break; case 14: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 15: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 16: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 17: hour = 'Lɪɴᴅᴀ Tᴀʀᴅᴇ 🌆'; break; case 18: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 19: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 20: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 21: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 22: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break; case 23: hour = 'Lɪɴᴅᴀ Nᴏᴄʜᴇ 🌃'; break;}
global.saludo = hour;

global.nombre = msg.pushName || 'Anónimo'
global.taguser = '@' + msg.sender.split("@s.whatsapp.net")
var more = String.fromCharCode(8206)
global.readMore = more.repeat(850)

/*global.packsticker = `${nombre}`;
global.packsticker2 = `${wm}`*/
  
/*global.fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `6285600793871-1614953337@g.us` } : {}) }, message: { 'contactMessage': { 'displayName': `${nombre}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${nombre},;;;\nFN:${nombre},\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': null, thumbnail: null,sendEphemeral: true}}}*/

/*global.fake = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channelRD.id, newsletterName: channelRD.name, serverMessageId: -1 }
}}, { quoted: m }*/

/*global.icono = [ 
'https://files.catbox.moe/ztexr8.jpg',
'https://files.catbox.moe/fd7x3t.jpg',
'https://files.catbox.moe/nsfx7f.jpg',
'https://files.catbox.moe/p3wdxz.jpg',
'https://files.catbox.moe/cbagtg.jpg',
'https://files.catbox.moe/ojqdd0.jpg',
'https://files.catbox.moe/9tkqgt.jpg',
'https://files.catbox.moe/3s7htp.jpg',
'https://files.catbox.moe/kkcj69.jpg',
'https://files.catbox.moe/mkjnzl.jpg',
'https://files.catbox.moe/mkjnzl.jpg',
'https://files.catbox.moe/zxwp9c.jpg',
'https://files.catbox.moe/p3fssk.jpg',
'https://files.catbox.moe/u5bspe.jpg',
'https://files.catbox.moe/wf4bb1.jpg',
'https://files.catbox.moe/f28poz.jpg',
'https://files.catbox.moe/dpx2s1.jpg',
'https://files.catbox.moe/wg1vbo.jpg',
'https://files.catbox.moe/grk81s.jpg'].getRandom()

const thumbnail = await (await fetch(icono)).buffer()*/
const red = await global.getRandomRed();
console.log(red);
  const im = await global.getRandomIcon();
global.rcanal = { contextInfo: { isForwarded: true, forwardedNewsletterMessageInfo: { newsletterJid: channel, serverMessageId: 100, newsletterName: wm, }, externalAdReply: { showAdAttribution: true, title: wm, body: textbot, mediaUrl: null, description: null, previewType: "PHOTO", thumbnailUrl: red, sourceUrl: red, thumbnail: im, mediaType: 1, renderLargerThumbnail: false }, }, }}


module.exports = handler;

/*function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
  }

async function getRandomChannel() {
let randomIndex = Math.floor(Math.random() * canalIdM.length)
let id = canalIdM[randomIndex]
let name = canalNombreM[randomIndex]
return { id, name }
}*/
