# Guía de Carga de Imágenes para Productos

## Funcionalidad Implementada

Se ha implementado la funcionalidad para cargar y guardar imágenes por producto en el backend del e-commerce.

## Características

- **Carga de archivos**: Soporte para subir imágenes directamente al servidor
- **Validación**: Solo se permiten archivos de imagen (jpg, png, gif, etc.)
- **Límite de tamaño**: Máximo 5MB por imagen
- **Almacenamiento**: Las imágenes se guardan en `/uploads/products/`
- **Nombres únicos**: Cada imagen recibe un nombre único para evitar conflictos
- **Limpieza automática**: Las imágenes se eliminan cuando se actualiza o elimina un producto

## Endpoints Actualizados

### Crear Producto
```
POST /api/admin/products
```

**Opciones de envío:**

1. **Con archivo de imagen (multipart/form-data):**
```javascript
const formData = new FormData();
formData.append('name', 'Nombre del producto');
formData.append('description', 'Descripción del producto');
formData.append('enrollmentPrice', '99.99');
formData.append('stock', '10');
formData.append('category', 'Categoría');
formData.append('image', imageFile); // Archivo de imagen
```

2. **Con URL de imagen (JSON):**
```json
{
  "name": "Nombre del producto",
  "description": "Descripción del producto",
  "imageUrl": "https://ejemplo.com/imagen.jpg",
  "enrollmentPrice": 99.99,
  "stock": 10,
  "category": "Categoría"
}
```

### Actualizar Producto
```
PUT /api/admin/products/:id
```

**Opciones de envío:**

1. **Con nueva imagen (multipart/form-data):**
```javascript
const formData = new FormData();
formData.append('name', 'Nombre actualizado');
formData.append('description', 'Descripción actualizada');
formData.append('enrollmentPrice', '109.99');
formData.append('stock', '15');
formData.append('category', 'Nueva categoría');
formData.append('image', newImageFile); // Nueva imagen
```

2. **Sin cambiar imagen (JSON):**
```json
{
  "name": "Nombre actualizado",
  "description": "Descripción actualizada",
  "enrollmentPrice": 109.99,
  "stock": 15,
  "category": "Nueva categoría"
}
```

3. **Con nueva URL de imagen (JSON):**
```json
{
  "name": "Nombre actualizado",
  "description": "Descripción actualizada",
  "imageUrl": "https://ejemplo.com/nueva-imagen.jpg",
  "enrollmentPrice": 109.99,
  "stock": 15,
  "category": "Nueva categoría"
}
```

## Estructura de Archivos

```
my-ecommerce-backend/
├── middleware/
│   └── upload.js          # Configuración de multer
├── uploads/
│   └── products/          # Carpeta donde se guardan las imágenes
├── controllers/
│   └── productController.js # Controladores actualizados
└── routes/
    └── productRoutes.js   # Rutas actualizadas
```

## Acceso a las Imágenes

Las imágenes subidas están disponibles en:
```
http://localhost:3000/uploads/products/nombre-del-archivo.jpg
```

## Manejo de Errores

- **Archivo demasiado grande**: "El archivo es demasiado grande. Máximo 5MB."
- **Tipo de archivo inválido**: "Solo se permiten archivos de imagen."
- **Falta imagen**: "Debe proporcionar una imagen o una URL de imagen."

## Ejemplo de Uso con JavaScript

```javascript
// Crear producto con imagen
const createProductWithImage = async (productData, imageFile) => {
  const formData = new FormData();
  
  Object.keys(productData).forEach(key => {
    formData.append(key, productData[key]);
  });
  
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  const response = await fetch('/api/admin/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  return response.json();
};
```

## Notas Importantes

1. **Autenticación**: Todas las operaciones de administración requieren token de administrador
2. **Compatibilidad**: Mantiene compatibilidad con URLs externas de imágenes
3. **Limpieza**: Las imágenes antiguas se eliminan automáticamente al actualizar o eliminar productos
4. **Seguridad**: Solo se permiten archivos de imagen con límite de tamaño