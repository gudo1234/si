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

// Para guardar la adivinanza activa por usuario
const userAdivinanzas = {};

const handler = async (msg, { conn }) => {
  const texto = msg.body?.toLowerCase()?.trim();
  const user = msg.key.remoteJid;

  if (!userAdivinanzas[user]) {
    // Si no hay adivinanza activa, enviar una nueva
    const adivinanza = adivinanzas[Math.floor(Math.random() * adivinanzas.length)];
    userAdivinanzas[user] = adivinanza;
    await conn.sendMessage2(user, { text: `Adivina: ${adivinanza.pregunta}` }, msg);
  } else {
    const correcta = userAdivinanzas[user].respuesta;
    if (texto === correcta) {
      await conn.sendMessage2(user, { text: "¡Correcto! Bien hecho." }, msg);
      delete userAdivinanzas[user];
    } else {
      await conn.sendMessage2(user, { text: "Incorrecto. Intenta de nuevo." }, msg);
    }
  }
};

handler.command = ['que', 'q'];
module.exports = handler;
