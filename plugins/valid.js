const fs = require("fs");
const path = require("path");
const levenshtein = require("fast-levenshtein");

function getCaseCommands() {
  try {
    const mainPath = path.resolve('./main.js');
    if (!fs.existsSync(mainPath)) return [];

    const content = fs.readFileSync(mainPath, 'utf8');
    const regex = /case\s+['"]([^'"]+)['"]/gi;
    const matches = [...content.matchAll(regex)].map(m => m[1].toLowerCase());
    return matches;
  } catch (e) {
    console.error('[ERROR leyendo main.js]:', e);
    return [];
  }
}

function getPluginCommands(dir) {
  const commands = [];
  try {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      const matchArray = [...content.matchAll(/handler\.command\s*=\s*([^]+|['"`][^'"`]+['"`])/gi)];

      for (const match of matchArray) {
        try {
          const raw = match[1];
          const cmds = eval(raw); // eval para extraer los comandos como array
          if (Array.isArray(cmds)) {
            commands.push(...cmds.map(c => c.toLowerCase()));
          } else if (typeof cmds === 'string') {
            commands.push(cmds.toLowerCase());
          }
        } catch (err) {
          console.warn(`[WARNING al analizar comando en ${file}]: ${err.message}`);
        }
      }
    }
  } catch (e) {
    console.error(`[ERROR leyendo carpeta ${dir}]:`, e);
  }

  return commands;
}

const handler = async (msg, { conn }) => {
  try {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderClean = senderId.replace(/[^0-9]/g, '');

    const body = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
    const usedPrefix = global.prefix.exec(body)?.[0];
    if (!usedPrefix) return;

    const command = body.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

    // Escanear comandos
    const caseCmds = getCaseCommands();
    const plugin1 = getPluginCommands('./plugins');
    const plugin2 = getPluginCommands('./plugins2');
    const allCommands = [...new Set([...caseCmds, ...plugin1, ...plugin2])];

    // Validar si el comando existe
    if (allCommands.includes(command)) {
      // Aquí va tu lógica real si el comando existe
      return conn.sendMessage(msg.key.remoteJid, {
        text: `✅ El comando *${usedPrefix + command}* existe.`
      }, { quoted: msg });
    }

    // Buscar sugerencia
    let closest = '';
    let shortest = Infinity;
    for (const cmd of allCommands) {
      const dist = levenshtein.get(command, cmd);
      if (dist < shortest) {
        shortest = dist;
        closest = cmd;
      }
    }

    const similarity = Math.round((1 - shortest / Math.max(command.length, closest.length)) * 100);

    // Enviar respuesta si no existe
    return conn.sendMessage(msg.key.remoteJid, {
      text: `❌ El comando *${usedPrefix + command}* no existe.\n` +
            `> Usa *${usedPrefix}menu* para ver los comandos disponibles.\n\n` +
            `*¿Quisiste decir?* ➤ \`${usedPrefix + closest}\` (${similarity}% de coincidencia)`
    }, { quoted: msg });

  } catch (error) {
    console.error('❌ Error en la detección de comandos:', error);
    await conn.sendMessage(msg.key.remoteJid, {
      text: '⚠️ Ocurrió un error al verificar el comando.'
    }, { quoted: msg });
  }
};

module.exports = handler;
