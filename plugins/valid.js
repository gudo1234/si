const fs = require('fs');
const levenshtein = require("fast-levenshtein");

function getCommandsFromFile(file) {
  try {
    if (!fs.existsSync(file)) return [];
    const content = fs.readFileSync(file, 'utf8');
    const regex = /handler\.command\s*=\s*([^]+)|case\s+['"]([^'"]+)['"]/g;
    const commands = [];

    let match;
    while ((match = regex.exec(content)) !== null) {
      if (match[1]) {
        const cmds = match[1].match(/['"]([^'"]+)['"]/g)?.map(c => c.replace(/['"]/g, '').toLowerCase());
        if (cmds) commands.push(...cmds);
      } else if (match[2]) {
        commands.push(match[2].toLowerCase());
      }
    }
    return commands;
  } catch (err) {
    console.error(`[ERROR leyendo ${file}]:`, err);
    return [];
  }
}

function getAllCommands() {
  const folders = ['plugins', 'plugins2'];
  let allCommands = [];

  try {
    for (const folder of folders) {
      if (!fs.existsSync(folder)) continue;
      const files = fs.readdirSync(folder);
      for (const file of files) {
        if (file.endsWith('.js')) {
          allCommands.push(...getCommandsFromFile(`${folder}/${file}`));
        }
      }
    }

    if (fs.existsSync('main.js')) {
      allCommands.push(...getCommandsFromFile('main.js'));
    }
  } catch (err) {
    console.error('[ERROR obteniendo comandos]:', err);
  }

  return [...new Set(allCommands)];
}

function findClosestCommand(command, list) {
  const input = command.toLowerCase();
  let closest = '';
  let minDistance = Infinity;

  for (const cmd of list) {
    const dist = levenshtein.get(input, cmd);
    if (dist < minDistance) {
      minDistance = dist;
      closest = cmd;
    }
  }

  const similarity = Math.max(0, 100 - (minDistance / input.length) * 100);
  return { closest, similarity: similarity.toFixed(2) };
}

// En el handler
const handler = async (msg, { conn, text, usedPrefix, command }) => {
  try {
    const commands = getAllCommands();
    const lowerCommand = command.toLowerCase();

    // Debug temporal
    console.log('Comando recibido:', lowerCommand);
    console.log('Comandos disponibles:', commands);

    if (!commands.includes(lowerCommand)) {
      const { closest, similarity } = findClosestCommand(lowerCommand, commands);
      return await conn.sendMessage2(msg.key.remoteJid, {
        text: `❌ El comando *${usedPrefix + command}* no existe.\n` +
              `> Usa *${usedPrefix}menu* para ver los comandos disponibles.\n\n` +
              `*¿Quisiste decir?* ➤ \`${usedPrefix + closest}\` (${similarity}% de coincidencia)`
      }, msg);
    }

    // Aquí iría el código si el comando existe...
  } catch (err) {
    console.error('[ERROR en handler de comando desconocido]:', err);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: '⚠️ Hubo un error al verificar el comando. Intenta nuevamente.'
    }, msg);
  }
};
