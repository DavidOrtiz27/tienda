export interface FolderResponse {
  success: boolean;
  message: string;
  rutaAbsoluta?: string; // Ruta absoluta para guardar archivos
  rutaRelativa?: string; // Ruta relativa para la base de datos y la API
}

// Función para obtener la ruta absoluta en la raíz del proyecto
function getRutaEnRaiz(relativa: string): string {
  // import.meta.url es la URL del archivo actual (file:///...)
  // Usamos desde ahí para obtener la raíz del proyecto
  const urlActual = new URL(import.meta.url);
  // Quitamos el nombre del archivo y subimos hasta la raíz del proyecto
  // Asumimos que estamos en Controller/, así que subimos un nivel
  const raizProyecto = new URL("../", urlActual).pathname;
  // Unimos la ruta relativa a la raíz del proyecto
  return `${raizProyecto}${relativa}`;
}

export async function CreateFolderController(codigo: string): Promise<FolderResponse> {
  // Verifica y crea la carpeta raíz "uploads"
  const rutaRelativaRaiz = "uploads";
  const rutaAbsolutaRaiz = getRutaEnRaiz(rutaRelativaRaiz);
  try {
    await Deno.stat(rutaAbsolutaRaiz);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(rutaAbsolutaRaiz, { recursive: true });
    }
  }

  // Carpeta del producto
  const rutaRelativa = `uploads/${codigo}`;
  const rutaAbsoluta = getRutaEnRaiz(rutaRelativa);

  try {
    await Deno.stat(rutaAbsoluta);
    return {
      success: true,
      message: `La carpeta ${rutaAbsoluta} ya existe`,
      rutaAbsoluta,
      rutaRelativa,
    };
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(rutaAbsoluta, { recursive: true });
      return {
        success: true,
        message: `Carpeta ${rutaAbsoluta} creada exitosamente`,
        rutaAbsoluta,
        rutaRelativa,
      };
    } else {
      return {
        success: false,
        message: `Error al verificar/crear la carpeta: ${error.message}`,
        rutaAbsoluta,
        rutaRelativa,
      };
    }
  }
}

// Función para renombrar carpeta cuando cambia el código del producto
export async function RenombrarCarpetaController(codigoAnterior: string, codigoNuevo: string): Promise<FolderResponse> {
  try {
    // Si el código no cambió, no hacer nada
    if (codigoAnterior === codigoNuevo) {
      return { 
        success: true, 
        message: "El código no cambió, no es necesario renombrar" 
      };
    }

    // Obtener rutas absolutas
    const rutaCarpetaAnterior = getRutaEnRaiz(`uploads/${codigoAnterior}`);
    const rutaCarpetaNueva = getRutaEnRaiz(`uploads/${codigoNuevo}`);

    // Verificar si la carpeta anterior existe
    try {
      await Deno.stat(rutaCarpetaAnterior);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return { 
          success: true, 
          message: "La carpeta anterior no existe" 
        };
      }
      throw error;
    }

    // Verificar si la carpeta nueva ya existe
    try {
      await Deno.stat(rutaCarpetaNueva);
      return { 
        success: false, 
        message: `Ya existe una carpeta con el código ${codigoNuevo}` 
      };
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        // La carpeta nueva no existe, podemos renombrar
      } else {
        throw error;
      }
    }

    // Renombrar la carpeta
    await Deno.rename(rutaCarpetaAnterior, rutaCarpetaNueva);
    
    return { 
      success: true, 
      message: `Carpeta renombrada de ${codigoAnterior} a ${codigoNuevo}` 
    };
  } catch (error) {
    console.error("Error al renombrar carpeta:", error);
    return { 
      success: false, 
      message: `Error al renombrar carpeta: ${error.message}` 
    };
  }
}