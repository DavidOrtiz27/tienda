# API de Productos con Gestión de Imágenes

## 🚀 Funcionalidades Implementadas

### Endpoints Disponibles

#### 1. **GET /products** - Listar Productos
```bash
GET http://localhost:8000/products
```

**Respuesta:**
```json
{
  "success": true,
  "message": [
    {
      "id_productos": 1,
      "codigo": "PROD001",
      "nombre": "Laptop Gaming",
      "gramaje": "2.5 kg",
      "precio": 1299.99,
      "descripcion": "Laptop gaming de alto rendimiento",
      "stock": 10,
      "url_ruta_img": "uploads/PROD001/imagen_1234567890.jpg"
    }
  ]
}
```

#### 2. **POST /products** - Crear Producto con Imagen
```bash
POST http://localhost:8000/products
Content-Type: application/json
```

**Campos requeridos:**
- `codigo` (string): Código único del producto
- `nombre` (string): Nombre del producto
- `gramaje` (string): Peso/dimensiones
- `precio` (number): Precio del producto
- `descripcion` (string): Descripción del producto
- `stock` (number): Cantidad en inventario
- `imagenBase64` (string, opcional): Imagen en formato base64

**Ejemplo de uso con curl:**
```bash
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "PROD001",
    "nombre": "Laptop Gaming",
    "gramaje": "2.5 kg",
    "precio": 1299.99,
    "descripcion": "Laptop gaming de alto rendimiento",
    "stock": 10,
    "imagenBase64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  }'
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "codigo": "PROD001",
    "nombre": "Laptop Gaming",
    "gramaje": "2.5 kg",
    "precio": 1299.99,
    "descripcion": "Laptop gaming de alto rendimiento",
    "stock": 10,
    "url_ruta_img": "uploads/PROD001/imagen_1234567890.jpg",
    "id": 1
  }
}
```

## 📁 Estructura de Carpetas

```
backend/
├── uploads/                    # Carpeta raíz para imágenes
│   └── [codigo_producto]/     # Subcarpeta por código de producto
│       └── imagen_timestamp.jpg # Imagen guardada con timestamp
├── Controller/
│   ├── CreateFolder.ts        # Gestión de carpetas
│   ├── ProductController.ts   # Controlador de productos
│   └── uploadIMG.ts          # Subida de imágenes
├── Model/
│   ├── Conexion.ts           # Conexión a MySQL
│   └── ProductModel.ts       # Modelo de productos
└── Router/
    └── ProductRouter.ts      # Rutas de la API
```

## 🛠️ Configuración

### Base de Datos MySQL
```sql
CREATE DATABASE uploads;
USE uploads;

CREATE TABLE productos (
    id_productos INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    gramaje VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    descripcion TEXT NOT NULL,
    stock INT NOT NULL,
    url_ruta_img VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Variables de Entorno
```bash
# Configuración en Model/Conexion.ts
hostname: "localhost"
username: "root"
db: "uploads"
password: ""
```

## 🚀 Ejecutar el Proyecto

```bash
# Instalar dependencias
deno cache app.ts

# Ejecutar en modo desarrollo
deno task dev

# O ejecutar directamente
deno run --allow-read --allow-write --allow-net app.ts
```

## 📝 Notas Importantes

1. **Carpetas**: El sistema crea automáticamente carpetas `uploads/[codigo]` para cada producto
2. **Imágenes**: Se guardan con timestamp para evitar conflictos de nombres
3. **Validación**: Todos los campos son requeridos (excepto imagenBase64)
4. **CORS**: Habilitado para desarrollo frontend
5. **Puerto**: Servidor ejecutándose en puerto 8000
6. **Formato**: Usamos JSON con base64 para las imágenes (más compatible con Oak 17)

## 🔧 Próximas Funcionalidades

- [ ] PUT /products - Actualizar productos
- [ ] DELETE /products/:id - Eliminar productos
- [ ] Validación de tipos de imagen
- [ ] Compresión de imágenes
- [ ] Autenticación y autorización 