const fetch = require("node-fetch");

const handler = async (msg, { conn, text, args, usedPrefix, command }) => {
  if (!args.length) {
    return await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Uso incorrecto.*\n📌 Ejemplo: \`${usedPrefix + command} ¿Cuál es la capital de Japón?\``
    }, msg );
  }

  const pregunta = args.join(" ");
  const geminiUrl = `https://api.dorratz.com/ai/gemini?prompt=${encodeURIComponent(pregunta)}`;
  const userId = msg.key.participant || msg.key.remoteJid;

  await conn.sendMessage(msg.key.remoteJid, {
    react: { text: "🤖", key: msg.key }
  });

  try {
    const response = await fetch(geminiUrl);
    if (!response.ok) throw new Error(`Error de la API: ${response.status} ${response.statusText}`);

    const json = await response.json();
    if (!json?.message?.trim()) throw new Error("Respuesta vacía de Gemini.");

    const respuestaGemini = json.message.trim();

    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} ${respuestaGemini}`,
      mentions: [userId]
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "✅", key: msg.key }
    });

  } catch (err) {
    console.error("❌ Error en el comando geminis:", err.message);
    await conn.sendMessage2(msg.key.remoteJid, {
      text: `${e} *Error al obtener respuesta de Gemini:*\n_${err.message}_\n\n🔹 Inténtalo más tarde.`
    }, msg );

    await conn.sendMessage(msg.key.remoteJid, {
      react: { text: "❌", key: msg.key }
    });
  }
};

handler.command = ['geminis', 'gemini'];
module.exports = handler;
