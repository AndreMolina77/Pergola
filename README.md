# **Pérgola Joyería Artesanal - *Tu belleza merece cada pieza*** 💍

Pérgola Joyería es una tienda de joyas y accesorios elaborados con productos de alta calidad con un proceso de producción artesanal. Inspirándose en los valores de la autenticidad, elegancia y empoderamiento. Este proyecto nace para ofrecer una experiencia personalizada, conectando el arte de la joyería tradicional con el estilo de vida contemporáneo, permitiendo a las clientas encontrar piezas que se conviertan en una extensión de su identidad.

#### Disponible en: [https://pergola-rose.vercel.app/](https://pergola-rose.vercel.app/)

## 🛍️ Descripción del proyecto

Pérgola Joyería Artesanal se aliará con un conjunto de desarrolladores de software, quienes colaborarán con el emprendimiento por medio de la construcción de una aplicación web para escritorio y una aplicación web para teléfonos. La aplicación web se encargará de gestionar la parte administrativa de la tienda, englobando análisis del flujo de la tienda, tales como ventas, devoluciones, movimiento de productos, materia prima, interacciones de parte del cliente con los productos y gestión del inventario. La aplicación móvil estará enfocada hacia los usuarios finales, es decir, los clientes, ofreciendo servicios como compras en línea, realización de pedidos, personalización de productos y comentarios, tales como sugerencias, reseñas, etc.

El objetivo es posicionarse como referente en joyería de lujo, fusionando tradición, innovación y empoderamiento femenino. El objetivo de los desarrolladores es proporcionar escalabilidad y brindar soluciones colaborando con el emprendimiento de Pérgola para ayudarle a posicionarse en un puesto destacado a nivel nacional.

## 👨🏻‍💻 Arquitectura del Sistema

El proyecto utiliza el stack **MERN** (MongoDB, Express, React, Node.js) con herramientas modernas de desarrollo:

### Backend (Node.js + Express)
- **MongoDB**: Base de datos NoSQL con MongoDB Atlas (servicio en la nube) y MongoDB Compass (herramienta de visualización)
- **Express**: Framework web minimalista y flexible para Node.js
- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor

### Frontend (React + Vite)
- **React**: Biblioteca de JavaScript para construir interfaces de usuario interactivas
- **Vite**: Herramienta de build y desarrollo frontend de nueva generación
- **Tailwind CSS**: Framework de CSS utility-first para diseño responsive

## 📚 Dependencias del Proyecto

### Backend Dependencies
#### Principales
- `express` - Framework web para Node.js
- `mongoose` - ODM para MongoDB
- `mongodb` - Driver oficial de MongoDB
- `cors` - Middleware para habilitar CORS
- `dotenv` - Gestión de variables de entorno
- `cookie-parser` - Middleware para parsing de cookies

#### Autenticación y Seguridad
- `bcryptjs` - Biblioteca para hash de contraseñas
- `jsonwebtoken` - Implementación de JSON Web Tokens
- `crypto` - Funcionalidades criptográficas

#### Gestión de Archivos
- `cloudinary` - Servicio de gestión de imágenes en la nube
- `multer` - Middleware para manejo de archivos multipart
- `multer-storage-cloudinary` - Storage engine de Multer para Cloudinary

#### Otros
- `nodemailer` - Envío de correos electrónicos
- `swagger-ui-express` - Documentación de API con Swagger

#### Desarrollo
- `nodemon` - Herramienta para reinicio automático del servidor

### Frontend Dependencies
#### Principales
- `react` v19.1.0 - Biblioteca principal
- `react-dom` v19.1.0 - Renderizado de React para el DOM
- `react-router-dom` - Enrutamiento para aplicaciones React
- `vite` - Herramienta de build y desarrollo

#### UI y Estilos
- `tailwindcss` v4.1.3 - Framework CSS utility-first
- `@tailwindcss/forms` - Plugin de Tailwind para formularios
- `@tailwindcss/vite` - Plugin de Vite para Tailwind CSS
- `framer-motion` - Biblioteca de animaciones
- `classnames` - Utilidad para manejo de clases CSS condicionales
- `tailgrids` - Componentes de grid para Tailwind

#### Iconos
- `lucide-react` - Biblioteca de iconos moderna
- `react-icons` - Colección popular de iconos para React
- `@flaticon/flaticon-uicons` - Iconos de Flaticon
- `@fortawesome/fontawesome-free` - Iconos de Font Awesome
- `@fortawesome/fontawesome-svg-core` - Core de Font Awesome SVG
- `@fortawesome/free-solid-svg-icons` - Iconos sólidos de Font Awesome
- `@fortawesome/react-fontawesome` - Componentes React de Font Awesome

#### Formularios y UX
- `react-hook-form` - Gestión eficiente de formularios
- `react-hot-toast` - Notificaciones toast elegantes
- `js-cookie` - Manipulación de cookies en JavaScript

#### Gráficos y Visualización
- `chart.js` - Biblioteca para gráficos interactivos

#### Servicios Backend
- `appwrite` - Backend-as-a-Service (BaaS)

#### Desarrollo
- `typescript` - Lenguaje tipado basado en JavaScript
- `eslint` - Linter para JavaScript/TypeScript
- `autoprefixer` - Plugin de PostCSS para autoprefijos
- `postcss` - Herramienta de transformación CSS

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn
- MongoDB (local o MongoDB Atlas)
- Expo CLI instalado VIA npm

### Instalación del Backend
```bash
cd backend
npm install --force 
npm run dev
```

### Instalación del Frontend
```bash
cd frontend
npm install
npm run dev
```

### Instalación de la aplicación móvil
```bash
cd mobile
npm install 
npx expo start
```

## 🎯 Características del Proyecto

### Aplicación Web (Administración)
- Dashboard administrativo
- Gestión de inventario
- Análisis de ventas y métricas
- Control de productos y materia prima
- Gestión de usuarios y roles

### Aplicación Cliente
- Catálogo de productos interactivo
- Carrito de compras
- Personalización de productos
- Sistema de reseñas y comentarios
- Gestión de pedidos
- Notificaciones en tiempo real

## 📱 Tecnologías Adicionales

- **Autenticación**: JWT (JSON Web Tokens)
- **Almacenamiento de imágenes**: Cloudinary
- **Notificaciones**: Nodemailer
- **Documentación API**: Swagger
- **Validación**: React Hook Form
- **Animaciones**: Framer Motion
- **Responsivo**: Tailwind CSS

## 🔧 Scripts Disponibles

### Backend
- `npm start` - Inicia el servidor en producción
- `npm run dev` - Inicia el servidor en modo desarrollo con Nodemon

### Frontend
- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter ESLint
