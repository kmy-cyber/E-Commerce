# Arquitectura del Frontend - E-commerce App

## Estructura Modular Reorganizada

### 📁 Estructura de Directorios

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
└── utils/               # Utilidades (legacy, se mantendrá por compatibilidad)
```

### 🔧 Servicios (Services Layer)

Los servicios encapsulan toda la lógica de comunicación con la API:

#### `api.config.ts`
- Configuración centralizada de Axios
- Interceptores para autenticación y manejo de errores
- Instancias separadas para API pública y privada

#### Servicios Específicos
- **AuthService**: Manejo de autenticación de administradores
- **ProductService**: CRUD de productos y gestión de stock
- **CartService**: Reservas de stock y gestión del carrito
- **CategoryService**: Gestión de categorías
- **DashboardService**: Estadísticas y reportes

### 🎣 Hooks Personalizados

#### `useAuth`
- Gestiona el estado de autenticación
- Funciones de login/logout
- Verificación de estado de autenticación

#### `useProducts`
- Carga y gestión de productos
- Estados de loading y error
- Función de recarga

#### `useCart`
- Lógica completa del carrito de compras
- Gestión de reservas de stock
- Integración con temporizador

#### `useCartId` y `useCartTimer`
- Gestión del ID único del carrito
- Temporizador de expiración (15 minutos)
- Liberación automática de reservas

### 🎯 Contexto de la Aplicación

#### `AppContext`
- Contexto centralizado con hook personalizado `useAppContext`
- Proveedor reutilizable `AppProvider`
- Tipado estricto con TypeScript

### ⚙️ Configuración

#### `constants.ts`
- URLs de API centralizadas
- Rutas de endpoints organizadas
- Claves de localStorage
- Configuraciones de tiempo
- Categorías de fallback

### 🧩 Componentes de Layout

#### `Navigation`
- Barra de navegación reutilizable
- Cambio entre módulos cliente/admin

#### `Layout`
- Wrapper principal de la aplicación
- Integra navegación y contenido principal

## 🚀 Beneficios de la Nueva Arquitectura

### 1. **Separación de Responsabilidades**
- Servicios manejan la comunicación con API
- Hooks manejan la lógica de estado
- Componentes se enfocan en la UI

### 2. **Reutilización de Código**
- Servicios reutilizables en toda la aplicación
- Hooks personalizados para lógica común
- Componentes modulares

### 3. **Mantenibilidad**
- Código organizado por funcionalidad
- Fácil localización de bugs
- Actualizaciones centralizadas

### 4. **Escalabilidad**
- Fácil agregar nuevos servicios
- Estructura preparada para crecimiento
- Patrones consistentes

### 5. **Testing**
- Servicios fáciles de testear unitariamente
- Hooks aislados para testing
- Mocking simplificado

### 6. **TypeScript**
- Tipado estricto en toda la aplicación
- Interfaces centralizadas
- Mejor experiencia de desarrollo

## 🔄 Migración desde la Estructura Anterior

### Cambios Principales:
1. **API calls** movidas de `utils/api.ts` a servicios específicos
2. **Lógica de negocio** extraída del `App.tsx` a hooks personalizados
3. **Configuraciones** centralizadas en `constants.ts`
4. **Contexto** modularizado con provider personalizado
5. **Layout** separado en componentes reutilizables

### Compatibilidad:
- Los archivos `utils/` se mantienen para compatibilidad
- Las interfaces existentes se preservan
- Los componentes existentes funcionan sin cambios

## 📝 Próximos Pasos

1. **Testing**: Implementar tests unitarios para servicios y hooks
2. **Error Handling**: Mejorar manejo de errores con contexto global
3. **Loading States**: Implementar estados de carga globales
4. **Caching**: Agregar cache para optimizar requests
5. **Offline Support**: Implementar funcionalidad offline