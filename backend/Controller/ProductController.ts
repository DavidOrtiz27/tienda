import { Context } from "../Dependences/Dependencias.ts";
import { Productos } from "../Model/ProductModel.ts";
import { CreateFolderController } from "./CreateFolder.ts";

// Declaración de Deno para operaciones de archivos
declare const Deno: {
    writeFile(path: string, data: Uint8Array): Promise<void>;
    readFile(path: string): Promise<Uint8Array>;
};

// GET - Listar todos los productos
export const getProducts = async (ctx: Context) => {
    const { response } = ctx;

    try {
        const ObjProduct = new Productos({} as any);
        const productos = await ObjProduct.listarProductos();

        response.status = 200;
        response.body = {
            success: true,
            message: "Productos obtenidos exitosamente",
            data: productos
        };

    } catch (error) {
        console.error("Error al obtener productos:", error);
        response.status = 500;
        response.body = {
            success: false,
            message: "Error al obtener productos"
        };
    }
};

// POST - Crear nuevo producto con imagen
export const postProducts = async (ctx: Context) => {
    const { request, response } = ctx;

    try {
        
    } catch (error) {
        
    }
    
};

// PUT - Actualizar producto
export const putProducts = async (ctx: Context) => {
    const { response } = ctx;
    response.status = 501;
    response.body = {
        success: false,
        message: "Función no implementada aún"
    };
};

// DELETE - Eliminar producto
export const deleteProducts = async (ctx: any) => {
    const { response } = ctx;
    response.status = 501;
    response.body = {
        success: false,
        message: "Función no implementada aún"
    };
};



