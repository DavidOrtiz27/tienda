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
    private producto: ProductData | null;

    constructor(producto: ProductData | null = null) {
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
            if (!this.producto) {
                return {
                    success: false,
                    message: "No hay datos del producto para crear"
                };
            }
            
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

    // Actualizar producto existente
    public async actualizarProducto(): Promise<{ success: boolean; message: string }> {
        try {
            if (!this.producto) {
                return {
                    success: false,
                    message: "No hay datos del producto para actualizar"
                };
            }
            
            const { id_productos, codigo, nombre, gramaje, precio, descripcion, stock, url_ruta_img } = this.producto;

            if (!id_productos) {
                return {
                    success: false,
                    message: "ID del producto es requerido para actualizar"
                };
            }

            // Verificar que el producto existe
            const checkQuery = "SELECT id_productos FROM productos WHERE id_productos = ?";
            const checkResult = await Conexion.execute(checkQuery, [id_productos]);

            if (!checkResult || !checkResult.rows || checkResult.rows.length === 0) {
                return {
                    success: false,
                    message: "Producto no encontrado"
                };
            }

            // Verificar que el código no esté duplicado (excluyendo el producto actual)
            const duplicateCheckQuery = "SELECT id_productos FROM productos WHERE codigo = ? AND id_productos != ?";
            const duplicateResult = await Conexion.execute(duplicateCheckQuery, [codigo, id_productos]);

            if (duplicateResult && duplicateResult.rows && duplicateResult.rows.length > 0) {
                return {
                    success: false,
                    message: "Ya existe otro producto con ese código"
                };
            }

            // Actualizar producto
            const updateQuery = `
                UPDATE productos 
                SET codigo = ?, nombre = ?, gramaje = ?, precio = ?, descripcion = ?, stock = ?, url_ruta_img = ?
                WHERE id_productos = ?
            `;

            const result = await Conexion.execute(updateQuery, [
                codigo, nombre, gramaje, precio, descripcion, stock, url_ruta_img, id_productos
            ]);

            if (result && result.affectedRows > 0) {
                return {
                    success: true,
                    message: "Producto actualizado exitosamente"
                };
            } else {
                return {
                    success: false,
                    message: "No se pudo actualizar el producto"
                };
            }

        } catch (error) {
            console.error("Error al actualizar producto:", error);
            return {
                success: false,
                message: "Error al actualizar producto en la base de datos"
            };
        }
    }

    public async eliminarProducto(id_productos: number, codigo: string): Promise<{ success: boolean, message: string }> {
        try {
            // Verificar que el producto existe
            const checkQuery = "SELECT id_productos FROM productos WHERE id_productos = ?";
            const checkResult = await Conexion.execute(checkQuery, [id_productos]);

            if (!checkResult || !checkResult.rows || checkResult.rows.length === 0) {
                return {
                    success: false,
                    message: "Producto no encontrado"
                };
            }

            // Eliminar de la base de datos
            const deleteQuery = "DELETE FROM productos WHERE id_productos = ?";
            const result = await Conexion.execute(deleteQuery, [id_productos]);

            if (result && result.affectedRows > 0) {
                // Importar la función para eliminar carpeta
                const { elimnarCarpeta } = await import("../Controller/CreateFolder.ts");
                
                // Eliminar la carpeta de imágenes
                const resultadoCarpeta = await elimnarCarpeta(codigo);
                if (resultadoCarpeta && !resultadoCarpeta.success) {
                    console.warn("Advertencia al eliminar carpeta:", resultadoCarpeta.message);
                }

                return {
                    success: true,
                    message: "Producto eliminado exitosamente"
                };
            } else {
                return {
                    success: false,
                    message: "No se pudo eliminar el producto de la base de datos"
                };
            }

        } catch (error) {
            console.error("Error al eliminar producto:", error);
            return {
                success: false,
                message: "Error al eliminar producto de la base de datos"
            };
        }
    }
}