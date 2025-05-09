const fetch = require("node-fetch");
const axios = require("axios");
const yts = require("yt-search");

const tempSearchResults = {}

const handler = async (msg, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* Bad Bunny`
    }, msg)
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  })

  try {
    const search = await yts(text)
    const videos = search.videos.slice(0, 20)
    if (!videos.length) {
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: '❌ No se encontraron resultados.'
      }, msg)
    }

    let list = `╭───── • ─────╮
✩ \`Youtube Search\` ✩

🔍 *Consulta:* ${text}
📥 *Resultados:* ${videos.length}
╰───── • ─────╯

📌 *Responde a este mensaje con:*
━━━━━━━━━━━━━
✑ \`a 1\` o \`audio 1\` → Audio
✑ \`v 1\` o \`video 1\` → Video
⁌ \`d 1 a\` o \`documento 1 audio\` → Documento de Audio
⁌ \`d 1 v\` o \`documento 1 video\` → Documento de Video
━━━━━━━━━━━━━`

    for (let i = 0; i < videos.length; i++) {
      const vid = videos[i]
      list += `\n\n*#${i + 1}.* ${vid.title}
⌚ ${vid.timestamp} | ${vid.ago}
👤 ${vid.author.name}
🔗 ${vid.url}
_______________`
    }

    const thumbRes = await axios.get(videos[0].thumbnail, { responseType: 'arraybuffer' })
    const thumb = Buffer.from(thumbRes.data, 'binary')

    const sentMsg = await conn.sendMessage2(msg.key.remoteJid, {
      text: list,
      contextInfo: {
        externalAdReply: {
          title: wm,
          body: textbot,
          thumbnailUrl: redes,
          thumbnail: thumb,
          sourceUrl: redes,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, msg)

    tempSearchResults[sentMsg.key.id] = {
      sender: msg.sender,
      videos
    }

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    })

  } catch (e) {
    console.error(e)
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Error en la búsqueda:\n${e.message}`
    }, msg)
    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "❌", key: msg.key }
    })
  }
}

const before = async (msg, { conn }) => {
  if (!msg.quoted || !msg.quoted.id || !msg.text) return

  const quotedId = msg.quoted.id
  const data = tempSearchResults[quotedId]
  if (!data || data.sender !== msg.sender) return

  const text = msg.text.trim().toLowerCase()
  const match = text.match(/^(?:(a|v|audio|video|d|documento))\s*#?\s*(\d+)\s*(a|v|audio|video)?$/i)
  if (!match) return

  const [__, cmd1, numStr, cmd2] = match
  const type1 = (cmd1 || '').toLowerCase()
  const type2 = (cmd2 || '').toLowerCase()
  const index = parseInt(numStr) - 1
  const videos = data.videos
  if (!videos || !videos[index]) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: '❌ Número inválido.'
    }, msg)
  }

  const video = videos[index]
  const url = video.url
  const title = video.title
  const quotedMsg = msg.quoted

  let format = 'audio'
  let asDocument = false

  if (['video', 'v'].includes(type1)) format = 'video'
  if (['audio', 'a'].includes(type1)) format = 'audio'
  if (['d', 'documento'].includes(type1)) {
    asDocument = true
    if (['video', 'v'].includes(type2)) format = 'video'
    if (['audio', 'a'].includes(type2)) format = 'audio'
  }

  try {
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `Enviando ✑ *${title}* como ${asDocument ? 'documento' : format}...`
    }, quotedMsg)

    const send = async (msgType, downloadUrl, fileName, mimetype) => {
      const fileMsg = {
        [msgType]: { url: downloadUrl },
        fileName,
        mimetype
      }
      await conn.sendMessage2(msg.key.remoteJid, fileMsg, msg)
    }

    if (format === 'audio') {
      const res = await axios.get(`https://api.vreden.my.id/api/ytmp3?url=${url}`)
      const json = res.data
      const download = json?.result?.download?.url
      if (!download) throw new Error('No se pudo obtener el audio.')
      await send(asDocument ? 'document' : 'audio', download, `${title}.mp3`, 'audio/mpeg')
    } else {
      const res = await axios.get(`https://api.neoxr.eu/api/youtube?url=${url}&type=video&quality=360p&apikey=GataDios`)
      const json = res.data
      const download = json?.data?.url
      if (!download) throw new Error('No se pudo obtener el video.')
      await send(asDocument ? 'document' : 'video', download, `${title}.mp4`, 'video/mp4')
    }

  } catch (e) {
    console.error(e)
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Error en la descarga:\n${e.message}`
    }, msg)
  }
}

handler.before = before
handler.command = ['yts', 'ytsearch']
module.exports = handler
