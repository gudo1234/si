const fs = require("fs");
const path = require("path");

const handler = async (msg, { conn }) => {
  let reportes = [];

  const limpiarSesiones = () => {
    // --- LIMPIEZA DE ./sessions ---
    const sessionPath = path.resolve('./sessions');
    if (fs.existsSync(sessionPath)) {
      const archivos = fs.readdirSync(sessionPath);
      let eliminados = 0;

      for (const archivo of archivos) {
        const archivoPath = path.join(sessionPath, archivo);
        if (archivo !== 'creds.json' && fs.statSync(archivoPath).isFile()) {
          try {
            fs.unlinkSync(archivoPath);
            eliminados++;
          } catch (err) {
            console.error(`❌ Error al eliminar ${archivoPath}:`, err);
          }
        }
      }

      reportes.push(`✅ [sessions] ${eliminados} archivo(s) eliminados`);
    }

    // --- LIMPIEZA DE ./subbots ---
    const subbotsPath = path.resolve('./subbots');
    if (fs.existsSync(subbotsPath)) {
      const carpetas = fs.readdirSync(subbotsPath);
      let totalEliminados = 0;
      let carpetasEliminadas = 0;

      for (const carpeta of carpetas) {
        const rutaSesion = path.join(subbotsPath, carpeta);
        if (!fs.statSync(rutaSesion).isDirectory()) continue;

        const archivos = fs.readdirSync(rutaSesion);
        for (const archivo of archivos) {
          const archivoPath = path.join(rutaSesion, archivo);
          if (archivo !== 'creds.json' && fs.statSync(archivoPath).isFile()) {
            try {
              fs.unlinkSync(archivoPath);
              totalEliminados++;
            } catch (e) {
              console.error(`❌ Error al eliminar ${archivo} de ${carpeta}:`, e);
            }
          }
        }

        const restantes = fs.readdirSync(rutaSesion);
        if (restantes.length === 0) {
          try {
            fs.rmdirSync(rutaSesion);
            carpetasEliminadas++;
          } catch (e) {
            console.error(`❌ Error al eliminar carpeta ${carpeta}:`, e);
          }
        }
      }

      reportes.push(`✅ [subbots] ${totalEliminados} archivo(s) eliminados, ${carpetasEliminadas} carpeta(s) eliminadas`);
    }
  };

  limpiarSesiones();

await conn.sendMessage2(msg.key.remoteJid, {
      text: reportes.length > 0 ? reportes.join('\n') : 'No se encontró nada para limpiar.' }, msg);
  
await conn.sendMessage(msg.key.remoteJid, {
            react: { text: "⚡", key: msg.key} 
        });
};

handler.command = ['ds']; // el comando que ejecuta esta función
module.exports = handler;
