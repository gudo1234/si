const fs = require("fs");
const path = require("path");

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

    console.log(`✅ [sessions] ${eliminados} archivo(s) eliminados`);
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

      // Eliminar carpeta si está vacía
      const restantes = fs.readdirSync(rutaSesion);
      if (restantes.length === 0) {
        try {
          fs.rmdirSync(rutaSesion);
          carpetasEliminadas++;
          console.log(`🗑️ Carpeta eliminada: ${carpeta}`);
        } catch (e) {
          console.error(`❌ Error al eliminar carpeta ${carpeta}:`, e);
        }
      }
    }

    console.log(`✅ [subbots] ${totalEliminados} archivo(s) eliminados, ${carpetasEliminadas} carpeta(s) eliminadas`);
  }
};

// Ejecutar cada 20 segundos
setInterval(limpiarSesiones, 20_000);

module.exports = {};
