const fs = require("fs");
const path = require("path");

setTimeout(() => {
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
  } else {
    console.log("📂 La carpeta /sessions no existe.");
  }

  // --- LIMPIEZA DE ./subbots ---
  const subbotsPath = path.resolve('./subbots');
  if (fs.existsSync(subbotsPath)) {
    const carpetas = fs.readdirSync(subbotsPath);
    let totalEliminados = 0;

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
    }

    console.log(`✅ [subbots] Archivos eliminados: ${totalEliminados}`);
  } else {
    console.log("📂 No hay carpeta /subbots encontrada.");
  }

}, 20_000); // Ejecutar después de 20 segundos

module.exports = {};
