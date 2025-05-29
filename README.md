# FarmaciaDB - Inventory Management System

![Project Logo](https://via.placeholder.com/150)  *(Reemplaza con tu logo real)*

## Descripción
Sistema backend para la gestión de inventarios con API RESTful. Proporciona endpoints para:
- Gestión de productos
- Control de stock
- Reportes y análisis

## Características principales
✅ API RESTful con documentación Postman  
✅ Autenticación JWT  
✅ Base de datos relacional  
✅ Variables de entorno configurables

## Requisitos previos
- Node.js v18+  
- npm v9+  
- PostgreSQL 14+

## Instalación
1. Clonar el repositorio
```bash
git clone [repo-url]
```
2. Instalar dependencias
```bash
npm install
```
3. Configurar variables de entorno (ver `.env.example`)
4. Iniciar servidor
```bash
npm start
```

## Estructura del proyecto
```
farmacia-backend/
├── controllers/       # Lógica de negocio
├── routes/           # Definición de endpoints
├── models/           # Modelos de base de datos
├── middleware/       # Middlewares
├── config/           # Configuraciones
├── tests/            # Pruebas
└── ...
```

## Documentación API
La colección Postman `FarmaciaDB - Inventory Management API.postman_collection.json` contiene:
- Todos los endpoints disponibles
- Ejemplos de requests/responses
- Configuración de autenticación

## Contribución
1. Haz fork del proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia
[MIT](LICENSE)
