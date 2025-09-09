# Sistema Dinámico de Razas de Gatos

## 📋 Descripción
Sistema implementado para mostrar información dinámica de diferentes razas de gatos en la página `/breed/:breed`.

## 🐾 Razas Disponibles
- **Bengalí** - `/breed/bengal`
- **Maine Coon** - `/breed/mainecoon`
- **Elf** - `/breed/elf`
- **Persa** - `/breed/persian`
- **Sphynx** - `/breed/sphynx`
- **Persa Exótico** - `/breed/exotic`

## 📋 Páginas del Sistema
- **Todas las Razas** - `/breeds` - Página con grid de todas las razas
- **Información de Raza** - `/breed/:breed` - Página detallada de cada raza
- **Menú Dropdown** - Navegación directa desde el menú principal

## 🗂️ Archivos Modificados

### 1. Plantillas Dinámicas
- **Archivo**: `src/views/gatos/info.njk` - Página detallada de cada raza
- **Archivo**: `src/views/portal/breeds.njk` - Página con grid de todas las razas
- **Cambios**: 
  - Convertida a plantilla dinámica que recibe el parámetro `breed`
  - Utiliza claves de localización dinámicas: `{{ t('breeds.' + breed + '.name') }}`
  - Imágenes dinámicas: `public/portal/image/breeds/{{ breed }}-main.jpg`
  - Hero background dinámico: `public/portal/image/breeds/{{ breed }}-hero.jpg`

### 2. Localización (3 idiomas)
- **Archivos**: `locales/sp.json`, `locales/eng.json`, `locales/zh.json`
- **Nuevas claves agregadas**:
  ```json
  "breeds.title": "Nuestras Razas",
  "breeds.breadcrumb.home": "Inicio",
  "breeds.breadcrumb.breeds": "Nuestras razas",
  "breeds.{raza}.name": "Nombre de la raza",
  "breeds.{raza}.description": "Descripción detallada",
  "breeds.{raza}.characteristics": "Características físicas",
  "breeds.{raza}.temperament": "Temperamento",
  "breeds.{raza}.care": "Cuidados especiales"
  ```

### 3. Menú de Navegación
- **Archivo**: `src/views/template/portal.njk`
- **Cambios**:
  - Dropdown "Razas de Gatos" con las 6 razas
  - Iconos de colores para cada raza
  - Enlaces directos a `/breed/:raza`
  - Enlace "Ver Todas las Razas" a `/breeds`

### 4. Rutas Dinámicas
- **Archivo**: `src/routes/portal/portal.router.ts`
- **Nuevas rutas**: 
  - `router.get('/breeds', portalController.getBreeds);`
  - `router.get('/breed/:breed', portalController.getBreedInfo);`

### 5. Controlador
- **Archivo**: `src/controllers/portal.controller.ts`
- **Nuevos métodos**: 
  - `getBreeds` - Para la página de todas las razas
  - `getBreedInfo` - Para información detallada de cada raza
- **Validación**: Solo acepta razas válidas definidas en `validBreeds`
- **Error 404**: Para razas no válidas

## 🖼️ Estructura de Imágenes Requerida

Crear la siguiente estructura de carpetas e imágenes:

```
public/portal/image/breeds/
├── hero-all-breeds.jpg      # Imagen de fondo para página de todas las razas (1920x900)
├── bengal-hero.jpg          # Imagen de fondo para hero (1920x900)
├── bengal-main.jpg          # Imagen principal (600x600)
├── bengal-card.jpg          # Imagen para tarjeta en grid (400x250)
├── mainecoon-hero.jpg
├── mainecoon-main.jpg
├── mainecoon-card.jpg
├── elf-hero.jpg
├── elf-main.jpg
├── elf-card.jpg
├── persian-hero.jpg
├── persian-main.jpg
├── persian-card.jpg
├── sphynx-hero.jpg
├── sphynx-main.jpg
├── sphynx-card.jpg
├── exotic-hero.jpg
├── exotic-main.jpg
└── exotic-card.jpg
```

## 🎨 Características del Diseño

### Secciones Implementadas:
1. **Hero Section**: Imagen de fondo con breadcrumb
2. **Información Principal**: Imagen + descripción de la raza
3. **Detalles de la Raza**: 3 tarjetas con características, temperamento y cuidados
4. **Call to Action**: Sección de contacto

### Elementos Visuales:
- ✅ Badge con nombre de la raza
- ✅ Iconos FontAwesome para cada sección
- ✅ Tarjetas con sombras y bordes redondeados
- ✅ Diseño responsive
- ✅ Colores del tema (accent-2, etc.)

## 🚀 Cómo Usar

### 1. Acceder a todas las razas:
```
https://tudominio.com/breeds
```

### 2. Acceder a una raza específica:
```
https://tudominio.com/breed/bengal
https://tudominio.com/breed/mainecoon
https://tudominio.com/breed/elf
https://tudominio.com/breed/persian
https://tudominio.com/breed/sphynx
https://tudominio.com/breed/exotic
```

### 3. Navegación desde el menú:
- **Menú "Razas de Gatos"** → Seleccionar raza específica
- **Menú "Razas de Gatos"** → "Ver Todas las Razas"
- **Footer** → "Razas de Gatos"

### 4. Enlaces desde otras páginas:
```html
<a href="/breeds">Ver todas las razas</a>
<a href="/breed/bengal">Ver información del Bengalí</a>
<a href="/breed/mainecoon">Ver información del Maine Coon</a>
```

## 🔧 Personalización

### Agregar Nueva Raza:
1. **Agregar a validBreeds** en `portal.controller.ts`
2. **Agregar claves de localización** en los 3 archivos JSON
3. **Agregar imágenes** en `public/portal/image/breeds/`
4. **Probar la ruta** `/breed/nuevaraza`

### Modificar Información:
- Editar las claves correspondientes en `locales/sp.json`, `locales/eng.json`, `locales/zh.json`
- Los cambios se reflejarán automáticamente en todas las páginas

## 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Tarjetas adaptables
- ✅ Imágenes responsivas
- ✅ Texto legible en todos los dispositivos

## 🌐 Multiidioma
- ✅ Español (sp)
- ✅ Inglés (eng) 
- ✅ Chino (zh)
- ✅ Cambio dinámico de idioma
- ✅ Contenido localizado para cada raza

## ✨ Próximos Pasos Sugeridos
1. **Agregar las imágenes** de las razas
2. **Probar todas las rutas** en diferentes idiomas
3. **Optimizar imágenes** para web
4. **Agregar más razas** si es necesario
5. **Implementar SEO** con meta tags dinámicos

---

**¡El sistema está listo para usar!** 🎉
