# Panel de Administración - Cat Lovers Paradise

## 🎯 Descripción

Sistema de administración completo para gestionar dinámicamente la información de los gatos en el sitio web. Incluye autenticación, roles de usuario y gestión de contenido multilingüe.

## ✨ Características

- **Sistema de Autenticación**: Login seguro con bcrypt
- **Gestión de Roles**: Admin, Editor y Viewer con permisos específicos
- **CRUD de Gatos**: Crear, editar, eliminar y visualizar gatos
- **Soporte Multilingüe**: Traducciones en español e inglés
- **Panel Responsive**: Interfaz moderna y adaptable
- **Base de Datos MySQL**: Almacenamiento persistente de datos

## 🚀 Instalación

### 1. Configurar Base de Datos

```bash
# Crear base de datos MySQL
mysql -u root -p
CREATE DATABASE catloversparadise;
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=catloversparadise
DB_PORT=3306
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Inicializar Base de Datos

```bash
# Ejecutar migraciones y datos iniciales
npm run init-db
```

### 5. Compilar y Ejecutar

```bash
# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run dev

# O ejecutar en producción
npm start
```

## 🔐 Acceso al Panel

- **URL**: http://localhost:3000/admin
- **Usuario por defecto**: admin
- **Contraseña**: admin123

## 📋 Funcionalidades del Panel

### Dashboard
- Estadísticas generales del sistema
- Lista de gatos y usuarios recientes
- Acciones rápidas

### Gestión de Gatos
- **Listar**: Ver todos los gatos con filtros
- **Crear**: Agregar nuevos gatos con traducciones
- **Editar**: Modificar información existente
- **Eliminar**: Soft delete de gatos
- **Visualizar**: Ver gato en el sitio web

### Gestión de Usuarios
- **Listar**: Ver todos los usuarios
- **Crear**: Registrar nuevos usuarios
- **Roles**: Asignar permisos específicos

## 🎨 Estructura de Datos

### Tabla `cats`
- Información básica del gato
- Imágenes (hero y principal)
- Estado activo/inactivo

### Tabla `cat_translations`
- Traducciones en múltiples idiomas
- Campos: name, description, characteristics, temperament, care

### Tabla `users`
- Datos de autenticación
- Roles y permisos
- Estado activo/inactivo

### Tabla `roles`
- Definición de roles
- Permisos específicos por recurso

## 🌐 Uso del Sitio Web

### Páginas Dinámicas
- `/cats` - Lista todos los gatos
- `/breeds` - Galería de razas
- `/breed/:slug` - Página individual del gato

### Multilingüe
- Soporte para español, inglés y chino
- Cambio de idioma automático
- Traducciones específicas por gato

## 🛠️ Desarrollo

### Estructura de Archivos
```
src/
├── config/          # Configuración de BD
├── controllers/     # Lógica de controladores
├── middlewares/     # Middlewares de auth
├── migrations/      # Scripts de BD
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/           # Tipos TypeScript
└── views/           # Plantillas Nunjucks
```

### Comandos Útiles
```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Tests
npm test

# Linting
npm run lint

# Inicializar BD
npm run init-db
```

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt
- Sesiones seguras con express-session
- Validación de permisos por ruta
- Sanitización de inputs

## 📱 Responsive Design

- Panel adaptable a móviles
- Navegación colapsable
- Formularios optimizados para touch

## 🚀 Despliegue

### Preparación
1. Compilar el proyecto: `npm run build`
2. Configurar variables de entorno de producción
3. Ejecutar migraciones en el servidor

### FTP (cPanel)
- Subir archivos compilados (excluyendo node_modules)
- Instalar dependencias en el servidor: `npm install --production`
- Configurar base de datos MySQL
- Ejecutar migraciones

## 🐛 Solución de Problemas

### Error de Conexión a BD
- Verificar credenciales en .env
- Asegurar que MySQL esté ejecutándose
- Verificar que la base de datos existe

### Error de Permisos
- Verificar que el usuario tiene el rol correcto
- Revisar configuración de permisos en la BD

### Error de Compilación
- Verificar que todas las dependencias están instaladas
- Revisar errores de TypeScript
- Limpiar cache: `rm -rf dist/`

## 📞 Soporte

Para problemas o dudas:
1. Revisar logs del servidor
2. Verificar configuración de BD
3. Comprobar variables de entorno
4. Revisar permisos de archivos

---

**¡Disfruta gestionando tu paraíso de gatos! 🐱✨**
