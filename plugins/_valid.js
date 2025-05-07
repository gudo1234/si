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

        // Captura tanto arrays como strings individuales
        const regex = /handler\.command\s*=\s*([^]*|["'`](.*?)["'`])/g;
        const matches = [...content.matchAll(regex)];

        for (const match of matches) {
            let raw = match[1];

            try {
                // Si es un array, evalúa como JSON seguro
                if (raw.startsWith("[")) {
                    const jsonArray = eval(raw); // aceptable porque es código local controlado
                    jsonArray.forEach(cmd => {
                        if (typeof cmd === "string" && cmd.trim()) {
                            commands.push(cmd.trim().toLowerCase());
                        }
                    });
                } else {
                    // Si es string suelto
                    const single = match[2];
                    if (single && typeof single === "string") {
                        commands.push(single.trim().toLowerCase());
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
