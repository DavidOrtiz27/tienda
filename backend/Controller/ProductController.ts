import { Context } from "../Dependences/Dependencias.ts";
import { Productos } from "../Model/ProductModel.ts";
import { CreateFolderController } from "./CreateFolder.ts";
import { guardarImagen } from "./uploadIMG.ts";
import { z } from "../Dependences/Dependencias.ts";

const productSchema = z.object({
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  gramaje: z.string().min(1),
  precio: z.coerce.number().positive(),
  descripcion: z.string().min(1),
  stock: z.coerce.number().int().nonnegative(),
});

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
  const { response, request } = ctx;

  try {
    const contentLength = request.headers.get("Content-Length");
    if (contentLength === "0") {
      response.status = 400;
      response.body = {
        success: false,
        message: "El cuerpo de la solicitud está vacío"
      };
      return;
    }

    const body = await request.body.formData();

    const data: Record<string, unknown> = {};
    let url_ruta_img = "sin_imagen";
    let codigo = "";
    let imagenFile: File | null = null;

    for (const [key, value] of body.entries()) {
      if (typeof value === "string") {
        data[key] = value;
        if (key === "codigo") {
          codigo = value;
        }
      } else {
        // Guardar referencia al archivo para procesarlo después
        imagenFile = value;
        data[key] = value.name;
      }
    }

    console.log(data);

    // Validar datos (sin imagen)
    const validated = productSchema.parse(data);

    // Manejo de la imagen usando tus funciones existentes
    if (imagenFile) {
      const resultado = await guardarImagen(imagenFile, codigo);
      if (resultado.success && resultado.ruta) {
        url_ruta_img = resultado.ruta;
      } else {
        response.status = 500;
        response.body = { 
          success: false, 
          message: "Error al guardar la imagen: " + (resultado.message || "Error desconocido") 
        };
        return;
      }
    }

    // Construir el producto para el modelo
    const producto = {
      ...validated,
      url_ruta_img,
    };

    const ObjProduct = new Productos(producto);
    const resultado = await ObjProduct.crearProducto();

    if (resultado.success) {
      response.status = 201;
      response.body = {
        success: true,
        message: "Producto creado exitosamente",
        data: { ...producto, id: resultado.id }
      };
    } else {
      response.status = 400;
      response.body = {
        success: false,
        message: "Producto ya existe en la base de datos " + resultado.message,
      };
    }
  } catch (error) {
    console.error("Error en postProducts:", error);
    if (error instanceof z.ZodError) {
      response.status = 400;
      response.body = {
        success: false,
        message: "Datos inválidos",
        errors: error.format(),
      };
    } else {
      response.status = 500;
      response.body = {
        success: false,
        message: "Error interno del servidor",
        error: error.message,
      };
    }
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



