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
        const regex = /handler\.command\s*=\s*([^]+)/g;
        const matches = [...content.matchAll(regex)];

        for (const match of matches) {
            const listRaw = match[1];
            const items = [...listRaw.matchAll(/["'`](.*?)["'`]/g)];
            for (const item of items) {
                const cmd = item[1].trim();
                if (cmd) commands.push(cmd.toLowerCase());
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
        .filter(cmd => cmd); // Elimina los vacíos como case ""
}

module.exports = {
    name: "notfound",
    command: /^.([^\s]+)/i,
    tags: ["sistema"],
    disabled: false,
    run: async ({ sock, msg, command }) => {
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

        await sock.sendMessage(msg.key.remoteJid, {
            text: response
        }, { quoted: msg });
    },
};
