const fs = require('fs');
const levenshtein = require("fast-levenshtein");

const pluginDirs = ['plugins', 'plugins2'];
const mainCommandsPath = './main.js';

function getAllPluginCommands() {
  const allCommands = [];

  for (const dir of pluginDirs) {
    const files = fs.readdirSync(`./${dir}`);
    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      try {
        const plugin = require(`../${dir}/${file}`);
        if (!plugin.command) continue;

        const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
        allCommands.push(...cmds.map(c => c.toLowerCase()));
      } catch (err) {
        console.error(`Error cargando el plugin ${file}:`, err);
      }
    }
  }

  return allCommands;
}

function getMainCommands() {
  try {
    const fileContent = fs.readFileSync(mainCommandsPath, 'utf-8');
    const regex = /case ['"`](\w+)['"`]/g;

    const matches = [];
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
      matches.push(match[1].toLowerCase());
    }

    return matches;
  } catch (err) {
    console.error('Error leyendo main.js:', err);
    return [];
  }
}

const before = async (msg, { conn }) => {
  try {
    if (!msg.text || !global.prefix.test(msg.text)) return;

    const usedPrefix = global.prefix.exec(msg.text)[0];
    const command = msg.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

    const allCommands = [...getAllPluginCommands(), ...getMainCommands()];
    const isValid = allCommands.includes(command);

    if (!command || command === "bot") return;

    if (isValid) {
      let chat = global.db.data.chats[msg.chat];
      let user = global.db.data.users[msg.sender];

      if (chat.isBanned) {
        const avisoDesactivado = `El bot *${botname}* está desactivado en este grupo.\n\n` +
          `> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`;

        await conn.sendMessage(msg.chat, { text: avisoDesactivado }, { quoted: msg });
        return;
      }

      user.commands = (user.commands || 0) + 1;
    } else {
      let closest = '';
      let shortest = Infinity;

      for (let cmd of allCommands) {
        const dist = levenshtein.get(command, cmd);
        if (dist < shortest) {
          shortest = dist;
          closest = cmd;
        }
      }

      const maxLength = Math.max(command.length, closest.length);
      const similarity = Math.round((1 - shortest / maxLength) * 100);

      await conn.sendMessage(msg.chat, {
        text: `El comando *${usedPrefix + command}* no existe.\n` +
              `> Usa *${usedPrefix}menu* para ver los comandos disponibles.\n\n` +
              `¿Quisiste decir? ➤ \`${usedPrefix + closest}\` (${similarity}% de coincidencia)`
      }, { quoted: msg });
    }

  } catch (err) {
    console.error('Error en el handler before:', err);
    await conn.sendMessage(msg.chat, {
      text: `Ocurrió un error al procesar tu comando.\n\nDetalles: ${err.message}`
    }, { quoted: msg });
  }
}
