// test-upload.js - Script para probar la carga de imágenes
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Crear una imagen de prueba simple (1x1 pixel PNG)
const createTestImage = () => {
  const testImagePath = path.join(__dirname, 'test-image.png');
  // PNG de 1x1 pixel transparente en base64
  const pngData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77yQAAAABJRU5ErkJggg==', 'base64');
  fs.writeFileSync(testImagePath, pngData);
  return testImagePath;
};

const testImageUpload = async () => {
  try {
    console.log('🧪 Iniciando prueba de carga de imagen...');
    
    // Crear imagen de prueba
    const testImagePath = createTestImage();
    console.log('✅ Imagen de prueba creada');
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('name', 'Producto de Prueba');
    formData.append('description', 'Este es un producto de prueba para verificar la carga de imágenes');
    formData.append('enrollmentPrice', '99.99');
    formData.append('stock', '10');
    formData.append('category', 'Prueba');
    formData.append('image', fs.createReadStream(testImagePath));
    
    console.log('📤 Enviando solicitud...');
    
    // Usar ruta de prueba sin autenticación
    const response = await axios.post('http://localhost:3000/api/test/products', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('✅ Producto creado exitosamente:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Limpiar archivo de prueba
    fs.unlinkSync(testImagePath);
    console.log('🧹 Archivo de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    
    // Limpiar archivo de prueba en caso de error
    const testImagePath = path.join(__dirname, 'test-image.png');
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  }
};

// Ejecutar prueba solo si se llama directamente
if (require.main === module) {
  testImageUpload();
}

module.exports = { testImageUpload };