import Conexion from "./Conexion.ts";

interface ProductData {
    id_productos?: number;
    codigo: string;
    nombre: string;
    gramaje: string;
    precio: number;
    descripcion: string;
    stock: number;
    url_ruta_img: string;
}

export class Productos {
    private producto: ProductData;

    constructor(producto: ProductData) {
        this.producto = producto;
    }

    // Listar todos los productos
    public async listarProductos(): Promise<ProductData[]> {
        try {
            const query = "SELECT * FROM productos ORDER BY id_productos DESC";
            const result = await Conexion.execute(query);

            if (!result || !result.rows) {
                return [];
            }

            return result.rows as ProductData[];

        } catch (error) {
            console.error("Error al listar productos:", error);
            throw new Error("Error al obtener productos de la base de datos");
        }
    }

    // Crear nuevo producto
    public async crearProducto(): Promise<{ success: boolean; message: string; id?: number }> {
        try {
            const { codigo, nombre, gramaje, precio, descripcion, stock, url_ruta_img } = this.producto;

            // Verificar que el código no exista
            const checkQuery = "SELECT id_productos FROM productos WHERE codigo = ?";
            const checkResult = await Conexion.execute(checkQuery, [codigo]);

            if (checkResult && checkResult.rows && checkResult.rows.length > 0) {
                return {
                    success: false,
                    message: "Ya existe un producto con ese código"
                };
            }

            // Insertar nuevo producto
            const insertQuery = `
                INSERT INTO productos (codigo, nombre, gramaje, precio, descripcion, stock, url_ruta_img) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await Conexion.execute(insertQuery, [
                codigo, nombre, gramaje, precio, descripcion, stock, url_ruta_img
            ]);

            if (result && result.lastInsertId) {
                return {
                    success: true,
                    message: "Producto creado exitosamente",
                    id: result.lastInsertId
                };
            } else {
                return {
                    success: false,
                    message: "Error al insertar en la base de datos"
                };
            }

        } catch (error) {
            console.error("Error al crear producto:", error);
            return {
                success: false,
                message: "Error al crear producto en la base de datos"
            };
        }
    }
}