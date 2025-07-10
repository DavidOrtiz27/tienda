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
    const rutaImagen = `${folderResult.ruta}/${imagen.name}`;
    await Deno.writeFile(rutaImagen, bytes);

    return { success: true, ruta: rutaImagen };
}
