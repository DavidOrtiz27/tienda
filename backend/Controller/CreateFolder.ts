export interface FolderResponse {
  success: boolean;
  message: string;
  ruta?: string; // Ruta de la carpeta creada o verificada
}

export async function carpetaRaiz(ruta: string): Promise<FolderResponse> {
  try {
    const info = await Deno.stat(ruta);
    if (info.isDirectory) {
      return {
        success: true,
        message: `La carpeta raíz ya existe: ${ruta}`,
        ruta: ruta
      };
    } else {
      return {
        success: false,
        message: `Existe un archivo con el nombre ${ruta}, pero no es una carpeta.`,
        ruta: ruta
      };
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // No existe, así que la creamos
      await Deno.mkdir(ruta, { recursive: true });
      return {
        success: true,
        message: `Carpeta raíz creada: ${ruta}`,
        ruta: ruta
      };
    } else {
      return {
        success: false,
        message: `Error al verificar/crear la carpeta raíz: ${error.message}`,
        ruta: ruta
      };
    }
  }
}

export async function CreateFolderController(codigo: string): Promise<FolderResponse> {



  // Verificación de que exista la carpeta raíz
  const respuestaRaiz = await carpetaRaiz("uploads");
  if (!respuestaRaiz.success) {
    return respuestaRaiz;
  }

  const ruta = "uploads/" + codigo;

  try {
    const info = await Deno.stat(ruta);
    if (info.isDirectory) {
      return {
        success: true,
        message: `La carpeta ${ruta} ya existe`,
        ruta: ruta
      };
    } else {
      return {
        success: false,
        message: `Existe un archivo con el nombre ${ruta}, pero no es una carpeta`,
        ruta: ruta
      };
    }
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // Si no existe, la creamos
      await Deno.mkdir(ruta, { recursive: true });
      return {
        success: true,
        message: `Carpeta ${ruta} creada exitosamente`,
        ruta: ruta
      };
    } else {
      return {
        success: false,
        message: `Error al verificar/crear la carpeta: ${error.message}`,
        ruta: ruta
      };
    }
  }
}