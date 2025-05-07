const fs = require("fs");
const path = require("path");
const levenshtein = require("fast-levenshtein");

function getCommandsFromPluginsAsText(dir) {
    const commands = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (!file.endsWith(".js")) continue;

        const content = fs.readFileSync(filePath, "utf-8");

        // Captura handler.command = 'cmd', ["cmd1", "cmd2"], o regex
        const regex = /handler\.command\s*=\s*([^\n;]+)/g;
        const matches = [...content.matchAll(regex)];

        for (const match of matches) {
            let raw = match[1].trim();

            try {
                // Detectar y extraer comando de regex tipo /^cmd$/i
                const regexMatch = raw.match(/^\/\^?(.+?)\$?\/[a-z]*$/i);
                if (regexMatch) {
                    commands.push(regexMatch[1].trim().toLowerCase());
                    continue;
                }

                // Si es string o array, evaluar
                if (
                    (raw.startsWith("'") && raw.endsWith("'")) ||
                    (raw.startsWith('"') && raw.endsWith('"')) ||
                    (raw.startsWith("[") && raw.endsWith("]"))
                ) {
                    const evaluated = eval(raw);
                    if (Array.isArray(evaluated)) {
                        evaluated.forEach(cmd => {
                            if (typeof cmd === "string" && cmd.trim()) {
                                commands.push(cmd.trim().toLowerCase());
                            }
                        });
                    } else if (typeof evaluated === "string") {
                        commands.push(evaluated.trim().toLowerCase());
                    }
                }
            } catch (err) {
                console.error(`Error analizando handler.command en ${file}:`, err);
            }
        }
    }
    return commands;
}

function getCommandsFromMainJS(filePath) {
    if (!fs.existsSync(filePath)) return [];

    const content = fs.readFileSync(filePath, "utf-8");
    const regex = /case\s+["'`](.*?)["'`]\s*:/g;
    const matches = [...content.matchAll(regex)];
    return matches
        .map(match => match[1].trim().toLowerCase())
        .filter(cmd => cmd);
}

module.exports = {
    name: "notfound",
    command: /^.([^\s]+)/i,
    tags: ["sistema"],
    disabled: false,
    run: async ({ conn, msg, command }) => {
        try {
            const pluginsPath = path.join(__dirname);
            const mainJSPath = path.join(__dirname, "..", "main.js");

            const pluginCommands = getCommandsFromPluginsAsText(pluginsPath);
            const mainJSCommands = getCommandsFromMainJS(mainJSPath);
            const validCommands = [...new Set([...pluginCommands, ...mainJSCommands])];

            if (validCommands.includes(command)) return;

            let closest = null;
            let minDistance = Infinity;

            for (const cmd of validCommands) {
                const dist = levenshtein.get(command, cmd);
                if (dist < minDistance) {
                    minDistance = dist;
                    closest = cmd;
                }
            }

            const similarity = Math.max(0, 100 - Math.floor((minDistance / command.length) * 100));
            let response = `🪐 El comando *.${command}* no existe.\n> 🧮 Usa *.menu* para ver los comandos disponibles.`;

            if (similarity >= 40 && closest) {
                response += `\n\n*¿Quisiste decir?* ➤ *.${closest}* (${similarity}% de coincidencia)`;
            }

            await conn.sendMessage(msg.key.remoteJid, {
                text: response
            }, { quoted: msg });

        } catch (err) {
            console.error("Error en plugin notfound.js:", err);
            await conn.sendMessage(msg.key.remoteJid, {
                text: "⚠️ Ocurrió un error al procesar tu comando. Intenta de nuevo más tarde."
            }, { quoted: msg });
        }
    },
};
