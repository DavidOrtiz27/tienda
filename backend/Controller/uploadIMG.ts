import { CreateFolderController } from "./CreateFolder.ts";

export async function guardarImagen(imagen: File, codigo: string): Promise<{ success: boolean, ruta?: string, message?: string }> {
    // 1. Crear carpeta si no existe
    const folderResult = await CreateFolderController(codigo);
    if (!folderResult.success) {
        return { success: false, message: folderResult.message };
    }

    // Primero, obtenemos el contenido de la imagen que recibimos como un archivo (File) a través de form-data.
    // Usamos imagen.arrayBuffer() para leer los datos binarios de la imagen y luego los convertimos a un Uint8Array,
    // que es el formato que Deno.writeFile necesita para guardar archivos en el sistema de archivos del servidor.
    // Creamos la ruta donde se va a guardar la imagen usando el nombre de la carpeta (folderResult.ruta) y el nombre original del archivo (imagen.name).
    // Finalmente, usamos Deno.writeFile para guardar la imagen físicamente en el servidor.
    const arrayBuffer = await imagen.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const nombreArchivo = `imagen_${imagen.name}`;
    const rutaAbsoluta = `${folderResult.rutaAbsoluta}/${nombreArchivo}`;
    const rutaRelativa = `${folderResult.rutaRelativa}/${nombreArchivo}`;

    // Guarda la imagen físicamente
    await Deno.writeFile(rutaAbsoluta, bytes);

    // Guarda en la base de datos y responde SOLO la ruta relativa
    const producto = {
      // ...otros campos...
      url_ruta_img: rutaRelativa
    };

    return { success: true, ruta: rutaRelativa };
}

// Función para eliminar imagen anterior cuando se actualiza
export async function eliminarImagenAnterior(rutaImagen: string): Promise<{ success: boolean; message?: string }> {
  try {
    // Si no hay imagen anterior, no hacer nada
    if (!rutaImagen || rutaImagen === "sin_imagen") {
      return { success: true, message: "No hay imagen anterior para eliminar" };
    }

    // Obtener la ruta absoluta de la imagen
    const urlActual = new URL(import.meta.url);
    const raizProyecto = new URL("../", urlActual).pathname;
    const rutaAbsoluta = `${raizProyecto}${rutaImagen}`;

    // Verificar si el archivo existe antes de eliminarlo
    try {
      await Deno.stat(rutaAbsoluta);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        return { success: true, message: "La imagen anterior ya no existe" };
      }
      throw error;
    }

    // Eliminar el archivo
    await Deno.remove(rutaAbsoluta);
    
    return { success: true, message: "Imagen anterior eliminada exitosamente" };
  } catch (error) {
    console.error("Error al eliminar imagen anterior:", error);
    return { 
      success: false, 
      message: `Error al eliminar imagen anterior: ${error.message}` 
    };
  }
}
