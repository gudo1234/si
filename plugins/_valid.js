const fs = require("fs");
const path = require("path");

function getCommandsFromPluginsAsText(dir) {
    const commands = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (!file.endsWith(".js")) continue;

        const content = fs.readFileSync(filePath, "utf-8");

        // Captura handler.command = 'comando', ["uno", "dos"], o expresiones regulares
        const regex = /handler\.command\s*=\s*([^\n;]+)/g;
        const matches = [...content.matchAll(regex)];

        for (const match of matches) {
            let raw = match[1].trim();

            try {
                // Ignorar expresiones regulares
                if (raw.startsWith("/") && raw.endsWith("/i")) continue;

                // Evalúa solo strings y arrays seguros
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
