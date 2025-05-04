const fetch = require("node-fetch");

let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* link de github`
    }, msg);
  }
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "🕒", key: msg.key} 
        });
  if (!regex.test(args[0])) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* unicode pad`
    }, msg).then(_ => m.react(error))
  }
  let [_, user, repo] = args[0].match(regex) || []
  let sanitizedRepo = repo.replace(/.git$/, '')
  let repoUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}`
  let zipUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}/zipball`
    let [repoResponse, zipResponse] = await Promise.all([
      fetch(repoUrl),
      fetch(zipUrl),
    ])
    let repoData = await repoResponse.json()
    let filename = zipResponse.headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    let type = zipResponse.headers.get('content-type')
    let img = 'https://i.ibb.co/tLKyhgM/file.png'
    let txt = `*乂  G I T H U B  -  D O W N L O A D*\n\n`
       txt += `✩  *Nombre* : ${sanitizedRepo}\n`
       txt += `✩  *Repositorio* : ${user}/${sanitizedRepo}\n`
       txt += `✩  *Creador* : ${repoData.owner.login}\n`
       txt += `✩  *Descripción* : ${repoData.description || 'Sin descripción disponible'}\n`
       txt += `✩  *Url* : ${args[0]}`

//await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, null, rcanal)
await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: img },
      caption: txt
    },  msg );
//await conn.sendFile(m.chat, await zipResponse.buffer(), filename, null, m)
await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: await zipResponse.buffer() },
      mimetype: 'application/vnd.android.package-archive',
      fileName: filename
    }, msg );
}

handler.command = ['gitclone']
module.exports = handler;
