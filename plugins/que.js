const adivinanzas = [
  {
    pregunta: "Blanca por dentro, verde por fuera. Si quieres que te lo diga, espera.",
    respuesta: "la pera"
  },
  {
    pregunta: "Oro parece, plata no es. ¿Qué es?",
    respuesta: "el plátano"
  },
  {
    pregunta: "Vuelo de noche, duermo en el día y nunca verás plumas en ala mía.",
    respuesta: "el murciélago"
  },
  {
    pregunta: "Agua pasa por mi casa, cate de mi corazón. ¿Qué es?",
    respuesta: "el aguacate"
  },
  {
    pregunta: "Tengo agujas pero no pincho, doy las horas sin ser reloj.",
    respuesta: "el reloj"
  }
];

const userAdivinanzas = {};

// Handler para el comando `.que`
const handler = async (msg, { conn }) => {
  const user = msg.key.remoteJid;
  const adivinanza = adivinanzas[Math.floor(Math.random() * adivinanzas.length)];
  userAdivinanzas[user] = adivinanza;
  await conn.sendMessage2(user, { text: `Adivina: ${adivinanza.pregunta}` }, msg);
};

handler.command = ['que', 'q'];
module.exports = handler;

// Handler separado para detectar respuestas normales
const respuestaHandler = async (msg, { conn }) => {
  const user = msg.key.remoteJid;
  const texto = msg.body?.toLowerCase()?.trim();

  if (!texto || texto.startsWith('.')) return; // Ignorar comandos

  if (userAdivinanzas[user]) {
    const correcta = userAdivinanzas[user].respuesta;
    if (texto === correcta) {
      await conn.sendMessage2(user, { text: "¡Correcto! Bien hecho." }, msg);
      delete userAdivinanzas[user];
    } else {
      await conn.sendMessage2(user, { text: "Incorrecto. Intenta de nuevo." }, msg);
    }
  }
};

respuestaHandler.customPrefix = /^[^\.]/; // Solo mensajes que no empiezan con punto
respuestaHandler.command = new RegExp; // Para que se ejecute siempre
module.exports = [handler, respuestaHandler];
