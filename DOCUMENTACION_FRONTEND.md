# 📱 Documentación Frontend - E-commerce App

## 🚀 Información General

**Aplicación:** E-commerce Frontend  
**Tecnología Principal:** React 19.1.0 con TypeScript  
**Framework de Estilos:** Tailwind CSS  
**Arquitectura:** Modular con separación de responsabilidades  
**Puerto de Desarrollo:** 3000  

## 🛠️ Stack Tecnológico

### Core Technologies
- **React 19.1.0** - Biblioteca principal de UI
- **TypeScript 4.9.5** - Tipado estático
- **React Scripts 5.0.1** - Herramientas de desarrollo
- **Axios 1.11.0** - Cliente HTTP para API calls

### Desarrollo y Testing
- **@testing-library/react 16.3.0** - Testing de componentes
- **@testing-library/jest-dom 6.6.3** - Matchers adicionales para Jest
- **@testing-library/user-event 13.5.0** - Simulación de eventos de usuario
- **Web Vitals 2.1.4** - Métricas de rendimiento

### Estilos
- **Tailwind CSS** - Framework de utilidades CSS
- **Inter Font** - Tipografía principal
- **CSS Modules** - Estilos modulares

## 📁 Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/           # Componentes de UI organizados por módulos
│   ├── layout/          # Componentes de layout (Navigation, Layout)
│   ├── Admin/           # Componentes del módulo de administración
│   ├── Client/          # Componentes del módulo de cliente
│   └── common/          # Componentes reutilizables
├── services/            # Servicios para comunicación con API
│   ├── api.config.ts    # Configuración de Axios
│   ├── auth.service.ts  # Servicio de autenticación
│   ├── product.service.ts # Servicio de productos
│   ├── cart.service.ts  # Servicio de carrito
│   ├── category.service.ts # Servicio de categorías
│   ├── dashboard.service.ts # Servicio de dashboard
│   └── index.ts         # Exportaciones centralizadas
├── hooks/               # Hooks personalizados
│   ├── useAuth.ts       # Hook para autenticación
│   ├── useProducts.ts   # Hook para gestión de productos
│   ├── useCart.ts       # Hook para gestión del carrito
│   ├── useCartId.ts     # Hook para ID del carrito
│   └── useCartTimer.ts  # Hook para temporizador del carrito
├── context/             # Contextos de React
│   └── AppContext.tsx   # Contexto principal de la aplicación
├── config/              # Configuraciones y constantes
│   └── constants.ts     # Constantes de la aplicación
├── interfaces/          # Definiciones de tipos TypeScript
│   └── index.ts         # Interfaces principales
└── utils/               # Utilidades (legacy, mantenido por compatibilidad)
```

## 🔧 Servicios (Services Layer)

### API Configuration (`api.config.ts`)
- **Propósito:** Configuración centralizada de Axios
- **Características:**
  - Interceptores para autenticación automática
  - Manejo centralizado de errores
  - Instancias separadas para API pública y privada
  - Base URL configurable

### Servicios Específicos

#### AuthService (`auth.service.ts`)
- **Funcionalidad:** Autenticación de administradores
- **Métodos principales:**
  - `login(credentials)` - Autenticación
  - `logout()` - Cierre de sesión
  - `isAuthenticated()` - Verificación de estado

#### ProductService (`product.service.ts`)
- **Funcionalidad:** Gestión completa de productos
- **Métodos principales:**
  - `getProducts()` - Obtener todos los productos
  - `getProduct(id)` - Obtener producto específico
  - `createProduct(data)` - Crear nuevo producto
  - `updateProduct(id, data)` - Actualizar producto
  - `deleteProduct(id)` - Eliminar producto

#### CartService (`cart.service.ts`)
- **Funcionalidad:** Gestión del carrito y reservas de stock
- **Métodos principales:**
  - `reserveStock(cartId, productId, quantity)` - Reservar stock
  - `releaseReservation(cartId, productId)` - Liberar reserva
  - `extendReservation(cartId)` - Extender tiempo de reserva

#### CategoryService (`category.service.ts`)
- **Funcionalidad:** Gestión de categorías de productos
- **Métodos principales:**
  - `getCategories()` - Obtener todas las categorías
  - `createCategory(data)` - Crear nueva categoría

#### DashboardService (`dashboard.service.ts`)
- **Funcionalidad:** Estadísticas y reportes administrativos
- **Métodos principales:**
  - `getStats()` - Obtener estadísticas generales
  - `getReports()` - Obtener reportes detallados

## 🎣 Hooks Personalizados

### useAuth
- **Propósito:** Gestión del estado de autenticación
- **Estado gestionado:**
  - `isAuthenticated` - Estado de autenticación
  - `loading` - Estado de carga
  - `error` - Errores de autenticación
- **Funciones:**
  - `login(credentials)` - Función de login
  - `logout()` - Función de logout

### useProducts
- **Propósito:** Gestión de productos y su estado
- **Estado gestionado:**
  - `products` - Lista de productos
  - `loading` - Estado de carga
  - `error` - Errores de carga
- **Funciones:**
  - `refetch()` - Recargar productos
  - `createProduct(data)` - Crear producto
  - `updateProduct(id, data)` - Actualizar producto

### useCart
- **Propósito:** Lógica completa del carrito de compras
- **Estado gestionado:**
  - `cartItems` - Items del carrito
  - `totalPrice` - Precio total
  - `reservationTime` - Tiempo de reserva restante
- **Funciones:**
  - `addToCart(product, quantity)` - Agregar al carrito
  - `removeFromCart(productId)` - Remover del carrito
  - `updateQuantity(productId, quantity)` - Actualizar cantidad
  - `clearCart()` - Limpiar carrito

### useCartId y useCartTimer
- **Propósito:** Gestión del ID único del carrito y temporizador
- **Características:**
  - ID único persistente en localStorage
  - Temporizador de 15 minutos para reservas
  - Liberación automática de reservas al expirar

## 🎯 Contexto de la Aplicación

### AppContext
- **Propósito:** Estado global de la aplicación
- **Proveedor:** `AppProvider` - Wrapper reutilizable
- **Hook:** `useAppContext` - Hook personalizado para acceso
- **Características:**
  - Tipado estricto con TypeScript
  - Estado centralizado
  - Fácil acceso desde cualquier componente

## ⚙️ Configuración

### Constants (`constants.ts`)
- **URLs de API:** Endpoints centralizados
- **Rutas:** Definición de rutas de la aplicación
- **Configuraciones de tiempo:** Timeouts y duraciones
- **Claves de localStorage:** Keys estandarizadas
- **Categorías de fallback:** Datos por defecto

## 🧩 Componentes

### Layout Components

#### Navigation
- **Propósito:** Barra de navegación principal
- **Características:**
  - Cambio entre módulos cliente/admin
  - Indicador de estado de autenticación
  - Responsive design

#### Layout
- **Propósito:** Wrapper principal de la aplicación
- **Características:**
  - Integra navegación y contenido
  - Manejo de rutas
  - Estructura consistente

### Admin Components
- **AdminDashboard:** Panel de administración
- **ProductManager:** Gestión de productos
- **CategoryManager:** Gestión de categorías
- **StatsView:** Visualización de estadísticas

### Client Components
- **ProductCatalog:** Catálogo de productos
- **ProductDetail:** Detalle de producto
- **ShoppingCart:** Carrito de compras
- **Checkout:** Proceso de compra

### Common Components
- **Button:** Botón reutilizable
- **Modal:** Modal genérico
- **LoadingSpinner:** Indicador de carga
- **ErrorMessage:** Mensaje de error

## 🚀 Scripts Disponibles

### Desarrollo
```bash
npm start          # Inicia servidor de desarrollo (puerto 3000)
npm test           # Ejecuta tests en modo watch
npm run build      # Construye la aplicación para producción
npm run eject      # Expone configuración de webpack (irreversible)
```

## 🔄 Flujo de Datos

### 1. Cliente → Servicio → API
```
Componente → Hook → Servicio → API Backend
```

### 2. API → Servicio → Estado → UI
```
API Response → Servicio → Hook State → Componente → UI Update
```

### 3. Gestión de Estado
```
Local State (useState) → Custom Hooks → Context (Global) → Components
```

## 🛡️ Características de Seguridad

### Autenticación
- JWT tokens para autenticación de admin
- Interceptores automáticos para headers de autorización
- Logout automático en caso de token expirado

### Validación
- Validación de tipos con TypeScript
- Validación de formularios en cliente
- Sanitización de datos de entrada

## 📱 Responsive Design

### Breakpoints (Tailwind CSS)
- **sm:** 640px y superior
- **md:** 768px y superior
- **lg:** 1024px y superior
- **xl:** 1280px y superior
- **2xl:** 1536px y superior

### Estrategia Mobile-First
- Diseño base para móviles
- Progressive enhancement para pantallas más grandes
- Componentes adaptables

## 🧪 Testing

### Configuración
- **Jest:** Framework de testing
- **React Testing Library:** Testing de componentes
- **User Event:** Simulación de interacciones

### Estrategia de Testing
- **Unit Tests:** Hooks y servicios individuales
- **Integration Tests:** Flujos completos de usuario
- **Component Tests:** Renderizado y comportamiento de componentes

## 🚀 Optimizaciones de Rendimiento

### Code Splitting
- Lazy loading de componentes
- Separación por rutas
- Chunks optimizados

### Caching
- Service Worker para cache de assets
- Memoización de componentes costosos
- Cache de respuestas de API

### Bundle Optimization
- Tree shaking automático
- Minificación en producción
- Compresión de assets

## 🔧 Configuración de Desarrollo

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "node"
  }
}
```

### Tailwind Configuration
```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  }
}
```

## 📈 Próximos Pasos

### Mejoras Planificadas
1. **PWA Support:** Funcionalidad offline
2. **Internationalization:** Soporte multi-idioma
3. **Advanced Caching:** Cache inteligente de datos
4. **Performance Monitoring:** Métricas en tiempo real
5. **Accessibility:** Mejoras de accesibilidad
6. **E2E Testing:** Tests end-to-end con Cypress

### Refactoring Pendiente
1. **Error Boundaries:** Manejo global de errores
2. **Loading States:** Estados de carga unificados
3. **Form Validation:** Librería de validación robusta
4. **State Management:** Considerar Redux Toolkit para estado complejo