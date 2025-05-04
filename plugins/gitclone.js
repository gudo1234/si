const fetch = require("node-fetch"); // Asegúrate de tener node-fetch@2 instalado

let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;

const handler = async (msg, { conn, text, usedPrefix, command, args }) => {
  if (!text) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Usa el comando correctamente:\n\n📌 Ejemplo: *${usedPrefix + command}* link de github`
    }, msg);
  }

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🕒", key: msg.key }
  });

  if (!regex.test(args[0])) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Enlace no válido.\n\n📌 Ejemplo: *${usedPrefix + command}* https://github.com/usuario/repositorio`
    }, msg);
  }

  let [_, user, repo] = args[0].match(regex) || [];
  let sanitizedRepo = repo.replace(/.git$/, '');
  let repoUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}`;
  let zipUrl = `https://api.github.com/repos/${user}/${sanitizedRepo}/zipball`;

  try {
    let [repoResponse, zipResponse] = await Promise.all([
      fetch(repoUrl),
      fetch(zipUrl)
    ]);

    if (!repoResponse.ok || !zipResponse.ok) {
      throw new Error('No se pudo obtener el repositorio.');
    }

    let repoData = await repoResponse.json();
    let disposition = zipResponse.headers.get('content-disposition');
    let filename = disposition ? disposition.match(/attachment; filename="?(.+)"?/)[1] : `${sanitizedRepo}.zip`;
    let img = 'https://i.ibb.co/tLKyhgM/file.png';

    let txt = `*乂  G I T H U B  -  D O W N L O A D*\n\n`;
    txt += `✩  *Nombre* : ${sanitizedRepo}\n`;
    txt += `✩  *Repositorio* : ${user}/${sanitizedRepo}\n`;
    txt += `✩  *Creador* : ${repoData.owner?.login || 'Desconocido'}\n`;
    txt += `✩  *Descripción* : ${repoData.description || 'Sin descripción disponible'}\n`;
    txt += `✩  *Url* : ${args[0]}`;

    await conn.sendMessage2(msg.key.remoteJid, {
      image: { url: img },
      caption: txt
    }, msg);

    const buffer = await zipResponse.buffer();

    await conn.sendMessage2(msg.key.remoteJid, {
      document: { url: buffer },
      mimetype: 'application/zip',
      fileName: filename
    }, msg);

  } catch (err) {
    console.error(err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `❌ Ocurrió un error al descargar el repositorio.`
    }, msg);
  }
};

handler.command = ['gitclone'];
module.exports = handler;
